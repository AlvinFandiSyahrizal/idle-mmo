import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAreaById } from "@/data/zones";
import { getMonstersForArea } from "@/data/monsters";
import {
  runCombatTick,
  getSkillExpGain,
  getPrimaryCombatStyle,
} from "@/systems/CombatEngine";
import { getExpToNextLevel } from "@/data/skills";
import { getItemById } from "@/data/items";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { skills: true, equipment: true, inventory: true },
    });

    if (!character || !character.isInCombat || !character.currentAreaId) {
      return NextResponse.json({ success: false, error: "Tidak sedang combat" }, { status: 400 });
    }

    const areaResult = getAreaById(character.currentAreaId);
    if (!areaResult) return NextResponse.json({ success: false, error: "Area tidak valid" }, { status: 400 });

    const monsters = getMonstersForArea(areaResult.area.monsters);
    if (!monsters.length) return NextResponse.json({ success: false, error: "Tidak ada monster" }, { status: 400 });

    const monster = monsters[Math.floor(Math.random() * monsters.length)];

    // Get all skill levels
    const getSkillLevel = (id: string) =>
      character.skills.find((s) => s.skillId === id)?.level ?? 1;

    const skillLevels = {
      melee:   getSkillLevel("melee"),
      ranged:  getSkillLevel("ranged"),
      magic:   getSkillLevel("magic"),
      defense: getSkillLevel("defense"),
    };

    // Get equipped weapon damage bonus
    const equippedWeaponId = character.equipment?.weapon;
    let weaponDamage = 0;
    if (equippedWeaponId) {
      const weaponInv = character.inventory.find((i) => i.id === equippedWeaponId);
      if (weaponInv) {
        const weaponDef = getItemById(weaponInv.itemId);
        weaponDamage = weaponDef?.stats?.damage ?? 0;
      }
    }

    // Determine combat style from class
    const combatStyle = getPrimaryCombatStyle(character.classId);

    // Fight loop
    let monsterHp = monster.hp;
    let charHp    = character.hp;
    const logs: string[] = [];
    let totalExp  = 0;
    let totalGold = 0;
    const allLoot: Record<string, number> = {};
    let playerDied = false;

    while (monsterHp > 0 && charHp > 0) {
      const tick = runCombatTick(
        { ...character, int_stat: character.int_stat, hp: charHp },
        monster, monsterHp,
        skillLevels, combatStyle, weaponDamage
      );

      monsterHp = tick.monsterHpAfter;
      charHp    = tick.playerHpAfter;

      if (tick.logMessage) logs.push(tick.logMessage);

      if (tick.monsterKilled) {
        totalExp  += tick.expGained;
        totalGold += tick.goldGained;
        tick.loot.forEach((l) => {
          allLoot[l.itemId] = (allLoot[l.itemId] ?? 0) + l.quantity;
        });
      }

      if (tick.playerDied) { playerDied = true; break; }
    }

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

    // Skill exp gains based on combat style
    const skillExpGains = getSkillExpGain(totalExp, combatStyle);

    await prisma.$transaction(async (tx) => {
      const newHp = Math.min(character.maxHp, charHp + Math.floor(character.maxHp * 0.1));

      await tx.character.update({
        where: { id: character.id },
        data: { hp: newHp, gold: { increment: totalGold }, lastOnlineAt: new Date() },
      });

      // Update skill exp + level up
      for (const [skillId, expGain] of Object.entries(skillExpGains)) {
        const skill = character.skills.find((s) => s.skillId === skillId);
        if (!skill) continue;

        let newExp   = skill.experience + expGain;
        let newLevel = skill.level;
        const oldLevel = skill.level;

        while (newLevel < 99) {
          const needed = getExpToNextLevel(newLevel);
          if (newExp >= needed) { newExp -= needed; newLevel++; }
          else break;
        }

        await tx.characterSkill.update({
          where: { characterId_skillId: { characterId: character.id, skillId } },
          data: { experience: newExp, level: newLevel },
        });

        // Apply stat gains on level up
        if (newLevel > oldLevel) {
          const levelsGained = newLevel - oldLevel;
          logs.push(`🎉 ${skillId.charAt(0).toUpperCase() + skillId.slice(1)} naik ke Level ${newLevel}!`);

          const statUpdate: any = {};

          if (skillId === "melee") {
            statUpdate.str   = { increment: 2 * levelsGained };
            statUpdate.maxHp = { increment: 1 * levelsGained };
          } else if (skillId === "ranged") {
            statUpdate.agi   = { increment: 2 * levelsGained };
          } else if (skillId === "magic") {
            statUpdate.int_stat = { increment: 2 * levelsGained };
            statUpdate.maxMp    = { increment: 1 * levelsGained };
          } else if (skillId === "defense") {
            statUpdate.vit   = { increment: 1 * levelsGained };
            statUpdate.maxHp = { increment: 2 * levelsGained };
          }

          if (Object.keys(statUpdate).length > 0) {
            await tx.character.update({
              where: { id: character.id },
              data: statUpdate,
            });
          }

          // Milestone attribute points
          const oldMilestones = Math.floor(oldLevel / 10);
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
      }

      // Recalculate overall level
      const allSkills = await tx.characterSkill.findMany({
        where: { characterId: character.id },
      });
      const totalLevels   = allSkills.reduce((sum, s) => sum + s.level, 0);
      const newCharLevel  = Math.max(1, Math.floor(totalLevels / allSkills.length));
      await tx.character.update({
        where: { id: character.id },
        data: { level: newCharLevel },
      });

      // Add loot
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

      // Quest progress
      if (totalExp > 0) {
        const freshChar = await tx.character.findUnique({
          where: { id: character.id },
          include: { questProgress: true },
        });

        for (const prog of freshChar?.questProgress ?? []) {
          if (prog.completed || prog.resetAt <= new Date()) continue;

          let increment = 0;
          if (["daily_kill_10","daily_kill_25","daily_kill_50","daily_kill_100","weekly_kill_500"].includes(prog.questId)) {
            increment = 1;
          } else if (["daily_earn_gold","daily_earn_200","weekly_earn_5000"].includes(prog.questId)) {
            increment = totalGold;
          }

          if (increment > 0) {
            const { DAILY_QUESTS, WEEKLY_QUESTS } = await import("@/data/quests/daily_quests");
            const questDef = [...DAILY_QUESTS, ...WEEKLY_QUESTS].find((q) => q.id === prog.questId);
            if (questDef) {
              const newProgress = Math.min(prog.progress + increment, questDef.objective.target);
              await tx.questProgress.update({
                where: { id: prog.id },
                data: { progress: newProgress, completed: newProgress >= questDef.objective.target },
              });
            }
          }
        }
      }
      // Track achievements
        if (totalExp > 0) {
          const { checkAndGrantAchievements } = await import("@/systems/AchievementEngine");
          await checkAndGrantAchievements(character.id, { killCount: 1 });
        }
    });

    return NextResponse.json({
      success: true,
      data: {
        playerDied: false, logs,
        expGained: totalExp, goldGained: totalGold,
        loot: Object.entries(allLoot).map(([itemId, quantity]) => ({ itemId, quantity })),
        monsterName: monster.name,
        combatStyle,
      },
    });
  } catch (error) {
    console.error("Combat tick error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}