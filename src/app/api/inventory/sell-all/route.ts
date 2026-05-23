import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getItemById } from "@/data/items";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { excludeIds = [] } = await req.json();

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { inventory: true },
    });
    if (!character) return NextResponse.json({ success: false, error: "Karakter tidak ditemukan" }, { status: 404 });

    const itemsToSell = character.inventory.filter(
      (item) => !excludeIds.includes(item.id)
    );

    let totalGold = 0;
    const soldItems: { name: string; qty: number; gold: number }[] = [];

    await prisma.$transaction(async (tx) => {
      for (const item of itemsToSell) {
        const def = getItemById(item.itemId);
        const gold = (def?.sellPrice ?? 0) * item.quantity;
        if (gold === 0) continue;
        totalGold += gold;
        soldItems.push({ name: def?.name ?? item.itemId, qty: item.quantity, gold });
        await tx.inventoryItem.delete({ where: { id: item.id } });
      }
      if (totalGold > 0) {
        await tx.character.update({
          where: { id: character.id },
          data: { gold: { increment: totalGold } },
        });
      }
    });

    return NextResponse.json({ success: true, data: { totalGold, soldItems } });
  } catch (error) {
    console.error("Sell all error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}