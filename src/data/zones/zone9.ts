import { ZoneDefinition } from "@/types";

export const ZONE9: ZoneDefinition = {
  id: "zone9",
  name: "Gerbang Aaru / Kur",
  description: "Perbatasan antara dunia hidup dan mati. Mesir menyebutnya Aaru, Mesopotamia menyebutnya Kur. Keduanya mengarah ke tempat yang sama.",
  alignment: "neutral",
  minLevel: 1,
  order: 9,
  bossId: "osiris_fallen",
  areas: [
    {
      id: "area9_1", zoneId: "zone9",
      name: "Sungai Kematian",
      description: "Sungai yang memisahkan dunia hidup dari dunia mati.",
      minCombatLevel: 370, order: 1,
      monsters: ["soul_ferry_guardian", "death_current"],
    },
    {
      id: "area9_2", zoneId: "zone9",
      name: "Ladang Jiwa",
      description: "Tempat jiwa-jiwa yang belum dihakimi mengembara.",
      minCombatLevel: 390, order: 2,
      monsters: ["judgment_shade_elder", "divine_exile"],
    },
    {
      id: "area9_3", zoneId: "zone9",
      name: "Aula Dua Kebenaran",
      description: "Tempat Maat dan Ereshkigal menghakimi jiwa bersama.",
      minCombatLevel: 410, order: 3,
      monsters: ["truth_guardian", "scale_keeper"],
    },
    {
      id: "area9_4", zoneId: "zone9",
      name: "Tahta yang Jatuh",
      description: "Singgasana Osiris yang telah korup oleh kekuatan gelap.",
      minCombatLevel: 430, order: 4,
      monsters: ["fallen_divine", "corrupted_osiris_fragment"],
    },
  ],
};