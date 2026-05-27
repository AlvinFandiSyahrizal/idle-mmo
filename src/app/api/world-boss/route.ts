import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WORLD_BOSSES, BOSS_MAP } from "@/data/bosses";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    // Get active world boss
    let boss = await prisma.worldBoss.findFirst({
      where: { status: "active" },
      include: {
        participants: {
          orderBy: { damage: "desc" },
          take: 10,
        },
      },
    });

    // Auto spawn if none active
    if (!boss) {
      const randomBoss = WORLD_BOSSES[Math.floor(Math.random() * WORLD_BOSSES.length)];
      const totalPlayers = await prisma.character.count();
      const totalHp = BigInt(randomBoss.baseHp + randomBoss.hpPerPlayer * Math.max(1, totalPlayers));
      const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6 jam

      boss = await prisma.worldBoss.create({
        data: {
          bossId: randomBoss.id,
          name: randomBoss.name,
          maxHp: totalHp,
          currentHp: totalHp,
          expiresAt,
        },
        include: { participants: true },
      });
    }

    const bossDef = BOSS_MAP[boss.bossId];
    const myParticipation = boss.participants.find((p) => p.characterId === character.id);
    const totalDamage = boss.participants.reduce((sum, p) => sum + p.damage, BigInt(0));
    const myDamagePct = totalDamage > 0 && myParticipation
      ? Number((myParticipation.damage * BigInt(10000)) / totalDamage) / 100
      : 0;

    // Enrich participants with character names
    const participantIds = boss.participants.map((p) => p.characterId);
    const chars = await prisma.character.findMany({
      where: { id: { in: participantIds } },
      select: { id: true, name: true, classId: true },
    });
    const charMap = Object.fromEntries(chars.map((c) => [c.id, c]));

    const enrichedParticipants = boss.participants.map((p) => ({
      characterId: p.characterId,
      characterName: charMap[p.characterId]?.name ?? "Unknown",
      damage: p.damage.toString(),
      hits: p.hits,
    }));

    const hpPct = Number((boss.currentHp * BigInt(10000)) / boss.maxHp) / 100;
    const timeLeft = Math.max(0, boss.expiresAt.getTime() - Date.now());

    return NextResponse.json({
      success: true,
      data: {
        boss: {
          id: boss.id,
          bossId: boss.bossId,
          name: boss.name,
          status: boss.status,
          currentHp: boss.currentHp.toString(),
          maxHp: boss.maxHp.toString(),
          hpPct,
          expiresAt: boss.expiresAt,
          timeLeft,
          spawnedAt: boss.spawnedAt,
        },
        bossDef: bossDef ? {
          emoji: bossDef.emoji,
          color: bossDef.color,
          title: bossDef.title,
          description: bossDef.description,
          alignment: bossDef.alignment,
          spawnMessage: bossDef.spawnMessage,
        } : null,
        myParticipation: myParticipation ? {
          damage: myParticipation.damage.toString(),
          hits: myParticipation.hits,
          damagePct: myDamagePct,
          rewarded: myParticipation.rewarded,
        } : null,
        participants: enrichedParticipants,
        totalParticipants: boss.participants.length,
      },
    });
  } catch (error) {
    console.error("World boss GET error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}