import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PETS, PET_MAP, getPetExpForLevel, MAX_PET_LEVEL } from "@/data/pets";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { pets: true },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const ownedMap = Object.fromEntries(character.pets.map((p) => [p.petId, p]));

    const enriched = PETS.map((pet) => {
      const owned = ownedMap[pet.id];
      return {
        ...pet,
        owned: !!owned,
        level: owned?.level ?? 0,
        experience: owned?.experience ?? 0,
        isActive: owned?.isActive ?? false,
        totalFed: owned?.totalFed ?? 0,
        expToNext: owned ? getPetExpForLevel(owned.level) : null,
        expPct: owned ? Math.min(100, Math.round((owned.experience / getPetExpForLevel(owned.level)) * 100)) : 0,
      };
    });

    const activePet = character.pets.find((p) => p.isActive);
    const activePetDef = activePet ? PET_MAP[activePet.petId] : null;

    return NextResponse.json({
      success: true,
      data: {
        pets: enriched,
        activePet: activePet ? {
          ...activePet,
          def: activePetDef,
        } : null,
        totalOwned: character.pets.length,
      },
    });
  } catch (error) {
    console.error("Pets GET error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { action, petId } = await req.json();

    const character = await prisma.character.findUnique({
      where: { userId: session.user.id },
      include: { pets: true, inventory: true },
    });
    if (!character) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    if (action === "activate") {
      const petData = character.pets.find((p) => p.petId === petId);
      if (!petData) return NextResponse.json({ success: false, error: "Pet tidak dimiliki" }, { status: 404 });

      const petDef = PET_MAP[petId];
      if (!petDef) return NextResponse.json({ success: false, error: "Pet tidak valid" }, { status: 404 });

      await prisma.$transaction(async (tx) => {
        // Deactivate all pets
        await tx.characterPet.updateMany({
          where: { characterId: character.id },
          data: { isActive: false },
        });
        // Activate selected pet
        await tx.characterPet.update({
          where: { characterId_petId: { characterId: character.id, petId } },
          data: { isActive: true },
        });

        // Apply immediate stat bonuses
        if (petDef.bonus.type === "hp_boost") {
          await tx.character.update({
            where: { id: character.id },
            data: { maxHp: { increment: petDef.bonus.value * petData.level } },
          });
        }
      });

      return NextResponse.json({ success: true, data: { activated: petDef.name } });
    }

    if (action === "deactivate") {
      const petData = character.pets.find((p) => p.petId === petId && p.isActive);
      if (!petData) return NextResponse.json({ success: false, error: "Pet tidak aktif" }, { status: 400 });

      const petDef = PET_MAP[petId];

      await prisma.$transaction(async (tx) => {
        await tx.characterPet.update({
          where: { characterId_petId: { characterId: character.id, petId } },
          data: { isActive: false },
        });

        // Remove stat bonus
        if (petDef?.bonus.type === "hp_boost") {
          await tx.character.update({
            where: { id: character.id },
            data: { maxHp: { decrement: petDef.bonus.value * petData.level } },
          });
        }
      });

      return NextResponse.json({ success: true });
    }

    if (action === "feed") {
      const petData = character.pets.find((p) => p.petId === petId);
      if (!petData) return NextResponse.json({ success: false, error: "Pet tidak dimiliki" }, { status: 404 });

      const petDef = PET_MAP[petId];
      if (!petDef) return NextResponse.json({ success: false, error: "Pet tidak valid" }, { status: 404 });

      if (petData.level >= MAX_PET_LEVEL) {
        return NextResponse.json({ success: false, error: "Pet sudah level maksimal" }, { status: 400 });
      }

      // Check if player has the feed item
      const feedItem = character.inventory.find(
        (i) => i.itemId === petDef.feedItem && i.quantity >= petDef.feedCost
      );
      if (!feedItem) {
        return NextResponse.json({
          success: false,
          error: `Butuh ${petDef.feedCost}x ${petDef.feedItem} untuk feed pet ini`,
        }, { status: 400 });
      }

      const expGain     = 20 + petData.level * 10;
      let newExp        = petData.experience + expGain;
      let newLevel      = petData.level;
      let leveledUp     = false;

      while (newLevel < MAX_PET_LEVEL) {
        const needed = getPetExpForLevel(newLevel);
        if (newExp >= needed) { newExp -= needed; newLevel++; leveledUp = true; }
        else break;
      }

      await prisma.$transaction(async (tx) => {
        // Consume feed item
        if (feedItem.quantity === petDef.feedCost) {
          await tx.inventoryItem.delete({ where: { id: feedItem.id } });
        } else {
          await tx.inventoryItem.update({
            where: { id: feedItem.id },
            data: { quantity: { decrement: petDef.feedCost } },
          });
        }

        await tx.characterPet.update({
          where: { characterId_petId: { characterId: character.id, petId } },
          data: { experience: newExp, level: newLevel, totalFed: { increment: 1 } },
        });

        // If HP boost pet and active, update HP
        if (leveledUp && petDef.bonus.type === "hp_boost" && petData.isActive) {
          await tx.character.update({
            where: { id: character.id },
            data: { maxHp: { increment: petDef.bonus.value } },
          });
        }
      });

      return NextResponse.json({
        success: true,
        data: { expGained: expGain, newLevel, leveledUp },
      });
    }

    if (action === "unlock") {
      const existing = character.pets.find((p) => p.petId === petId);
      if (existing) {
        return NextResponse.json({ success: false, error: "Pet sudah dimiliki" }, { status: 400 });
      }

      await prisma.characterPet.create({
        data: { characterId: character.id, petId, level: 1 },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Action tidak valid" }, { status: 400 });
  } catch (error) {
    console.error("Pets POST error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}