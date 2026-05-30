import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ACHIEVEMENTS } from "@/data/achievements";
import { checkAndGrantAchievements } from "@/systems/AchievementEngine";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { achievements: true },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    // Check for any newly unlocked achievements
    const newGrants = await checkAndGrantAchievements(character.id);

    const unlockedMap = new Set(character.achievements.map((a) => a.achievementId));
    // Also add newly granted
    newGrants.granted.forEach((a) => unlockedMap.add(a.id));

    const enriched = ACHIEVEMENTS.map((ach) => {
      const isUnlocked = unlockedMap.has(ach.id);
      return {
        ...ach,
        unlocked: isUnlocked,
        // Hide details for hidden achievements not yet unlocked
        title: ach.hidden && !isUnlocked ? "???" : ach.title,
        description: ach.hidden && !isUnlocked ? "Selesaikan sesuatu yang istimewa..." : ach.description,
      };
    });

    const total    = ACHIEVEMENTS.length;
    const unlocked = enriched.filter((a) => a.unlocked).length;

    return NextResponse.json({
      success: true,
      data: {
        achievements: enriched,
        total,
        unlocked,
        newlyGranted: newGrants.granted.map((a) => ({
          id: a.id,
          title: a.title,
          icon: a.icon,
          reward: a.reward,
        })),
      },
    });
  } catch (error) {
    console.error("Achievement error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}