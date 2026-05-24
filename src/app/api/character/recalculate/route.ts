import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CHARACTER_CLASSES } from "@/data/characters";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { skills: true },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    // Get base stats from class definition
    const classDef = CHARACTER_CLASSES.find((c) => c.id === character.classId);
    if (!classDef) return NextResponse.json({ success: false, error: "Class not found" }, { status: 404 });

    const base = classDef.baseStats;

    // Get current skill levels
    const meleeLevel = character.skills.find((s) => s.skillId === "melee")?.level ?? 1;
    const defenseLevel = character.skills.find((s) => s.skillId === "defense")?.level ?? 1;
    const rangedLevel = character.skills.find((s) => s.skillId === "ranged")?.level ?? 1;
    const magicLevel = character.skills.find((s) => s.skillId === "magic")?.level ?? 1;

    // Recalculate stats from scratch
    // Melee: +2 STR, +1 maxHp per level above 1
    const meleeBonus = meleeLevel - 1;
    // Defense: +1 VIT, +2 maxHp per level above 1
    const defenseBonus = defenseLevel - 1;
    // Ranged: +2 AGI per level above 1
    const rangedBonus = rangedLevel - 1;
    // Magic: +2 INT, +1 maxMp per level above 1
    const magicBonus = magicLevel - 1;

    // Also add any manually spent attribute points
    // We need to track this separately — for now recalc from skills only
    // and add attributePoints spent back (we don't track spent points per stat yet)
    // So we recalc skill-based stats + keep manual attribute point gains

    const newStr = base.str + (meleeBonus * 2);
    const newAgi = base.agi + (rangedBonus * 2);
    const newInt = base.int_stat + (magicBonus * 2);
    const newVit = base.vit + (defenseBonus * 1);
    const newMaxHp = base.hp + (meleeBonus * 1) + (defenseBonus * 2);
    const newMaxMp = base.mp + (magicBonus * 1);

    await prisma.character.update({
      where: { id: character.id },
      data: {
        str: newStr,
        agi: newAgi,
        int_stat: newInt,
        vit: newVit,
        maxHp: newMaxHp,
        maxMp: newMaxMp,
        // Make sure HP/MP don't exceed new max
        hp: Math.min(character.hp, newMaxHp),
        mp: Math.min(character.mp, newMaxMp),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        before: { str: character.str, agi: character.agi, int_stat: character.int_stat, vit: character.vit },
        after: { str: newStr, agi: newAgi, int_stat: newInt, vit: newVit, maxHp: newMaxHp, maxMp: newMaxMp },
      },
    });
  } catch (error) {
    console.error("Recalculate error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}