import { MonsterDefinition, CombatTick, LootDrop } from "@/types";
import { getItemById } from "@/data/items";

interface CharacterStats {
  hp: number;
  maxHp: number;
  str: number;
  agi: number;
  int_stat: number;
  vit: number;
  classId: string;
  alignment: number;
}

export function calculatePlayerDamage(
  char: CharacterStats,
  meleeLevel: number,
  ascensionPerks?: { combatBoost: number }
): number {
  // Base damage dari STR dan melee level
  const strBonus   = char.str * 1.8;
  const levelBonus = meleeLevel * 1.2;
  const base       = strBonus + levelBonus;

  // Critical hit chance (5% base + AGI bonus)
  const critChance = 0.05 + char.agi * 0.002;
  const isCrit     = Math.random() < critChance;
  const critMult   = isCrit ? 1.5 : 1;

  // Variance ±15%
  const variance = 0.85 + Math.random() * 0.3;

  // Ascension perk bonus
  const ascBonus = 1 + (ascensionPerks?.combatBoost ?? 0) / 100;

  return Math.max(1, Math.floor(base * variance * critMult * ascBonus));
}

export function calculateMonsterDamage(
  monster: MonsterDefinition,
  defenseLevel: number,
  vit: number
): number {
  // Defense reduction: diminishing returns
  const defReduction = Math.min(0.65, (defenseLevel * 0.008) + (vit * 0.003));
  const raw = monster.minDamage + Math.random() * (monster.maxDamage - monster.minDamage);
  return Math.max(1, Math.floor(raw * (1 - defReduction)));
}

export function rollLoot(monster: MonsterDefinition): LootDrop[] {
  const drops: LootDrop[] = [];
  for (const entry of monster.lootTable) {
    if (Math.random() < entry.dropChance) {
      const qty = entry.minQuantity +
        Math.floor(Math.random() * (entry.maxQuantity - entry.minQuantity + 1));
      const item = getItemById(entry.itemId);
      drops.push({
        itemId: entry.itemId,
        quantity: qty,
        itemName: item?.name ?? entry.itemId,
      });
    }
  }
  return drops;
}

export function runCombatTick(
  char: CharacterStats,
  monster: MonsterDefinition,
  currentMonsterHp: number,
  meleeLevel: number,
  defenseLevel: number
): CombatTick {
  const playerDamage    = calculatePlayerDamage(char, meleeLevel);
  const monsterHpAfter  = Math.max(0, currentMonsterHp - playerDamage);
  const monsterKilled   = monsterHpAfter <= 0;

  let monsterDamage = 0;
  let playerHpAfter = char.hp;
  let expGained     = 0;
  let goldGained    = 0;
  let loot: LootDrop[] = [];
  let logMessage    = "";

  if (!monsterKilled) {
    monsterDamage = calculateMonsterDamage(monster, defenseLevel, char.vit);
    playerHpAfter = Math.max(0, char.hp - monsterDamage);
  } else {
    expGained  = monster.expReward;
    goldGained = monster.goldMin +
      Math.floor(Math.random() * (monster.goldMax - monster.goldMin + 1));
    loot       = rollLoot(monster);
    logMessage = `Kamu mengalahkan ${monster.name}! +${expGained} EXP, +${goldGained} Gold`;
    if (loot.length > 0) {
      logMessage += ` | Drop: ${loot.map((l) => `${l.itemName} x${l.quantity}`).join(", ")}`;
    }
  }

  const playerDied = playerHpAfter <= 0;

  if (!monsterKilled && !playerDied) {
    logMessage = `Kamu menyerang ${monster.name} (-${playerDamage} HP) | ${monster.name} menyerang balik (-${monsterDamage} HP)`;
  } else if (playerDied) {
    logMessage = `Kamu dikalahkan oleh ${monster.name}... Kembali ke area yang lebih aman.`;
  }

  return {
    playerDamage, monsterDamage, playerHpAfter, monsterHpAfter,
    expGained, goldGained, loot, monsterKilled, playerDied, logMessage,
  };
}

export function getSkillExpGain(expGained: number): Record<string, number> {
  return {
    melee:   Math.floor(expGained * 0.6),
    defense: Math.floor(expGained * 0.2),
  };
}