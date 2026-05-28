import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GATHERING_AREA_MAP } from "@/data/gathering";
import { getExpToNextLevel } from "@/data/skills";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { action, areaId } = await req.json();

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { skills: true, inventory: true },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    if (action === "start") {
      const area = GATHERING_AREA_MAP[areaId];
      if (!area) return NextResponse.json({ success: false, error: "Area tidak ditemukan" }, { status: 404 });

      const skill = character.skills.find((s) => s.skillId === area.skill);
      if (!skill || skill.level < area.minSkillLevel) {
        return NextResponse.json({
          success: false,
          error: `Butuh ${area.skill} level ${area.minSkillLevel}`,
        }, { status: 400 });
      }

      return NextResponse.json({ success: true, data: { areaId, areaName: area.name } });
    }

    if (action === "tick") {
      const area = GATHERING_AREA_MAP[areaId];
      if (!area) return NextResponse.json({ success: false, error: "Area tidak valid" }, { status: 400 });

      const skill = character.skills.find((s) => s.skillId === area.skill);
      const skillLevel = skill?.level ?? 1;

      // Roll resources
      const gathered: { itemId: string; itemName: string; quantity: number }[] = [];
      for (const resource of area.resources) {
        if (skillLevel < resource.minSkillLevel) continue;
        if (Math.random() < resource.chance) {
          const qty = resource.minQty + Math.floor(Math.random() * (resource.maxQty - resource.minQty + 1));
          gathered.push({ itemId: resource.itemId, itemName: resource.itemName, quantity: qty });
        }
      }

      // Skill exp gain
      const expGain = area.expPerTick;
      let newLevel = skill?.level ?? 1;
      let newExp = (skill?.experience ?? 0) + expGain;
      let leveledUp = false;

      while (newLevel < 99) {
        const needed = getExpToNextLevel(newLevel);
        if (newExp >= needed) { newExp -= needed; newLevel++; leveledUp = true; }
        else break;
      }

      await prisma.$transaction(async (tx) => {
        // Update skill
        if (skill) {
          await tx.characterSkill.update({
            where: { characterId_skillId: { characterId: character.id, skillId: area.skill } },
            data: { experience: newExp, level: newLevel },
          });
        }

        // Add gathered items to inventory
        for (const item of gathered) {
          const existing = await tx.inventoryItem.findFirst({
            where: { characterId: character.id, itemId: item.itemId },
          });
          if (existing) {
            await tx.inventoryItem.update({
              where: { id: existing.id },
              data: { quantity: { increment: item.quantity } },
            });
          } else {
            await tx.inventoryItem.create({
              data: { characterId: character.id, itemId: item.itemId, quantity: item.quantity },
            });
          }
        }
      });

      return NextResponse.json({
        success: true,
        data: {
          gathered,
          expGained: expGain,
          skillLevel: newLevel,
          leveledUp,
          skillId: area.skill,
        },
      });
    }

    return NextResponse.json({ success: false, error: "Action tidak valid" }, { status: 400 });
  } catch (error) {
    console.error("Gathering error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}