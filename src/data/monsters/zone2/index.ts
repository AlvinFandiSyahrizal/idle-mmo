import { MonsterDefinition } from "@/types";

export const ZONE2_MONSTERS: MonsterDefinition[] = [
  {
    id: "sand_scarab", name: "Sand Scarab", zoneId: "zone2",
    hp: 280, minDamage: 35, maxDamage: 50, expReward: 180, goldMin: 28, goldMax: 45,
    alignment: "egypt", isBoss: false,
    lootTable: [
      { itemId: "scarab_shell", dropChance: 0.5, minQuantity: 1, maxQuantity: 2 },
      { itemId: "desert_sand", dropChance: 0.7, minQuantity: 2, maxQuantity: 5 },
    ],
  },
  {
    id: "desert_wanderer", name: "Desert Wanderer", zoneId: "zone2",
    hp: 260, minDamage: 30, maxDamage: 48, expReward: 160, goldMin: 25, goldMax: 40,
    alignment: "egypt", isBoss: false,
    lootTable: [
      { itemId: "torn_bandage", dropChance: 0.4, minQuantity: 1, maxQuantity: 2 },
      { itemId: "desert_sand", dropChance: 0.6, minQuantity: 1, maxQuantity: 3 },
    ],
  },
  {
    id: "desert_wraith", name: "Desert Wraith", zoneId: "zone2",
    hp: 320, minDamage: 45, maxDamage: 65, expReward: 220, goldMin: 35, goldMax: 55,
    alignment: "egypt", isBoss: false,
    lootTable: [
      { itemId: "wraith_essence", dropChance: 0.3, minQuantity: 1, maxQuantity: 1 },
      { itemId: "scorpion_venom", dropChance: 0.2, minQuantity: 1, maxQuantity: 2 },
    ],
  },
  {
    id: "cursed_palm", name: "Cursed Palm", zoneId: "zone2",
    hp: 380, minDamage: 50, maxDamage: 72, expReward: 260, goldMin: 40, goldMax: 65,
    alignment: "egypt", isBoss: false,
    lootTable: [
      { itemId: "cactus_herb", dropChance: 0.6, minQuantity: 1, maxQuantity: 3 },
      { itemId: "cursed_sap", dropChance: 0.2, minQuantity: 1, maxQuantity: 1 },
    ],
  },
  {
    id: "desiccated_warrior", name: "Desiccated Warrior", zoneId: "zone2",
    hp: 420, minDamage: 58, maxDamage: 80, expReward: 300, goldMin: 45, goldMax: 70,
    alignment: "egypt", isBoss: false,
    lootTable: [
      { itemId: "bone_fragment", dropChance: 0.5, minQuantity: 1, maxQuantity: 3 },
      { itemId: "ancient_coin", dropChance: 0.15, minQuantity: 1, maxQuantity: 2 },
    ],
  },
  {
    id: "apep_cultist", name: "Apep Cultist", zoneId: "zone2",
    hp: 500, minDamage: 68, maxDamage: 95, expReward: 360, goldMin: 55, goldMax: 85,
    alignment: "egypt", isBoss: false,
    lootTable: [
      { itemId: "void_scale", dropChance: 0.3, minQuantity: 1, maxQuantity: 2 },
      { itemId: "offering_token", dropChance: 0.2, minQuantity: 1, maxQuantity: 2 },
    ],
  },
  {
    id: "void_serpent", name: "Void Serpent", zoneId: "zone2",
    hp: 560, minDamage: 75, maxDamage: 105, expReward: 400, goldMin: 60, goldMax: 95,
    alignment: "egypt", isBoss: false,
    lootTable: [
      { itemId: "void_scale", dropChance: 0.5, minQuantity: 2, maxQuantity: 4 },
      { itemId: "serpent_fang", dropChance: 0.3, minQuantity: 1, maxQuantity: 2 },
      { itemId: "electrum_ore", dropChance: 0.08, minQuantity: 1, maxQuantity: 1 },
    ],
  },
];