import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SKILLS, getExpToNextLevel } from "@/data/skills";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { skills: true },
    });

    if (!character) return NextResponse.json({ success: false, error: "Karakter tidak ditemukan" }, { status: 404 });

    const skillsWithDetails = character.skills.map((skill) => {
      const def = SKILLS.find((s) => s.id === skill.skillId);
      const expToNext = getExpToNextLevel(skill.level);
      const expPct = expToNext > 0 ? Math.min(100, Math.round((skill.experience / expToNext) * 100)) : 100;
      return {
        ...skill,
        name: def?.name ?? skill.skillId,
        icon: def?.icon ?? "📊",
        category: def?.category ?? "combat",
        description: def?.description ?? "",
        maxLevel: def?.maxLevel ?? 99,
        expToNext,
        expPct,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        skills: skillsWithDetails,
        attributePoints: character.attributePoints,
        str: character.str,
        agi: character.agi,
        int_stat: character.int_stat,
        vit: character.vit,
        hp: character.hp,
        maxHp: character.maxHp,
        mp: character.mp,
        maxMp: character.maxMp,
      },
    });
  } catch (error) {
    console.error("Skills error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}