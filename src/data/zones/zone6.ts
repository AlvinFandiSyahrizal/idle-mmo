import { ZoneDefinition } from "@/types";

export const ZONE6: ZoneDefinition = {
  id: "zone6",
  name: "Padang Sumeria",
  description: "Stepa luas tempat peradaban Sumeria pertama kali berdiri. Angin kencang membawa debu dan bisikan para dewa.",
  alignment: "mesopotamia",
  minLevel: 1,
  order: 6,
  bossId: "bull_of_heaven",
  areas: [
    {
      id: "area6_1", zoneId: "zone6",
      name: "Stepa Liar",
      description: "Padang terbuka tempat singa-singa Mesopotamia berkeliaran.",
      minCombatLevel: 180, order: 1,
      monsters: ["steppe_lion_elder", "dust_djinn"],
    },
    {
      id: "area6_2", zoneId: "zone6",
      name: "Reruntuhan Ur",
      description: "Sisa-sisa kota Ur yang pernah menjadi pusat peradaban.",
      minCombatLevel: 195, order: 2,
      monsters: ["rogue_soldier", "ur_guardian"],
    },
    {
      id: "area6_3", zoneId: "zone6",
      name: "Kuil Ziggurat Tua",
      description: "Ziggurat kuno yang kini ditempati makhluk-makhluk kuno.",
      minCombatLevel: 210, order: 3,
      monsters: ["ziggurat_shade", "copper_golem"],
    },
    {
      id: "area6_4", zoneId: "zone6",
      name: "Arena Gugalanna",
      description: "Tempat Banteng Surga pernah berjalan, tanah masih bergetar.",
      minCombatLevel: 225, order: 4,
      monsters: ["bull_cultist", "heaven_fragment"],
    },
  ],
};