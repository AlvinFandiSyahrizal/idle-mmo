import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    // Check if already in a guild
    const membership = await prisma.guildMember.findFirst({
      where: { characterId: character.id },
      include: {
        guild: {
          include: {
            members: {
              include: {
                guild: false,
              },
            },
          },
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ success: true, data: { guild: null, membership: null } });
    }

    // Get all member characters
    const memberIds = membership.guild.members.map((m) => m.characterId);
    const memberChars = await prisma.character.findMany({
      where: { id: { in: memberIds } },
      include: {
        user: { select: { username: true } },
        skills: { where: { skillId: "melee" } },
      },
    });

    const enrichedMembers = membership.guild.members.map((m) => {
      const char = memberChars.find((c) => c.id === m.characterId);
      return {
        ...m,
        characterName: char?.name ?? "Unknown",
        username: char?.user?.username ?? "",
        level: char?.level ?? 1,
        meleeLevel: char?.skills[0]?.level ?? 1,
        isMe: char?.userId === session.user.id,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        guild: { ...membership.guild, members: enrichedMembers },
        membership: { role: membership.role, joinedAt: membership.joinedAt, contribution: membership.contribution },
      },
    });
  } catch (error) {
    console.error("Guild GET error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { action, guildName, description, guildId } = await req.json();

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    // Check if already in a guild
    const existingMembership = await prisma.guildMember.findFirst({
      where: { characterId: character.id },
    });

    if (action === "create") {
      if (existingMembership) {
        return NextResponse.json({ success: false, error: "Kamu sudah bergabung dengan guild" }, { status: 400 });
      }
      if (!guildName?.trim() || guildName.length < 3) {
        return NextResponse.json({ success: false, error: "Nama guild minimal 3 karakter" }, { status: 400 });
      }

      const existing = await prisma.guild.findUnique({ where: { name: guildName.trim() } });
      if (existing) {
        return NextResponse.json({ success: false, error: "Nama guild sudah dipakai" }, { status: 400 });
      }

      const guild = await prisma.$transaction(async (tx) => {
        const g = await tx.guild.create({
          data: {
            name: guildName.trim(),
            description: description?.trim() ?? "",
            leaderId: character.id,
          },
        });
        await tx.guildMember.create({
          data: { guildId: g.id, characterId: character.id, role: "leader" },
        });
        return g;
      });

      return NextResponse.json({ success: true, data: guild });
    }

    if (action === "join") {
      if (existingMembership) {
        return NextResponse.json({ success: false, error: "Kamu sudah bergabung dengan guild" }, { status: 400 });
      }
      if (!guildId) {
        return NextResponse.json({ success: false, error: "Guild ID diperlukan" }, { status: 400 });
      }

      const guild = await prisma.guild.findUnique({
        where: { id: guildId },
        include: { members: true },
      });
      if (!guild) return NextResponse.json({ success: false, error: "Guild tidak ditemukan" }, { status: 404 });
      if (guild.members.length >= 20) {
        return NextResponse.json({ success: false, error: "Guild sudah penuh (maks 20 member)" }, { status: 400 });
      }

      await prisma.guildMember.create({
        data: { guildId: guild.id, characterId: character.id, role: "member" },
      });

      return NextResponse.json({ success: true, data: { guildName: guild.name } });
    }

    if (action === "leave") {
      if (!existingMembership) {
        return NextResponse.json({ success: false, error: "Kamu tidak dalam guild" }, { status: 400 });
      }

      const guild = await prisma.guild.findUnique({
        where: { id: existingMembership.guildId },
        include: { members: true },
      });

      if (existingMembership.role === "leader") {
        if (guild && guild.members.length > 1) {
          return NextResponse.json({ success: false, error: "Transfer kepemimpinan dulu sebelum keluar" }, { status: 400 });
        }
        // Last member — delete guild
        await prisma.$transaction(async (tx) => {
          await tx.guildMember.deleteMany({ where: { guildId: existingMembership.guildId } });
          await tx.guild.delete({ where: { id: existingMembership.guildId } });
        });
      } else {
        await prisma.guildMember.delete({ where: { id: existingMembership.id } });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Action tidak valid" }, { status: 400 });
  } catch (error) {
    console.error("Guild POST error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}