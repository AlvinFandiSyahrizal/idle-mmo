"use client";

import { signOut } from "next-auth/react";
import { CHARACTER_CLASSES, CLASS_ICONS, ALIGNMENT_LABELS } from "@/data/characters";
import { SKILLS } from "@/data/skills";

interface Props {
  character: any;
  onRefresh: () => void;
}

export default function Dashboard({ character, onRefresh }: Props) {
  const classData = CHARACTER_CLASSES.find((c) => c.id === character.classId);

  const alignmentLabel =
    character.alignment < -30
      ? "Condong Mesir"
      : character.alignment > 30
      ? "Condong Mesopotamia"
      : "Netral";

  const alignmentPercent = ((character.alignment + 100) / 200) * 100;

  const hpPercent = (character.hp / character.maxHp) * 100;
  const mpPercent = (character.mp / character.maxMp) * 100;

  const combatSkills = character.skills?.filter((s: any) =>
    ["melee", "ranged", "magic", "defense"].includes(s.skillId)
  );

  return (
    <div className="min-h-screen bg-stone-950">
      {/* Navbar */}
      <nav className="bg-stone-900 border-b border-stone-800 px-6 py-3 flex items-center justify-between">
        <h1 className="text-amber-400 font-bold tracking-wider">⚱ SANDS OF ETERNITY</h1>
        <div className="flex items-center gap-4">
          <span className="text-stone-400 text-sm">{character.name}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-stone-500 hover:text-stone-300 text-sm transition-colors"
          >
            Keluar
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Character card */}
        <div className="bg-stone-900 border border-stone-700 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{classData ? CLASS_ICONS[classData.id] : "⚔️"}</span>
            <div>
              <h2 className="text-xl font-bold text-stone-100">{character.name}</h2>
              <p className="text-stone-400 text-sm">
                {classData?.name} · Lv {character.level}
              </p>
            </div>
          </div>

          {/* HP bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-stone-400 mb-1">
              <span>HP</span>
              <span>{character.hp} / {character.maxHp}</span>
            </div>
            <div className="bg-stone-800 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-red-500 transition-all"
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>

          {/* MP bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-stone-400 mb-1">
              <span>MP</span>
              <span>{character.mp} / {character.maxMp}</span>
            </div>
            <div className="bg-stone-800 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-blue-500 transition-all"
                style={{ width: `${mpPercent}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { label: "STR", value: character.str, color: "text-red-400" },
              { label: "AGI", value: character.agi, color: "text-green-400" },
              { label: "INT", value: character.int_stat, color: "text-blue-400" },
              { label: "VIT", value: character.vit, color: "text-yellow-400" },
            ].map((stat) => (
              <div key={stat.label} className="bg-stone-800 rounded-lg px-3 py-2 flex justify-between">
                <span className="text-stone-400 text-sm">{stat.label}</span>
                <span className={`font-semibold text-sm ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Alignment bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-amber-400">Mesir</span>
              <span className="text-stone-400">{alignmentLabel}</span>
              <span className="text-blue-400">Mesopotamia</span>
            </div>
            <div className="bg-stone-800 rounded-full h-2 relative">
              <div
                className="absolute top-0 h-2 w-2 rounded-full bg-stone-100 -translate-x-1/2 transition-all"
                style={{ left: `${alignmentPercent}%` }}
              />
              <div className="h-2 rounded-full bg-gradient-to-r from-amber-600 to-blue-600 opacity-30" style={{ width: "100%" }} />
            </div>
          </div>
        </div>

        {/* Currencies */}
        <div className="bg-stone-900 border border-stone-700 rounded-xl p-5">
          <h3 className="text-stone-300 font-semibold mb-4">Mata Uang</h3>
          <div className="space-y-3">
            {[
              { icon: "💰", label: "Gold", value: character.gold.toLocaleString() },
              { icon: "🔮", label: "Soul Shard", value: character.soulShard.toLocaleString() },
              { icon: "⚗️", label: "Offering", value: character.offering.toLocaleString() },
              { icon: "🏛️", label: "Guild Token", value: character.guildToken.toLocaleString() },
            ].map((curr) => (
              <div key={curr.label} className="flex items-center justify-between bg-stone-800 rounded-lg px-3 py-2.5">
                <span className="flex items-center gap-2 text-stone-300 text-sm">
                  <span>{curr.icon}</span>
                  {curr.label}
                </span>
                <span className="text-amber-400 font-semibold text-sm">{curr.value}</span>
              </div>
            ))}
          </div>

          {/* Passive info */}
          {classData && (
            <div className="mt-4 bg-amber-950/30 border border-amber-800/50 rounded-lg p-3">
              <p className="text-amber-400 text-xs font-medium mb-1">✦ {classData.passive}</p>
              <p className="text-stone-400 text-xs">{classData.passiveDescription}</p>
            </div>
          )}
        </div>

        {/* Combat skills */}
        <div className="bg-stone-900 border border-stone-700 rounded-xl p-5">
          <h3 className="text-stone-300 font-semibold mb-4">Combat Skills</h3>
          <div className="space-y-3">
            {combatSkills?.map((skill: any) => {
              const def = SKILLS.find((s) => s.id === skill.skillId);
              const expPercent = Math.min((skill.experience / 1000) * 100, 100);
              return (
                <div key={skill.skillId}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-300">
                      {def?.icon} {def?.name}
                    </span>
                    <span className="text-amber-400 font-semibold">Lv {skill.level}</span>
                  </div>
                  <div className="bg-stone-800 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-amber-600 transition-all"
                      style={{ width: `${expPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick nav */}
          <div className="mt-6 grid grid-cols-2 gap-2">
            {[
              { href: "/combat", label: "⚔️ Combat", color: "bg-red-950/50 border-red-800 hover:bg-red-950 text-red-300" },
              { href: "/inventory", label: "🎒 Inventory", color: "bg-stone-800 border-stone-600 hover:bg-stone-700 text-stone-300" },
              { href: "/skills", label: "📊 Skills", color: "bg-stone-800 border-stone-600 hover:bg-stone-700 text-stone-300" },
              { href: "/crafting", label: "🔨 Crafting", color: "bg-stone-800 border-stone-600 hover:bg-stone-700 text-stone-300" },
            ].map((nav) => (
              <a
                key={nav.href}
                href={nav.href}
                className={`border rounded-lg px-3 py-2 text-sm text-center transition-colors ${nav.color}`}
              >
                {nav.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}