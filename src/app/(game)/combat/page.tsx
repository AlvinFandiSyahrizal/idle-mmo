"use client";

import { useState, useEffect } from "react";
import { useCombat } from "@/hooks/useCombat";
import { getAvailableAreas } from "@/data/zones";
import { CHARACTER_CLASSES, CLASS_ICONS } from "@/data/characters";
import GameSidebar from "@/components/layout/GameSidebar";

const LOG_COLORS: Record<string, string> = {
  combat: "#c4bfb0",
  loot: "#f59e0b",
  levelup: "#34d399",
  death: "#ef4444",
  system: "#60a5fa",
};

const AREA_MONSTERS: Record<string, { name: string; emoji: string; color: string }[]> = {
  area1_1: [
    { name: "Crocodile Hatchling", emoji: "🐊", color: "#16a34a" },
    { name: "Reed Sprite", emoji: "🌿", color: "#15803d" },
  ],
  area1_2: [
    { name: "Cursed Ibis", emoji: "🦅", color: "#7c3aed" },
    { name: "Marsh Lurker", emoji: "👁️", color: "#6d28d9" },
  ],
  area1_3: [
    { name: "Flood Elemental", emoji: "💧", color: "#1d4ed8" },
    { name: "Silt Golem", emoji: "🪨", color: "#78716c" },
  ],
  area1_4: [
    { name: "Sobek Cultist", emoji: "🐍", color: "#b45309" },
    { name: "Alpha Crocodile", emoji: "🐊", color: "#dc2626" },
  ],
};

