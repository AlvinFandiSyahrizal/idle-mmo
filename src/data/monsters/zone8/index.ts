import { MonsterDefinition } from "@/types";

export const ZONE8_MONSTERS: MonsterDefinition[] = [
  {
    id: "reality_fracture", name: "Reality Fracture", zoneId: "zone8",
    hp: 11000, minDamage: 1250, maxDamage: 1750, expReward: 9200, goldMin: 1200, goldMax: 1850,
    alignment: "neutral", isBoss: false,
    lootTable: [
      { itemId: "void_crystal", dropChance: 0.5, minQuantity: 3, maxQuantity: 6 },
      { itemId: "astral_dust", dropChance: 0.6, minQuantity: 4, maxQuantity: 8 },
    ],
  },
  {
    id: "void_scarab", name: "Void Scarab", zoneId: "zone8",
    hp: 10500, minDamage: 1190, maxDamage: 1660, expReward: 8750, goldMin: 1150, goldMax: 1760,
    alignment: "neutral", isBoss: false,
    lootTable: [
      { itemId: "void_scale", dropChance: 0.6, minQuantity: 3, maxQuantity: 6 },
      { itemId: "void_crystal", dropChance: 0.35, minQuantity: 2, maxQuantity: 4 },
    ],
  },
  {
    id: "dimensional_rift", name: "Dimensional Rift", zoneId: "zone8",
    hp: 12000, minDamage: 1360, maxDamage: 1900, expReward: 10100, goldMin: 1310, goldMax: 2010,
    alignment: "neutral", isBoss: false,
    lootTable: [
      { itemId: "cosmic_fragment", dropChance: 0.4, minQuantity: 2, maxQuantity: 4 },
      { itemId: "divine_remnant", dropChance: 0.3, minQuantity: 1, maxQuantity: 3 },
    ],
  },
  {
    id: "lost_deity_fragment", name: "Lost Deity Fragment", zoneId: "zone8",
    hp: 13000, minDamage: 1480, maxDamage: 2060, expReward: 10950, goldMin: 1425, goldMax: 2185,
    alignment: "neutral", isBoss: false,
    lootTable: [
      { itemId: "divine_remnant", dropChance: 0.5, minQuantity: 2, maxQuantity: 5 },
      { itemId: "soul_essence", dropChance: 0.6, minQuantity: 4, maxQuantity: 8 },
    ],
  },
  {
    id: "frozen_time_guardian", name: "Frozen Time Guardian", zoneId: "zone8",
    hp: 14000, minDamage: 1590, maxDamage: 2220, expReward: 11800, goldMin: 1540, goldMax: 2360,
    alignment: "neutral", isBoss: false,
    lootTable: [
      { itemId: "cosmic_fragment", dropChance: 0.5, minQuantity: 2, maxQuantity: 5 },
      { itemId: "ancient_coin", dropChance: 0.4, minQuantity: 3, maxQuantity: 6 },
    ],
  },
  {
    id: "ancient_construct", name: "Ancient Construct", zoneId: "zone8",
    hp: 15000, minDamage: 1700, maxDamage: 2380, expReward: 12700, goldMin: 1660, goldMax: 2540,
    alignment: "neutral", isBoss: false,
    lootTable: [
      { itemId: "void_crystal", dropChance: 0.6, minQuantity: 3, maxQuantity: 7 },
      { itemId: "astral_dust", dropChance: 0.7, minQuantity: 5, maxQuantity: 10 },
    ],
  },
  {
    id: "cosmic_horror", name: "Cosmic Horror", zoneId: "zone8",
    hp: 16500, minDamage: 1880, maxDamage: 2620, expReward: 13900, goldMin: 1830, goldMax: 2810,
    alignment: "neutral", isBoss: false,
    lootTable: [
      { itemId: "cosmic_fragment", dropChance: 0.6, minQuantity: 3, maxQuantity: 6 },
      { itemId: "divine_remnant", dropChance: 0.4, minQuantity: 2, maxQuantity: 4 },
      { itemId: "void_crystal", dropChance: 0.5, minQuantity: 3, maxQuantity: 6 },
    ],
  },
  {
    id: "void_titan", name: "Void Titan", zoneId: "zone8",
    hp: 18000, minDamage: 2060, maxDamage: 2880, expReward: 15200, goldMin: 2010, goldMax: 3080,
    alignment: "neutral", isBoss: false,
    lootTable: [
      { itemId: "void_crystal", dropChance: 0.8, minQuantity: 4, maxQuantity: 8 },
      { itemId: "cosmic_fragment", dropChance: 0.5, minQuantity: 2, maxQuantity: 5 },
      { itemId: "astral_dust", dropChance: 0.7, minQuantity: 6, maxQuantity: 12 },
    ],
  },
];