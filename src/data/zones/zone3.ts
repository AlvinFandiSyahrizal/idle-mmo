import { ZoneDefinition } from "@/types";

export const ZONE3: ZoneDefinition = {
  id: "zone3",
  name: "Nekropolis",
  description: "Kota orang mati yang terletak di tepi padang pasir barat. Jiwa-jiwa gelisah berkeliaran.",
  alignment: "egypt",
  minLevel: 1,
  order: 3,
  bossId: "ammit_devourer",
  areas: [
    {
      id: "area3_1",
      zoneId: "zone3",
      name: "Gerbang Kematian",
      description: "Pintu masuk menuju kota para arwah.",
      minCombatLevel: 70,
      order: 1,
      monsters: ["restless_mummy", "ka_spirit"],
    },
    {
      id: "area3_2",
      zoneId: "zone3",
      name: "Lorong Makam",
      description: "Lorong gelap penuh perangkap dan penjaga kuno.",
      minCombatLevel: 80,
      order: 2,
      monsters: ["ushabti_golem", "tomb_guardian"],
    },
    {
      id: "area3_3",
      zoneId: "zone3",
      name: "Ruang Penghakiman",
      description: "Tempat jiwa-jiwa dihakimi oleh timbangan Maat.",
      minCombatLevel: 90,
      order: 3,
      monsters: ["judgment_shade", "cursed_priest"],
    },
    {
      id: "area3_4",
      zoneId: "zone3",
      name: "Altar Ammit",
      description: "Altar pemujaan Ammit, sang pemakan jiwa.",
      minCombatLevel: 100,
      order: 4,
      monsters: ["soul_eater", "ammit_spawn"],
    },
  ],
};