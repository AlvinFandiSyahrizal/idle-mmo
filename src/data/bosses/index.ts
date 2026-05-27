export interface BossDefinition {
  id: string;
  name: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  alignment: "egypt" | "mesopotamia" | "neutral";
  baseHp: number;
  hpPerPlayer: number;
  minDamage: number;
  maxDamage: number;
  spawnMessage: string;
  defeatMessage: string;
  rewards: {
    tiers: {
      minPct: number; 
      gold: number;
      soulShard: number;
      itemId?: string;
    }[];
  };
}

export const WORLD_BOSSES: BossDefinition[] = [
  {
    id: "apep_rising",
    name: "Apep Rising",
    title: "Ular Kosmik Kekacauan",
    description: "Apep, ular primordial musuh Ra, bangkit dari kegelapan bawah tanah untuk menelan matahari dan menghancurkan dunia.",
    emoji: "🐍",
    color: "#7c3aed",
    alignment: "egypt",
    baseHp: 500000,
    hpPerPlayer: 50000,
    minDamage: 800,
    maxDamage: 1500,
    spawnMessage: "🌑 Langit menjadi gelap... Apep bangkit dari kedalaman!",
    defeatMessage: "☀️ Ra menang! Apep dipukul mundur ke kegelapan.",
    rewards: {
      tiers: [
        { minPct: 10, gold: 5000, soulShard: 20, itemId: "void_scale" },
        { minPct: 5,  gold: 3000, soulShard: 12, itemId: "void_scale" },
        { minPct: 1,  gold: 1500, soulShard: 6  },
        { minPct: 0,  gold: 500,  soulShard: 2  },
      ],
    },
  },
  {
    id: "tiamat_awakened",
    name: "Tiamat Awakened",
    title: "Naga Primordial Kekacauan",
    description: "Tiamat, ibu dari semua monster, terbangun dari tidur panjangnya. Lautan darah dan kehancuran mengikuti jejaknya.",
    emoji: "🐲",
    color: "#dc2626",
    alignment: "mesopotamia",
    baseHp: 800000,
    hpPerPlayer: 80000,
    minDamage: 1200,
    maxDamage: 2200,
    spawnMessage: "🌊 Lautan bergemuruh... Tiamat terbangun dari kedalaman!",
    defeatMessage: "⚡ Marduk menang! Tiamat kembali ke tidurnya.",
    rewards: {
      tiers: [
        { minPct: 10, gold: 8000, soulShard: 30, itemId: "chaos_crystal" },
        { minPct: 5,  gold: 5000, soulShard: 18, itemId: "chaos_crystal" },
        { minPct: 1,  gold: 2500, soulShard: 8  },
        { minPct: 0,  gold: 800,  soulShard: 3  },
      ],
    },
  },
  {
    id: "sobek_manifestation",
    name: "Sobek Manifestation",
    title: "Dewa Buaya Yang Murka",
    description: "Sobek memanifestasikan dirinya dalam wujud fisik, membanjiri dataran dengan air Nil yang terkutuk.",
    emoji: "🐊",
    color: "#16a34a",
    alignment: "egypt",
    baseHp: 300000,
    hpPerPlayer: 30000,
    minDamage: 500,
    maxDamage: 900,
    spawnMessage: "🌊 Sungai Nil meluap tak terkendali... Sobek murka!",
    defeatMessage: "🏆 Sobek dipaksa kembali ke sungai!",
    rewards: {
      tiers: [
        { minPct: 10, gold: 3000, soulShard: 12, itemId: "crocodile_fang" },
        { minPct: 5,  gold: 2000, soulShard: 7,  itemId: "crocodile_scale" },
        { minPct: 1,  gold: 1000, soulShard: 3  },
        { minPct: 0,  gold: 300,  soulShard: 1  },
      ],
    },
  },
];

export const BOSS_MAP = Object.fromEntries(WORLD_BOSSES.map((b) => [b.id, b]));