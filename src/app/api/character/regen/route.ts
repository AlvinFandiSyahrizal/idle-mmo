import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    if (character.isInCombat) {
      return NextResponse.json({ success: true, data: { healed: 0 } });
    }

    if (character.hp >= character.maxHp) {
      return NextResponse.json({ success: true, data: { healed: 0 } });
    }

    // Regen 5% max HP per tick saat tidak combat
    const regenAmount = Math.max(1, Math.floor(character.maxHp * 0.05));
    const newHp = Math.min(character.maxHp, character.hp + regenAmount);

    await prisma.character.update({
      where: { id: character.id },
      data: { hp: newHp },
    });

    return NextResponse.json({ success: true, data: { healed: newHp - character.hp, newHp } });
  } catch (error) {
    console.error("Regen error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}