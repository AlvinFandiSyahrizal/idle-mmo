import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: {
        skills: true,
        equipment: true,
        inventory: { take: 50, orderBy: { createdAt: "desc" } },
      },
    });

    if (!character) {
      return NextResponse.json({ success: false, error: "Karakter tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: character });
  } catch (error) {
    console.error("Get character error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}