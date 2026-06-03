import { MonsterDefinition } from "@/types";
import { ZONE1_MONSTERS } from "./zone1";
import { ZONE2_MONSTERS } from "./zone2";
import { ZONE3_MONSTERS } from "./zone3";
import { ZONE4_MONSTERS } from "./zone4";
import { ZONE5_MONSTERS } from "./zone5";
import { ZONE6_MONSTERS } from "./zone6";
import { ZONE7_MONSTERS } from "./zone7";
import { ZONE8_MONSTERS } from "./zone8";
import { ZONE9_MONSTERS } from "./zone9";
import { ZONE10_MONSTERS } from "./zone10";

export const ALL_MONSTERS: MonsterDefinition[] = [
  ...ZONE1_MONSTERS, ...ZONE2_MONSTERS,
  ...ZONE3_MONSTERS, ...ZONE4_MONSTERS,
  ...ZONE5_MONSTERS, ...ZONE6_MONSTERS,
  ...ZONE7_MONSTERS, ...ZONE8_MONSTERS,
  ...ZONE9_MONSTERS, ...ZONE10_MONSTERS,
];

export const MONSTER_MAP = Object.fromEntries(
  ALL_MONSTERS.map((m) => [m.id, m])
);

export function getMonsterById(id: string): MonsterDefinition | undefined {
  return MONSTER_MAP[id];
}

export function getMonstersForArea(monsterIds: string[]): MonsterDefinition[] {
  return monsterIds.map((id) => MONSTER_MAP[id]).filter(Boolean);
}