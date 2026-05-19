import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CHARACTER_CLASSES } from "@/data/characters";
import { SKILLS } from "@/data/skills";
import { CharacterClass } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { characterName, classId } = await req.json();

    if (!characterName || !classId) {
      return NextResponse.json(
        { success: false, error: "Nama karakter dan kelas wajib dipilih" },
        { status: 400 }
      );
    }

    const classData = CHARACTER_CLASSES.find((c) => c.id === classId);
    if (!classData) {
      return NextResponse.json(
        { success: false, error: "Kelas tidak valid" },
        { status: 400 }
      );
    }

    // Check if user already has a character
    const existing = await prisma.character.findUnique({
      where: { userId: session.user.id },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Kamu sudah memiliki karakter" },
        { status: 400 }
      );
    }

    // Check character name unique
    const nameTaken = await prisma.character.findFirst({
      where: { name: characterName },
    });
    if (nameTaken) {
      return NextResponse.json(
        { success: false, error: "Nama karakter sudah digunakan" },
        { status: 400 }
      );
    }

    const stats = classData.baseStats;

    // Create character + all skills in one transaction
    const character = await prisma.$transaction(async (tx) => {
      const char = await tx.character.create({
        data: {
          userId: session.user.id,
          name: characterName,
          classId: classId as CharacterClass,
          hp: stats.hp,
          maxHp: stats.hp,
          mp: stats.mp,
          maxMp: stats.mp,
          str: stats.str,
          agi: stats.agi,
          int_stat: stats.int_stat,
          vit: stats.vit,
          alignment: classData.alignment === "egypt" ? -20 : classData.alignment === "mesopotamia" ? 20 : 0,
        },
      });

      // Init all skills at level 1
      await tx.characterSkill.createMany({
        data: SKILLS.map((skill) => ({
          characterId: char.id,
          skillId: skill.id,
          level: 1,
          experience: 0,
        })),
      });

      // Init equipment slot
      await tx.equipment.create({
        data: { characterId: char.id },
      });

      return char;
    });

    return NextResponse.json({ success: true, data: character });
  } catch (error) {
    console.error("Create character error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}