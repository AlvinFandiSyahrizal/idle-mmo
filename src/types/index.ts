// Character classes
export type CharacterClass = "medjay" | "siptu" | "kher-heb" | "ashipu" | "seba";

// Alignment
export type AlignmentSide = "egypt" | "mesopotamia" | "neutral";

// Item tiers
export type ItemTier = "common" | "uncommon" | "rare" | "epic" | "legendary" | "divine";

// Skill IDs
export type SkillId =
  | "melee"
  | "ranged"
  | "magic"
  | "defense"
  | "excavation"
  | "inscription"
  | "herbalism"
  | "fishing"
  | "smithing"
  | "alchemy"
  | "runecrafting"
  | "enchanting"
  | "prayer"
  | "lore_skill";

// Skill categories
export type SkillCategory = "combat" | "gathering" | "production" | "support";

export interface SkillDefinition {
  id: SkillId;
  name: string;
  category: SkillCategory;
  description: string;
  icon: string;
  maxLevel: number;
}

// Character class definition
export interface ClassDefinition {
  id: CharacterClass;
  name: string;
  description: string;
  lore: string;
  alignment: AlignmentSide;
  primaryStat: string;
  passive: string;
  passiveDescription: string;
  baseStats: {
    hp: number;
    mp: number;
    str: number;
    agi: number;
    int_stat: number;
    vit: number;
  };
}

// Monster definition
export interface MonsterDefinition {
  id: string;
  name: string;
  zoneId: string;
  hp: number;
  minDamage: number;
  maxDamage: number;
  expReward: number;
  goldMin: number;
  goldMax: number;
  alignment: AlignmentSide;
  isBoss: boolean;
  lootTable: LootEntry[];
}

export interface LootEntry {
  itemId: string;
  dropChance: number;
  minQuantity: number;
  maxQuantity: number;
}

// Area definition
export interface AreaDefinition {
  id: string;
  zoneId: string;
  name: string;
  description: string;
  minCombatLevel: number;
  order: number;
  monsters: string[]; // monster IDs
}

// Zone definition
export interface ZoneDefinition {
  id: string;
  name: string;
  description: string;
  alignment: AlignmentSide;
  minLevel: number;
  order: number;
  areas: AreaDefinition[];
  bossId: string;
}

// Combat
export interface CombatTick {
  playerDamage: number;
  monsterDamage: number;
  playerHpAfter: number;
  monsterHpAfter: number;
  expGained: number;
  goldGained: number;
  loot: LootDrop[];
  monsterKilled: boolean;
  playerDied: boolean;
  logMessage: string;
}

export interface LootDrop {
  itemId: string;
  quantity: number;
  itemName: string;
}

// Item definition
export interface ItemDefinition {
  id: string;
  name: string;
  type: "weapon" | "helmet" | "chest" | "gloves" | "boots" | "accessory" | "material" | "consumable";
  tier: ItemTier;
  alignment?: AlignmentSide;
  description: string;
  stats?: {
    str?: number;
    agi?: number;
    int_stat?: number;
    vit?: number;
    damage?: number;
    defense?: number;
  };
  sellPrice: number;
  craftable?: boolean;
}

// API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// NextAuth type extensions
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
  }
}