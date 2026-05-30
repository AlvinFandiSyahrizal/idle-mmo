export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  category: "combat" | "gathering" | "crafting" | "exploration" | "social" | "progression";
  icon: string;
  condition: {
    type: "kill_count" | "skill_level" | "gold_earned" | "zone_unlocked" |
          "craft_count" | "ascension_count" | "login_streak" | "guild_joined" |
          "item_collected" | "boss_killed";
    skillId?: string;
    target: number;
    itemId?: string;
  };
  reward: {
    gold?: number;
    soulShard?: number;
    title?: string;
    attributePoints?: number;
  };
  hidden?: boolean; // Secret achievements
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  // ── COMBAT ──
  {
    id: "first_blood",
    title: "First Blood",
    description: "Kalahkan monster pertamamu.",
    category: "combat", icon: "⚔️",
    condition: { type: "kill_count", target: 1 },
    reward: { gold: 50 },
  },
  {
    id: "slayer_100",
    title: "Slayer",
    description: "Kalahkan 100 monster.",
    category: "combat", icon: "🗡️",
    condition: { type: "kill_count", target: 100 },
    reward: { gold: 200, attributePoints: 1 },
  },
  {
    id: "slayer_1000",
    title: "Monster Hunter",
    description: "Kalahkan 1,000 monster.",
    category: "combat", icon: "🏹",
    condition: { type: "kill_count", target: 1000 },
    reward: { gold: 1000, soulShard: 5, attributePoints: 2 },
  },
  {
    id: "slayer_10000",
    title: "Legendary Slayer",
    description: "Kalahkan 10,000 monster.",
    category: "combat", icon: "💀",
    condition: { type: "kill_count", target: 10000 },
    reward: { gold: 5000, soulShard: 20, attributePoints: 5, title: "Legendary Slayer" },
  },
  {
    id: "melee_10",
    title: "Apprentice Warrior",
    description: "Capai Melee level 10.",
    category: "combat", icon: "⚔️",
    condition: { type: "skill_level", skillId: "melee", target: 10 },
    reward: { gold: 100, attributePoints: 1 },
  },
  {
    id: "melee_30",
    title: "Seasoned Warrior",
    description: "Capai Melee level 30.",
    category: "combat", icon: "⚔️",
    condition: { type: "skill_level", skillId: "melee", target: 30 },
    reward: { gold: 500, attributePoints: 2 },
  },
  {
    id: "melee_50",
    title: "Elite Warrior",
    description: "Capai Melee level 50.",
    category: "combat", icon: "⚔️",
    condition: { type: "skill_level", skillId: "melee", target: 50 },
    reward: { gold: 1500, soulShard: 5, attributePoints: 3 },
  },
  {
    id: "melee_99",
    title: "Transcendent Blade",
    description: "Capai Melee level 99 — level maksimal!",
    category: "combat", icon: "🌟",
    condition: { type: "skill_level", skillId: "melee", target: 99 },
    reward: { gold: 10000, soulShard: 50, attributePoints: 10, title: "Master of Blades" },
  },
  {
    id: "defense_50",
    title: "Iron Wall",
    description: "Capai Defense level 50.",
    category: "combat", icon: "🛡️",
    condition: { type: "skill_level", skillId: "defense", target: 50 },
    reward: { gold: 1000, attributePoints: 2 },
  },
  {
    id: "ranged_30",
    title: "Skilled Archer",
    description: "Capai Ranged level 30.",
    category: "combat", icon: "🏹",
    condition: { type: "skill_level", skillId: "ranged", target: 30 },
    reward: { gold: 500, attributePoints: 2 },
  },
  {
    id: "magic_30",
    title: "Arcane Student",
    description: "Capai Magic level 30.",
    category: "combat", icon: "🔮",
    condition: { type: "skill_level", skillId: "magic", target: 30 },
    reward: { gold: 500, attributePoints: 2 },
  },

  // ── GATHERING ──
  {
    id: "first_gather",
    title: "First Harvest",
    description: "Kumpulkan item pertamamu dari gathering.",
    category: "gathering", icon: "⛏️",
    condition: { type: "skill_level", skillId: "excavation", target: 2 },
    reward: { gold: 50 },
  },
  {
    id: "excavation_20",
    title: "Amateur Archaeologist",
    description: "Capai Excavation level 20.",
    category: "gathering", icon: "⛏️",
    condition: { type: "skill_level", skillId: "excavation", target: 20 },
    reward: { gold: 300, attributePoints: 1 },
  },
  {
    id: "herbalism_20",
    title: "Herb Collector",
    description: "Capai Herbalism level 20.",
    category: "gathering", icon: "🌿",
    condition: { type: "skill_level", skillId: "herbalism", target: 20 },
    reward: { gold: 300, attributePoints: 1 },
  },
  {
    id: "fishing_20",
    title: "Patient Fisher",
    description: "Capai Fishing level 20.",
    category: "gathering", icon: "🎣",
    condition: { type: "skill_level", skillId: "fishing", target: 20 },
    reward: { gold: 300, attributePoints: 1 },
  },
  {
    id: "inscription_20",
    title: "Ancient Scribe",
    description: "Capai Inscription level 20.",
    category: "gathering", icon: "📜",
    condition: { type: "skill_level", skillId: "inscription", target: 20 },
    reward: { gold: 300, attributePoints: 1 },
  },

  // ── CRAFTING ──
  {
    id: "first_craft",
    title: "First Creation",
    description: "Craft item pertamamu.",
    category: "crafting", icon: "🔨",
    condition: { type: "craft_count", target: 1 },
    reward: { gold: 50 },
  },
  {
    id: "craft_50",
    title: "Apprentice Crafter",
    description: "Craft 50 item.",
    category: "crafting", icon: "🔨",
    condition: { type: "craft_count", target: 50 },
    reward: { gold: 500, attributePoints: 1 },
  },
  {
    id: "craft_200",
    title: "Master Crafter",
    description: "Craft 200 item.",
    category: "crafting", icon: "⚗️",
    condition: { type: "craft_count", target: 200 },
    reward: { gold: 2000, soulShard: 10, attributePoints: 3, title: "Master Crafter" },
  },
  {
    id: "smithing_30",
    title: "Apprentice Smith",
    description: "Capai Smithing level 30.",
    category: "crafting", icon: "🔨",
    condition: { type: "skill_level", skillId: "smithing", target: 30 },
    reward: { gold: 500, attributePoints: 1 },
  },
  {
    id: "alchemy_20",
    title: "Potion Brewer",
    description: "Capai Alchemy level 20.",
    category: "crafting", icon: "⚗️",
    condition: { type: "skill_level", skillId: "alchemy", target: 20 },
    reward: { gold: 300, attributePoints: 1 },
  },

  // ── EXPLORATION ──
  {
    id: "zone2_unlock",
    title: "Desert Explorer",
    description: "Masuki Padang Pasir Barat.",
    category: "exploration", icon: "🏜️",
    condition: { type: "zone_unlocked", target: 35 },
    reward: { gold: 200 },
  },
  {
    id: "zone3_unlock",
    title: "Tomb Raider",
    description: "Masuki Nekropolis.",
    category: "exploration", icon: "💀",
    condition: { type: "zone_unlocked", target: 70 },
    reward: { gold: 500, soulShard: 3 },
  },
  {
    id: "zone4_unlock",
    title: "Temple Seeker",
    description: "Masuki Kuil Karnak.",
    category: "exploration", icon: "🏛️",
    condition: { type: "zone_unlocked", target: 105 },
    reward: { gold: 800, soulShard: 5 },
  },
  {
    id: "zone5_unlock",
    title: "Eastern Pioneer",
    description: "Masuki Lembah Eufrat — tanah Mesopotamia!",
    category: "exploration", icon: "🌿",
    condition: { type: "zone_unlocked", target: 140 },
    reward: { gold: 1200, soulShard: 8, attributePoints: 2 },
  },

  // ── PROGRESSION ──
  {
    id: "first_ascension",
    title: "Demi-God",
    description: "Lakukan Ascension pertama.",
    category: "progression", icon: "🌟",
    condition: { type: "ascension_count", target: 1 },
    reward: { gold: 5000, soulShard: 30, title: "Ascended" },
  },
  {
    id: "ascension_3",
    title: "Thrice Reborn",
    description: "Lakukan Ascension 3 kali.",
    category: "progression", icon: "⭐",
    condition: { type: "ascension_count", target: 3 },
    reward: { gold: 15000, soulShard: 100, attributePoints: 10, title: "Reborn" },
  },
  {
    id: "rich_100k",
    title: "Wealthy Adventurer",
    description: "Kumpulkan 100,000 Gold.",
    category: "progression", icon: "💰",
    condition: { type: "gold_earned", target: 100000 },
    reward: { soulShard: 10 },
  },
  {
    id: "streak_7",
    title: "Devoted",
    description: "Login 7 hari berturut-turut.",
    category: "progression", icon: "🔥",
    condition: { type: "login_streak", target: 7 },
    reward: { gold: 500, soulShard: 5 },
  },
  {
    id: "streak_30",
    title: "Eternal Pilgrim",
    description: "Login 30 hari berturut-turut.",
    category: "progression", icon: "👑",
    condition: { type: "login_streak", target: 30 },
    reward: { gold: 3000, soulShard: 30, title: "Eternal Pilgrim" },
  },

  // ── SOCIAL ──
  {
    id: "guild_joined",
    title: "Brotherhood",
    description: "Bergabung dengan sebuah guild.",
    category: "social", icon: "🏛️",
    condition: { type: "guild_joined", target: 1 },
    reward: { gold: 100 },
  },

  // ── HIDDEN ──
  {
    id: "secret_gold_million",
    title: "???",
    description: "Rahasia tersembunyi...",
    category: "progression", icon: "❓",
    condition: { type: "gold_earned", target: 1000000 },
    reward: { soulShard: 100, title: "Millionaire", attributePoints: 20 },
    hidden: true,
  },
];

export const ACHIEVEMENT_MAP = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a])
);

export const ACHIEVEMENT_CATEGORIES = [
  { id: "combat",      label: "⚔️ Combat",     color: "#ef4444" },
  { id: "gathering",   label: "⛏️ Gathering",  color: "#22c55e" },
  { id: "crafting",    label: "🔨 Crafting",   color: "#f59e0b" },
  { id: "exploration", label: "🗺️ Exploration", color: "#60a5fa" },
  { id: "progression", label: "📈 Progression", color: "#818cf8" },
  { id: "social",      label: "👥 Social",      color: "#f472b6" },
];