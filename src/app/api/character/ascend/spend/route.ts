import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface AscensionPerk {
  id: string;
  name: string;
  description: string;
  cost: number;
  maxStack: number;
  category: "exp" | "drop" | "gold" | "combat";
}

export const ASCENSION_PERKS: AscensionPerk[] = [
  { id: "exp_boost", name: "Ancient Wisdom", description: "+5% EXP gain permanent", cost: 3, maxStack: 10, category: "exp" },
  { id: "drop_boost", name: "Fortune's Favor", description: "+3% drop rate permanent", cost: 3, maxStack: 10, category: "drop" },
  { id: "gold_boost", name: "Midas Touch", description: "+5% Gold gain permanent", cost: 2, maxStack: 10, category: "gold" },
  { id: "combat_boost", name: "Battle Hardened", description: "+5% damage permanent", cost: 4, maxStack: 5, category: "combat" },
  { id: "hp_boost", name: "Iron Constitution", description: "+50 max HP permanent", cost: 2, maxStack: 20, category: "combat" },
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { inventory: true },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    // Get purchased perks from a simple JSON field
    // We'll store in character's inventory with special itemId prefix
    const perkCounts: Record<string, number> = {};
    for (const perk of ASCENSION_PERKS) {
      const perkItem = character.inventory.find((i) => i.itemId === `ascension_perk_${perk.id}`);
      perkCounts[perk.id] = perkItem?.quantity ?? 0;
    }

    return NextResponse.json({
      success: true,
      data: {
        perks: ASCENSION_PERKS.map((p) => ({
          ...p,
          owned: perkCounts[p.id] ?? 0,
          canBuy: (perkCounts[p.id] ?? 0) < p.maxStack && character.ascensionPoints >= p.cost,
        })),
        ascensionPoints: character.ascensionPoints,
        ascensionCount: character.ascensionCount,
      },
    });
  } catch (error) {
    console.error("Ascension spend GET error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { perkId } = await req.json();
    const perk = ASCENSION_PERKS.find((p) => p.id === perkId);
    if (!perk) return NextResponse.json({ success: false, error: "Perk tidak ditemukan" }, { status: 404 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { inventory: true },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    if (character.ascensionPoints < perk.cost) {
      return NextResponse.json({ success: false, error: "Ascension point tidak cukup" }, { status: 400 });
    }

    const existingPerk = character.inventory.find((i) => i.itemId === `ascension_perk_${perk.id}`);
    const currentOwned = existingPerk?.quantity ?? 0;

    if (currentOwned >= perk.maxStack) {
      return NextResponse.json({ success: false, error: "Perk sudah maksimal" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.character.update({
        where: { id: character.id },
        data: { ascensionPoints: { decrement: perk.cost } },
      });

      if (existingPerk) {
        await tx.inventoryItem.update({
          where: { id: existingPerk.id },
          data: { quantity: { increment: 1 } },
        });
      } else {
        await tx.inventoryItem.create({
          data: {
            characterId: character.id,
            itemId: `ascension_perk_${perk.id}`,
            quantity: 1,
            tier: "legendary",
          },
        });
      }

      // Apply immediate stat effects
      if (perk.id === "hp_boost") {
        await tx.character.update({
          where: { id: character.id },
          data: { maxHp: { increment: 50 }, hp: { increment: 50 } },
        });
      }
    });

    return NextResponse.json({ success: true, data: { perkName: perk.name } });
  } catch (error) {
    console.error("Ascension spend POST error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
