import { SkillDefinition } from "@/types";

export const SKILLS: SkillDefinition[] = [
  // Combat
  { id: "melee", name: "Melee", category: "combat", description: "Kemampuan bertarung jarak dekat. Tiap level +2 STR, +1 DEF.", icon: "⚔️", maxLevel: 99 },
  { id: "ranged", name: "Ranged", category: "combat", description: "Kemampuan menyerang dari jarak jauh. Tiap level +2 AGI, +1 hit rate.", icon: "🏹", maxLevel: 99 },
  { id: "magic", name: "Magic", category: "combat", description: "Penguasaan sihir dan mantra. Tiap level +2 INT, +1 MP max.", icon: "🔮", maxLevel: 99 },
  { id: "defense", name: "Defense", category: "combat", description: "Kemampuan bertahan. Tiap level +3 DEF, +2 HP max.", icon: "🛡️", maxLevel: 99 },
  // Gathering
  { id: "excavation", name: "Excavation", category: "gathering", description: "Menggali situs arkeologi untuk menemukan material dan artefak.", icon: "⛏️", maxLevel: 99 },
  { id: "inscription", name: "Inscription", category: "gathering", description: "Menyalin hieroglif dan cuneiform untuk mendapat scroll dan blueprint.", icon: "📜", maxLevel: 99 },
  { id: "herbalism", name: "Herbalism", category: "gathering", description: "Mengumpulkan tanaman dari gurun dan lembah sungai.", icon: "🌿", maxLevel: 99 },
  { id: "fishing", name: "Fishing", category: "gathering", description: "Memancing di Sungai Nil dan Eufrat untuk makanan dan buff.", icon: "🎣", maxLevel: 99 },
  // Production
  { id: "smithing", name: "Smithing", category: "production", description: "Menempa senjata dan armor dari bijih logam.", icon: "🔨", maxLevel: 99 },
  { id: "alchemy", name: "Alchemy", category: "production", description: "Meracik potion dari tanaman dan material.", icon: "⚗️", maxLevel: 99 },
  { id: "runecrafting", name: "Runecrafting", category: "production", description: "Membuat rune dan tablet untuk spell.", icon: "✨", maxLevel: 99 },
  { id: "enchanting", name: "Enchanting", category: "production", description: "Menambahkan enchantment pada gear.", icon: "💫", maxLevel: 99 },
  // Support
  { id: "prayer", name: "Prayer", category: "support", description: "Membuka blessing dari dewa dengan ritual persembahan.", icon: "🙏", maxLevel: 99 },
  { id: "lore_skill", name: "Lore", category: "support", description: "Pengetahuan tentang monster, meningkatkan damage ke tipe tertentu.", icon: "📖", maxLevel: 99 },
];

export const SKILL_EXP_TABLE: number[] = Array.from({ length: 99 }, (_, i) => {
  const level = i + 1;
  // Smoother curve: early levels fast, late levels slow
  if (level <= 10)  return Math.floor(level * 80);
  if (level <= 20)  return Math.floor(level * 150);
  if (level <= 30)  return Math.floor(level * 250);
  if (level <= 50)  return Math.floor(level * 400);
  if (level <= 70)  return Math.floor(level * 650);
  if (level <= 90)  return Math.floor(level * 1000);
  return Math.floor(level * 1500);
});

export function getExpForLevel(level: number): number {
  if (level <= 1) return 0;
  return SKILL_EXP_TABLE.slice(0, level - 1).reduce((a, b) => a + b, 0);
}

export function getExpToNextLevel(level: number): number {
  if (level >= 99) return 0;
  return SKILL_EXP_TABLE[level - 1];
}