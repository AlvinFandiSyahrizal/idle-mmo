import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BOSS_MAP } from "@/data/bosses";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { skills: true },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const boss = await prisma.worldBoss.findFirst({
      where: { status: "active" },
    });
    if (!boss) return NextResponse.json({ success: false, error: "Tidak ada World Boss aktif" }, { status: 404 });
    if (boss.expiresAt < new Date()) {
      await prisma.worldBoss.update({
        where: { id: boss.id },
        data: { status: "expired" },
      });
      return NextResponse.json({ success: false, error: "World Boss sudah kedaluwarsa" }, { status: 400 });
    }

    const bossDef = BOSS_MAP[boss.bossId];
    if (!bossDef) return NextResponse.json({ success: false, error: "Boss data tidak ditemukan" }, { status: 404 });

    // Calculate player damage based on stats
    const meleeLevel = character.skills.find((s) => s.skillId === "melee")?.level ?? 1;
    const baseDamage = character.str * 2 + meleeLevel * 3;
    const variance = 0.85 + Math.random() * 0.3;
    const damage = Math.max(1, Math.floor(baseDamage * variance));
    const bigDamage = BigInt(damage);

    // Boss attacks back
    const bossMinDmg = bossDef.minDamage;
    const bossMaxDmg = bossDef.maxDamage;
    const bossDmgToPlayer = Math.floor(bossMinDmg + Math.random() * (bossMaxDmg - bossMinDmg));

    let bossDefeated = false;
    let newHp = boss.currentHp - bigDamage;
    if (newHp <= BigInt(0)) {
      newHp = BigInt(0);
      bossDefeated = true;
    }

    await prisma.$transaction(async (tx) => {
      // Update boss HP
      await tx.worldBoss.update({
        where: { id: boss.id },
        data: {
          currentHp: newHp,
          status: bossDefeated ? "defeated" : "active",
          defeatedAt: bossDefeated ? new Date() : undefined,
        },
      });

      // Update or create participant record
      const existing = await tx.worldBossParticipant.findUnique({
        where: { worldBossId_characterId: { worldBossId: boss.id, characterId: character.id } },
      });

      if (existing) {
        await tx.worldBossParticipant.update({
          where: { id: existing.id },
          data: {
            damage: { increment: bigDamage },
            hits: { increment: 1 },
          },
        });
      } else {
        await tx.worldBossParticipant.create({
          data: {
            worldBossId: boss.id,
            characterId: character.id,
            damage: bigDamage,
            hits: 1,
          },
        });
      }

      // Apply boss damage to player HP
      const newPlayerHp = Math.max(1, character.hp - bossDmgToPlayer);
      await tx.character.update({
        where: { id: character.id },
        data: { hp: newPlayerHp },
      });

      // If boss defeated, distribute rewards
      if (bossDefeated) {
        const allParticipants = await tx.worldBossParticipant.findMany({
          where: { worldBossId: boss.id, rewarded: false },
        });
        const totalDmg = allParticipants.reduce((sum, p) => sum + p.damage, BigInt(0));

        for (const participant of allParticipants) {
          const pct = totalDmg > 0
            ? Number((participant.damage * BigInt(10000)) / totalDmg) / 100
            : 0;

          const rewardTier = bossDef.rewards.tiers.find((t) => pct >= t.minPct)
            ?? bossDef.rewards.tiers[bossDef.rewards.tiers.length - 1];

          await tx.character.update({
            where: { id: participant.characterId },
            data: {
              gold: { increment: rewardTier.gold },
              soulShard: { increment: rewardTier.soulShard },
            },
          });

          if (rewardTier.itemId) {
            const existingItem = await tx.inventoryItem.findFirst({
              where: { characterId: participant.characterId, itemId: rewardTier.itemId },
            });
            if (existingItem) {
              await tx.inventoryItem.update({
                where: { id: existingItem.id },
                data: { quantity: { increment: 1 } },
              });
            } else {
              await tx.inventoryItem.create({
                data: { characterId: participant.characterId, itemId: rewardTier.itemId, quantity: 1 },
              });
            }
          }

          await tx.worldBossParticipant.update({
            where: { id: participant.id },
            data: { rewarded: true },
          });
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        damage,
        bossDmgToPlayer,
        bossDefeated,
        newBossHp: newHp.toString(),
        hpPct: Number((newHp * BigInt(10000)) / boss.maxHp) / 100,
      },
    });
  } catch (error) {
    console.error("World boss attack error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}