import { MonsterDefinition } from "@/types";

export const ZONE5_MONSTERS: MonsterDefinition[] = [
  {
    id: "mud_golem", name: "Mud Golem", zoneId: "zone5",
    hp: 2200, minDamage: 268, maxDamage: 375, expReward: 1780, goldMin: 260, goldMax: 400,
    alignment: "mesopotamia", isBoss: false,
    lootTable: [
      { itemId: "river_clay", dropChance: 0.7, minQuantity: 2, maxQuantity: 5 },
      { itemId: "bitumen", dropChance: 0.4, minQuantity: 1, maxQuantity: 3 },
    ],
  },
  {
    id: "river_demon", name: "River Demon", zoneId: "zone5",
    hp: 2100, minDamage: 258, maxDamage: 360, expReward: 1700, goldMin: 248, goldMax: 382,
    alignment: "mesopotamia", isBoss: false,
    lootTable: [
      { itemId: "demon_horn", dropChance: 0.3, minQuantity: 1, maxQuantity: 2 },
      { itemId: "river_clay", dropChance: 0.5, minQuantity: 1, maxQuantity: 3 },
    ],
  },
  {
    id: "marsh_stalker", name: "Marsh Stalker", zoneId: "zone5",
    hp: 2400, minDamage: 288, maxDamage: 402, expReward: 1950, goldMin: 282, goldMax: 435,
    alignment: "mesopotamia", isBoss: false,
    lootTable: [
      { itemId: "marsh_slime", dropChance: 0.6, minQuantity: 2, maxQuantity: 4 },
      { itemId: "demon_horn", dropChance: 0.2, minQuantity: 1, maxQuantity: 1 },
    ],
  },
  {
    id: "swamp_horror", name: "Swamp Horror", zoneId: "zone5",
    hp: 2600, minDamage: 308, maxDamage: 430, expReward: 2100, goldMin: 300, goldMax: 465,
    alignment: "mesopotamia", isBoss: false,
    lootTable: [
      { itemId: "horror_hide", dropChance: 0.35, minQuantity: 1, maxQuantity: 2 },
      { itemId: "bitumen", dropChance: 0.5, minQuantity: 2, maxQuantity: 4 },
    ],
  },
  {
    id: "forest_guardian", name: "Forest Guardian", zoneId: "zone5",
    hp: 2800, minDamage: 328, maxDamage: 458, expReward: 2280, goldMin: 320, goldMax: 495,
    alignment: "mesopotamia", isBoss: false,
    lootTable: [
      { itemId: "cedar_wood", dropChance: 0.5, minQuantity: 2, maxQuantity: 4 },
      { itemId: "lapis_lazuli", dropChance: 0.12, minQuantity: 1, maxQuantity: 1 },
    ],
  },
  {
    id: "ancient_treant", name: "Ancient Treant", zoneId: "zone5",
    hp: 3000, minDamage: 348, maxDamage: 486, expReward: 2450, goldMin: 340, goldMax: 525,
    alignment: "mesopotamia", isBoss: false,
    lootTable: [
      { itemId: "cedar_wood", dropChance: 0.7, minQuantity: 3, maxQuantity: 6 },
      { itemId: "ancient_bark", dropChance: 0.3, minQuantity: 1, maxQuantity: 2 },
      { itemId: "lapis_lazuli", dropChance: 0.15, minQuantity: 1, maxQuantity: 2 },
    ],
  },
  {
    id: "humbaba_servant", name: "Humbaba Servant", zoneId: "zone5",
    hp: 3300, minDamage: 378, maxDamage: 528, expReward: 2700, goldMin: 368, goldMax: 568,
    alignment: "mesopotamia", isBoss: false,
    lootTable: [
      { itemId: "humbaba_scale", dropChance: 0.4, minQuantity: 1, maxQuantity: 3 },
      { itemId: "cedar_wood", dropChance: 0.5, minQuantity: 2, maxQuantity: 5 },
      { itemId: "copper_ore", dropChance: 0.2, minQuantity: 1, maxQuantity: 2 },
    ],
  },
  {
    id: "wild_lion", name: "Wild Lion", zoneId: "zone5",
    hp: 3100, minDamage: 362, maxDamage: 505, expReward: 2560, goldMin: 352, goldMax: 542,
    alignment: "mesopotamia", isBoss: false,
    lootTable: [
      { itemId: "lion_pelt", dropChance: 0.45, minQuantity: 1, maxQuantity: 2 },
      { itemId: "lion_claw", dropChance: 0.35, minQuantity: 1, maxQuantity: 3 },
      { itemId: "copper_ore", dropChance: 0.15, minQuantity: 1, maxQuantity: 2 },
    ],
  },
];