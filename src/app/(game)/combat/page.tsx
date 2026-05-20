"use client";

import { useState, useEffect } from "react";
import { useCombat } from "@/hooks/useCombat";
import { ZONES, getAvailableAreas } from "@/data/zones";

export default function CombatPage() {
  const [character, setCharacter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function fetchCharacter() {
    const res = await fetch("/api/character");
    const data = await res.json();
    if (data.success) setCharacter(data.data);
    setLoading(false);
  }

  const { state, startCombat, stopCombat } = useCombat(fetchCharacter);

  useEffect(() => {
    fetchCharacter();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <p className="text-stone-400 animate-pulse">Memuat...</p>
      </div>
    );
  }

  if (!character) return null;

  const meleeLevel = character.skills?.find((s: any) => s.skillId === "melee")?.level ?? 1;
  const availableAreas = getAvailableAreas(meleeLevel);
  const hpPercent = (character.hp / character.maxHp) * 100;

  const logColors: Record<string, string> = {
    combat: "text-stone-300",
    loot: "text-amber-400",
    levelup: "text-emerald-400",
    death: "text-red-400",
    system: "text-blue-400",
  };

  return (
    <div className="min-h-screen bg-stone-950 px-4 py-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-stone-100 mb-6">⚔️ Combat</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — Area select */}
          <div className="lg:col-span-1 space-y-4">

            {/* Character status */}
            <div className="bg-stone-900 border border-stone-700 rounded-xl p-4">
              <h2 className="text-stone-300 font-semibold text-sm mb-3">{character.name}</h2>
              <div className="mb-2">
                <div className="flex justify-between text-xs text-stone-400 mb-1">
                  <span>HP</span>
                  <span>{character.hp} / {character.maxHp}</span>
                </div>
                <div style={{ height: "6px", backgroundColor: "#292524", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${hpPercent}%`, backgroundColor: "#ef4444", borderRadius: "999px" }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 mt-3 text-xs">
                <div className="bg-stone-800 rounded px-2 py-1 flex justify-between">
                  <span className="text-stone-500">Melee</span>
                  <span className="text-amber-400">Lv {meleeLevel}</span>
                </div>
                <div className="bg-stone-800 rounded px-2 py-1 flex justify-between">
                  <span className="text-stone-500">Gold</span>
                  <span className="text-amber-400">{character.gold.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Session stats */}
            {(state.stats.killCount > 0 || state.isActive) && (
              <div className="bg-stone-900 border border-stone-700 rounded-xl p-4">
                <h2 className="text-stone-400 text-xs font-semibold mb-2 uppercase tracking-wider">Sesi Ini</h2>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Kill</span>
                    <span className="text-stone-200">{state.stats.killCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">EXP</span>
                    <span className="text-emerald-400">+{state.stats.totalExp.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Gold</span>
                    <span className="text-amber-400">+{state.stats.totalGold.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Area list */}
            <div className="bg-stone-900 border border-stone-700 rounded-xl p-4">
              <h2 className="text-stone-400 text-xs font-semibold mb-3 uppercase tracking-wider">Pilih Area</h2>
              <div className="space-y-2">
                {availableAreas.map(({ area, zone }) => {
                  const isActive = state.currentAreaId === area.id;
                  return (
                    <button
                      key={area.id}
                      onClick={() => isActive ? stopCombat() : startCombat(area.id, area.name)}
                      className={[
                        "w-full text-left rounded-lg px-3 py-2.5 text-sm transition-all border",
                        isActive
                          ? "bg-red-950/40 border-red-700 text-red-300"
                          : "bg-stone-800 border-stone-600 hover:border-stone-400 text-stone-300",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{area.name}</span>
                        {isActive && (
                          <span className="text-xs bg-red-900/50 text-red-400 px-1.5 py-0.5 rounded animate-pulse">
                            AKTIF
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        {zone.name} · Min Melee Lv {area.minCombatLevel}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stop button */}
            {state.isActive && (
              <button
                onClick={stopCombat}
                className="w-full bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-300 font-semibold rounded-xl px-4 py-3 transition-colors text-sm"
              >
                🛑 Hentikan Combat
              </button>
            )}
          </div>

          {/* Right — Combat log */}
          <div className="lg:col-span-2">
            <div className="bg-stone-900 border border-stone-700 rounded-xl p-4 h-full min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-stone-300 font-semibold text-sm">
                  Combat Log
                  {state.currentAreaName && (
                    <span className="text-stone-500 font-normal ml-2">— {state.currentAreaName}</span>
                  )}
                </h2>
                {state.isActive && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                    Berjalan
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 font-mono text-xs">
                {state.logs.length === 0 ? (
                  <p className="text-stone-600 italic text-center mt-20">
                    Pilih area untuk memulai combat...
                  </p>
                ) : (
                  state.logs.map((log) => (
                    <div key={log.id} className={`leading-relaxed ${logColors[log.type]}`}>
                      <span className="text-stone-600 mr-2">
                        {log.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </span>
                      {log.message}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}