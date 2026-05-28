import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CHARACTER_CLASSES } from "@/data/characters";
import { SKILLS } from "@/data/skills";

const ASCENSION_REQUIREMENTS = {
  minMeleeLevel: 99,
  minTotalSkillLevels: 400,
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { skills: true },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const meleeLevel = character.skills.find((s) => s.skillId === "melee")?.level ?? 1;
    const totalSkillLevels = character.skills.reduce((sum, s) => sum + s.level, 0);

    const meetsRequirements =
      meleeLevel >= ASCENSION_REQUIREMENTS.minMeleeLevel &&
      totalSkillLevels >= ASCENSION_REQUIREMENTS.minTotalSkillLevels;

    const ascensionPoints = 10 + character.ascensionCount * 5;

    return NextResponse.json({
      success: true,
      data: {
        meleeLevel,
        totalSkillLevels,
        requirements: ASCENSION_REQUIREMENTS,
        meetsRequirements,
        ascensionCount: character.ascensionCount,
        ascensionPoints,
        currentAscensionPoints: character.ascensionPoints,
      },
    });
  } catch (error) {
    console.error("Ascension GET error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { skills: true },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const meleeLevel = character.skills.find((s) => s.skillId === "melee")?.level ?? 1;
    const totalSkillLevels = character.skills.reduce((sum, s) => sum + s.level, 0);

    if (meleeLevel < ASCENSION_REQUIREMENTS.minMeleeLevel) {
      return NextResponse.json({
        success: false,
        error: `Melee harus level ${ASCENSION_REQUIREMENTS.minMeleeLevel} dulu`,
      }, { status: 400 });
    }
    if (totalSkillLevels < ASCENSION_REQUIREMENTS.minTotalSkillLevels) {
      return NextResponse.json({
        success: false,
        error: `Total skill levels harus ${ASCENSION_REQUIREMENTS.minTotalSkillLevels}+`,
      }, { status: 400 });
    }

    const classDef = CHARACTER_CLASSES.find((c) => c.id === character.classId);
    const baseStats = classDef?.baseStats ?? { hp: 100, mp: 50, str: 10, agi: 10, int_stat: 10, vit: 10 };
    const ascensionPoints = 10 + character.ascensionCount * 5;

    await prisma.$transaction(async (tx) => {
      // Reset semua skill ke level 1
      for (const skill of character.skills) {
        await tx.characterSkill.update({
          where: { characterId_skillId: { characterId: character.id, skillId: skill.skillId } },
          data: { level: 1, experience: 0 },
        });
      }

      // Reset karakter ke base stats, tapi simpan inventory dan gold
      await tx.character.update({
        where: { id: character.id },
        data: {
          level: 1,
          experience: 0,
          hp: baseStats.hp,
          maxHp: baseStats.hp,
          mp: baseStats.mp,
          maxMp: baseStats.mp,
          str: baseStats.str,
          agi: baseStats.agi,
          int_stat: baseStats.int_stat,
          vit: baseStats.vit,
          attributePoints: 0,
          ascensionCount: { increment: 1 },
          ascensionPoints: { increment: ascensionPoints },
          isInCombat: false,
          currentAreaId: null,
          combatStartedAt: null,
          lastOnlineAt: new Date(),
        },
      });
    });

    return NextResponse.json({
      success: true,
      data: {
        ascensionCount: character.ascensionCount + 1,
        pointsGained: ascensionPoints,
      },
    });
  } catch (error) {
    console.error("Ascension POST error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}