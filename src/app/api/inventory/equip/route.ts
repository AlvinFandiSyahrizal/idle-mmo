import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getItemById } from "@/data/items";

const SLOT_MAP: Record<string, string> = {
  weapon: "weapon",
  helmet: "helmet",
  chest: "chest",
  gloves: "gloves",
  boots: "boots",
  accessory: "accessory1",
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { action, inventoryItemId, slot } = await req.json();

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { equipment: true, inventory: true },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    if (action === "equip") {
      const invItem = character.inventory.find((i) => i.id === inventoryItemId);
      if (!invItem) return NextResponse.json({ success: false, error: "Item tidak ditemukan" }, { status: 404 });

      const itemDef = getItemById(invItem.itemId);
      if (!itemDef) return NextResponse.json({ success: false, error: "Item data tidak ditemukan" }, { status: 404 });

      const equipSlot = SLOT_MAP[itemDef.type];
      if (!equipSlot) return NextResponse.json({ success: false, error: "Item tidak bisa di-equip" }, { status: 400 });

      // Check if slot is taken — unequip old first
      const equipment = character.equipment;
      const currentEquipped = equipment ? (equipment as any)[equipSlot] : null;

      // Calculate stat changes
      const newStats = itemDef.stats ?? {};
      let statDelta: Record<string, number> = {};

      if (currentEquipped) {
        const oldItem = character.inventory.find((i) => i.id === currentEquipped);
        const oldDef  = oldItem ? getItemById(oldItem.itemId) : null;
        const oldStats = oldDef?.stats ?? {};

        // Remove old stats, add new stats
        for (const key of ["str", "agi", "int_stat", "vit"] as const) {
          statDelta[key] = (newStats[key] ?? 0) - (oldStats[key] ?? 0);
        }
        const hpDelta  = (newStats.defense ?? 0) * 2 - (oldStats.defense ?? 0) * 2;
        statDelta["maxHp"] = hpDelta;
      } else {
        for (const key of ["str", "agi", "int_stat", "vit"] as const) {
          statDelta[key] = newStats[key] ?? 0;
        }
        statDelta["maxHp"] = (newStats.defense ?? 0) * 2;
      }

      await prisma.$transaction(async (tx) => {
        // Update equipment slot
        await tx.equipment.update({
          where: { characterId: character.id },
          data: { [equipSlot]: inventoryItemId },
        });

        // Apply stat changes
        const updateData: any = {};
        if (statDelta["str"])    updateData.str       = { increment: statDelta["str"] };
        if (statDelta["agi"])    updateData.agi       = { increment: statDelta["agi"] };
        if (statDelta["int_stat"]) updateData.int_stat = { increment: statDelta["int_stat"] };
        if (statDelta["vit"])    updateData.vit       = { increment: statDelta["vit"] };
        if (statDelta["maxHp"])  updateData.maxHp     = { increment: statDelta["maxHp"] };

        if (Object.keys(updateData).length > 0) {
          await tx.character.update({
            where: { id: character.id },
            data: updateData,
          });
        }
      });

      return NextResponse.json({
        success: true,
        data: { equipped: itemDef.name, slot: equipSlot, statDelta },
      });
    }

    if (action === "unequip") {
        const unequipSlot = slot;

        const equipment = character.equipment;

        if (!equipment) {
            return NextResponse.json(
            { success: false, error: "No equipment" },
            { status: 400 }
            );
        }

        const currentId = (equipment as any)[unequipSlot];

        if (!currentId) {
            return NextResponse.json({
            success: true,
            data: { unequipped: true },
            });
        }

        const invItem = character.inventory.find(
            (i) => i.id === currentId
        );

        const itemDef = invItem
            ? getItemById(invItem.itemId)
            : null;

        const oldStats = itemDef?.stats ?? {};

        await prisma.$transaction(async (tx) => {
            await tx.equipment.update({
            where: { characterId: character.id },
            data: {
                [unequipSlot]: null,
            },
            });

            const updateData: any = {};

            if (oldStats.str)
            updateData.str = { decrement: oldStats.str };

            if (oldStats.agi)
            updateData.agi = { decrement: oldStats.agi };

            if (oldStats.int_stat)
            updateData.int_stat = {
                decrement: oldStats.int_stat,
            };

            if (oldStats.vit)
            updateData.vit = {
                decrement: oldStats.vit,
            };

            if (oldStats.defense)
            updateData.maxHp = {
                decrement: oldStats.defense * 2,
            };

            if (Object.keys(updateData).length > 0) {
            await tx.character.update({
                where: { id: character.id },
                data: updateData,
            });
            }
        });

        return NextResponse.json({
            success: true,
            data: { unequipped: true },
        });
    }

    return NextResponse.json({ success: false, error: "Action tidak valid" }, { status: 400 });
  } catch (error) {
    console.error("Equip error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}