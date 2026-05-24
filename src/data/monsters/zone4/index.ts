import { MonsterDefinition } from "@/types";

export const ZONE4_MONSTERS: MonsterDefinition[] = [
  {
    id: "corrupted_priest", name: "Corrupted Priest", zoneId: "zone4",
    hp: 1200, minDamage: 162, maxDamage: 225, expReward: 980, goldMin: 150, goldMax: 230,
    alignment: "egypt", isBoss: false,
    lootTable: [
      { itemId: "sacred_oil", dropChance: 0.4, minQuantity: 1, maxQuantity: 2 },
      { itemId: "gold_ore", dropChance: 0.2, minQuantity: 1, maxQuantity: 2 },
    ],
  },
  {
    id: "stone_guardian", name: "Stone Guardian", zoneId: "zone4",
    hp: 1400, minDamage: 175, maxDamage: 245, expReward: 1100, goldMin: 165, goldMax: 255,
    alignment: "egypt", isBoss: false,
    lootTable: [
      { itemId: "guardian_stone", dropChance: 0.5, minQuantity: 2, maxQuantity: 4 },
      { itemId: "turquoise", dropChance: 0.2, minQuantity: 1, maxQuantity: 2 },
    ],
  },
  {
    id: "curse_scarab", name: "Curse Scarab", zoneId: "zone4",
    hp: 1150, minDamage: 158, maxDamage: 220, expReward: 950, goldMin: 145, goldMax: 225,
    alignment: "egypt", isBoss: false,
    lootTable: [
      { itemId: "scarab_shell", dropChance: 0.6, minQuantity: 2, maxQuantity: 4 },
      { itemId: "cursed_ink", dropChance: 0.25, minQuantity: 1, maxQuantity: 2 },
    ],
  },
  {
    id: "dark_acolyte", name: "Dark Acolyte", zoneId: "zone4",
    hp: 1300, minDamage: 172, maxDamage: 240, expReward: 1060, goldMin: 160, goldMax: 248,
    alignment: "egypt", isBoss: false,
    lootTable: [
      { itemId: "shadow_essence", dropChance: 0.35, minQuantity: 1, maxQuantity: 2 },
      { itemId: "sacred_oil", dropChance: 0.3, minQuantity: 1, maxQuantity: 2 },
    ],
  },
  {
    id: "set_cultist", name: "Set Cultist", zoneId: "zone4",
    hp: 1500, minDamage: 192, maxDamage: 268, expReward: 1200, goldMin: 180, goldMax: 278,
    alignment: "egypt", isBoss: false,
    lootTable: [
      { itemId: "set_talisman", dropChance: 0.25, minQuantity: 1, maxQuantity: 1 },
      { itemId: "shadow_essence", dropChance: 0.4, minQuantity: 1, maxQuantity: 3 },
      { itemId: "gold_ore", dropChance: 0.15, minQuantity: 1, maxQuantity: 2 },
    ],
  },
  {
    id: "shadow_sentinel", name: "Shadow Sentinel", zoneId: "zone4",
    hp: 1650, minDamage: 208, maxDamage: 290, expReward: 1320, goldMin: 195, goldMax: 302,
    alignment: "egypt", isBoss: false,
    lootTable: [
      { itemId: "shadow_essence", dropChance: 0.5, minQuantity: 2, maxQuantity: 4 },
      { itemId: "electrum_ore", dropChance: 0.12, minQuantity: 1, maxQuantity: 1 },
    ],
  },
  {
    id: "set_champion_guard", name: "Set Champion Guard", zoneId: "zone4",
    hp: 1800, minDamage: 225, maxDamage: 315, expReward: 1450, goldMin: 215, goldMax: 330,
    alignment: "egypt", isBoss: false,
    lootTable: [
      { itemId: "set_talisman", dropChance: 0.35, minQuantity: 1, maxQuantity: 2 },
      { itemId: "electrum_ore", dropChance: 0.15, minQuantity: 1, maxQuantity: 2 },
      { itemId: "sacred_oil", dropChance: 0.3, minQuantity: 1, maxQuantity: 2 },
    ],
  },
  {
    id: "chaos_elemental", name: "Chaos Elemental", zoneId: "zone4",
    hp: 2000, minDamage: 248, maxDamage: 345, expReward: 1620, goldMin: 240, goldMax: 368,
    alignment: "egypt", isBoss: false,
    lootTable: [
      { itemId: "chaos_crystal", dropChance: 0.3, minQuantity: 1, maxQuantity: 2 },
      { itemId: "shadow_essence", dropChance: 0.5, minQuantity: 2, maxQuantity: 5 },
      { itemId: "electrum_ore", dropChance: 0.18, minQuantity: 1, maxQuantity: 2 },
    ],
  },
];