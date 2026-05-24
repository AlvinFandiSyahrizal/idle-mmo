import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CHARACTER_CLASSES, CLASS_ICONS } from "@/data/characters";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") ?? "level";

    const characters = await prisma.character.findMany({
      include: {
        skills: true,
        user: { select: { username: true } },
      },
      take: 50,
    });

    const enriched = characters.map((char) => {
      const classDef = CHARACTER_CLASSES.find((c) => c.id === char.classId);
      const totalSkillLevels = char.skills.reduce((sum, s) => sum + s.level, 0);
      const meleeLevel = char.skills.find((s) => s.skillId === "melee")?.level ?? 1;
      const highestSkill = char.skills.reduce((a, b) => a.level > b.level ? a : b);

      return {
        id: char.id,
        name: char.name,
        username: char.user.username,
        classId: char.classId,
        classIcon: classDef ? CLASS_ICONS[classDef.id] : "⚔️",
        className: classDef?.name ?? char.classId,
        level: char.level,
        totalSkillLevels,
        meleeLevel,
        highestSkillLevel: highestSkill.level,
        gold: char.gold,
        ascensionCount: char.ascensionCount,
        alignment: char.alignment,
        isMe: char.userId === session.user.id,
      };
    });

    // Sort by type
    let sorted = [...enriched];
    if (type === "level") {
      sorted.sort((a, b) => b.totalSkillLevels - a.totalSkillLevels);
    } else if (type === "melee") {
      sorted.sort((a, b) => b.meleeLevel - a.meleeLevel);
    } else if (type === "gold") {
      sorted.sort((a, b) => b.gold - a.gold);
    } else if (type === "ascension") {
      sorted.sort((a, b) => b.ascensionCount - a.ascensionCount);
    }

    const ranked = sorted.map((char, i) => ({ ...char, rank: i + 1 }));

    return NextResponse.json({ success: true, data: ranked });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}