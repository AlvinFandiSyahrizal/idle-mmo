import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { skills: true, inventory: true },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    // Calculate ascension bonuses from inventory perks
    const expBoost    = (character.inventory.find((i) => i.itemId === "ascension_perk_exp_boost")?.quantity ?? 0) * 5;
    const dropBoost   = (character.inventory.find((i) => i.itemId === "ascension_perk_drop_boost")?.quantity ?? 0) * 3;
    const goldBoost   = (character.inventory.find((i) => i.itemId === "ascension_perk_gold_boost")?.quantity ?? 0) * 5;
    const combatBoost = (character.inventory.find((i) => i.itemId === "ascension_perk_combat_boost")?.quantity ?? 0) * 5;

    const meleeLevel   = character.skills.find((s) => s.skillId === "melee")?.level ?? 1;
    const defenseLevel = character.skills.find((s) => s.skillId === "defense")?.level ?? 1;
    const rangedLevel  = character.skills.find((s) => s.skillId === "ranged")?.level ?? 1;
    const magicLevel   = character.skills.find((s) => s.skillId === "magic")?.level ?? 1;

    // Calculated combat stats
    const estimatedDamage = Math.floor(character.str * 1.8 + meleeLevel * 1.2);
    const critChance      = Math.min(50, Math.floor(5 + character.agi * 0.2));
    const defReduction    = Math.min(65, Math.floor(defenseLevel * 0.8 + character.vit * 0.3));

    return NextResponse.json({
      success: true,
      data: {
        base: {
          hp: character.hp, maxHp: character.maxHp,
          mp: character.mp, maxMp: character.maxMp,
          str: character.str, agi: character.agi,
          int_stat: character.int_stat, vit: character.vit,
        },
        combat: {
          estimatedDamage,
          critChance,
          defReduction,
          meleeLevel, defenseLevel, rangedLevel, magicLevel,
        },
        ascensionBonus: {
          expBoost, dropBoost, goldBoost, combatBoost,
        },
        currencies: {
          gold: character.gold,
          soulShard: character.soulShard,
          offering: character.offering,
          guildToken: character.guildToken,
        },
        meta: {
          level: character.level,
          ascensionCount: character.ascensionCount,
          loginStreak: character.loginStreak,
          longestStreak: character.longestStreak,
        },
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
