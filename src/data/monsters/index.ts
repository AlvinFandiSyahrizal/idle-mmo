import { MonsterDefinition } from "@/types";
import { ZONE1_MONSTERS } from "./zone1";

export const ALL_MONSTERS: MonsterDefinition[] = [
  ...ZONE1_MONSTERS,
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