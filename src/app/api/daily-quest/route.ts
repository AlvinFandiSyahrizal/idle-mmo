import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DAILY_QUESTS, WEEKLY_QUESTS } from "@/data/quests/daily_quests";

function getDailyReset(): Date {
  const now = new Date();
  const reset = new Date(now);
  reset.setUTCHours(0, 0, 0, 0);
  if (now >= reset) reset.setUTCDate(reset.getUTCDate() + 1);
  return reset;
}

function getWeeklyReset(): Date {
  const now = new Date();
  const day = now.getUTCDay();
  const daysUntilMonday = day === 0 ? 1 : 8 - day;
  const reset = new Date(now);
  reset.setUTCDate(reset.getUTCDate() + daysUntilMonday);
  reset.setUTCHours(0, 0, 0, 0);
  return reset;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { questProgress: true },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const now = new Date();
    const dailyReset = getDailyReset();
    const weeklyReset = getWeeklyReset();

    // Auto-init quest progress for all quests
    const allQuests = [...DAILY_QUESTS, ...WEEKLY_QUESTS];
    for (const quest of allQuests) {
      const existing = character.questProgress.find((q) => q.questId === quest.id);
      const resetAt = quest.type === "daily" ? dailyReset : weeklyReset;

      if (!existing) {
        await prisma.questProgress.create({
          data: {
            characterId: character.id,
            questId: quest.id,
            type: quest.type,
            progress: quest.id === "daily_login" ? 1 : 0,
            completed: quest.id === "daily_login",
            resetAt,
          },
        });
      } else if (existing.resetAt <= now) {
        // Reset expired quest
        await prisma.questProgress.update({
          where: { id: existing.id },
          data: {
            progress: quest.id === "daily_login" ? 1 : 0,
            completed: quest.id === "daily_login",
            claimedAt: null,
            resetAt,
          },
        });
      }
    }

    // Fetch fresh progress
    const freshChar = await prisma.character.findUnique({
      where: { id: character.id },
      include: { questProgress: true },
    });

    const enriched = allQuests.map((quest) => {
      const prog = freshChar?.questProgress.find((q) => q.questId === quest.id);
      const progress = prog?.progress ?? 0;
      const completed = prog?.completed ?? false;
      const claimed = !!prog?.claimedAt;
      const pct = Math.min(100, Math.round((progress / quest.objective.target) * 100));

      return {
        ...quest,
        progress,
        completed,
        claimed,
        pct,
        canClaim: completed && !claimed,
      };
    });

    return NextResponse.json({ success: true, data: enriched });
  } catch (error) {
    console.error("Quest GET error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}