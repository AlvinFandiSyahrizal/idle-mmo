import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const STAT_GAINS: Record<string, { field: string; amount: number; extra?: { field: string; amount: number } }> = {
  str: { field: "str", amount: 1 },
  agi: { field: "agi", amount: 1 },
  int_stat: { field: "int_stat", amount: 1, extra: { field: "maxMp", amount: 5 } },
  vit: { field: "vit", amount: 1, extra: { field: "maxHp", amount: 15 } },
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { stat } = await req.json();
    if (!STAT_GAINS[stat]) {
      return NextResponse.json({ success: false, error: "Stat tidak valid" }, { status: 400 });
    }

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
    });
    if (!character) return NextResponse.json({ success: false, error: "Karakter tidak ditemukan" }, { status: 404 });

    if (character.attributePoints < 1) {
      return NextResponse.json({ success: false, error: "Attribute point tidak cukup" }, { status: 400 });
    }

    const gain = STAT_GAINS[stat];
    const updateData: any = {
      attributePoints: { decrement: 1 },
      [gain.field]: { increment: gain.amount },
    };
    if (gain.extra) {
      updateData[gain.extra.field] = { increment: gain.extra.amount };
    }

    await prisma.character.update({
      where: { id: character.id },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Spend point error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}