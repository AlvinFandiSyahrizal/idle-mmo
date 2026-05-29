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
      include: {
        skills: true,
        equipment: true,
        inventory: { take: 100, orderBy: { createdAt: "desc" } },
      },
    });

    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    // Enrich equipment with item definitions
    const equipment = character.equipment;
    const enrichedEquipment: Record<string, any> = {};

    if (equipment) {
      const slots = ["weapon", "helmet", "chest", "gloves", "boots", "accessory1", "accessory2"];
      for (const slot of slots) {
        const invItemId = (equipment as any)[slot];
        if (invItemId) {
          const invItem = character.inventory.find((i) => i.id === invItemId);
          if (invItem) {
            const def = getItemById(invItem.itemId);
            enrichedEquipment[slot] = {
              ...invItem,
              name: def?.name ?? invItem.itemId,
              type: def?.type ?? "material",
              description: def?.description ?? "",
              stats: def?.stats ?? {},
              sellPrice: def?.sellPrice ?? 0,
            };
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...character,
        enrichedEquipment,
      },
    });
  } catch (error) {
    console.error("Get character error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}