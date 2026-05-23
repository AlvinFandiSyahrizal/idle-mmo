import { MonsterDefinition } from "@/types";
import { rollLoot, calculatePlayerDamage, calculateMonsterDamage } from "./CombatEngine";
import { getExpToNextLevel } from "@/data/skills";

export interface OfflineResult {
  duration: number; // detik
  durationText: string;
  kills: number;
  expGained: number;
  goldGained: number;
  loot: Record<string, number>; // itemId -> quantity
  skillLevelsGained: Record<string, number>; // skillId -> levels gained
  cappedAt: number; // max offline hours
}

const MAX_OFFLINE_HOURS = 8; // maksimal 8 jam offline
const TICK_DURATION = 3; // 3 detik per tick (sama dengan combat)

export function calculateOfflineGains(
  character: {
    hp: number;
    maxHp: number;
    str: number;
    agi: number;
    int_stat: number;
    vit: number;
    classId: string;
    alignment: number;
  },
  skills: { skillId: string; level: number; experience: number }[],
  monsters: MonsterDefinition[],
  lastOnlineAt: Date
): OfflineResult {
  const now = new Date();
  const maxSeconds = MAX_OFFLINE_HOURS * 3600;
  const rawSeconds = Math.floor((now.getTime() - lastOnlineAt.getTime()) / 1000);
  const durationSeconds = Math.min(rawSeconds, maxSeconds);

  if (durationSeconds < 10 || !monsters.length) {
    return {
      duration: 0,
      durationText: "0 detik",
      kills: 0,
      expGained: 0,
      goldGained: 0,
      loot: {},
      skillLevelsGained: {},
      cappedAt: MAX_OFFLINE_HOURS,
    };
  }

  const meleeLevel = skills.find((s) => s.skillId === "melee")?.level ?? 1;
  const defenseLevel = skills.find((s) => s.skillId === "defense")?.level ?? 1;

  const totalTicks = Math.floor(durationSeconds / TICK_DURATION);

  let kills = 0;
  let expGained = 0;
  let goldGained = 0;
  const loot: Record<string, number> = {};

  // Offline efficiency: 70% dari online (karena no player input)
  const efficiency = 0.7;

  for (let i = 0; i < totalTicks; i++) {
    const monster = monsters[Math.floor(Math.random() * monsters.length)];
    let monsterHp = monster.hp;
    let charHp = character.maxHp; // reset HP tiap fight offline

    let fightTicks = 0;
    const maxFightTicks = 50; // prevent infinite loop

    while (monsterHp > 0 && charHp > 0 && fightTicks < maxFightTicks) {
      const playerDmg = calculatePlayerDamage(character, meleeLevel);
      monsterHp -= playerDmg;
      if (monsterHp <= 0) break;
      const monsterDmg = calculateMonsterDamage(monster, defenseLevel);
      charHp -= monsterDmg;
      fightTicks++;
    }

    if (monsterHp <= 0) {
      kills++;
      expGained += Math.floor(monster.expReward * efficiency);
      goldGained += Math.floor(
        (monster.goldMin + Math.floor(Math.random() * (monster.goldMax - monster.goldMin + 1))) * efficiency
      );

      for (const entry of monster.lootTable) {
        const adjustedChance = entry.dropChance * efficiency;
        if (Math.random() < adjustedChance) {
          const qty = entry.minQuantity + Math.floor(Math.random() * (entry.maxQuantity - entry.minQuantity + 1));
          loot[entry.itemId] = (loot[entry.itemId] ?? 0) + qty;
        }
      }
    }
  }

  // Calculate skill level gains
  const skillLevelsGained: Record<string, number> = {};
  const meleeExpGain = Math.floor(expGained * 0.6);
  const defenseExpGain = Math.floor(expGained * 0.2);

  const meleeSkill = skills.find((s) => s.skillId === "melee");
  if (meleeSkill) {
    let lvl = meleeSkill.level;
    let exp = meleeSkill.experience + meleeExpGain;
    let levelsGained = 0;
    while (lvl < 99) {
      const needed = getExpToNextLevel(lvl);
      if (exp >= needed) { exp -= needed; lvl++; levelsGained++; }
      else break;
    }
    if (levelsGained > 0) skillLevelsGained["melee"] = levelsGained;
  }

  const defSkill = skills.find((s) => s.skillId === "defense");
  if (defSkill) {
    let lvl = defSkill.level;
    let exp = defSkill.experience + defenseExpGain;
    let levelsGained = 0;
    while (lvl < 99) {
      const needed = getExpToNextLevel(lvl);
      if (exp >= needed) { exp -= needed; lvl++; levelsGained++; }
      else break;
    }
    if (levelsGained > 0) skillLevelsGained["defense"] = levelsGained;
  }

  return {
    duration: durationSeconds,
    durationText: formatDuration(durationSeconds),
    kills,
    expGained,
    goldGained,
    loot,
    skillLevelsGained,
    cappedAt: MAX_OFFLINE_HOURS,
  };
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} detik`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} menit`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return m > 0 ? `${h} jam ${m} menit` : `${h} jam`;
}