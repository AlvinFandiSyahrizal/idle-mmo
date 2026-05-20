import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAreaById } from "@/data/zones";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { areaId } = await req.json();
    const result = getAreaById(areaId);
    if (!result) return NextResponse.json({ success: false, error: "Area tidak ditemukan" }, { status: 404 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { skills: true },
    });
    if (!character) return NextResponse.json({ success: false, error: "Karakter tidak ditemukan" }, { status: 404 });

    const meleeSkill = character.skills.find((s) => s.skillId === "melee");
    const combatLevel = meleeSkill?.level ?? 1;

    if (combatLevel < result.area.minCombatLevel) {
      return NextResponse.json({
        success: false,
        error: `Butuh Melee level ${result.area.minCombatLevel} untuk masuk area ini`,
      }, { status: 400 });
    }

    await prisma.character.update({
      where: { id: character.id },
      data: {
        isInCombat: true,
        currentAreaId: areaId,
        combatStartedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: { areaId, areaName: result.area.name } });
  } catch (error) {
    console.error("Combat start error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}