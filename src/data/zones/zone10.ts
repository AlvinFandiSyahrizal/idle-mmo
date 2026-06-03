import { ZoneDefinition } from "@/types";

export const ZONE10: ZoneDefinition = {
  id: "zone10",
  name: "Axis Mundi",
  description: "Titik pusat dunia yang menghubungkan langit, bumi, dan dunia bawah. Ini adalah tujuan akhir setiap Vessel. Di sinilah kebenaran tentang segalanya akan terungkap.",
  alignment: "neutral",
  minLevel: 1,
  order: 10,
  bossId: "the_first_entity",
  areas: [
    {
      id: "area10_1", zoneId: "zone10",
      name: "Menara Cahaya",
      description: "Menara yang menembus langit, tempat energi kosmik terpusat.",
      minCombatLevel: 450, order: 1,
      monsters: ["duality_construct", "primordial_shade"],
    },
    {
      id: "area10_2", zoneId: "zone10",
      name: "Akar Dunia",
      description: "Akar pohon kosmik yang menghubungkan semua alam.",
      minCombatLevel: 475, order: 2,
      monsters: ["world_root_guardian", "cosmic_parasite"],
    },
    {
      id: "area10_3", zoneId: "zone10",
      name: "Ruang Antara",
      description: "Ruang di luar ruang — tempat yang tidak seharusnya ada.",
      minCombatLevel: 500, order: 3,
      monsters: ["between_horror", "reality_eater"],
    },
    {
      id: "area10_4", zoneId: "zone10",
      name: "Inti Axis",
      description: "Pusat dari segalanya. Di sini waktu tidak berlaku. Di sini segalanya dimulai — dan berakhir.",
      minCombatLevel: 525, order: 4,
      monsters: ["the_unnamed", "primordial_construct"],
    },
  ],
};