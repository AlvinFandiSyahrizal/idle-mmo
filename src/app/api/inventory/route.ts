import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getItemById } from "@/data/items";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { inventory: { orderBy: { createdAt: "desc" } } },
    });

    if (!character) return NextResponse.json({ success: false, error: "Karakter tidak ditemukan" }, { status: 404 });

    const inventoryWithDetails = character.inventory.map((item) => {
      const def = getItemById(item.itemId);
      return {
        ...item,
        name: def?.name ?? item.itemId,
        type: def?.type ?? "material",
        tier: def?.tier ?? "common",
        description: def?.description ?? "",
        sellPrice: def?.sellPrice ?? 0,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        items: inventoryWithDetails,
        gold: character.gold,
      },
    });
  } catch (error) {
    console.error("Inventory error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}