import { ZoneDefinition } from "@/types";

export const ZONE8: ZoneDefinition = {
  id: "zone8",
  name: "Gurun Axis Mundi",
  description: "Gurun misterius di antara dua peradaban. Realitas di sini tidak stabil — portal antar dimensi terbuka dan menutup tanpa peringatan.",
  alignment: "neutral",
  minLevel: 1,
  order: 8,
  bossId: "tiamat_reborn",
  areas: [
    {
      id: "area8_1", zoneId: "zone8",
      name: "Perbatasan Dua Dunia",
      description: "Titik di mana energi Mesir dan Mesopotamia bertabrakan.",
      minCombatLevel: 295, order: 1,
      monsters: ["reality_fracture", "void_scarab"],
    },
    {
      id: "area8_2", zoneId: "zone8",
      name: "Celah Dimensional",
      description: "Area di mana ruang dan waktu tidak stabil.",
      minCombatLevel: 315, order: 2,
      monsters: ["dimensional_rift", "lost_deity_fragment"],
    },
    {
      id: "area8_3", zoneId: "zone8",
      name: "Oasis Beku Waktu",
      description: "Oasis di mana waktu berhenti — makhluk di sini berusia ribuan tahun.",
      minCombatLevel: 335, order: 3,
      monsters: ["frozen_time_guardian", "ancient_construct"],
    },
    {
      id: "area8_4", zoneId: "zone8",
      name: "Mata Badai Kosmik",
      description: "Pusat dari semua kekacauan di Axis Mundi.",
      minCombatLevel: 355, order: 4,
      monsters: ["cosmic_horror", "void_titan"],
    },
  ],
};