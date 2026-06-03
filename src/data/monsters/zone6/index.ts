import { MonsterDefinition } from "@/types";

export const ZONE6_MONSTERS: MonsterDefinition[] = [
  {
    id: "steppe_lion_elder", name: "Steppe Lion Elder", zoneId: "zone6",
    hp: 3600, minDamage: 420, maxDamage: 585, expReward: 2900, goldMin: 410, goldMax: 635,
    alignment: "mesopotamia", isBoss: false,
    lootTable: [
      { itemId: "lion_pelt", dropChance: 0.6, minQuantity: 2, maxQuantity: 4 },
      { itemId: "lion_claw", dropChance: 0.5, minQuantity: 2, maxQuantity: 4 },
      { itemId: "lapis_lazuli", dropChance: 0.1, minQuantity: 1, maxQuantity: 1 },
    ],
  },
  {
    id: "dust_djinn", name: "Dust Djinn", zoneId: "zone6",
    hp: 3400, minDamage: 400, maxDamage: 560, expReward: 2750, goldMin: 390, goldMax: 605,
    alignment: "mesopotamia", isBoss: false,
    lootTable: [
      { itemId: "void_crystal", dropChance: 0.25, minQuantity: 1, maxQuantity: 2 },
      { itemId: "astral_dust", dropChance: 0.4, minQuantity: 2, maxQuantity: 4 },
    ],
  },
  {
    id: "rogue_soldier", name: "Rogue Soldier", zoneId: "zone6",
    hp: 3800, minDamage: 445, maxDamage: 620, expReward: 3050, goldMin: 435, goldMax: 670,
    alignment: "mesopotamia", isBoss: false,
    lootTable: [
      { itemId: "copper_ore", dropChance: 0.5, minQuantity: 2, maxQuantity: 4 },
      { itemId: "iron_ore", dropChance: 0.3, minQuantity: 1, maxQuantity: 3 },
    ],
  },
  {
    id: "ur_guardian", name: "Ur Guardian", zoneId: "zone6",
    hp: 4100, minDamage: 475, maxDamage: 665, expReward: 3300, goldMin: 465, goldMax: 715,
    alignment: "mesopotamia", isBoss: false,
    lootTable: [
      { itemId: "guardian_stone", dropChance: 0.4, minQuantity: 2, maxQuantity: 3 },
      { itemId: "ancient_coin", dropChance: 0.2, minQuantity: 2, maxQuantity: 4 },
    ],
  },
  {
    id: "ziggurat_shade", name: "Ziggurat Shade", zoneId: "zone6",
    hp: 4400, minDamage: 510, maxDamage: 710, expReward: 3550, goldMin: 495, goldMax: 765,
    alignment: "mesopotamia", isBoss: false,
    lootTable: [
      { itemId: "shadow_essence", dropChance: 0.5, minQuantity: 2, maxQuantity: 4 },
      { itemId: "star_chart_fragment", dropChance: 0.15, minQuantity: 1, maxQuantity: 1 },
    ],
  },
  {
    id: "copper_golem", name: "Copper Golem", zoneId: "zone6",
    hp: 4800, minDamage: 545, maxDamage: 760, expReward: 3850, goldMin: 530, goldMax: 820,
    alignment: "mesopotamia", isBoss: false,
    lootTable: [
      { itemId: "copper_ore", dropChance: 0.7, minQuantity: 3, maxQuantity: 6 },
      { itemId: "electrum_ore", dropChance: 0.12, minQuantity: 1, maxQuantity: 2 },
    ],
  },
  {
    id: "bull_cultist", name: "Bull of Heaven Cultist", zoneId: "zone6",
    hp: 5200, minDamage: 590, maxDamage: 820, expReward: 4200, goldMin: 575, goldMax: 885,
    alignment: "mesopotamia", isBoss: false,
    lootTable: [
      { itemId: "divine_remnant", dropChance: 0.2, minQuantity: 1, maxQuantity: 2 },
      { itemId: "offering_token", dropChance: 0.35, minQuantity: 2, maxQuantity: 4 },
    ],
  },
  {
    id: "heaven_fragment", name: "Heaven Fragment", zoneId: "zone6",
    hp: 5600, minDamage: 635, maxDamage: 885, expReward: 4550, goldMin: 620, goldMax: 955,
    alignment: "mesopotamia", isBoss: false,
    lootTable: [
      { itemId: "astral_dust", dropChance: 0.6, minQuantity: 3, maxQuantity: 6 },
      { itemId: "void_crystal", dropChance: 0.2, minQuantity: 1, maxQuantity: 2 },
      { itemId: "divine_remnant", dropChance: 0.1, minQuantity: 1, maxQuantity: 1 },
    ],
  },
];