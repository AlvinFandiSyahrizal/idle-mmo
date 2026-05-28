export interface GatheringArea {
  id: string;
  name: string;
  zoneId: string;
  zoneName: string;
  skill: "excavation" | "herbalism" | "fishing" | "inscription";
  minSkillLevel: number;
  description: string;
  resources: GatheringResource[];
  expPerTick: number;
}

export interface GatheringResource {
  itemId: string;
  itemName: string;
  chance: number;
  minQty: number;
  maxQty: number;
  minSkillLevel: number;
}

export const GATHERING_AREAS: GatheringArea[] = [
  // ── EXCAVATION ──
  {
    id: "exc_zone1_riverbank",
    name: "Tepi Sungai Nil",
    zoneId: "zone1", zoneName: "Delta Nil",
    skill: "excavation", minSkillLevel: 1,
    description: "Menggali tanah liat dan batu dari tepi sungai Nil.",
    expPerTick: 12,
    resources: [
      { itemId: "silt_clay", itemName: "Silt Clay", chance: 0.8, minQty: 2, maxQty: 5, minSkillLevel: 1 },
      { itemId: "papyrus_reed", itemName: "Papyrus Reed", chance: 0.5, minQty: 1, maxQty: 3, minSkillLevel: 1 },
      { itemId: "bronze_ore", itemName: "Bronze Ore", chance: 0.2, minQty: 1, maxQty: 2, minSkillLevel: 5 },
      { itemId: "ancient_coin", itemName: "Ancient Coin", chance: 0.05, minQty: 1, maxQty: 1, minSkillLevel: 10 },
    ],
  },
  {
    id: "exc_zone2_desert",
    name: "Padang Pasir Barat",
    zoneId: "zone2", zoneName: "Padang Pasir Barat",
    skill: "excavation", minSkillLevel: 20,
    description: "Menggali reruntuhan kuno di bawah pasir gurun.",
    expPerTick: 28,
    resources: [
      { itemId: "desert_sand", itemName: "Desert Sand", chance: 0.8, minQty: 3, maxQty: 6, minSkillLevel: 20 },
      { itemId: "scarab_shell", itemName: "Scarab Shell", chance: 0.4, minQty: 1, maxQty: 2, minSkillLevel: 20 },
      { itemId: "ancient_coin", itemName: "Ancient Coin", chance: 0.2, minQty: 1, maxQty: 2, minSkillLevel: 25 },
      { itemId: "electrum_ore", itemName: "Electrum Ore", chance: 0.05, minQty: 1, maxQty: 1, minSkillLevel: 35 },
    ],
  },
  {
    id: "exc_zone3_necropolis",
    name: "Nekropolis",
    zoneId: "zone3", zoneName: "Nekropolis",
    skill: "excavation", minSkillLevel: 40,
    description: "Menggali situs pemakaman kuno yang menyimpan artefak berharga.",
    expPerTick: 48,
    resources: [
      { itemId: "canopic_shard", itemName: "Canopic Shard", chance: 0.5, minQty: 1, maxQty: 3, minSkillLevel: 40 },
      { itemId: "faience_shard", itemName: "Faience Shard", chance: 0.6, minQty: 2, maxQty: 4, minSkillLevel: 40 },
      { itemId: "gold_ore", itemName: "Gold Ore", chance: 0.15, minQty: 1, maxQty: 2, minSkillLevel: 45 },
      { itemId: "turquoise", itemName: "Turquoise", chance: 0.08, minQty: 1, maxQty: 1, minSkillLevel: 50 },
    ],
  },
  {
    id: "exc_zone4_karnak",
    name: "Kuil Karnak",
    zoneId: "zone4", zoneName: "Kuil Karnak",
    skill: "excavation", minSkillLevel: 60,
    description: "Menggali lantai kuil yang menyimpan rahasia Set.",
    expPerTick: 68,
    resources: [
      { itemId: "guardian_stone", itemName: "Guardian Stone", chance: 0.4, minQty: 1, maxQty: 2, minSkillLevel: 60 },
      { itemId: "gold_ore", itemName: "Gold Ore", chance: 0.25, minQty: 1, maxQty: 3, minSkillLevel: 60 },
      { itemId: "chaos_crystal", itemName: "Chaos Crystal", chance: 0.06, minQty: 1, maxQty: 1, minSkillLevel: 70 },
    ],
  },

  // ── HERBALISM ──
  {
    id: "herb_zone1_marsh",
    name: "Rawa Papirus",
    zoneId: "zone1", zoneName: "Delta Nil",
    skill: "herbalism", minSkillLevel: 1,
    description: "Mengumpulkan tanaman herbal dari rawa tepian Nil.",
    expPerTick: 10,
    resources: [
      { itemId: "herb_lotus", itemName: "Lotus Herb", chance: 0.7, minQty: 1, maxQty: 3, minSkillLevel: 1 },
      { itemId: "papyrus_reed", itemName: "Papyrus Reed", chance: 0.6, minQty: 2, maxQty: 4, minSkillLevel: 1 },
      { itemId: "cactus_herb", itemName: "Cactus Herb", chance: 0.3, minQty: 1, maxQty: 2, minSkillLevel: 5 },
    ],
  },
  {
    id: "herb_zone2_oasis",
    name: "Oasis Terkutuk",
    zoneId: "zone2", zoneName: "Padang Pasir Barat",
    skill: "herbalism", minSkillLevel: 15,
    description: "Mengumpulkan tanaman langka dari oasis yang tersembunyi.",
    expPerTick: 24,
    resources: [
      { itemId: "cactus_herb", itemName: "Cactus Herb", chance: 0.7, minQty: 2, maxQty: 4, minSkillLevel: 15 },
      { itemId: "cursed_sap", itemName: "Cursed Sap", chance: 0.25, minQty: 1, maxQty: 2, minSkillLevel: 20 },
      { itemId: "scorpion_venom", itemName: "Scorpion Venom", chance: 0.15, minQty: 1, maxQty: 1, minSkillLevel: 25 },
    ],
  },
  {
    id: "herb_zone5_euphrates",
    name: "Lembah Eufrat",
    zoneId: "zone5", zoneName: "Lembah Eufrat",
    skill: "herbalism", minSkillLevel: 35,
    description: "Mengumpulkan herbal Mesopotamia dari lembah subur.",
    expPerTick: 45,
    resources: [
      { itemId: "cedar_wood", itemName: "Cedar Wood", chance: 0.5, minQty: 1, maxQty: 3, minSkillLevel: 35 },
      { itemId: "ancient_bark", itemName: "Ancient Bark", chance: 0.3, minQty: 1, maxQty: 2, minSkillLevel: 40 },
      { itemId: "lapis_lazuli", itemName: "Lapis Lazuli", chance: 0.06, minQty: 1, maxQty: 1, minSkillLevel: 50 },
    ],
  },

  // ── FISHING ──
  {
    id: "fish_zone1_nile",
    name: "Sungai Nil",
    zoneId: "zone1", zoneName: "Delta Nil",
    skill: "fishing", minSkillLevel: 1,
    description: "Memancing di Sungai Nil yang kaya ikan.",
    expPerTick: 8,
    resources: [
      { itemId: "raw_fish", itemName: "Raw Fish", chance: 0.8, minQty: 1, maxQty: 3, minSkillLevel: 1 },
      { itemId: "river_clay", itemName: "River Clay", chance: 0.4, minQty: 1, maxQty: 2, minSkillLevel: 1 },
      { itemId: "ancient_coin", itemName: "Ancient Coin", chance: 0.04, minQty: 1, maxQty: 1, minSkillLevel: 10 },
    ],
  },
  {
    id: "fish_zone5_euphrates",
    name: "Sungai Eufrat",
    zoneId: "zone5", zoneName: "Lembah Eufrat",
    skill: "fishing", minSkillLevel: 20,
    description: "Memancing di Sungai Eufrat yang dalam dan misterius.",
    expPerTick: 32,
    resources: [
      { itemId: "raw_fish", itemName: "Raw Fish", chance: 0.7, minQty: 2, maxQty: 4, minSkillLevel: 20 },
      { itemId: "river_clay", itemName: "River Clay", chance: 0.5, minQty: 2, maxQty: 5, minSkillLevel: 20 },
      { itemId: "bitumen", itemName: "Bitumen", chance: 0.2, minQty: 1, maxQty: 2, minSkillLevel: 25 },
      { itemId: "demon_horn", itemName: "Demon Horn", chance: 0.05, minQty: 1, maxQty: 1, minSkillLevel: 30 },
    ],
  },

  // ── INSCRIPTION ──
  {
    id: "ins_zone1_temple",
    name: "Reruntuhan Kuil Nil",
    zoneId: "zone1", zoneName: "Delta Nil",
    skill: "inscription", minSkillLevel: 1,
    description: "Menyalin hieroglif dari dinding reruntuhan kuno.",
    expPerTick: 15,
    resources: [
      { itemId: "cursed_ink", itemName: "Cursed Ink", chance: 0.4, minQty: 1, maxQty: 2, minSkillLevel: 1 },
      { itemId: "faience_shard", itemName: "Faience Shard", chance: 0.5, minQty: 1, maxQty: 3, minSkillLevel: 1 },
      { itemId: "clay_tablet", itemName: "Clay Tablet", chance: 0.3, minQty: 1, maxQty: 2, minSkillLevel: 5 },
    ],
  },
  {
    id: "ins_zone4_karnak",
    name: "Aula Pilar Karnak",
    zoneId: "zone4", zoneName: "Kuil Karnak",
    skill: "inscription", minSkillLevel: 30,
    description: "Menyalin mantra kuno dari pilar-pilar Kuil Karnak.",
    expPerTick: 52,
    resources: [
      { itemId: "sacred_oil", itemName: "Sacred Oil", chance: 0.4, minQty: 1, maxQty: 2, minSkillLevel: 30 },
      { itemId: "maat_feather", itemName: "Maat Feather", chance: 0.1, minQty: 1, maxQty: 1, minSkillLevel: 40 },
      { itemId: "set_talisman", itemName: "Set Talisman", chance: 0.06, minQty: 1, maxQty: 1, minSkillLevel: 50 },
    ],
  },
];

export const GATHERING_AREA_MAP = Object.fromEntries(
  GATHERING_AREAS.map((a) => [a.id, a])
);

export function getGatheringAreasBySkill(skillId: string): GatheringArea[] {
  return GATHERING_AREAS.filter((a) => a.skill === skillId);
}