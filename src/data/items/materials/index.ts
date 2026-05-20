import { ItemDefinition } from "@/types";

export const MATERIALS: ItemDefinition[] = [
  { id: "crocodile_scale", name: "Crocodile Scale", type: "material", tier: "common", description: "Sisik keras dari buaya muda Delta Nil.", sellPrice: 3 },
  { id: "crocodile_fang", name: "Crocodile Fang", type: "material", tier: "common", description: "Taring tajam buaya Delta Nil.", sellPrice: 5 },
  { id: "raw_fish", name: "Raw Fish", type: "material", tier: "common", description: "Ikan segar dari Sungai Nil.", sellPrice: 2 },
  { id: "papyrus_reed", name: "Papyrus Reed", type: "material", tier: "common", description: "Batang papirus dari tepi sungai.", sellPrice: 1 },
  { id: "herb_lotus", name: "Lotus Herb", type: "material", tier: "common", description: "Bunga lotus dengan khasiat penyembuhan.", sellPrice: 8 },
  { id: "ibis_feather", name: "Ibis Feather", type: "material", tier: "common", description: "Bulu ibis yang dipercaya membawa kebijaksanaan Thoth.", sellPrice: 6 },
  { id: "cursed_ink", name: "Cursed Ink", type: "material", tier: "uncommon", description: "Tinta hitam dengan energi kutukan.", sellPrice: 25 },
  { id: "marsh_slime", name: "Marsh Slime", type: "material", tier: "common", description: "Lendir dari makhluk rawa.", sellPrice: 2 },
  { id: "water_essence", name: "Water Essence", type: "material", tier: "uncommon", description: "Esensi murni dari elemental air.", sellPrice: 20 },
  { id: "silt_clay", name: "Silt Clay", type: "material", tier: "common", description: "Tanah liat subur dari banjir Nil.", sellPrice: 1 },
  { id: "bronze_ore", name: "Bronze Ore", type: "material", tier: "common", description: "Bijih perunggu mentah.", sellPrice: 8 },
  { id: "iron_ore", name: "Iron Ore", type: "material", tier: "common", description: "Bijih besi mentah.", sellPrice: 12 },
  { id: "cultist_robe_scrap", name: "Cultist Robe Scrap", type: "material", tier: "common", description: "Sobekan jubah pengikut Sobek.", sellPrice: 4 },
  { id: "offering_token", name: "Offering Token", type: "material", tier: "uncommon", description: "Token ritual yang digunakan dalam persembahan.", sellPrice: 15 },
  { id: "hardened_hide", name: "Hardened Hide", type: "material", tier: "uncommon", description: "Kulit keras dari buaya alpha.", sellPrice: 30 },
];

export const MATERIAL_MAP = Object.fromEntries(MATERIALS.map((m) => [m.id, m]));