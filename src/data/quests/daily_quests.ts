export interface QuestDefinition {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly";
  category: "combat" | "crafting" | "gathering" | "general";
  icon: string;
  objective: {
    type: "kill_monsters" | "craft_items" | "earn_gold" | "login" | "farm_area";
    target: number;
    areaId?: string;
  };
  rewards: {
    gold?: number;
    exp?: number;
    soulShard?: number;
  };
}

export const DAILY_QUESTS: QuestDefinition[] = [
  {
    id: "daily_login",
    title: "Hadir Setiap Hari",
    description: "Login dan klaim hadiah harian.",
    type: "daily",
    category: "general",
    icon: "📅",
    objective: { type: "login", target: 1 },
    rewards: { gold: 100, exp: 50 },
  },
  {
    id: "daily_kill_50",
    title: "Pembantai Harian",
    description: "Kalahkan 50 monster di area manapun.",
    type: "daily",
    category: "combat",
    icon: "⚔️",
    objective: { type: "kill_monsters", target: 50 },
    rewards: { gold: 300, exp: 200, soulShard: 1 },
  },
  {
    id: "daily_kill_100",
    title: "Pembantai Ulung",
    description: "Kalahkan 100 monster dalam sehari.",
    type: "daily",
    category: "combat",
    icon: "🗡️",
    objective: { type: "kill_monsters", target: 100 },
    rewards: { gold: 600, exp: 400, soulShard: 2 },
  },
  {
    id: "daily_earn_gold",
    title: "Pedagang Harian",
    description: "Dapatkan 500 Gold dari monster.",
    type: "daily",
    category: "general",
    icon: "💰",
    objective: { type: "earn_gold", target: 500 },
    rewards: { gold: 200, exp: 100 },
  },
  {
    id: "daily_craft_3",
    title: "Pengrajin Harian",
    description: "Craft 3 item apapun.",
    type: "daily",
    category: "crafting",
    icon: "🔨",
    objective: { type: "craft_items", target: 3 },
    rewards: { gold: 250, exp: 150, soulShard: 1 },
  },
  {
    id: "daily_farm_zone1",
    title: "Penjaga Delta Nil",
    description: "Farm di area Delta Nil selama sesi ini.",
    type: "daily",
    category: "combat",
    icon: "🌊",
    objective: { type: "farm_area", target: 20, areaId: "zone1" },
    rewards: { gold: 200, exp: 120 },
  },
];

export const WEEKLY_QUESTS: QuestDefinition[] = [
  {
    id: "weekly_kill_500",
    title: "Legenda Pertempuran",
    description: "Kalahkan 500 monster minggu ini.",
    type: "weekly",
    category: "combat",
    icon: "⚔️",
    objective: { type: "kill_monsters", target: 500 },
    rewards: { gold: 2000, exp: 1500, soulShard: 10 },
  },
  {
    id: "weekly_craft_15",
    title: "Pengrajin Andal",
    description: "Craft 15 item minggu ini.",
    type: "weekly",
    category: "crafting",
    icon: "🔨",
    objective: { type: "craft_items", target: 15 },
    rewards: { gold: 1500, exp: 1000, soulShard: 8 },
  },
  {
    id: "weekly_earn_5000",
    title: "Pedagang Kaya",
    description: "Kumpulkan 5000 Gold dari monster minggu ini.",
    type: "weekly",
    category: "general",
    icon: "💰",
    objective: { type: "earn_gold", target: 5000 },
    rewards: { gold: 1000, exp: 800, soulShard: 5 },
  },
];