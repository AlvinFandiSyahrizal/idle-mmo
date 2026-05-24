import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CHARACTER_CLASSES, CLASS_ICONS } from "@/data/characters";
import { SKILLS } from "@/data/skills";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const targetUsername = searchParams.get("username");

    let userId = session.user.id;

    if (targetUsername) {
      const targetUser = await prisma.user.findUnique({
        where: { username: targetUsername },
      });
      if (!targetUser) return NextResponse.json({ success: false, error: "Player tidak ditemukan" }, { status: 404 });
      userId = targetUser.id;
    }

    const character = await prisma.character.findUnique({
      where: { userId },
      include: {
        skills: true,
        achievements: true,
        user: { select: { username: true, createdAt: true } },
      },
    });

    if (!character) return NextResponse.json({ success: false, error: "Karakter tidak ditemukan" }, { status: 404 });

    const classDef = CHARACTER_CLASSES.find((c) => c.id === character.classId);
    const skillsEnriched = character.skills.map((s) => {
      const def = SKILLS.find((d) => d.id === s.skillId);
      return { ...s, name: def?.name ?? s.skillId, icon: def?.icon ?? "📊", category: def?.category ?? "combat" };
    });

    const totalSkillLevels = character.skills.reduce((sum, s) => sum + s.level, 0);
    const highestSkill = character.skills.reduce((a, b) => a.level > b.level ? a : b);
    const highestSkillDef = SKILLS.find((s) => s.id === highestSkill.skillId);

    const alignmentLabel =
      character.alignment <= -60 ? "Mesir Sejati"
      : character.alignment <= -30 ? "Condong Mesir"
      : character.alignment >= 60 ? "Mesopotamia Sejati"
      : character.alignment >= 30 ? "Condong Mesopotamia"
      : "Netral";

    return NextResponse.json({
      success: true,
      data: {
        character: {
          ...character,
          classIcon: classDef ? CLASS_ICONS[classDef.id] : "⚔️",
          className: classDef?.name ?? character.classId,
          alignmentLabel,
        },
        skills: skillsEnriched,
        stats: {
          totalSkillLevels,
          highestSkill: { ...highestSkill, name: highestSkillDef?.name, icon: highestSkillDef?.icon },
          achievementCount: character.achievements.length,
        },
        username: character.user.username,
        joinedAt: character.user.createdAt,
        isOwn: userId === session.user.id,
      },
    });
  } catch (error) {
    console.error("Profile error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
