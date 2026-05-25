// Mapping itemId -> area mana yang drop item ini
export const ITEM_SOURCES: Record<string, { areaId: string; areaName: string; zoneName: string; minLevel: number }[]> = {
  crocodile_scale: [
    { areaId: "area1_1", areaName: "Tepi Sungai Nil", zoneName: "Delta Nil", minLevel: 1 },
    { areaId: "area1_4", areaName: "Sarang Sobek", zoneName: "Delta Nil", minLevel: 30 },
  ],
  raw_fish: [
    { areaId: "area1_1", areaName: "Tepi Sungai Nil", zoneName: "Delta Nil", minLevel: 1 },
  ],
  papyrus_reed: [
    { areaId: "area1_1", areaName: "Tepi Sungai Nil", zoneName: "Delta Nil", minLevel: 1 },
    { areaId: "area1_2", areaName: "Rawa Papirus", zoneName: "Delta Nil", minLevel: 10 },
  ],
  herb_lotus: [
    { areaId: "area1_1", areaName: "Tepi Sungai Nil", zoneName: "Delta Nil", minLevel: 1 },
    { areaId: "area1_2", areaName: "Rawa Papirus", zoneName: "Delta Nil", minLevel: 10 },
  ],
  silt_clay: [
    { areaId: "area1_3", areaName: "Padang Banjir", zoneName: "Delta Nil", minLevel: 20 },
  ],
  marsh_slime: [
    { areaId: "area1_2", areaName: "Rawa Papirus", zoneName: "Delta Nil", minLevel: 10 },
  ],
  bronze_ore: [
    { areaId: "area1_2", areaName: "Rawa Papirus", zoneName: "Delta Nil", minLevel: 10 },
  ],
  iron_ore: [
    { areaId: "area1_3", areaName: "Padang Banjir", zoneName: "Delta Nil", minLevel: 20 },
  ],
  linen_wrap: [
    { areaId: "area3_1", areaName: "Gerbang Kematian", zoneName: "Nekropolis", minLevel: 70 },
    { areaId: "area3_2", areaName: "Lorong Makam", zoneName: "Nekropolis", minLevel: 80 },
  ],
  crocodile_fang: [
    { areaId: "area1_4", areaName: "Sarang Sobek", zoneName: "Delta Nil", minLevel: 30 },
  ],
  hardened_hide: [
    { areaId: "area1_4", areaName: "Sarang Sobek", zoneName: "Delta Nil", minLevel: 30 },
  ],
  cedar_wood: [
    { areaId: "area5_3", areaName: "Hutan Purba", zoneName: "Lembah Eufrat", minLevel: 160 },
    { areaId: "area5_4", areaName: "Gerbang Hutan Humbaba", zoneName: "Lembah Eufrat", minLevel: 170 },
  ],
  copper_ore: [
    { areaId: "area5_1", areaName: "Tepi Sungai Eufrat", zoneName: "Lembah Eufrat", minLevel: 140 },
  ],
  gold_ore: [
    { areaId: "area3_2", areaName: "Lorong Makam", zoneName: "Nekropolis", minLevel: 80 },
  ],
  electrum_ore: [
    { areaId: "area2_4", areaName: "Sarang Apep", zoneName: "Padang Pasir Barat", minLevel: 65 },
  ],
  lapis_lazuli: [
    { areaId: "area5_3", areaName: "Hutan Purba", zoneName: "Lembah Eufrat", minLevel: 160 },
  ],
  soul_essence: [
    { areaId: "area3_1", areaName: "Gerbang Kematian", zoneName: "Nekropolis", minLevel: 70 },
    { areaId: "area3_3", areaName: "Ruang Penghakiman", zoneName: "Nekropolis", minLevel: 90 },
  ],
  lion_claw: [
    { areaId: "area5_4", areaName: "Gerbang Hutan Humbaba", zoneName: "Lembah Eufrat", minLevel: 170 },
  ],
  scorpion_venom: [
    { areaId: "area2_2", areaName: "Badai Pasir Abadi", zoneName: "Padang Pasir Barat", minLevel: 45 },
  ],
  natron_salt: [
    { areaId: "area3_1", areaName: "Gerbang Kematian", zoneName: "Nekropolis", minLevel: 70 },
  ],
};