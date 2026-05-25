import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { amount } = await req.json();
    if (!amount || amount < 100) {
      return NextResponse.json({ success: false, error: "Minimal kontribusi 100 Gold" }, { status: 400 });
    }

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    if (character.gold < amount) {
      return NextResponse.json({ success: false, error: "Gold tidak cukup" }, { status: 400 });
    }

    const membership = await prisma.guildMember.findFirst({
      where: { characterId: character.id },
    });
    if (!membership) {
      return NextResponse.json({ success: false, error: "Kamu tidak dalam guild" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.character.update({
        where: { id: character.id },
        data: { gold: { decrement: amount } },
      });
      await tx.guildMember.update({
        where: { id: membership.id },
        data: { contribution: { increment: amount } },
      });
      // Guild exp from contribution
      const guildExp = Math.floor(amount / 10);
      const guild = await tx.guild.findUnique({ where: { id: membership.guildId } });
      if (guild) {
        const newExp = guild.experience + guildExp;
        const newLevel = Math.max(1, Math.floor(newExp / 1000) + 1);
        await tx.guild.update({
          where: { id: membership.guildId },
          data: { experience: newExp, level: newLevel },
        });
      }
    });

    return NextResponse.json({ success: true, data: { contributed: amount } });
  } catch (error) {
    console.error("Contribute error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}