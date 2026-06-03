import { MonsterDefinition } from "@/types";

export const ZONE10_MONSTERS: MonsterDefinition[] = [
  {
    id: "duality_construct", name: "Duality Construct", zoneId: "zone10",
    hp: 35000, minDamage: 4000, maxDamage: 5600, expReward: 30000, goldMin: 3950, goldMax: 6020,
    alignment: "neutral", isBoss: false,
    lootTable: [
      { itemId: "void_crystal", dropChance: 0.8, minQuantity: 5, maxQuantity: 10 },
      { itemId: "cosmic_fragment", dropChance: 0.7, minQuantity: 4, maxQuantity: 8 },
    ],
  },
  {
    id: "primordial_shade", name: "Primordial Shade", zoneId: "zone10",
    hp: 38000, minDamage: 4350, maxDamage: 6080, expReward: 32500, goldMin: 4300, goldMax: 6540,
    alignment: "neutral", isBoss: false,
    lootTable: [
      { itemId: "ethereal_ore", dropChance: 0.5, minQuantity: 3, maxQuantity: 6 },
      { itemId: "divine_remnant", dropChance: 0.8, minQuantity: 6, maxQuantity: 12 },
    ],
  },
  {
    id: "world_root_guardian", name: "World Root Guardian", zoneId: "zone10",
    hp: 42000, minDamage: 4800, maxDamage: 6700, expReward: 36000, goldMin: 4750, goldMax: 7220,
    alignment: "neutral", isBoss: false,
    lootTable: [
      { itemId: "cosmic_fragment", dropChance: 0.8, minQuantity: 5, maxQuantity: 10 },
      { itemId: "astral_dust", dropChance: 0.9, minQuantity: 8, maxQuantity: 15 },
    ],
  },
  {
    id: "cosmic_parasite", name: "Cosmic Parasite", zoneId: "zone10",
    hp: 46000, minDamage: 5260, maxDamage: 7340, expReward: 39500, goldMin: 5210, goldMax: 7920,
    alignment: "neutral", isBoss: false,
    lootTable: [
      { itemId: "void_crystal", dropChance: 0.9, minQuantity: 6, maxQuantity: 12 },
      { itemId: "ethereal_ore", dropChance: 0.6, minQuantity: 3, maxQuantity: 7 },
    ],
  },
  {
    id: "between_horror", name: "Between Horror", zoneId: "zone10",
    hp: 50000, minDamage: 5720, maxDamage: 7980, expReward: 43000, goldMin: 5670, goldMax: 8620,
    alignment: "neutral", isBoss: false,
    lootTable: [
      { itemId: "divine_remnant", dropChance: 0.9, minQuantity: 7, maxQuantity: 14 },
      { itemId: "cosmic_fragment", dropChance: 0.8, minQuantity: 5, maxQuantity: 10 },
    ],
  },
  {
    id: "reality_eater", name: "Reality Eater", zoneId: "zone10",
    hp: 55000, minDamage: 6300, maxDamage: 8800, expReward: 47500, goldMin: 6250, goldMax: 9510,
    alignment: "neutral", isBoss: false,
    lootTable: [
      { itemId: "void_crystal", dropChance: 0.9, minQuantity: 8, maxQuantity: 15 },
      { itemId: "ethereal_ore", dropChance: 0.7, minQuantity: 4, maxQuantity: 8 },
      { itemId: "cosmic_fragment", dropChance: 0.8, minQuantity: 6, maxQuantity: 12 },
    ],
  },
  {
    id: "the_unnamed", name: "The Unnamed", zoneId: "zone10",
    hp: 60000, minDamage: 6900, maxDamage: 9640, expReward: 52000, goldMin: 6850, goldMax: 10420,
    alignment: "neutral", isBoss: false,
    lootTable: [
      { itemId: "divine_remnant", dropChance: 0.95, minQuantity: 8, maxQuantity: 16 },
      { itemId: "cosmic_fragment", dropChance: 0.9, minQuantity: 6, maxQuantity: 12 },
      { itemId: "ethereal_ore", dropChance: 0.8, minQuantity: 5, maxQuantity: 10 },
    ],
  },
  {
    id: "primordial_construct", name: "Primordial Construct", zoneId: "zone10",
    hp: 68000, minDamage: 7800, maxDamage: 10900, expReward: 58000, goldMin: 7750, goldMax: 11800,
    alignment: "neutral", isBoss: false,
    lootTable: [
      { itemId: "void_crystal", dropChance: 1.0, minQuantity: 10, maxQuantity: 20 },
      { itemId: "divine_remnant", dropChance: 0.95, minQuantity: 8, maxQuantity: 16 },
      { itemId: "cosmic_fragment", dropChance: 0.9, minQuantity: 6, maxQuantity: 12 },
      { itemId: "ethereal_ore", dropChance: 0.8, minQuantity: 5, maxQuantity: 10 },
    ],
  },
];