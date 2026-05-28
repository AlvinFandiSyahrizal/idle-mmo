"use client";

import { useState, useEffect, useCallback } from "react";
import GameSidebar from "@/components/layout/GameSidebar";
import { useGatheringStore } from "@/stores/gatheringStore";
import { GATHERING_AREAS, getGatheringAreasBySkill } from "@/data/gathering";

const SKILL_INFO: Record<string, { label: string; icon: string; color: string; desc: string }> = {
  excavation: { label: "Excavation", icon: "⛏️", color: "#d97706", desc: "Menggali situs arkeologi" },
  herbalism:  { label: "Herbalism",  icon: "🌿", color: "#16a34a", desc: "Mengumpulkan tanaman herbal" },
  fishing:    { label: "Fishing",    icon: "🎣", color: "#2563eb", desc: "Memancing di sungai kuno" },
  inscription:{ label: "Inscription",icon: "📜", color: "#7c3aed", desc: "Menyalin hieroglif dan mantra" },
};

const LOG_COLORS: Record<string, string> = {
  gather: "#f59e0b",
  levelup: "#34d399",
  system: "#60a5fa",
};

export default function GatheringPage() {
  const [character, setCharacter]   = useState<any>(null);
  const [loading, setLoading]       = useState(true);
  const [activeSkill, setActiveSkill] = useState("excavation");
  const { isActive, currentAreaId, currentAreaName, currentSkill, logs, stats, start, stop } =
    useGatheringStore();

  const fetchCharacter = useCallback(async () => {
    const res = await fetch("/api/character");
    const data = await res.json();
    if (data.success) setCharacter(data.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCharacter(); }, [fetchCharacter]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#6b6b80", fontFamily: "Georgia, serif" }}>Memuat...</span>
    </div>
  );

  const areas = getGatheringAreasBySkill(activeSkill);

  function getSkillLevel(skillId: string): number {
    return character?.skills?.find((s: any) => s.skillId === skillId)?.level ?? 1;
  }

  function getSkillExp(skillId: string): number {
    return character?.skills?.find((s: any) => s.skillId === skillId)?.experience ?? 0;
  }

  const activeSkillLevel = getSkillLevel(activeSkill);
  const activeSkillExp   = getSkillExp(activeSkill);

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#0a0a0f", color: "#e2e0d8", fontFamily: "Georgia, serif" }}>
      <GameSidebar character={character} />

      <main style={{ flex: 1, padding: "28px 24px", overflow: "auto", minWidth: 0 }}>
        <div className="game-mobile-spacer" style={{ height: 0 }} />

        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#f0ece0", margin: 0 }}>
            ⛏️ Gathering
          </h1>
          <p style={{ fontSize: "12px", color: "#6b6b80", margin: "3px 0 0" }}>
            Kumpulkan resource untuk crafting dan ritual
          </p>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>

          {/* Left panel */}
          <div style={{ width: "240px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Skill selector */}
            <div style={card}>
              <Label>Pilih Skill</Label>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {Object.entries(SKILL_INFO).map(([skillId, info]) => {
                  const lvl = getSkillLevel(skillId);
                  const isSelected = activeSkill === skillId;
                  const isCurrentlyGathering = isActive && currentSkill === skillId;
                  return (
                    <button
                      key={skillId}
                      onClick={() => setActiveSkill(skillId)}
                      style={{
                        textAlign: "left", padding: "10px 12px", borderRadius: "8px",
                        background: isSelected ? `${info.color}12` : "#0f0f1a",
                        outline: isSelected ? `1px solid ${info.color}44` : "1px solid #1e1e2e",
                        border: "none", cursor: "pointer", transition: "all 0.15s",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "13px", color: isSelected ? info.color : "#c4bfb0", fontFamily: "Georgia, serif" }}>
                          {info.icon} {info.label}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          {isCurrentlyGathering && (
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 1.5s infinite" }} />
                          )}
                          <span style={{ fontSize: "10px", fontWeight: "bold", color: info.color, background: `${info.color}15`, border: `1px solid ${info.color}33`, borderRadius: "5px", padding: "1px 6px" }}>
                            Lv {lvl}
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: "10px", color: "#4a4a5a", marginTop: "2px" }}>
                        {info.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active skill stats */}
            <div style={card}>
              <Label>{SKILL_INFO[activeSkill]?.icon} {SKILL_INFO[activeSkill]?.label} Stats</Label>
              <div style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                  <span style={{ color: "#6b6b80" }}>Level</span>
                  <span style={{ color: SKILL_INFO[activeSkill]?.color, fontWeight: "bold" }}>{activeSkillLevel}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
                  <span style={{ color: "#4a4a5a" }}>EXP</span>
                  <span style={{ color: "#4a4a5a" }}>{activeSkillExp.toLocaleString()}</span>
                </div>
                <div style={{ height: "4px", background: "#0f0f1a", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${Math.min(100, (activeSkillExp / Math.max(1, activeSkillExp + 100)) * 100)}%`,
                    background: SKILL_INFO[activeSkill]?.color,
                    borderRadius: "2px",
                  }} />
                </div>
              </div>

              {isActive && currentSkill === activeSkill && (
                <div style={{ borderTop: "1px solid #1e1e2e", paddingTop: "10px" }}>
                  {[
                    { label: "Tick berhasil", val: stats.totalGathered },
                    { label: "EXP sesi ini", val: `+${stats.expGained}` },
                  ].map((s) => (
                    <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: "11px" }}>
                      <span style={{ color: "#6b6b80" }}>{s.label}</span>
                      <span style={{ color: "#f59e0b", fontWeight: "bold" }}>{s.val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stop button */}
            {isActive && (
              <button
                onClick={stop}
                style={{
                  width: "100%", padding: "9px", borderRadius: "8px",
                  background: "rgba(220,38,38,0.08)", border: "1px solid #3a2020",
                  color: "#ef4444", fontSize: "13px", fontWeight: "bold",
                  fontFamily: "Georgia, serif", cursor: "pointer",
                }}
              >
                ⏹️ Hentikan Gathering
              </button>
            )}
          </div>

          {/* Center + Right */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Area grid */}
            <div style={card}>
              <Label>Area {SKILL_INFO[activeSkill]?.label}</Label>
              {areas.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px", color: "#4a4a5a", fontStyle: "italic", fontSize: "12px" }}>
                  Tidak ada area untuk skill ini.
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "10px" }}>
                  {areas.map((area) => {
                    const skillLvl = getSkillLevel(area.skill);
                    const canGather = skillLvl >= area.minSkillLevel;
                    const isThisActive = isActive && currentAreaId === area.id;
                    const color = SKILL_INFO[area.skill]?.color ?? "#6b6b80";

                    return (
                      <div
                        key={area.id}
                        style={{
                          background: isThisActive ? `${color}10` : "#0f0f1a",
                          border: `1px solid ${isThisActive ? color + "44" : canGather ? "#2a2a3a" : "#1e1e2e"}`,
                          borderRadius: "10px", padding: "12px",
                          opacity: canGather ? 1 : 0.5,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: "bold", color: isThisActive ? color : canGather ? "#f0ece0" : "#4a4a5a" }}>
                              {area.name}
                            </div>
                            <div style={{ fontSize: "10px", color: "#4a4a5a", marginTop: "1px" }}>
                              {area.zoneName} · Lv {area.minSkillLevel}+
                            </div>
                          </div>
                          {isThisActive && (
                            <span style={{ fontSize: "8px", color: "#22c55e", background: "rgba(34,197,94,0.15)", borderRadius: "3px", padding: "2px 6px" }}>
                              AKTIF
                            </span>
                          )}
                        </div>

                        <p style={{ fontSize: "11px", color: "#4a4a5a", margin: "0 0 8px", lineHeight: "1.4" }}>
                          {area.description}
                        </p>

                        {/* Resource list */}
                        <div style={{ marginBottom: "10px", display: "flex", flexWrap: "wrap", gap: "4px" }}>
                          {area.resources
                            .filter((r) => skillLvl >= r.minSkillLevel)
                            .map((r) => (
                              <span key={r.itemId} style={{
                                fontSize: "9px", padding: "1px 6px", borderRadius: "4px",
                                background: `${color}15`, border: `1px solid ${color}33`,
                                color: color,
                              }}>
                                {r.itemName}
                              </span>
                            ))}
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "10px", color: "#4a4a5a" }}>
                            +{area.expPerTick} EXP/tick
                          </span>
                          <button
                            onClick={() => isThisActive ? stop() : (canGather && start(area.id, area.name, area.skill, fetchCharacter))}
                            disabled={!canGather}
                            style={{
                              padding: "5px 12px", borderRadius: "6px",
                              background: isThisActive
                                ? "rgba(220,38,38,0.12)"
                                : canGather ? `${color}18` : "#1a1a28",
                              border: isThisActive
                                ? "1px solid rgba(220,38,38,0.3)"
                                : canGather ? `1px solid ${color}44` : "1px solid #1e1e2e",
                              color: isThisActive ? "#ef4444" : canGather ? color : "#4a4a5a",
                              fontSize: "11px", fontWeight: "bold",
                              fontFamily: "Georgia, serif",
                              cursor: canGather ? "pointer" : "not-allowed",
                            }}
                          >
                            {isThisActive ? "Stop" : canGather ? "Mulai" : `Lv ${area.minSkillLevel}`}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Gathering log */}
            <div style={{ ...card, padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#6b6b80", textTransform: "uppercase" }}>
                  Gathering Log
                  {currentAreaName && <span style={{ color: "#4a4a5a", fontWeight: "normal", marginLeft: "6px" }}>— {currentAreaName}</span>}
                </span>
                {isActive && currentSkill && (
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "10px", color: "#34d399" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34d399", display: "inline-block", animation: "pulse 1.5s infinite" }} />
                    Berjalan
                  </span>
                )}
              </div>

              <div style={{ height: "100px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "3px" }}>
                {logs.length === 0 ? (
                  <div style={{ color: "#3a3a4a", fontSize: "11px", fontStyle: "italic" }}>
                    Pilih area untuk mulai gathering...
                  </div>
                ) : (
                  logs.slice(0, 20).map((log) => (
                    <div key={log.id} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
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
  background: "#111118", border: "1px solid #2a2a3a",
  borderRadius: "12px", padding: "16px",
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: "10px", letterSpacing: "0.15em", color: "#6b6b80",
      textTransform: "uppercase", marginBottom: "10px",
      paddingBottom: "8px", borderBottom: "1px solid #1e1e2e",
    }}>{children}</div>
  );
}
