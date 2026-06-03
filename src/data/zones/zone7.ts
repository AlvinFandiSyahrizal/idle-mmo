import { ZoneDefinition } from "@/types";

export const ZONE7: ZoneDefinition = {
  id: "zone7",
  name: "Ziggurat Ur",
  description: "Kompleks ziggurat megah yang menghubungkan langit dan bumi. Kini dikuasai oleh Anunnaki Remnant.",
  alignment: "mesopotamia",
  minLevel: 1,
  order: 7,
  bossId: "nergal_warden",
  areas: [
    {
      id: "area7_1", zoneId: "zone7",
      name: "Gerbang Ziggurat",
      description: "Pintu masuk menuju struktur suci Mesopotamia.",
      minCombatLevel: 235, order: 1,
      monsters: ["temple_shade", "gate_guardian"],
    },
    {
      id: "area7_2", zoneId: "zone7",
      name: "Lantai Bintang",
      description: "Lantai tertinggi ziggurat, tempat para imam mengamati bintang.",
      minCombatLevel: 250, order: 2,
      monsters: ["anunnaki_remnant", "starfire_elemental"],
    },
    {
      id: "area7_3", zoneId: "zone7",
      name: "Ruang Nergal",
      description: "Ruang tersembunyi yang dipersembahkan untuk Nergal, dewa kematian.",
      minCombatLevel: 265, order: 3,
      monsters: ["death_shade", "underworld_spawn"],
    },
    {
      id: "area7_4", zoneId: "zone7",
      name: "Singgasana Bawah",
      description: "Replika Kur — dunia bawah Mesopotamia — di dalam ziggurat.",
      minCombatLevel: 280, order: 4,
      monsters: ["kur_demon", "nergal_champion"],
    },
  ],
};