import { MonsterDefinition } from "@/types";

export const ZONE7_MONSTERS: MonsterDefinition[] = [
  {
    id: "temple_shade", name: "Temple Shade", zoneId: "zone7",
    hp: 6000, minDamage: 680, maxDamage: 950, expReward: 4900, goldMin: 665, goldMax: 1025,
    alignment: "mesopotamia", isBoss: false,
    lootTable: [
      { itemId: "shadow_essence", dropChance: 0.6, minQuantity: 3, maxQuantity: 5 },
      { itemId: "star_chart_fragment", dropChance: 0.2, minQuantity: 1, maxQuantity: 2 },
    ],
  },
  {
    id: "gate_guardian", name: "Gate Guardian", zoneId: "zone7",
    hp: 6500, minDamage: 730, maxDamage: 1020, expReward: 5300, goldMin: 715, goldMax: 1100,
    alignment: "mesopotamia", isBoss: false,
    lootTable: [
      { itemId: "guardian_stone", dropChance: 0.5, minQuantity: 2, maxQuantity: 4 },
      { itemId: "silver_ingot", dropChance: 0.2, minQuantity: 1, maxQuantity: 2 },
    ],
  },
  {
    id: "anunnaki_remnant", name: "Anunnaki Remnant", zoneId: "zone7",
    hp: 7000, minDamage: 790, maxDamage: 1100, expReward: 5750, goldMin: 770, goldMax: 1185,
    alignment: "mesopotamia", isBoss: false,
    lootTable: [
      { itemId: "divine_remnant", dropChance: 0.35, minQuantity: 1, maxQuantity: 3 },
      { itemId: "astral_dust", dropChance: 0.5, minQuantity: 3, maxQuantity: 6 },
    ],
  },
  {
    id: "starfire_elemental", name: "Starfire Elemental", zoneId: "zone7",
    hp: 7500, minDamage: 845, maxDamage: 1180, expReward: 6200, goldMin: 825, goldMax: 1270,
    alignment: "mesopotamia", isBoss: false,
    lootTable: [
      { itemId: "void_crystal", dropChance: 0.35, minQuantity: 2, maxQuantity: 4 },
      { itemId: "cosmic_fragment", dropChance: 0.15, minQuantity: 1, maxQuantity: 1 },
    ],
  },
  {
    id: "death_shade", name: "Death Shade", zoneId: "zone7",
    hp: 8000, minDamage: 905, maxDamage: 1260, expReward: 6650, goldMin: 885, goldMax: 1360,
    alignment: "mesopotamia", isBoss: false,
    lootTable: [
      { itemId: "soul_essence", dropChance: 0.7, minQuantity: 3, maxQuantity: 6 },
      { itemId: "void_crystal", dropChance: 0.25, minQuantity: 1, maxQuantity: 3 },
    ],
  },
  {
    id: "underworld_spawn", name: "Underworld Spawn", zoneId: "zone7",
    hp: 8600, minDamage: 970, maxDamage: 1350, expReward: 7150, goldMin: 950, goldMax: 1460,
    alignment: "mesopotamia", isBoss: false,
    lootTable: [
      { itemId: "cosmic_fragment", dropChance: 0.25, minQuantity: 1, maxQuantity: 2 },
      { itemId: "divine_remnant", dropChance: 0.3, minQuantity: 1, maxQuantity: 3 },
    ],
  },
  {
    id: "kur_demon", name: "Kur Demon", zoneId: "zone7",
    hp: 9200, minDamage: 1040, maxDamage: 1450, expReward: 7700, goldMin: 1020, goldMax: 1570,
    alignment: "mesopotamia", isBoss: false,
    lootTable: [
      { itemId: "chaos_crystal", dropChance: 0.3, minQuantity: 1, maxQuantity: 3 },
      { itemId: "void_crystal", dropChance: 0.4, minQuantity: 2, maxQuantity: 5 },
    ],
  },
  {
    id: "nergal_champion", name: "Nergal's Champion", zoneId: "zone7",
    hp: 10000, minDamage: 1120, maxDamage: 1560, expReward: 8400, goldMin: 1100, goldMax: 1690,
    alignment: "mesopotamia", isBoss: false,
    lootTable: [
      { itemId: "divine_remnant", dropChance: 0.5, minQuantity: 2, maxQuantity: 4 },
      { itemId: "cosmic_fragment", dropChance: 0.25, minQuantity: 1, maxQuantity: 2 },
      { itemId: "astral_dust", dropChance: 0.6, minQuantity: 4, maxQuantity: 8 },
    ],
  },
];