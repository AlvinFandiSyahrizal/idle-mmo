export interface CraftingRecipe {
  id: string;
  name: string;
  description: string;
  category: "weapon" | "armor" | "consumable" | "material";
  outputItemId: string;
  outputQuantity: number;
  outputTier: string;
  requiredSkill: string;
  requiredSkillLevel: number;
  ingredients: { itemId: string; quantity: number }[];
  craftTime: number; // detik
}

export const RECIPES: CraftingRecipe[] = [
  // ── CONSUMABLES (Alchemy) ──

  {
  id: "recipe_simple_bandage",
  name: "Simple Bandage",
  description: "Pembalut sederhana. Memulihkan 20 HP.",
  category: "consumable",
  outputItemId: "simple_bandage",
  outputQuantity: 3,
  outputTier: "common",
  requiredSkill: "alchemy",
  requiredSkillLevel: 1,
  ingredients: [
    { itemId: "linen_wrap", quantity: 2 },
  ],
  craftTime: 3,
  },
  {
    id: "recipe_basic_offering",
    name: "Basic Offering",
    description: "Persembahan sederhana untuk ritual dewa.",
    category: "consumable",
    outputItemId: "basic_offering",
    outputQuantity: 2,
    outputTier: "common",
    requiredSkill: "alchemy",
    requiredSkillLevel: 1,
    ingredients: [
      { itemId: "papyrus_reed", quantity: 3 },
      { itemId: "herb_lotus", quantity: 1 },
    ],
    craftTime: 4,
  },
  {
    id: "recipe_dried_fish",
    name: "Dried Fish",
    description: "Ikan kering yang memberi sedikit tenaga.",
    category: "consumable",
    outputItemId: "dried_fish",
    outputQuantity: 2,
    outputTier: "common",
    requiredSkill: "alchemy",
    requiredSkillLevel: 1,
    ingredients: [
      { itemId: "raw_fish", quantity: 3 },
    ],
    craftTime: 3,
  },
  {
    id: "recipe_clay_tablet",
    name: "Clay Tablet",
    description: "Tablet tanah liat untuk mencatat mantra.",
    category: "material",
    outputItemId: "clay_tablet",
    outputQuantity: 2,
    outputTier: "common",
    requiredSkill: "runecrafting",
    requiredSkillLevel: 1,
    ingredients: [
      { itemId: "silt_clay", quantity: 4 },
      { itemId: "papyrus_reed", quantity: 1 },
    ],
    craftTime: 5,
  },
  {
    id: "recipe_scale_pouch",
    name: "Scale Pouch",
    description: "Kantong kecil dari sisik buaya.",
    category: "material",
    outputItemId: "scale_pouch",
    outputQuantity: 1,
    outputTier: "common",
    requiredSkill: "smithing",
    requiredSkillLevel: 1,
    ingredients: [
      { itemId: "crocodile_scale", quantity: 5 },
    ],
    craftTime: 8,
  },
  {
    id: "recipe_health_potion_small",
    name: "Small Health Potion",
    description: "Potion penyembuhan dasar. Memulihkan 50 HP.",
    category: "consumable",
    outputItemId: "health_potion_small",
    outputQuantity: 1,
    outputTier: "common",
    requiredSkill: "alchemy",
    requiredSkillLevel: 1,
    ingredients: [
      { itemId: "herb_lotus", quantity: 2 },
      { itemId: "river_clay", quantity: 1 },
    ],
    craftTime: 5,
  },
  {
    id: "recipe_health_potion_medium",
    name: "Medium Health Potion",
    description: "Potion penyembuhan menengah. Memulihkan 150 HP.",
    category: "consumable",
    outputItemId: "health_potion_medium",
    outputQuantity: 1,
    outputTier: "uncommon",
    requiredSkill: "alchemy",
    requiredSkillLevel: 15,
    ingredients: [
      { itemId: "herb_lotus", quantity: 3 },
      { itemId: "cactus_herb", quantity: 2 },
      { itemId: "natron_salt", quantity: 1 },
    ],
    craftTime: 10,
  },
  {
    id: "recipe_antidote",
    name: "Antidote",
    description: "Menetralkan racun dari monster gurun.",
    category: "consumable",
    outputItemId: "antidote",
    outputQuantity: 2,
    outputTier: "common",
    requiredSkill: "alchemy",
    requiredSkillLevel: 5,
    ingredients: [
      { itemId: "scorpion_venom", quantity: 1 },
      { itemId: "herb_lotus", quantity: 1 },
      { itemId: "natron_salt", quantity: 1 },
    ],
    craftTime: 8,
  },
  {
    id: "recipe_strength_elixir",
    name: "Strength Elixir",
    description: "Meningkatkan STR +10 selama 5 menit.",
    category: "consumable",
    outputItemId: "strength_elixir",
    outputQuantity: 1,
    outputTier: "uncommon",
    requiredSkill: "alchemy",
    requiredSkillLevel: 20,
    ingredients: [
      { itemId: "lion_claw", quantity: 1 },
      { itemId: "cursed_sap", quantity: 1 },
      { itemId: "herb_lotus", quantity: 3 },
    ],
    craftTime: 15,
  },
  {
    id: "recipe_soul_tonic",
    name: "Soul Tonic",
    description: "Memulihkan 80 MP seketika.",
    category: "consumable",
    outputItemId: "soul_tonic",
    outputQuantity: 1,
    outputTier: "uncommon",
    requiredSkill: "alchemy",
    requiredSkillLevel: 10,
    ingredients: [
      { itemId: "soul_essence", quantity: 1 },
      { itemId: "herb_lotus", quantity: 2 },
    ],
    craftTime: 8,
  },

  // ── WEAPONS (Smithing) ──
  {
    id: "recipe_bronze_khopesh",
    name: "Bronze Khopesh",
    description: "Pedang melengkung khas Mesir terbuat dari perunggu.",
    category: "weapon",
    outputItemId: "bronze_khopesh",
    outputQuantity: 1,
    outputTier: "common",
    requiredSkill: "smithing",
    requiredSkillLevel: 5,
    ingredients: [
      { itemId: "bronze_ore", quantity: 5 },
      { itemId: "silt_clay", quantity: 2 },
    ],
    craftTime: 20,
  },
  {
    id: "recipe_iron_spear",
    name: "Iron Spear",
    description: "Tombak besi panjang untuk pertempuran jarak menengah.",
    category: "weapon",
    outputItemId: "iron_spear",
    outputQuantity: 1,
    outputTier: "common",
    requiredSkill: "smithing",
    requiredSkillLevel: 15,
    ingredients: [
      { itemId: "iron_ore", quantity: 4 },
      { itemId: "cedar_wood", quantity: 2 },
    ],
    craftTime: 25,
  },
  {
    id: "recipe_copper_bow",
    name: "Copper Bow",
    description: "Busur tembaga ringan dari padang Sumeria.",
    category: "weapon",
    outputItemId: "copper_bow",
    outputQuantity: 1,
    outputTier: "common",
    requiredSkill: "smithing",
    requiredSkillLevel: 10,
    ingredients: [
      { itemId: "copper_ore", quantity: 4 },
      { itemId: "cedar_wood", quantity: 3 },
    ],
    craftTime: 22,
  },
  {
    id: "recipe_electrum_blade",
    name: "Electrum Blade",
    description: "Pedang mewah dari elektrum, sangat tajam.",
    category: "weapon",
    outputItemId: "electrum_blade",
    outputQuantity: 1,
    outputTier: "rare",
    requiredSkill: "smithing",
    requiredSkillLevel: 40,
    ingredients: [
      { itemId: "electrum_ore", quantity: 5 },
      { itemId: "gold_ore", quantity: 2 },
      { itemId: "guardian_stone", quantity: 1 },
    ],
    craftTime: 60,
  },
  {
    id: "recipe_lapis_staff",
    name: "Lapis Staff",
    description: "Tongkat sihir dihiasi lapis lazuli Mesopotamia.",
    category: "weapon",
    outputItemId: "lapis_staff",
    outputQuantity: 1,
    outputTier: "rare",
    requiredSkill: "smithing",
    requiredSkillLevel: 35,
    ingredients: [
      { itemId: "lapis_lazuli", quantity: 3 },
      { itemId: "cedar_wood", quantity: 4 },
      { itemId: "soul_essence", quantity: 2 },
    ],
    craftTime: 55,
  },

  // ── ARMOR (Smithing) ──
  {
    id: "recipe_linen_robe",
    name: "Linen Robe",
    description: "Jubah linen ringan, perlindungan dasar.",
    category: "armor",
    outputItemId: "linen_robe",
    outputQuantity: 1,
    outputTier: "common",
    requiredSkill: "smithing",
    requiredSkillLevel: 1,
    ingredients: [
      { itemId: "linen_wrap", quantity: 5 },
      { itemId: "papyrus_reed", quantity: 3 },
    ],
    craftTime: 15,
  },
  {
    id: "recipe_hide_armor",
    name: "Hide Armor",
    description: "Baju zirah dari kulit binatang.",
    category: "armor",
    outputItemId: "hide_armor",
    outputQuantity: 1,
    outputTier: "common",
    requiredSkill: "smithing",
    requiredSkillLevel: 8,
    ingredients: [
      { itemId: "hardened_hide", quantity: 3 },
      { itemId: "lion_pelt", quantity: 2 },
    ],
    craftTime: 20,
  },
  {
    id: "recipe_bronze_chestplate",
    name: "Bronze Chestplate",
    description: "Baju besi perunggu yang kokoh.",
    category: "armor",
    outputItemId: "bronze_chestplate",
    outputQuantity: 1,
    outputTier: "uncommon",
    requiredSkill: "smithing",
    requiredSkillLevel: 20,
    ingredients: [
      { itemId: "bronze_ore", quantity: 8 },
      { itemId: "iron_ore", quantity: 3 },
      { itemId: "linen_wrap", quantity: 2 },
    ],
    craftTime: 35,
  },
  {
    id: "recipe_crocodile_shield",
    name: "Crocodile Scale Shield",
    description: "Perisai dari sisik buaya yang sangat keras.",
    category: "armor",
    outputItemId: "crocodile_shield",
    outputQuantity: 1,
    outputTier: "uncommon",
    requiredSkill: "smithing",
    requiredSkillLevel: 25,
    ingredients: [
      { itemId: "crocodile_scale", quantity: 10 },
      { itemId: "hardened_hide", quantity: 3 },
      { itemId: "bronze_ore", quantity: 4 },
    ],
    craftTime: 40,
  },

  // ── MATERIALS (Runecrafting) ──
  {
    id: "recipe_basic_rune",
    name: "Basic Combat Rune",
    description: "Rune dasar untuk meningkatkan kekuatan serangan.",
    category: "material",
    outputItemId: "basic_combat_rune",
    outputQuantity: 2,
    outputTier: "common",
    requiredSkill: "runecrafting",
    requiredSkillLevel: 1,
    ingredients: [
      { itemId: "faience_shard", quantity: 3 },
      { itemId: "cursed_ink", quantity: 1 },
    ],
    craftTime: 10,
  },
  {
    id: "recipe_offering_incense",
    name: "Offering Incense",
    description: "Dupa persembahan untuk ritual dewa.",
    category: "material",
    outputItemId: "offering_incense",
    outputQuantity: 3,
    outputTier: "common",
    requiredSkill: "alchemy",
    requiredSkillLevel: 3,
    ingredients: [
      { itemId: "cactus_herb", quantity: 2 },
      { itemId: "sacred_oil", quantity: 1 },
    ],
    craftTime: 6,
  },
];

export const RECIPE_MAP = Object.fromEntries(RECIPES.map((r) => [r.id, r]));

export function getRecipesBySkill(skillId: string): CraftingRecipe[] {
  return RECIPES.filter((r) => r.requiredSkill === skillId);
}

export function getRecipesByCategory(category: string): CraftingRecipe[] {
  return RECIPES.filter((r) => r.category === category);
}