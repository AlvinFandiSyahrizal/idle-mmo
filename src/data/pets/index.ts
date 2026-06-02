export interface PetDefinition {
  id: string;
  name: string;
  description: string;
  emoji: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  color: string;
  source: string;
  bonus: {
    type: "gold_boost" | "exp_boost" | "drop_boost" | "damage_boost" |
          "gathering_boost" | "hp_boost" | "auto_loot";
    value: number;
    description: string;
  };
  ability: {
    name: string;
    description: string;
    triggerChance: number;
  };
  feedItem: string;
  feedCost: number;
}

export const PETS: PetDefinition[] = [
  {
    id: "baby_sobek",
    name: "Baby Sobek",
    description: "Anak buaya kecil yang jinak, keturunan langsung dari dewa Sobek.",
    emoji: "🐊",
    rarity: "rare",
    color: "#16a34a",
    source: "Drop langka dari Alpha Crocodile atau Sobek Cultist",
    bonus: {
      type: "gold_boost",
      value: 10,
      description: "+10% Gold dari semua monster",
    },
    ability: {
      name: "Nile Blessing",
      description: "5% chance setiap kill untuk double gold dari monster tersebut",
      triggerChance: 0.05,
    },
    feedItem: "raw_fish",
    feedCost: 5,
  },
  {
    id: "horus_fledgling",
    name: "Horus Fledgling",
    description: "Elang muda keturunan Horus, diberkahi dengan penglihatan ilahi.",
    emoji: "🦅",
    rarity: "epic",
    color: "#d97706",
    source: "Reward Zone 3 pertama kali clear, atau drop dari Judgment Shade",
    bonus: {
      type: "exp_boost",
      value: 8,
      description: "+8% EXP dari semua aktivitas",
    },
    ability: {
      name: "Divine Sight",
      description: "5% chance reveal lore fragment tersembunyi saat gathering",
      triggerChance: 0.05,
    },
    feedItem: "ibis_feather",
    feedCost: 3,
  },
  {
    id: "bastet_kitten",
    name: "Bastet Kitten",
    description: "Kucing suci Bastet, membawa keberuntungan bagi pemiliknya.",
    emoji: "🐱",
    rarity: "uncommon",
    color: "#f472b6",
    source: "Drop dari Ka Spirit atau Cursed Priest",
    bonus: {
      type: "drop_boost",
      value: 8,
      description: "+8% drop rate semua monster",
    },
    ability: {
      name: "Lucky Paw",
      description: "5% chance double drop dari setiap monster",
      triggerChance: 0.05,
    },
    feedItem: "raw_fish",
    feedCost: 3,
  },
  {
    id: "scorpion_serqet",
    name: "Scorpion of Serqet",
    description: "Kalajengking suci dewi Serqet, mengandung racun yang melemahkan musuh.",
    emoji: "🦂",
    rarity: "rare",
    color: "#dc2626",
    source: "Drop dari Desert Wraith atau Apep Cultist",
    bonus: {
      type: "damage_boost",
      value: 12,
      description: "+12% damage di semua area gurun",
    },
    ability: {
      name: "Venom Strike",
      description: "8% chance serangan memberikan efek racun, +20% damage satu hit berikutnya",
      triggerChance: 0.08,
    },
    feedItem: "scorpion_venom",
    feedCost: 2,
  },
  {
    id: "marsh_sprite",
    name: "Marsh Sprite",
    description: "Makhluk kecil dari rawa papirus, ahli dalam mengumpulkan herbal.",
    emoji: "🌿",
    rarity: "common",
    color: "#22c55e",
    source: "Drop dari Reed Sprite atau Cursed Ibis",
    bonus: {
      type: "gathering_boost",
      value: 15,
      description: "+15% resource dari Herbalism dan Fishing",
    },
    ability: {
      name: "Nature Bond",
      description: "10% chance mendapat resource bonus saat gathering",
      triggerChance: 0.10,
    },
    feedItem: "herb_lotus",
    feedCost: 5,
  },
  {
    id: "sand_scarab",
    name: "Golden Scarab",
    description: "Kumbang emas sakral, simbol keabadian dan kelahiran kembali.",
    emoji: "🪲",
    rarity: "uncommon",
    color: "#f59e0b",
    source: "Drop dari Sand Scarab atau Desert Wanderer",
    bonus: {
      type: "exp_boost",
      value: 5,
      description: "+5% EXP dari combat",
    },
    ability: {
      name: "Rebirth",
      description: "3% chance saat HP sangat rendah untuk instant regen 20% HP",
      triggerChance: 0.03,
    },
    feedItem: "scarab_shell",
    feedCost: 5,
  },
  {
    id: "river_demon_pup",
    name: "River Demon Pup",
    description: "Anak iblis sungai yang jinak, berasal dari perairan Mesopotamia.",
    emoji: "😈",
    rarity: "rare",
    color: "#3b82f6",
    source: "Drop dari River Demon atau Mud Golem",
    bonus: {
      type: "hp_boost",
      value: 50,
      description: "+50 Max HP permanen saat aktif",
    },
    ability: {
      name: "Flood Guard",
      description: "5% chance untuk block serangan monster sepenuhnya",
      triggerChance: 0.05,
    },
    feedItem: "river_clay",
    feedCost: 10,
  },
  {
    id: "maat_feather_spirit",
    name: "Maat Spirit",
    description: "Roh bulu Maat, simbol keseimbangan kosmik.",
    emoji: "🪶",
    rarity: "legendary",
    color: "#f0ece0",
    source: "Reward setelah mengumpulkan semua lore Zone 3",
    bonus: {
      type: "drop_boost",
      value: 15,
      description: "+15% drop rate dan +10% gold dari semua area",
    },
    ability: {
      name: "Cosmic Balance",
      description: "Semua bonus dari kedua alignment aktif sekaligus",
      triggerChance: 1.0,
    },
    feedItem: "maat_feather",
    feedCost: 1,
  },
];

export const PET_MAP = Object.fromEntries(PETS.map((p) => [p.id, p]));

export const RARITY_CONFIG: Record<string, { color: string; label: string; border: string; bg: string }> = {
  common:    { color: "#9ca3af", label: "Common",    border: "#374151",  bg: "#1a1a28" },
  uncommon:  { color: "#4ade80", label: "Uncommon",  border: "#166534",  bg: "#052e16" },
  rare:      { color: "#60a5fa", label: "Rare",      border: "#1e40af",  bg: "#0f172a" },
  epic:      { color: "#c084fc", label: "Epic",      border: "#6b21a8",  bg: "#1a0a2e" },
  legendary: { color: "#f59e0b", label: "Legendary", border: "#92400e",  bg: "#1c0a00" },
};

export const MAX_PET_LEVEL = 10;

export function getPetExpForLevel(level: number): number {
  return level * level * 50;
}