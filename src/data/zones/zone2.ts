import { ZoneDefinition } from "@/types";

export const ZONE2: ZoneDefinition = {
  id: "zone2",
  name: "Padang Pasir Barat",
  description: "Gurun tak berujung dengan badai pasir dan makhluk-makhluk yang hidup dari kekeringan.",
  alignment: "egypt",
  minLevel: 1,
  order: 2,
  bossId: "apep_fragment",
  areas: [
    {
      id: "area2_1",
      zoneId: "zone2",
      name: "Gerbang Gurun",
      description: "Pintu masuk padang pasir yang gersang.",
      minCombatLevel: 35,
      order: 1,
      monsters: ["sand_scarab", "desert_wanderer"],
    },
    {
      id: "area2_2",
      zoneId: "zone2",
      name: "Badai Pasir Abadi",
      description: "Badai pasir tanpa henti menyembunyikan bahaya.",
      minCombatLevel: 45,
      order: 2,
      monsters: ["desert_wraith", "sand_scarab"],
    },
    {
      id: "area2_3",
      zoneId: "zone2",
      name: "Oasis Terkutuk",
      description: "Oasis yang tampak indah namun penuh jebakan.",
      minCombatLevel: 55,
      order: 3,
      monsters: ["cursed_palm", "desiccated_warrior"],
    },
    {
      id: "area2_4",
      zoneId: "zone2",
      name: "Sarang Apep",
      description: "Tempat bersarangnya pecahan jiwa Apep, ular kosmik.",
      minCombatLevel: 65,
      order: 4,
      monsters: ["apep_cultist", "void_serpent"],
    },
  ],
};