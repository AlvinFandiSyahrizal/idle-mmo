import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CHARACTER_CLASSES } from "@/data/characters";

const RESET_COST = 5000; // Gold

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { skills: true },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    if (character.gold < RESET_COST) {
      return NextResponse.json({
        success: false,
        error: `Butuh ${RESET_COST.toLocaleString()} Gold untuk reset attribute points`,
      }, { status: 400 });
    }

    const classDef = CHARACTER_CLASSES.find((c) => c.id === character.classId);
    if (!classDef) return NextResponse.json({ success: false, error: "Class not found" }, { status: 404 });

    const base = classDef.baseStats;

    // Recalculate stats from skills only (same as recalculate endpoint)
    const meleeLevel   = character.skills.find((s) => s.skillId === "melee")?.level ?? 1;
    const defenseLevel = character.skills.find((s) => s.skillId === "defense")?.level ?? 1;
    const rangedLevel  = character.skills.find((s) => s.skillId === "ranged")?.level ?? 1;
    const magicLevel   = character.skills.find((s) => s.skillId === "magic")?.level ?? 1;

    const skillStr    = (meleeLevel - 1) * 2;
    const skillAgi    = (rangedLevel - 1) * 2;
    const skillInt    = (magicLevel - 1) * 2;
    const skillVit    = (defenseLevel - 1) * 1;
    const skillMaxHp  = (meleeLevel - 1) * 1 + (defenseLevel - 1) * 2;
    const skillMaxMp  = (magicLevel - 1) * 1;

    // Count how many attribute points were spent
    // Current stat - base stat - skill bonus = manually spent
    const spentStr = Math.max(0, character.str - base.str - skillStr);
    const spentAgi = Math.max(0, character.agi - base.agi - skillAgi);
    const spentInt = Math.max(0, character.int_stat - base.int_stat - skillInt);
    const spentVit = Math.max(0, character.vit - base.vit - skillVit);
    const totalSpent = spentStr + spentAgi + spentInt + spentVit;

    await prisma.character.update({
      where: { id: character.id },
      data: {
        gold: { decrement: RESET_COST },
        // Restore to skill-based stats
        str: base.str + skillStr,
        agi: base.agi + skillAgi,
        int_stat: base.int_stat + skillInt,
        vit: base.vit + skillVit,
        maxHp: base.hp + skillMaxHp,
        maxMp: base.mp + skillMaxMp,
        hp: Math.min(character.hp, base.hp + skillMaxHp),
        mp: Math.min(character.mp, base.mp + skillMaxMp),
        // Refund all spent points
        attributePoints: { increment: totalSpent },
      },
    });

    return NextResponse.json({
      success: true,
      data: { refunded: totalSpent, cost: RESET_COST },
    });
  } catch (error) {
    console.error("Reset points error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}