import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const STREAK_REWARDS: Record<number, { gold: number; soulShard: number; label: string }> = {
  1:  { gold: 100,  soulShard: 0,  label: "Hari pertama!" },
  2:  { gold: 150,  soulShard: 0,  label: "2 hari berturut-turut" },
  3:  { gold: 200,  soulShard: 1,  label: "3 hari streak" },
  5:  { gold: 350,  soulShard: 2,  label: "5 hari streak! 🔥" },
  7:  { gold: 500,  soulShard: 5,  label: "7 hari penuh! ⭐" },
  14: { gold: 1000, soulShard: 10, label: "2 minggu! 🌟" },
  30: { gold: 3000, soulShard: 25, label: "1 bulan! 👑" },
};

function getStreakReward(streak: number) {
  const keys = Object.keys(STREAK_REWARDS).map(Number).sort((a, b) => b - a);
  for (const key of keys) {
    if (streak % key === 0 || streak === key) {
      return STREAK_REWARDS[key];
    }
  }
  return { gold: 50, soulShard: 0, label: `${streak} hari streak` };
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const lastLoginStr = character.lastLoginDate?.toISOString().split("T")[0];

    // Already claimed today
    if (lastLoginStr === todayStr) {
      return NextResponse.json({
        success: true,
        data: {
          alreadyClaimed: true,
          streak: character.loginStreak,
          longestStreak: character.longestStreak,
        },
      });
    }

    // Calculate new streak
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const isConsecutive = lastLoginStr === yesterdayStr;
    const newStreak = isConsecutive ? character.loginStreak + 1 : 1;
    const newLongest = Math.max(character.longestStreak, newStreak);

    const reward = getStreakReward(newStreak);

    await prisma.character.update({
      where: { id: character.id },
      data: {
        loginStreak: newStreak,
        longestStreak: newLongest,
        lastLoginDate: now,
        gold: { increment: reward.gold },
        soulShard: { increment: reward.soulShard },
        lastOnlineAt: now,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        alreadyClaimed: false,
        streak: newStreak,
        longestStreak: newLongest,
        streakBroken: !isConsecutive && character.loginStreak > 1,
        previousStreak: character.loginStreak,
        reward,
      },
    });
  } catch (error) {
    console.error("Login streak error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const lastLoginStr = character.lastLoginDate?.toISOString().split("T")[0];
    const claimedToday = lastLoginStr === todayStr;

    const nextMilestones = [3, 5, 7, 14, 30].filter((m) => m > character.loginStreak);
    const nextMilestone = nextMilestones[0] ?? null;

    return NextResponse.json({
      success: true,
      data: {
        streak: character.loginStreak,
        longestStreak: character.longestStreak,
        claimedToday,
        nextMilestone,
        nextMilestoneReward: nextMilestone ? STREAK_REWARDS[nextMilestone] : null,
      },
    });
  } catch (error) {
    console.error("Login streak GET error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}