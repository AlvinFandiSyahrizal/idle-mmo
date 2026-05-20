import { ZoneDefinition } from "@/types";

export const ZONES: ZoneDefinition[] = [
  {
    id: "zone1",
    name: "Delta Nil",
    description: "Tepian sungai Nil yang dipenuhi makhluk-makhluk kuno. Tempat awal perjalananmu.",
    alignment: "egypt",
    minLevel: 1,
    order: 1,
    bossId: "sobek_manifestation",
    areas: [
      {
        id: "area1_1",
        zoneId: "zone1",
        name: "Tepi Sungai Nil",
        description: "Area paling aman di Delta Nil. Cocok untuk pemula.",
        minCombatLevel: 1,
        order: 1,
        monsters: ["crocodile_hatchling", "reed_sprite"],
      },
      {
        id: "area1_2",
        zoneId: "zone1",
        name: "Rawa Papirus",
        description: "Rawa gelap penuh ibis terkutuk dan makhluk rawa.",
        minCombatLevel: 10,
        order: 2,
        monsters: ["cursed_ibis", "marsh_lurker"],
      },
      {
        id: "area1_3",
        zoneId: "zone1",
        name: "Padang Banjir",
        description: "Dataran rendah yang selalu tergenang banjir Nil.",
        minCombatLevel: 20,
        order: 3,
        monsters: ["flood_elemental", "silt_golem"],
      },
      {
        id: "area1_4",
        zoneId: "zone1",
        name: "Sarang Sobek",
        description: "Sarang para pengikut Sobek. Sangat berbahaya.",
        minCombatLevel: 30,
        order: 4,
        monsters: ["sobek_cultist", "alpha_crocodile"],
      },
    ],
  },
];

export function getAreaById(areaId: string) {
  for (const zone of ZONES) {
    const area = zone.areas.find((a) => a.id === areaId);
    if (area) return { area, zone };
  }
  return null;
}

export function getAvailableAreas(combatLevel: number) {
  const available = [];
  for (const zone of ZONES) {
    for (const area of zone.areas) {
      if (combatLevel >= area.minCombatLevel) {
        available.push({ area, zone });
      }
    }
  }
  return available;
}