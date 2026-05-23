import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAreaById } from "@/data/zones";
import { getMonstersForArea } from "@/data/monsters";
import { runCombatTick, getSkillExpGain } from "@/systems/CombatEngine";
import { getExpToNextLevel } from "@/data/skills";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { skills: true },
    });

    if (!character || !character.isInCombat || !character.currentAreaId) {
      return NextResponse.json({ success: false, error: "Tidak sedang combat" }, { status: 400 });
    }

    const areaResult = getAreaById(character.currentAreaId);
    if (!areaResult) return NextResponse.json({ success: false, error: "Area tidak valid" }, { status: 400 });

    const monsters = getMonstersForArea(areaResult.area.monsters);
    if (!monsters.length) return NextResponse.json({ success: false, error: "Tidak ada monster" }, { status: 400 });

    // Pick random monster from area
    const monster = monsters[Math.floor(Math.random() * monsters.length)];

    const meleeSkill = character.skills.find((s) => s.skillId === "melee");
    const defenseSkill = character.skills.find((s) => s.skillId === "defense");
    const meleeLevel = meleeSkill?.level ?? 1;
    const defenseLevel = defenseSkill?.level ?? 1;

    // Run full fight until monster dies or player dies
    let monsterHp = monster.hp;
    let charHp = character.hp;
    const logs: string[] = [];
    let totalExp = 0;
    let totalGold = 0;
    const allLoot: Record<string, number> = {};
    let playerDied = false;

    while (monsterHp > 0 && charHp > 0) {
      const tick = runCombatTick(
        { ...character, int_stat: character.int_stat, hp: charHp },
        monster,
        monsterHp,
        meleeLevel,
        defenseLevel
      );
      monsterHp = tick.monsterHpAfter;
      charHp = tick.playerHpAfter;
      if (tick.logMessage) logs.push(tick.logMessage);
      if (tick.monsterKilled) {
        totalExp += tick.expGained;
        totalGold += tick.goldGained;
        tick.loot.forEach((l) => {
          allLoot[l.itemId] = (allLoot[l.itemId] ?? 0) + l.quantity;
        });
      }
      if (tick.playerDied) { playerDied = true; break; }
    }

    // If player died, restore some HP and stop combat
    if (playerDied) {
      await prisma.character.update({
        where: { id: character.id },
        data: { hp: Math.floor(character.maxHp * 0.3), isInCombat: false, currentAreaId: null },
      });
      return NextResponse.json({
        success: true,
        data: { playerDied: true, logs, newHp: Math.floor(character.maxHp * 0.3) },
      });
    }

    // Calculate skill exp gains
    const skillExpGains = getSkillExpGain(totalExp);

    // Apply everything in a transaction
    await prisma.$transaction(async (tx) => {
      // HP regen between fights (10% of max)
      const newHp = Math.min(character.maxHp, charHp + Math.floor(character.maxHp * 0.1));

      await tx.character.update({
        where: { id: character.id },
        data: {
          hp: newHp,
          gold: { increment: totalGold },
          lastOnlineAt: new Date(),
        },
      });

      // Recalculate character overall level from total skill levels
      const allSkills = await tx.characterSkill.findMany({
        where: { characterId: character.id },
      });
      const totalSkillLevels = allSkills.reduce((sum, s) => sum + s.level, 0);
      const newCharLevel = Math.max(1, Math.floor(totalSkillLevels / allSkills.length));

      await tx.character.update({
        where: { id: character.id },
        data: { level: newCharLevel },
      });

      // Update skill exp + level up if needed
      for (const [skillId, expGain] of Object.entries(skillExpGains)) {
        const skill = character.skills.find((s) => s.skillId === skillId);
        if (!skill) continue;

        let newExp = skill.experience + expGain;
        let newLevel = skill.level;
        const expNeeded = getExpToNextLevel(newLevel);

        if (newLevel < 99 && expNeeded > 0 && newExp >= expNeeded) {
          newExp -= expNeeded;
          newLevel += 1;
          logs.push(`🎉 Melee naik ke Level ${newLevel}!`);
        }

        if (newLevel > skill.level) {
  const levelsGained = newLevel - skill.level;

  // Milestone: tiap kelipatan 10 level dapat 1 attribute point
  const oldMilestones = Math.floor(skill.level / 10);
  const newMilestones = Math.floor(newLevel / 10);
  const milestoneCount = newMilestones - oldMilestones;

  if (milestoneCount > 0) {
    await tx.character.update({
      where: { id: character.id },
      data: { attributePoints: { increment: milestoneCount } },
    });
    logs.push(`🎯 Milestone! +${milestoneCount} Attribute Point`);
  }
}

        await tx.characterSkill.update({
          where: { characterId_skillId: { characterId: character.id, skillId } },
          data: { experience: newExp, level: newLevel },
        });

        // Update character stat setiap level naik
        if (newLevel > skill.level) {
          const levelsGained = newLevel - skill.level;
          if (skillId === "melee") {
            await tx.character.update({
              where: { id: character.id },
              data: {
                str: { increment: 2 * levelsGained },
                maxHp: { increment: 1 * levelsGained },
              },
            });
          }
          if (skillId === "defense") {
            await tx.character.update({
              where: { id: character.id },
              data: {
                vit: { increment: 1 * levelsGained },
                maxHp: { increment: 2 * levelsGained },
              },
            });
          }
        }
      }

      // Add loot to inventory
      for (const [itemId, quantity] of Object.entries(allLoot)) {
        const existing = await tx.inventoryItem.findFirst({
          where: { characterId: character.id, itemId },
        });
        if (existing) {
          await tx.inventoryItem.update({
            where: { id: existing.id },
            data: { quantity: { increment: quantity } },
          });
        } else {
          await tx.inventoryItem.create({
            data: { characterId: character.id, itemId, quantity },
          });
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        playerDied: false,
        logs,
        expGained: totalExp,
        goldGained: totalGold,
        loot: Object.entries(allLoot).map(([itemId, quantity]) => ({ itemId, quantity })),
        monsterName: monster.name,
      },
    });
  } catch (error) {
    console.error("Combat tick error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}