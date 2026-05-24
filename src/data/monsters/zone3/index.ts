import { MonsterDefinition } from "@/types";

export const ZONE3_MONSTERS: MonsterDefinition[] = [
  {
    id: "restless_mummy", name: "Restless Mummy", zoneId: "zone3",
    hp: 620, minDamage: 85, maxDamage: 118, expReward: 460, goldMin: 70, goldMax: 110,
    alignment: "egypt", isBoss: false,
    lootTable: [
      { itemId: "linen_wrap", dropChance: 0.6, minQuantity: 1, maxQuantity: 3 },
      { itemId: "natron_salt", dropChance: 0.4, minQuantity: 1, maxQuantity: 2 },
    ],
  },
  {
    id: "ka_spirit", name: "Ka Spirit", zoneId: "zone3",
    hp: 580, minDamage: 80, maxDamage: 110, expReward: 430, goldMin: 65, goldMax: 100,
    alignment: "egypt", isBoss: false,
    lootTable: [
      { itemId: "soul_essence", dropChance: 0.35, minQuantity: 1, maxQuantity: 2 },
      { itemId: "canopic_shard", dropChance: 0.2, minQuantity: 1, maxQuantity: 1 },
    ],
  },
  {
    id: "ushabti_golem", name: "Ushabti Golem", zoneId: "zone3",
    hp: 720, minDamage: 95, maxDamage: 135, expReward: 540, goldMin: 80, goldMax: 125,
    alignment: "egypt", isBoss: false,
    lootTable: [
      { itemId: "faience_shard", dropChance: 0.5, minQuantity: 1, maxQuantity: 3 },
      { itemId: "gold_ore", dropChance: 0.12, minQuantity: 1, maxQuantity: 2 },
    ],
  },
  {
    id: "tomb_guardian", name: "Tomb Guardian", zoneId: "zone3",
    hp: 800, minDamage: 105, maxDamage: 148, expReward: 600, goldMin: 90, goldMax: 140,
    alignment: "egypt", isBoss: false,
    lootTable: [
      { itemId: "guardian_stone", dropChance: 0.4, minQuantity: 1, maxQuantity: 2 },
      { itemId: "ancient_coin", dropChance: 0.25, minQuantity: 1, maxQuantity: 3 },
    ],
  },
  {
    id: "judgment_shade", name: "Judgment Shade", zoneId: "zone3",
    hp: 860, minDamage: 115, maxDamage: 160, expReward: 660, goldMin: 100, goldMax: 155,
    alignment: "egypt", isBoss: false,
    lootTable: [
      { itemId: "soul_essence", dropChance: 0.45, minQuantity: 1, maxQuantity: 3 },
      { itemId: "maat_feather", dropChance: 0.15, minQuantity: 1, maxQuantity: 1 },
    ],
  },
  {
    id: "cursed_priest", name: "Cursed Priest", zoneId: "zone3",
    hp: 900, minDamage: 120, maxDamage: 170, expReward: 700, goldMin: 110, goldMax: 170,
    alignment: "egypt", isBoss: false,
    lootTable: [
      { itemId: "cursed_ink", dropChance: 0.4, minQuantity: 1, maxQuantity: 2 },
      { itemId: "canopic_shard", dropChance: 0.3, minQuantity: 1, maxQuantity: 2 },
      { itemId: "gold_ore", dropChance: 0.1, minQuantity: 1, maxQuantity: 1 },
    ],
  },
  {
    id: "soul_eater", name: "Soul Eater", zoneId: "zone3",
    hp: 980, minDamage: 132, maxDamage: 185, expReward: 780, goldMin: 120, goldMax: 185,
    alignment: "egypt", isBoss: false,
    lootTable: [
      { itemId: "soul_essence", dropChance: 0.6, minQuantity: 2, maxQuantity: 4 },
      { itemId: "maat_feather", dropChance: 0.2, minQuantity: 1, maxQuantity: 2 },
      { itemId: "turquoise", dropChance: 0.1, minQuantity: 1, maxQuantity: 1 },
    ],
  },
  {
    id: "ammit_spawn", name: "Ammit Spawn", zoneId: "zone3",
    hp: 1100, minDamage: 148, maxDamage: 205, expReward: 880, goldMin: 135, goldMax: 210,
    alignment: "egypt", isBoss: false,
    lootTable: [
      { itemId: "ammit_claw", dropChance: 0.4, minQuantity: 1, maxQuantity: 2 },
      { itemId: "soul_essence", dropChance: 0.5, minQuantity: 2, maxQuantity: 5 },
      { itemId: "turquoise", dropChance: 0.15, minQuantity: 1, maxQuantity: 2 },
    ],
  },
];