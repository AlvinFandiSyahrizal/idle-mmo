import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") ?? "";

    const guilds = await prisma.guild.findMany({
      where: query ? { name: { contains: query } } : {},
      include: { members: true },
      take: 20,
      orderBy: { level: "desc" },
    });

    const enriched = guilds.map((g) => ({
      id: g.id,
      name: g.name,
      description: g.description,
      level: g.level,
      memberCount: g.members.length,
      maxMembers: 20,
      createdAt: g.createdAt,
    }));

    return NextResponse.json({ success: true, data: enriched });
  } catch (error) {
    console.error("Guild search error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
