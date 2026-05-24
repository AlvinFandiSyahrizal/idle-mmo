import { ZoneDefinition } from "@/types";

export const ZONE5: ZoneDefinition = {
  id: "zone5",
  name: "Lembah Eufrat",
  description: "Dataran subur di tepi Sungai Eufrat. Peradaban Mesopotamia dimulai dari sini.",
  alignment: "mesopotamia",
  minLevel: 1,
  order: 5,
  bossId: "humbaba_echo",
  areas: [
    {
      id: "area5_1",
      zoneId: "zone5",
      name: "Tepi Sungai Eufrat",
      description: "Tepian sungai yang tenang namun tersimpan bahaya.",
      minCombatLevel: 140,
      order: 1,
      monsters: ["mud_golem", "river_demon"],
    },
    {
      id: "area5_2",
      zoneId: "zone5",
      name: "Rawa Mesopotamia",
      description: "Rawa-rawa di delta sungai penuh makhluk primitif.",
      minCombatLevel: 150,
      order: 2,
      monsters: ["marsh_stalker", "swamp_horror"],
    },
    {
      id: "area5_3",
      zoneId: "zone5",
      name: "Hutan Purba",
      description: "Hutan lebat yang dijaga Humbaba.",
      minCombatLevel: 160,
      order: 3,
      monsters: ["forest_guardian", "ancient_treant"],
    },
    {
      id: "area5_4",
      zoneId: "zone5",
      name: "Gerbang Hutan Humbaba",
      description: "Pintu masuk ke wilayah Humbaba sang penjaga.",
      minCombatLevel: 170,
      order: 4,
      monsters: ["humbaba_servant", "wild_lion"],
    },
  ],
};
