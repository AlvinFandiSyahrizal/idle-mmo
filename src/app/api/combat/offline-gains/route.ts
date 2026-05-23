import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAreaById } from "@/data/zones";
import { getMonstersForArea } from "@/data/monsters";
import { calculateOfflineGains } from "@/systems/OfflineGains";
import { getExpToNextLevel } from "@/data/skills";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { skills: true },
    });

    if (!character) return NextResponse.json({ success: false, error: "Karakter tidak ditemukan" }, { status: 404 });

    // Only calculate if was in combat when offline
    if (!character.isInCombat || !character.currentAreaId) {
      await prisma.character.update({
        where: { id: character.id },
        data: { lastOnlineAt: new Date() },
      });
      return NextResponse.json({ success: true, data: null });
    }

    const areaResult = getAreaById(character.currentAreaId);
    if (!areaResult) return NextResponse.json({ success: true, data: null });

    const monsters = getMonstersForArea(areaResult.area.monsters);
    if (!monsters.length) return NextResponse.json({ success: true, data: null });

    const gains = calculateOfflineGains(
      character,
      character.skills,
      monsters,
      character.lastOnlineAt
    );

    if (gains.kills === 0) {
      await prisma.character.update({
        where: { id: character.id },
        data: { lastOnlineAt: new Date() },
      });
      return NextResponse.json({ success: true, data: null });
    }

    // Apply gains in transaction
    await prisma.$transaction(async (tx) => {
      await tx.character.update({
        where: { id: character.id },
        data: {
          gold: { increment: gains.goldGained },
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

      // Skill exp gains
      const meleeExpGain = Math.floor(gains.expGained * 0.6);
      const defenseExpGain = Math.floor(gains.expGained * 0.2);

      for (const [skillId, expGain] of [["melee", meleeExpGain], ["defense", defenseExpGain]] as [string, number][]) {
        const skill = character.skills.find((s) => s.skillId === skillId);
        if (!skill) continue;

        let newExp = skill.experience + expGain;
        let newLevel = skill.level;

        while (newLevel < 99) {
          const needed = getExpToNextLevel(newLevel);
          if (newExp >= needed) { newExp -= needed; newLevel++; }
          else break;
        }

        await tx.characterSkill.update({
          where: { characterId_skillId: { characterId: character.id, skillId } },
          data: { experience: newExp, level: newLevel },
        });
      }

      // Apply stat gains from level ups
        const meleeGained = gains.skillLevelsGained["melee"] ?? 0;
        const defenseGained = gains.skillLevelsGained["defense"] ?? 0;

        if (meleeGained > 0) {
        await tx.character.update({
            where: { id: character.id },
            data: {
            str: { increment: 2 * meleeGained },
            maxHp: { increment: 1 * meleeGained },
            },
        });
        }
        if (defenseGained > 0) {
        await tx.character.update({
            where: { id: character.id },
            data: {
            vit: { increment: 1 * defenseGained },
            maxHp: { increment: 2 * defenseGained },
            },
        });
        }

      // Add loot to inventory
      for (const [itemId, quantity] of Object.entries(gains.loot)) {
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

    return NextResponse.json({ success: true, data: gains });
  } catch (error) {
    console.error("Offline gains error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}