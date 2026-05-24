import { ZoneDefinition } from "@/types";

export const ZONE4: ZoneDefinition = {
  id: "zone4",
  name: "Kuil Karnak",
  description: "Kompleks kuil megah yang kini dikuasai oleh pendeta-pendeta korup pengikut Set.",
  alignment: "egypt",
  minLevel: 1,
  order: 4,
  bossId: "set_champion",
  areas: [
    {
      id: "area4_1",
      zoneId: "zone4",
      name: "Pelataran Luar",
      description: "Halaman depan kuil yang dijaga ketat.",
      minCombatLevel: 105,
      order: 1,
      monsters: ["corrupted_priest", "stone_guardian"],
    },
    {
      id: "area4_2",
      zoneId: "zone4",
      name: "Aula Pilar",
      description: "Lorong megah dengan pilar-pilar raksasa.",
      minCombatLevel: 115,
      order: 2,
      monsters: ["curse_scarab", "dark_acolyte"],
    },
    {
      id: "area4_3",
      zoneId: "zone4",
      name: "Ruang Suci",
      description: "Inti kuil yang telah ternoda energi Set.",
      minCombatLevel: 125,
      order: 3,
      monsters: ["set_cultist", "shadow_sentinel"],
    },
    {
      id: "area4_4",
      zoneId: "zone4",
      name: "Singgasana Set",
      description: "Tempat tahta Set, penuh kekuatan gelap.",
      minCombatLevel: 135,
      order: 4,
      monsters: ["set_champion_guard", "chaos_elemental"],
    },
  ],
};