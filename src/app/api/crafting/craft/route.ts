import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RECIPE_MAP } from "@/data/crafting";
import { getExpToNextLevel } from "@/data/skills";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { recipeId } = await req.json();
    const recipe = RECIPE_MAP[recipeId];
    if (!recipe) return NextResponse.json({ success: false, error: "Resep tidak ditemukan" }, { status: 404 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { skills: true, inventory: true },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    // Check skill level
    const skill = character.skills.find((s) => s.skillId === recipe.requiredSkill);
    const skillLevel = skill?.level ?? 1;
    if (skillLevel < recipe.requiredSkillLevel) {
      return NextResponse.json({
        success: false,
        error: `Butuh ${recipe.requiredSkill} level ${recipe.requiredSkillLevel}`,
      }, { status: 400 });
    }

    // Check ingredients
    const invMap: Record<string, { id: string; quantity: number }> = {};
    character.inventory.forEach((item) => {
      if (!invMap[item.itemId]) {
        invMap[item.itemId] = { id: item.id, quantity: item.quantity };
      } else {
        invMap[item.itemId].quantity += item.quantity;
      }
    });

    for (const ing of recipe.ingredients) {
      if ((invMap[ing.itemId]?.quantity ?? 0) < ing.quantity) {
        return NextResponse.json({
          success: false,
          error: `Bahan tidak cukup: ${ing.itemId}`,
        }, { status: 400 });
      }
    }

    // Craft exp gain
    const expGain = recipe.requiredSkillLevel * 5 + 10;

    let leveledUp = false;
    let newSkillLevel = skillLevel;

    await prisma.$transaction(async (tx) => {
      // Consume ingredients
      for (const ing of recipe.ingredients) {
        const invItem = character.inventory.find(
          (i) => i.itemId === ing.itemId && i.quantity >= ing.quantity
        );
        if (!invItem) throw new Error("Bahan tidak cukup");

        if (invItem.quantity === ing.quantity) {
          await tx.inventoryItem.delete({ where: { id: invItem.id } });
        } else {
          await tx.inventoryItem.update({
            where: { id: invItem.id },
            data: { quantity: { decrement: ing.quantity } },
          });
        }
      }

      const { checkAndGrantAchievements } = await import("@/systems/AchievementEngine");
      await checkAndGrantAchievements(character.id, { craftCount: 1 });

      // Add output to inventory
      const existing = await tx.inventoryItem.findFirst({
        where: { characterId: character.id, itemId: recipe.outputItemId },
      });
      if (existing) {
        await tx.inventoryItem.update({
          where: { id: existing.id },
          data: { quantity: { increment: recipe.outputQuantity } },
        });
      } else {
        await tx.inventoryItem.create({
          data: {
            characterId: character.id,
            itemId: recipe.outputItemId,
            quantity: recipe.outputQuantity,
            tier: recipe.outputTier,
          },
        });
      }

      // Update skill exp
      if (skill) {
        let newExp = skill.experience + expGain;
        newSkillLevel = skill.level;
        while (newSkillLevel < 99) {
          const needed = getExpToNextLevel(newSkillLevel);
          if (newExp >= needed) { newExp -= needed; newSkillLevel++; leveledUp = true; }
          else break;
        }
        await tx.characterSkill.update({
          where: { characterId_skillId: { characterId: character.id, skillId: recipe.requiredSkill } },
          data: { experience: newExp, level: newSkillLevel },
        });
      }
    });

    // Track crafting quest progress
    const freshChar2 = await prisma.character.findUnique({
      where: { id: character.id },
      include: { questProgress: true },
    });

    for (const prog of freshChar2?.questProgress ?? []) {
      if (prog.completed || prog.resetAt <= new Date()) continue;
      if (prog.questId === "daily_craft_3" || prog.questId === "weekly_craft_15") {
        const { DAILY_QUESTS, WEEKLY_QUESTS } = await import("@/data/quests/daily_quests");
        const questDef = [...DAILY_QUESTS, ...WEEKLY_QUESTS].find((q) => q.id === prog.questId);
        if (questDef) {
          const newProgress = Math.min(prog.progress + 1, questDef.objective.target);
          await prisma.questProgress.update({
            where: { id: prog.id },
            data: { progress: newProgress, completed: newProgress >= questDef.objective.target },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        crafted: recipe.outputItemId,
        quantity: recipe.outputQuantity,
        expGained: expGain,
        skillLevelUp: leveledUp,
        newSkillLevel,
      },
    });
  } catch (error) {
    console.error("Craft error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}