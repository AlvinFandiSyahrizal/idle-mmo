import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LORE_FRAGMENTS, LORE_MAP } from "@/data/lore";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { loreFragments: true },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const collectedIds = new Set(character.loreFragments.map((l) => l.loreId));

    const enriched = LORE_FRAGMENTS.map((lore) => ({
      ...lore,
      collected: collectedIds.has(lore.id),
      content: collectedIds.has(lore.id) ? lore.content : null,
    }));

    const byZone: Record<string, any[]> = {};
    for (const lore of enriched) {
      if (!byZone[lore.zoneId]) byZone[lore.zoneId] = [];
      byZone[lore.zoneId].push(lore);
    }

    return NextResponse.json({
      success: true,
      data: {
        fragments: enriched,
        byZone,
        total: LORE_FRAGMENTS.length,
        collected: collectedIds.size,
      },
    });
  } catch (error) {
    console.error("Lore GET error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { loreId } = await req.json();
    const lore = LORE_MAP[loreId];
    if (!lore) return NextResponse.json({ success: false, error: "Lore tidak ditemukan" }, { status: 404 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const existing = await prisma.characterLore.findUnique({
      where: { characterId_loreId: { characterId: character.id, loreId } },
    });

    if (!existing) {
      await prisma.characterLore.create({
        data: { characterId: character.id, loreId },
      });
    }

    return NextResponse.json({ success: true, data: { lore } });
  } catch (error) {
    console.error("Lore POST error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}