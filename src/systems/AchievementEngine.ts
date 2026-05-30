import { prisma } from "@/lib/prisma";
import { ACHIEVEMENTS, AchievementDefinition } from "@/data/achievements";

interface CharacterSnapshot {
  id: string;
  gold: number;
  ascensionCount: number;
  loginStreak: number;
  skills: { skillId: string; level: number }[];
  achievements: { achievementId: string }[];
}

export async function checkAndGrantAchievements(
  characterId: string,
  context: {
    killCount?: number;
    craftCount?: number;
    guildJoined?: boolean;
  } = {}
): Promise<{ granted: AchievementDefinition[]; totalGold: number; totalShard: number; totalPoints: number }> {
  const character = await prisma.character.findUnique({
    where: { id: characterId },
    include: {
      skills: true,
      achievements: true,
      inventory: true,
    },
  });

  if (!character) return { granted: [], totalGold: 0, totalShard: 0, totalPoints: 0 };

  const unlockedIds = new Set(character.achievements.map((a) => a.achievementId));
  const granted: AchievementDefinition[] = [];

  // Get kill count from quest progress as proxy
  const killQuest = await prisma.questProgress.findFirst({
    where: { characterId, questId: "daily_kill_100" },
  });

  // Get craft count from inventory perk as proxy
  // We'll use a simple counter stored in inventory with special itemId
  const craftCounter = character.inventory.find((i) => i.itemId === "_craft_count");
  const craftCount   = craftCounter?.quantity ?? 0;

  // Total kill count — stored as special inventory item
  const killCounter  = character.inventory.find((i) => i.itemId === "_kill_count");
  const totalKills   = (killCounter?.quantity ?? 0) + (context.killCount ?? 0);

  const totalCrafts  = craftCount + (context.craftCount ?? 0);

  const snapshot: CharacterSnapshot = {
    id: character.id,
    gold: character.gold,
    ascensionCount: character.ascensionCount,
    loginStreak: character.loginStreak,
    skills: character.skills,
    achievements: character.achievements,
  };

  for (const achievement of ACHIEVEMENTS) {
    if (unlockedIds.has(achievement.id)) continue;

    let met = false;
    const { condition } = achievement;

    switch (condition.type) {
      case "kill_count":
        met = totalKills >= condition.target;
        break;
      case "skill_level": {
        const skill = snapshot.skills.find((s) => s.skillId === condition.skillId);
        met = (skill?.level ?? 0) >= condition.target;
        break;
      }
      case "gold_earned":
        met = snapshot.gold >= condition.target;
        break;
      case "ascension_count":
        met = snapshot.ascensionCount >= condition.target;
        break;
      case "login_streak":
        met = snapshot.loginStreak >= condition.target;
        break;
      case "craft_count":
        met = totalCrafts >= condition.target;
        break;
      case "guild_joined":
        met = context.guildJoined ?? false;
        break;
      case "zone_unlocked": {
        const meleeLevel = snapshot.skills.find((s) => s.skillId === "melee")?.level ?? 1;
        met = meleeLevel >= condition.target;
        break;
      }
    }

    if (met) granted.push(achievement);
  }

  if (granted.length === 0) return { granted: [], totalGold: 0, totalShard: 0, totalPoints: 0 };

  // Grant all achievements in one transaction
  let totalGold   = 0;
  let totalShard  = 0;
  let totalPoints = 0;

  await prisma.$transaction(async (tx) => {
    for (const achievement of granted) {
      await tx.characterAchievement.create({
        data: { characterId, achievementId: achievement.id },
      });

      const r = achievement.reward;
      if (r.gold)            totalGold   += r.gold;
      if (r.soulShard)       totalShard  += r.soulShard;
      if (r.attributePoints) totalPoints += r.attributePoints;
    }

    const updateData: any = {};
    if (totalGold > 0)   updateData.gold            = { increment: totalGold };
    if (totalShard > 0)  updateData.soulShard        = { increment: totalShard };
    if (totalPoints > 0) updateData.attributePoints  = { increment: totalPoints };

    if (Object.keys(updateData).length > 0) {
      await tx.character.update({ where: { id: characterId }, data: updateData });
    }

    // Update kill/craft counters
    if (context.killCount) {
      const existing = await tx.inventoryItem.findFirst({
        where: { characterId, itemId: "_kill_count" },
      });
      if (existing) {
        await tx.inventoryItem.update({
          where: { id: existing.id },
          data: { quantity: { increment: context.killCount } },
        });
      } else {
        await tx.inventoryItem.create({
          data: { characterId, itemId: "_kill_count", quantity: context.killCount },
        });
      }
    }

    if (context.craftCount) {
      const existing = await tx.inventoryItem.findFirst({
        where: { characterId, itemId: "_craft_count" },
      });
      if (existing) {
        await tx.inventoryItem.update({
          where: { id: existing.id },
          data: { quantity: { increment: context.craftCount } },
        });
      } else {
        await tx.inventoryItem.create({
          data: { characterId, itemId: "_craft_count", quantity: context.craftCount },
        });
      }
    }
  });

  return { granted, totalGold, totalShard, totalPoints };
}