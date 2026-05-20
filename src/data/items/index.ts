import { ItemDefinition } from "@/types";
import { MATERIALS, MATERIAL_MAP } from "./materials";

export const ALL_ITEMS: ItemDefinition[] = [...MATERIALS];

export const ITEM_MAP: Record<string, ItemDefinition> = { ...MATERIAL_MAP };

export function getItemById(id: string): ItemDefinition | undefined {
  return ITEM_MAP[id];
}