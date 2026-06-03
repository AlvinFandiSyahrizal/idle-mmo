import { MonsterDefinition } from "@/types";

export const ZONE9_MONSTERS: MonsterDefinition[] = [
  {
    id: "soul_ferry_guardian", name: "Soul Ferry Guardian", zoneId: "zone9",
    hp: 19500, minDamage: 2220, maxDamage: 3100, expReward: 16500, goldMin: 2180, goldMax: 3330,
    alignment: "neutral", isBoss: false,
    lootTable: [
      { itemId: "soul_essence", dropChance: 0.8, minQuantity: 5, maxQuantity: 10 },
      { itemId: "ethereal_ore", dropChance: 0.2, minQuantity: 1, maxQuantity: 2 },
    ],
  },
  {
    id: "death_current", name: "Death Current", zoneId: "zone9",
    hp: 20500, minDamage: 2340, maxDamage: 3260, expReward: 17300, goldMin: 2290, goldMax: 3510,
    alignment: "neutral", isBoss: false,
    lootTable: [
      { itemId: "cosmic_fragment", dropChance: 0.6, minQuantity: 3, maxQuantity: 7 },
      { itemId: "void_crystal", dropChance: 0.5, minQuantity: 3, maxQuantity: 6 },
    ],
  },
  {
    id: "judgment_shade_elder", name: "Judgment Shade Elder", zoneId: "zone9",
    hp: 22000, minDamage: 2510, maxDamage: 3500, expReward: 18500, goldMin: 2460, goldMax: 3760,
    alignment: "neutral", isBoss: false,
    lootTable: [
      { itemId: "maat_feather", dropChance: 0.15, minQuantity: 1, maxQuantity: 2 },
      { itemId: "soul_essence", dropChance: 0.8, minQuantity: 6, maxQuantity: 12 },
    ],
  },
  {
    id: "divine_exile", name: "Divine Exile", zoneId: "zone9",
    hp: 23500, minDamage: 2680, maxDamage: 3740, expReward: 19800, goldMin: 2630, goldMax: 4020,
    alignment: "neutral", isBoss: false,
    lootTable: [
      { itemId: "divine_remnant", dropChance: 0.6, minQuantity: 3, maxQuantity: 7 },
      { itemId: "ethereal_ore", dropChance: 0.25, minQuantity: 1, maxQuantity: 3 },
    ],
  },
  {
    id: "truth_guardian", name: "Truth Guardian", zoneId: "zone9",
    hp: 25000, minDamage: 2860, maxDamage: 3990, expReward: 21200, goldMin: 2810, goldMax: 4290,
    alignment: "neutral", isBoss: false,
    lootTable: [
      { itemId: "cosmic_fragment", dropChance: 0.7, minQuantity: 4, maxQuantity: 8 },
      { itemId: "maat_feather", dropChance: 0.1, minQuantity: 1, maxQuantity: 1 },
    ],
  },
  {
    id: "scale_keeper", name: "Scale Keeper", zoneId: "zone9",
    hp: 27000, minDamage: 3080, maxDamage: 4300, expReward: 22800, goldMin: 3030, goldMax: 4620,
    alignment: "neutral", isBoss: false,
    lootTable: [
      { itemId: "ethereal_ore", dropChance: 0.35, minQuantity: 2, maxQuantity: 4 },
      { itemId: "soul_essence", dropChance: 0.7, minQuantity: 5, maxQuantity: 10 },
    ],
  },
  {
    id: "fallen_divine", name: "Fallen Divine", zoneId: "zone9",
    hp: 29000, minDamage: 3310, maxDamage: 4620, expReward: 24600, goldMin: 3260, goldMax: 4960,
    alignment: "neutral", isBoss: false,
    lootTable: [
      { itemId: "divine_remnant", dropChance: 0.7, minQuantity: 4, maxQuantity: 8 },
      { itemId: "ethereal_ore", dropChance: 0.3, minQuantity: 2, maxQuantity: 4 },
      { itemId: "cosmic_fragment", dropChance: 0.5, minQuantity: 3, maxQuantity: 6 },
    ],
  },
  {
    id: "corrupted_osiris_fragment", name: "Corrupted Osiris Fragment", zoneId: "zone9",
    hp: 32000, minDamage: 3650, maxDamage: 5100, expReward: 27200, goldMin: 3600, goldMax: 5480,
    alignment: "neutral", isBoss: false,
    lootTable: [
      { itemId: "divine_remnant", dropChance: 0.8, minQuantity: 5, maxQuantity: 10 },
      { itemId: "cosmic_fragment", dropChance: 0.6, minQuantity: 4, maxQuantity: 8 },
      { itemId: "ethereal_ore", dropChance: 0.4, minQuantity: 2, maxQuantity: 5 },
    ],
  },
];
