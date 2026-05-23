import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getItemById } from "@/data/items";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { inventoryItemId, quantity } = await req.json();
    if (!inventoryItemId || !quantity || quantity < 1) {
      return NextResponse.json({ success: false, error: "Data tidak valid" }, { status: 400 });
    }

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
    });
    if (!character) return NextResponse.json({ success: false, error: "Karakter tidak ditemukan" }, { status: 404 });

    const invItem = await prisma.inventoryItem.findFirst({
      where: { id: inventoryItemId, characterId: character.id },
    });
    if (!invItem) return NextResponse.json({ success: false, error: "Item tidak ditemukan" }, { status: 404 });

    const sellQty = Math.min(quantity, invItem.quantity);
    const itemDef = getItemById(invItem.itemId);
    const totalGold = (itemDef?.sellPrice ?? 0) * sellQty;

    await prisma.$transaction(async (tx) => {
      if (invItem.quantity <= sellQty) {
        await tx.inventoryItem.delete({ where: { id: invItem.id } });
      } else {
        await tx.inventoryItem.update({
          where: { id: invItem.id },
          data: { quantity: { decrement: sellQty } },
        });
      }
      await tx.character.update({
        where: { id: character.id },
        data: { gold: { increment: totalGold } },
      });
    });

    return NextResponse.json({ success: true, data: { goldGained: totalGold, soldQty: sellQty } });
  } catch (error) {
    console.error("Sell error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
