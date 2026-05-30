"use client";

import { CHARACTER_CLASSES } from "@/data/characters";
import { SKILLS } from "@/data/skills";
import GameSidebar from "@/components/layout/GameSidebar";
import NotificationBell from "@/components/game/NotificationBell";
import { useRegen } from "@/hooks/useRegen";
import { useEffect, useState } from "react";
import { useAchievementCheck } from "@/hooks/useAchievements";

interface Props {
  character: any;
  onRefresh: () => void;
}

export default function Dashboard({ character, onRefresh }: Props) {
  const classData = CHARACTER_CLASSES.find((c) => c.id === character.classId);
  const hpPct = Math.round((character.hp / character.maxHp) * 100);
  const mpPct = Math.round((character.mp / character.maxMp) * 100);
  const alignPct = ((character.alignment + 100) / 200) * 100;

  const alignLabel =
    character.alignment <= -60 ? "Mesir Sejati"
    : character.alignment <= -30 ? "Condong Mesir"
    : character.alignment >= 60 ? "Mesopotamia Sejati"
    : character.alignment >= 30 ? "Condong Mesopotamia"
    : "Netral";

  const combatSkills = character.skills?.filter((s: any) =>
    ["melee", "ranged", "magic", "defense"].includes(s.skillId)
  ) ?? [];

  const gatherSkills = character.skills?.filter((s: any) =>
    ["excavation", "inscription", "herbalism", "fishing"].includes(s.skillId)
  ) ?? [];

  const [streakInfo, setStreakInfo] = useState<any>(null);

  useAchievementCheck();

  useEffect(() => {
    fetch("/api/character/login-streak")
      .then((r) => r.json())
      .then((d) => { if (d.success) setStreakInfo(d.data); });
  }, []);
  

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#0a0a0f", color: "#e2e0d8", fontFamily: "Georgia, serif" }}>
      <GameSidebar character={character} />

      <main style={{ flex: 1, overflow: "auto", padding: "28px 24px", minWidth: 0 }}>
        {/* Mobile spacer */}
        <div style={{ height: "0px" }} className="game-mobile-spacer" />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#f0ece0", margin: 0 }}>
              Dashboard
            </h1>
            <p style={{ fontSize: "12px", color: "#6b6b80", margin: "3px 0 0" }}>
              Selamat datang, {character.name}
            </p>
          </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              <NotificationBell />
            {[
              { icon: "💰", val: character.gold.toLocaleString(), label: "Gold" },
              { icon: "🔮", val: character.soulShard, label: "Shard" },
            ].map((c) => (
              <div key={c.label} style={{
                background: "#111118", border: "1px solid #2a2a3a",
                borderRadius: "10px", padding: "8px 14px",
                display: "flex", alignItems: "center", gap: "7px",
              }}>
                <span style={{ fontSize: "16px" }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "bold", color: "#f59e0b" }}>{c.val}</div>
                  <div style={{ fontSize: "10px", color: "#6b6b80" }}>{c.label}</div>
                </div>
              </div>
            ))}
                {/* Streak badge */}
                  {streakInfo && (
                    <div style={{
                      background: streakInfo.streak >= 7
                        ? "rgba(245,158,11,0.1)"
                        : "rgba(34,197,94,0.08)",
                      border: `1px solid ${streakInfo.streak >= 7 ? "rgba(245,158,11,0.25)" : "rgba(34,197,94,0.2)"}`,
                      borderRadius: "10px", padding: "6px 12px",
                      display: "flex", alignItems: "center", gap: "6px",
                    }}>
                      <span style={{ fontSize: "14px" }}>
                        {streakInfo.streak >= 7 ? "⭐" : streakInfo.streak >= 3 ? "🔥" : "✨"}
                      </span>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: "bold", color: streakInfo.streak >= 7 ? "#f59e0b" : "#4ade80" }}>
                          {streakInfo.streak} hari
                        </div>
                        <div style={{ fontSize: "9px", color: "#4a4a5a" }}>
                          Login streak{streakInfo.claimedToday ? " ✓" : ""}
                        </div>
                      </div>
                      {streakInfo.nextMilestone && (
                        <div style={{ fontSize: "9px", color: "#4a4a5a", paddingLeft: "6px", borderLeft: "1px solid #1e1e2e" }}>
                          Next: {streakInfo.nextMilestone} hari<br />
                          <span style={{ color: "#f59e0b" }}>+{streakInfo.nextMilestoneReward?.gold}g</span>
                        </div>
                      )}
                    </div>
                  )}
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>

          {/* Statistik */}
          <div style={cardStyle}>
            <SectionTitle>Statistik Karakter</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px" }}>
              {[
                { label: "STR", val: character.str, color: "#ef4444" },
                { label: "AGI", val: character.agi, color: "#22c55e" },
                { label: "INT", val: character.int_stat, color: "#818cf8" },
                { label: "VIT", val: character.vit, color: "#eab308" },
              ].map((s) => (
                <div key={s.label} style={{
                  background: "#0f0f1a", border: "1px solid #2a2a3a",
                  borderRadius: "8px", padding: "10px 12px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{ fontSize: "12px", color: "#6b6b80" }}>{s.label}</span>
                  <span style={{ fontSize: "16px", fontWeight: "bold", color: s.color }}>{s.val}</span>
                </div>
              ))}
            </div>

            {[
              { label: "HP", val: character.hp, max: character.maxHp, pct: hpPct, color: "#ef4444" },
              { label: "MP", val: character.mp, max: character.maxMp, pct: mpPct, color: "#3b82f6" },
            ].map((b) => (
              <div key={b.label} style={{ marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6b6b80", marginBottom: "4px" }}>
                  <span>{b.label}</span>
                  <span style={{ color: b.color }}>{b.val}/{b.max}</span>
                </div>
                <div style={{ height: "5px", background: "#1a1a28", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${b.pct}%`, background: b.color, borderRadius: "3px" }} />
                </div>
              </div>
            ))}

            {/* Alignment */}
            <div style={{ background: "#0f0f1a", border: "1px solid #2a2a3a", borderRadius: "8px", padding: "10px", marginTop: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginBottom: "8px" }}>
                <span style={{ color: "#f59e0b" }}>Mesir</span>
                <span style={{ color: "#9ca3af", fontSize: "9px" }}>{alignLabel}</span>
                <span style={{ color: "#60a5fa" }}>Mesopotamia</span>
              </div>
              <div style={{ height: "6px", background: "linear-gradient(90deg,#d97706,#1e3a8a)", borderRadius: "3px", opacity: 0.4, position: "relative" }}>
                <div style={{
                  position: "absolute", top: "50%", left: `${alignPct}%`,
                  transform: "translate(-50%,-50%)",
                  width: "12px", height: "12px", borderRadius: "50%",
                  background: "#e2e0d8", border: "2px solid #0a0a0f",
                  boxShadow: "0 0 6px rgba(255,255,255,0.4)",
                }} />
              </div>
            </div>
          </div>

          {/* Combat Skills */}
          <div style={cardStyle}>
            <SectionTitle>Combat Skills</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {combatSkills.map((skill: any) => {
                const def = SKILLS.find((s) => s.id === skill.skillId);
                const pct = Math.min(100, (skill.experience / 1000) * 100);
                return (
                  <div key={skill.skillId}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "13px", color: "#c4bfb0" }}>{def?.icon} {def?.name}</span>
                      <span style={{
                        fontSize: "11px", fontWeight: "bold", color: "#f59e0b",
                        background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
                        borderRadius: "5px", padding: "1px 7px",
                      }}>Lv {skill.level}</span>
                    </div>
                    <div style={{ height: "4px", background: "#1a1a28", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "#d97706", borderRadius: "2px" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gathering Skills */}
          <div style={cardStyle}>
            <SectionTitle>Gathering Skills</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {gatherSkills.map((skill: any) => {
                const def = SKILLS.find((s) => s.id === skill.skillId);
                const pct = Math.min(100, (skill.experience / 1000) * 100);
                return (
                  <div key={skill.skillId}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "13px", color: "#c4bfb0" }}>{def?.icon} {def?.name}</span>
                      <span style={{
                        fontSize: "11px", fontWeight: "bold", color: "#22c55e",
                        background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)",
                        borderRadius: "5px", padding: "1px 7px",
                      }}>Lv {skill.level}</span>
                    </div>
                    <div style={{ height: "4px", background: "#1a1a28", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "#16a34a", borderRadius: "2px" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Passive + Currencies */}
          <div style={cardStyle}>
            <SectionTitle>Passive & Mata Uang</SectionTitle>
            {classData && (
              <div style={{
                background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)",
                borderRadius: "8px", padding: "12px", marginBottom: "14px",
              }}>
                <div style={{ fontSize: "12px", fontWeight: "bold", color: "#f59e0b", marginBottom: "4px" }}>
                  ✦ {classData.passive}
                </div>
                <div style={{ fontSize: "11px", color: "#8a8a9a", lineHeight: "1.6" }}>
                  {classData.passiveDescription}
                </div>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {[
                { icon: "💰", label: "Gold", val: character.gold.toLocaleString(), color: "#f59e0b" },
                { icon: "🔮", label: "Soul Shard", val: character.soulShard, color: "#818cf8" },
                { icon: "⚗️", label: "Offering", val: character.offering, color: "#34d399" },
                { icon: "🏛️", label: "Guild Token", val: character.guildToken, color: "#60a5fa" },
              ].map((c) => (
                <div key={c.label} style={{
                  background: "#0f0f1a", border: "1px solid #2a2a3a",
                  borderRadius: "8px", padding: "10px", textAlign: "center",
                }}>
                  <div style={{ fontSize: "20px", marginBottom: "4px" }}>{c.icon}</div>
                  <div style={{ fontSize: "15px", fontWeight: "bold", color: c.color }}>{c.val}</div>
                  <div style={{ fontSize: "9px", color: "#6b6b80", marginTop: "2px" }}>{c.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <style>{`
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

const cardStyle: React.CSSProperties = {
  background: "#111118",
  border: "1px solid #2a2a3a",
  borderRadius: "14px",
  padding: "18px",
};


function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: "10px", letterSpacing: "0.15em", color: "#6b6b80",
      textTransform: "uppercase", marginBottom: "12px",
      paddingBottom: "8px", borderBottom: "1px solid #1e1e2e",
    }}>
      {children}
    </div>
  );
}