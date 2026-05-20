import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
    });
    if (!character) return NextResponse.json({ success: false, error: "Karakter tidak ditemukan" }, { status: 404 });

    await prisma.character.update({
      where: { id: character.id },
      data: {
        isInCombat: false,
        currentAreaId: null,
        combatStartedAt: null,
        lastOnlineAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Combat stop error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}