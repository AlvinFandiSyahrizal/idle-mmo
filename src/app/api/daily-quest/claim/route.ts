import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DAILY_QUESTS, WEEKLY_QUESTS } from "@/data/quests/daily_quests";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { questId } = await req.json();
    const allQuests = [...DAILY_QUESTS, ...WEEKLY_QUESTS];
    const quest = allQuests.find((q) => q.id === questId);
    if (!quest) return NextResponse.json({ success: false, error: "Quest tidak ditemukan" }, { status: 404 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { questProgress: true },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const prog = character.questProgress.find((q) => q.questId === questId);
    if (!prog?.completed) return NextResponse.json({ success: false, error: "Quest belum selesai" }, { status: 400 });
    if (prog.claimedAt) return NextResponse.json({ success: false, error: "Reward sudah diambil" }, { status: 400 });

    await prisma.$transaction(async (tx) => {
      await tx.questProgress.update({
        where: { id: prog.id },
        data: { claimedAt: new Date() },
      });

      const updateData: any = {};
      if (quest.rewards.gold) updateData.gold = { increment: quest.rewards.gold };
      if (quest.rewards.soulShard) updateData.soulShard = { increment: quest.rewards.soulShard };

      if (Object.keys(updateData).length > 0) {
        await tx.character.update({
          where: { id: character.id },
          data: updateData,
        });
      }
    });

    return NextResponse.json({
      success: true,
      data: { rewards: quest.rewards, questTitle: quest.title },
    });
  } catch (error) {
    console.error("Quest claim error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}