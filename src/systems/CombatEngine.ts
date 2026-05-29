import { MonsterDefinition, CombatTick, LootDrop } from "@/types";
import { getItemById } from "@/data/items";

export type CombatStyle = "melee" | "ranged" | "magic";

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

interface SkillLevels {
  melee: number;
  ranged: number;
  magic: number;
  defense: number;
}

// Determine primary combat style based on class
export function getPrimaryCombatStyle(classId: string): CombatStyle {
  switch (classId) {
    case "medjay":   return "melee";
    case "siptu":    return "ranged";
    case "kher-heb": return "magic";
    case "ashipu":   return "magic";
    case "seba":     return "melee";
    default:         return "melee";
  }
}

// Which skills gain exp from combat per style
export function getSkillExpGain(
  expGained: number,
  style: CombatStyle
): Record<string, number> {
  switch (style) {
    case "melee":
      return {
        melee:   Math.floor(expGained * 0.6),
        defense: Math.floor(expGained * 0.2),
      };
    case "ranged":
      return {
        ranged:  Math.floor(expGained * 0.6),
        defense: Math.floor(expGained * 0.15),
      };
    case "magic":
      return {
        magic:   Math.floor(expGained * 0.6),
        defense: Math.floor(expGained * 0.1),
      };
  }
}

export function calculatePlayerDamage(
  char: CharacterStats,
  skills: SkillLevels,
  style: CombatStyle,
  equippedWeaponDamage: number = 0
): { damage: number; isCrit: boolean; styleUsed: CombatStyle } {
  let base = 0;
  let critChance = 0.05;

  switch (style) {
    case "melee":
      base = char.str * 1.8 + skills.melee * 1.2 + equippedWeaponDamage;
      critChance = 0.05 + char.agi * 0.001;
      break;
    case "ranged":
      base = char.agi * 2.0 + skills.ranged * 1.4 + equippedWeaponDamage;
      critChance = 0.08 + char.agi * 0.003; // Ranged has higher crit
      break;
    case "magic":
      base = char.int_stat * 2.2 + skills.magic * 1.5 + equippedWeaponDamage;
      critChance = 0.04 + char.int_stat * 0.002;
      break;
  }

  const isCrit    = Math.random() < critChance;
  const critMult  = isCrit ? 1.75 : 1;
  const variance  = 0.85 + Math.random() * 0.3;
  const damage    = Math.max(1, Math.floor(base * variance * critMult));

  return { damage, isCrit, styleUsed: style };
}

export function calculateMonsterDamage(
  monster: MonsterDefinition,
  defenseLevel: number,
  vit: number
): number {
  const defReduction = Math.min(0.65, defenseLevel * 0.008 + vit * 0.003);
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
  skills: SkillLevels,
  style: CombatStyle,
  equippedWeaponDamage: number = 0
): CombatTick & { isCrit: boolean; styleUsed: CombatStyle } {
  const { damage: playerDamage, isCrit, styleUsed } = calculatePlayerDamage(
    char, skills, style, equippedWeaponDamage
  );

  const monsterHpAfter = Math.max(0, currentMonsterHp - playerDamage);
  const monsterKilled  = monsterHpAfter <= 0;

  let monsterDamage = 0;
  let playerHpAfter = char.hp;
  let expGained     = 0;
  let goldGained    = 0;
  let loot: LootDrop[] = [];
  let logMessage    = "";

  if (!monsterKilled) {
    monsterDamage = calculateMonsterDamage(monster, skills.defense, char.vit);
    playerHpAfter = Math.max(0, char.hp - monsterDamage);
  } else {
    expGained  = monster.expReward;
    goldGained = monster.goldMin + Math.floor(Math.random() * (monster.goldMax - monster.goldMin + 1));
    loot       = rollLoot(monster);

    const critText = isCrit ? " ✨CRITICAL!" : "";
    logMessage = `Kamu mengalahkan ${monster.name}${critText} +${expGained} EXP, +${goldGained} Gold`;
    if (loot.length > 0) {
      logMessage += ` | Drop: ${loot.map((l) => `${l.itemName} x${l.quantity}`).join(", ")}`;
    }
  }

  const playerDied = playerHpAfter <= 0;

  if (!monsterKilled && !playerDied) {
    const styleIcon = styleUsed === "magic" ? "🔮" : styleUsed === "ranged" ? "🏹" : "⚔️";
    const critText  = isCrit ? " CRITICAL!" : "";
    logMessage = `${styleIcon}${critText} ${monster.name} (-${playerDamage} HP) | ${monster.name} balik (-${monsterDamage} HP)`;
  } else if (playerDied) {
    logMessage = `Kamu dikalahkan oleh ${monster.name}...`;
  }

  return {
    playerDamage, monsterDamage, playerHpAfter, monsterHpAfter,
    expGained, goldGained, loot, monsterKilled, playerDied, logMessage,
    isCrit, styleUsed,
  };
}