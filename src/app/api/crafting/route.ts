import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RECIPES } from "@/data/crafting";
import { getItemById } from "@/data/items";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { skills: true, inventory: true },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    // Build inventory map for quick lookup
    const invMap: Record<string, number> = {};
    character.inventory.forEach((item) => {
      invMap[item.itemId] = (invMap[item.itemId] ?? 0) + item.quantity;
    });

    // Enrich recipes with craftability
    const enriched = RECIPES.map((recipe) => {
      const skill = character.skills.find((s) => s.skillId === recipe.requiredSkill);
      const skillLevel = skill?.level ?? 1;
      const skillMet = skillLevel >= recipe.requiredSkillLevel;

      const ingredientsMet = recipe.ingredients.every(
        (ing) => (invMap[ing.itemId] ?? 0) >= ing.quantity
      );

      const ingredientsDetail = recipe.ingredients.map((ing) => {
        const itemDef = getItemById(ing.itemId);
        return {
          itemId: ing.itemId,
          name: itemDef?.name ?? ing.itemId,
          required: ing.quantity,
          owned: invMap[ing.itemId] ?? 0,
          enough: (invMap[ing.itemId] ?? 0) >= ing.quantity,
        };
      });

      const outputDef = getItemById(recipe.outputItemId);

      return {
        ...recipe,
        skillLevel,
        skillMet,
        ingredientsMet,
        canCraft: skillMet && ingredientsMet,
        ingredientsDetail,
        outputName: outputDef?.name ?? recipe.outputItemId,
        outputDescription: outputDef?.description ?? "",
      };
    });

    return NextResponse.json({ success: true, data: enriched });
  } catch (error) {
    console.error("Crafting GET error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