export default function CombatPage() {
  const [character, setCharacter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentMonster, setCurrentMonster] = useState<{ name: string; emoji: string; color: string } | null>(null);
  const [attackAnim, setAttackAnim] = useState(false);

  async function fetchCharacter() {
    const res = await fetch("/api/character");
    const data = await res.json();
    if (data.success) setCharacter(data.data);
    setLoading(false);
  }

  function handleStatsUpdate() {
    fetchCharacter();
    setAttackAnim(true);
    setTimeout(() => setAttackAnim(false), 300);
  }

  const { state, startCombat, stopCombat } = useCombat(handleStatsUpdate);

  useEffect(() => {
    if (!state.isActive || !state.currentAreaId) {
      setCurrentMonster(null);
      return;
    }
    const monsters = AREA_MONSTERS[state.currentAreaId] ?? [];
    if (!monsters.length) return;
    function pickRandom() {
      setCurrentMonster(monsters[Math.floor(Math.random() * monsters.length)]);
    }
    pickRandom();
    const iv = setInterval(pickRandom, 3500);
    return () => clearInterval(iv);
  }, [state.isActive, state.currentAreaId]);

  useEffect(() => { fetchCharacter(); }, []);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#6b6b80", fontFamily: "Georgia, serif" }}>Memuat...</span>
    </div>
  );
  if (!character) return null;

  const classData = CHARACTER_CLASSES.find((c) => c.id === character.classId);
  const meleeSkill = character.skills?.find((s: any) => s.skillId === "melee");
  const meleeLevel = meleeSkill?.level ?? 1;
  const meleeExp = meleeSkill?.experience ?? 0;
  const availableAreas = getAvailableAreas(meleeLevel);
  const hpPct = Math.round((character.hp / character.maxHp) * 100);
  const meleePct = Math.min(100, Math.round((meleeExp / 1000) * 100));

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#0a0a0f", color: "#e2e0d8", fontFamily: "Georgia, serif" }}>
      <GameSidebar character={character} />

      <main style={{ flex: 1, padding: "28px 24px", display: "flex", flexDirection: "column", gap: "20px", overflow: "auto", minWidth: 0 }}>
        {/* Mobile spacer */}
        <div style={{ height: "0px" }} className="game-mobile-spacer" />

        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#f0ece0", margin: 0 }}>⚔️ Combat</h1>
          <p style={{ fontSize: "12px", color: "#6b6b80", margin: "3px 0 0" }}>Auto-battle area farming</p>
        </div>

        <div style={{ display: "flex", gap: "20px", flex: 1, minHeight: 0 }}>

          {/* Left panel */}
          <div style={{ width: "220px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Melee skill */}
            <div style={card}>
              <Label>Melee Skill</Label>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "13px", color: "#c4bfb0" }}>⚔️ Melee</span>
                <span style={{
                  fontSize: "12px", fontWeight: "bold", color: "#f59e0b",
                  background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
                  borderRadius: "6px", padding: "1px 8px",
                }}>Lv {meleeLevel}</span>
              </div>
              <div style={{ height: "4px", background: "#0f0f1a", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${meleePct}%`, background: "#d97706", borderRadius: "2px", transition: "width 0.5s" }} />
              </div>
              <div style={{ fontSize: "10px", color: "#4a4a5a", marginTop: "4px", textAlign: "right" }}>
                {meleeExp} / 1000 exp
              </div>
            </div>

            {/* Session stats */}
            {state.isActive && (
              <div style={card}>
                <Label>Sesi Ini</Label>
                {[
                  { label: "Kill", val: state.stats.killCount, color: "#c4bfb0" },
                  { label: "EXP", val: `+${state.stats.totalExp}`, color: "#34d399" },
                  { label: "Gold", val: `+${state.stats.totalGold}`, color: "#f59e0b" },
                ].map((s) => (
                  <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #1a1a28" }}>
                    <span style={{ fontSize: "11px", color: "#6b6b80" }}>{s.label}</span>
                    <span style={{ fontSize: "12px", fontWeight: "bold", color: s.color }}>{s.val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Area list */}
            <div style={card}>
              <Label>Area Farming</Label>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {availableAreas.map(({ area, zone }) => {
                  const isActive = state.currentAreaId === area.id;
                  return (
                    <button
                      key={area.id}
                      onClick={() => isActive ? stopCombat() : startCombat(area.id, area.name)}
                      style={{
                        textAlign: "left", padding: "9px 10px", borderRadius: "7px",
                        background: isActive ? "rgba(220,38,38,0.1)" : "#0f0f1a",
                        outline: isActive ? "1px solid rgba(220,38,38,0.3)" : "1px solid #1e1e2e",
                        border: "none", cursor: "pointer", transition: "all 0.2s",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", fontWeight: "bold", color: isActive ? "#fca5a5" : "#c4bfb0", fontFamily: "Georgia, serif" }}>
                          {area.name}
                        </span>
                        {isActive && (
                          <span style={{ fontSize: "9px", color: "#ef4444", background: "rgba(220,38,38,0.2)", borderRadius: "3px", padding: "1px 5px" }}>
                            AKTIF
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "10px", color: "#4a4a5a", marginTop: "1px", fontFamily: "Georgia, serif" }}>
                        {zone.name} · Lv {area.minCombatLevel}+
                      </div>
                    </button>
                  );
                })}
              </div>

              {state.isActive && (
                <button
                  onClick={stopCombat}
                  style={{
                    marginTop: "8px", width: "100%", padding: "8px", borderRadius: "7px",
                    background: "rgba(220,38,38,0.08)", border: "1px solid #3a2020",
                    color: "#ef4444", fontSize: "12px", fontFamily: "Georgia, serif",
                    cursor: "pointer", fontWeight: "bold",
                  }}
                >
                  🛑 Hentikan
                </button>
              )}
            </div>

          </div>

          {/* Center: Arena + log */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "14px", minWidth: 0 }}>

            {/* Arena */}
            <div style={{
              ...card,
              flex: 1,
              background: "linear-gradient(180deg,#0d0d18,#0a0a12)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              position: "relative", overflow: "hidden", minHeight: "300px",
            }}>
              {state.currentAreaName && (
                <div style={{
                  position: "absolute", top: "14px", left: "50%", transform: "translateX(-50%)",
                  fontSize: "10px", letterSpacing: "0.2em", color: "#4a4a5a",
                  background: "#111118", border: "1px solid #2a2a3a",
                  borderRadius: "20px", padding: "3px 14px", whiteSpace: "nowrap",
                }}>
                  {state.currentAreaName.toUpperCase()}
                </div>
              )}

              {state.isActive && currentMonster ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "50px", width: "100%", padding: "0 20px" }}>

                  {/* Player */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "90px", height: "90px", borderRadius: "50%",
                      background: "#1a1a28", border: "2px solid #2e2e44",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "48px",
                      transform: attackAnim ? "translateX(10px)" : "translateX(0)",
                      transition: "transform 0.15s ease-out",
                      boxShadow: "0 0 25px rgba(245,158,11,0.15)",
                    }}>
                      {classData ? CLASS_ICONS[classData.id] : "⚔️"}
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", fontWeight: "bold", color: "#f0ece0" }}>{character.name}</div>
                      <div style={{ marginTop: "4px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#6b6b80", marginBottom: "2px" }}>
                          <span>HP</span><span style={{ color: "#ef4444" }}>{character.hp}/{character.maxHp}</span>
                        </div>
                        <div style={{ width: "80px", height: "4px", background: "#1a1a28", borderRadius: "2px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${hpPct}%`, background: "#ef4444", borderRadius: "2px" }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* VS */}
                  <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#2a2a3a", fontWeight: "bold" }}>VS</div>

                  {/* Monster */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "90px", height: "90px", borderRadius: "50%",
                      background: "#1a0f0f", border: `2px solid ${currentMonster.color}44`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "48px",
                      boxShadow: `0 0 25px ${currentMonster.color}22`,
                      transition: "all 0.4s ease",
                    }}>
                      {currentMonster.emoji}
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", fontWeight: "bold", color: currentMonster.color }}>
                        {currentMonster.name}
                      </div>
                      <div style={{ fontSize: "9px", color: "#4a4a5a", marginTop: "2px" }}>Zone 1 · Delta Nil</div>
                    </div>
                  </div>

                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px", opacity: 0.2 }}>⚔️</div>
                  <div style={{ fontSize: "12px", color: "#3a3a4a", fontStyle: "italic" }}>
                    Pilih area untuk mulai bertarung...
                  </div>
                </div>
              )}

              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: "50px",
                background: "linear-gradient(0deg,rgba(0,0,0,0.5),transparent)",
                pointerEvents: "none",
              }} />
            </div>

            {/* Combat log — compact */}
            <div style={{ ...card, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#6b6b80", textTransform: "uppercase" }}>
                  Combat Log
                </span>
                {state.isActive && (
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "10px", color: "#34d399" }}>
                    <span style={{
                      width: "6px", height: "6px", borderRadius: "50%",
                      background: "#34d399", display: "inline-block",
                      animation: "pulse 1.5s infinite",
                    }} />
                    Berjalan
                  </span>
                )}
              </div>

              <div style={{
                height: "90px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "3px",
              }}>
                {state.logs.length === 0 ? (
                  <div style={{ color: "#3a3a4a", fontSize: "11px", fontStyle: "italic" }}>
                    Belum ada aktivitas...
                  </div>
                ) : (
                  state.logs.slice(0, 20).map((log) => (
                    <div key={log.id} style={{ display: "flex", gap: "8px", alignItems: "flex-start", flexShrink: 0 }}>
                      <span style={{ fontSize: "9px", color: "#3a3a4a", flexShrink: 0, marginTop: "1px" }}>
                        {log.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </span>
                      <span style={{ fontSize: "11px", color: LOG_COLORS[log.type] ?? "#c4bfb0", lineHeight: "1.4" }}>
                        {log.message}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @media (max-width: 768px) {
          .game-mobile-spacer { height: 56px !important; }
          .game-mobile-topbar { display: flex !important; }
        }
        @media (min-width: 769px) {
          .game-mobile-topbar { display: none !important; }
        }
      `}</style>
    </div>
  );
}

const card: React.CSSProperties = {
  background: "#111118",
  border: "1px solid #2a2a3a",
  borderRadius: "12px",
  padding: "16px",
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: "10px", letterSpacing: "0.15em", color: "#6b6b80",
      textTransform: "uppercase", marginBottom: "10px",
      paddingBottom: "8px", borderBottom: "1px solid #1e1e2e",
    }}>
      {children}
    </div>
  );
}