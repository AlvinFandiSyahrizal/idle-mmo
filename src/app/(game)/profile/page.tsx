"use client";

import { useState, useEffect, useCallback } from "react";
import GameSidebar from "@/components/layout/GameSidebar";
import { SKILLS } from "@/data/skills";

const CATEGORY_COLORS: Record<string, string> = {
  combat: "#ef4444",
  gathering: "#22c55e",
  production: "#f59e0b",
  support: "#818cf8",
};

const ALIGNMENT_STYLE: Record<string, { color: string; label: string }> = {
  "Mesir Sejati":          { color: "#f59e0b", label: "Mesir Sejati" },
  "Condong Mesir":         { color: "#d97706", label: "Condong Mesir" },
  "Netral":                { color: "#6b7280", label: "Netral" },
  "Condong Mesopotamia":   { color: "#60a5fa", label: "Condong Mesopotamia" },
  "Mesopotamia Sejati":    { color: "#3b82f6", label: "Mesopotamia Sejati" },
};

export default function ProfilePage() {
  const [character, setCharacter] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSkillTab, setActiveSkillTab] = useState("combat");

  const fetchData = useCallback(async () => {
    const [charRes, profileRes] = await Promise.all([
      fetch("/api/character"),
      fetch("/api/character/profile"),
    ]);
    const charData = await charRes.json();
    const profileData = await profileRes.json();
    if (charData.success) setCharacter(charData.data);
    if (profileData.success) setProfile(profileData.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#6b6b80", fontFamily: "Georgia, serif" }}>Memuat...</span>
    </div>
  );

  if (!profile) return null;

  const { character: char, skills, stats, username, joinedAt } = profile;
  const alignPct = ((char.alignment + 100) / 200) * 100;
  const alignStyle = ALIGNMENT_STYLE[char.alignmentLabel] ?? { color: "#6b7280", label: char.alignmentLabel };

  const skillsByCategory = skills.reduce((acc: any, s: any) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const joinDate = new Date(joinedAt).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#0a0a0f", color: "#e2e0d8", fontFamily: "Georgia, serif" }}>
      <GameSidebar character={character} />

      <main style={{ flex: 1, padding: "28px 24px", overflow: "auto", minWidth: 0 }}>
        <div className="game-mobile-spacer" style={{ height: 0 }} />

        <div style={{ maxWidth: "900px" }}>

          {/* Profile hero card */}
          <div style={{
            background: "linear-gradient(135deg, #111118 0%, #0d0d18 100%)",
            border: "1px solid #2a2a3a",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "20px",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* BG decoration */}
            <div style={{
              position: "absolute", top: "-40px", right: "-40px",
              width: "200px", height: "200px", borderRadius: "50%",
              background: "rgba(245,158,11,0.04)",
              pointerEvents: "none",
            }} />

            <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", flexWrap: "wrap" }}>
              {/* Avatar */}
              <div style={{
                width: "80px", height: "80px", borderRadius: "20px",
                background: "#1a1a28", border: "2px solid #2e2e44",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "42px", flexShrink: 0,
              }}>
                {char.classIcon}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: "200px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px", flexWrap: "wrap" }}>
                  <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f0ece0", margin: 0 }}>
                    {char.name}
                  </h1>
                  <span style={{
                    fontSize: "11px", padding: "2px 10px", borderRadius: "10px",
                    background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)",
                    color: "#f59e0b",
                  }}>
                    Lv {char.level}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#6b6b80", marginBottom: "10px" }}>
                  @{username} · {char.className} · Bergabung {joinDate}
                </div>

                {/* Quick stats */}
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  {[
                    { label: "Total Skill Levels", val: stats.totalSkillLevels },
                    { label: "Achievements", val: stats.achievementCount },
                    { label: "Ascension", val: char.ascensionCount },
                    { label: "Gold", val: char.gold.toLocaleString() },
                  ].map((s) => (
                    <div key={s.label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "18px", fontWeight: "bold", color: "#f59e0b" }}>{s.val}</div>
                      <div style={{ fontSize: "10px", color: "#4a4a5a" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alignment badge */}
              <div style={{
                background: `${alignStyle.color}11`,
                border: `1px solid ${alignStyle.color}33`,
                borderRadius: "12px", padding: "12px 16px",
                textAlign: "center", flexShrink: 0,
              }}>
                <div style={{ fontSize: "11px", color: "#4a4a5a", marginBottom: "4px" }}>Alignment</div>
                <div style={{ fontSize: "13px", fontWeight: "bold", color: alignStyle.color }}>
                  {alignStyle.label}
                </div>
                <div style={{ marginTop: "8px", width: "80px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "8px", color: "#4a4a5a", marginBottom: "3px" }}>
                    <span style={{ color: "#f59e0b" }}>M</span>
                    <span style={{ color: "#60a5fa" }}>M</span>
                  </div>
                  <div style={{ height: "5px", background: "linear-gradient(90deg,#d97706,#1e3a8a)", borderRadius: "3px", opacity: 0.4, position: "relative" }}>
                    <div style={{
                      position: "absolute", top: "50%", left: `${alignPct}%`,
                      transform: "translate(-50%,-50%)",
                      width: "9px", height: "9px", borderRadius: "50%",
                      background: "#e2e0d8", border: "1px solid #0a0a0f",
                    }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
              gap: "8px", marginTop: "20px", paddingTop: "20px",
              borderTop: "1px solid #1e1e2e",
            }}>
              {[
                { label: "HP", val: `${char.hp}/${char.maxHp}`, color: "#ef4444" },
                { label: "MP", val: `${char.mp}/${char.maxMp}`, color: "#3b82f6" },
                { label: "STR", val: char.str, color: "#ef4444" },
                { label: "AGI", val: char.agi, color: "#22c55e" },
                { label: "INT", val: char.int_stat, color: "#818cf8" },
                { label: "VIT", val: char.vit, color: "#eab308" },
                { label: "Soul Shard", val: char.soulShard, color: "#818cf8" },
                { label: "Offering", val: char.offering, color: "#34d399" },
              ].map((s) => (
                <div key={s.label} style={{
                  background: "#0f0f1a", border: "1px solid #1e1e2e",
                  borderRadius: "8px", padding: "8px 10px", textAlign: "center",
                }}>
                  <div style={{ fontSize: "14px", fontWeight: "bold", color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: "9px", color: "#4a4a5a", marginTop: "2px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills section */}
          <div style={{
            background: "#111118", border: "1px solid #2a2a3a",
            borderRadius: "16px", padding: "20px",
            marginBottom: "20px",
          }}>
            <h2 style={{ fontSize: "14px", fontWeight: "bold", color: "#f0ece0", margin: "0 0 14px" }}>
              📊 Skills
            </h2>

            {/* Category tabs */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "14px", flexWrap: "wrap" }}>
              {["combat", "gathering", "production", "support"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveSkillTab(cat)}
                  style={{
                    padding: "4px 14px", borderRadius: "20px",
                    background: activeSkillTab === cat ? `${CATEGORY_COLORS[cat]}22` : "#0f0f1a",
                    border: activeSkillTab === cat ? `1px solid ${CATEGORY_COLORS[cat]}44` : "1px solid #1e1e2e",
                    color: activeSkillTab === cat ? CATEGORY_COLORS[cat] : "#4a4a5a",
                    fontSize: "11px", fontFamily: "Georgia, serif", cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "8px" }}>
              {(skillsByCategory[activeSkillTab] ?? []).map((skill: any) => {
                const color = CATEGORY_COLORS[skill.category] ?? "#6b6b80";
                const isMax = skill.level >= 99;
                return (
                  <div key={skill.skillId} style={{
                    background: "#0f0f1a", border: "1px solid #1e1e2e",
                    borderRadius: "10px", padding: "10px 12px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "13px", color: "#c4bfb0" }}>
                        {skill.icon} {skill.name}
                      </span>
                      <span style={{
                        fontSize: "11px", fontWeight: "bold",
                        color: isMax ? "#f59e0b" : color,
                        background: `${color}11`, border: `1px solid ${color}33`,
                        borderRadius: "5px", padding: "1px 7px",
                      }}>
                        {isMax ? "MAX" : `Lv ${skill.level}`}
                      </span>
                    </div>
                    <div style={{ height: "3px", background: "#1a1a28", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${(skill.level / 99) * 100}%`,
                        background: color, borderRadius: "2px",
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Passive info */}
          <div style={{
            background: "#111118", border: "1px solid #2a2a3a",
            borderRadius: "16px", padding: "20px",
          }}>
            <h2 style={{ fontSize: "14px", fontWeight: "bold", color: "#f0ece0", margin: "0 0 12px" }}>
              ✦ Passive Ability
            </h2>
            <div style={{
              background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)",
              borderRadius: "10px", padding: "14px",
            }}>
              <div style={{ fontSize: "13px", fontWeight: "bold", color: "#f59e0b", marginBottom: "6px" }}>
                {char.classIcon} {char.className}
              </div>
              <div style={{ fontSize: "12px", color: "#6b6b80", lineHeight: "1.6" }}>
                Karakter kelas {char.className} dengan alignment {char.alignmentLabel}.
                Total {stats.totalSkillLevels} skill levels dikumpulkan.
                Skill tertinggi: {stats.highestSkill.icon} {stats.highestSkill.name} Lv {stats.highestSkill.level}.
              </div>
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