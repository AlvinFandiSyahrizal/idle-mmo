"use client";

import { useState, useEffect, useCallback } from "react";
import GameSidebar from "@/components/layout/GameSidebar";

const CATEGORY_LABELS: Record<string, string> = {
  combat: "⚔️ Combat",
  gathering: "⛏️ Gathering",
  production: "🔨 Production",
  support: "🙏 Support",
};

const CATEGORY_COLORS: Record<string, string> = {
  combat: "#ef4444",
  gathering: "#22c55e",
  production: "#f59e0b",
  support: "#818cf8",
};

const STAT_INFO = [
  {
    key: "str",
    label: "STR",
    color: "#ef4444",
    icon: "⚔️",
    desc: "Meningkatkan damage fisik",
  },
  {
    key: "agi",
    label: "AGI",
    color: "#22c55e",
    icon: "💨",
    desc: "Meningkatkan kecepatan dan crit",
  },
  {
    key: "int_stat",
    label: "INT",
    color: "#818cf8",
    icon: "🔮",
    desc: "+1 INT, +5 MP Max",
  },
  {
    key: "vit",
    label: "VIT",
    color: "#eab308",
    icon: "❤️",
    desc: "+1 VIT, +15 HP Max",
  },
];

export default function SkillsPage() {
  const [character, setCharacter] = useState<any>(null);
  const [skillData, setSkillData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("combat");
  const [spending, setSpending] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [confirmStat, setConfirmStat] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const [charRes, skillRes] = await Promise.all([
      fetch("/api/character"),
      fetch("/api/skills"),
    ]);
    const charData = await charRes.json();
    const skillDataRes = await skillRes.json();
    if (charData.success) setCharacter(charData.data);
    if (skillDataRes.success) setSkillData(skillDataRes.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function showFeedback(msg: string, ok: boolean) {
    setFeedback({ msg, ok });
    setTimeout(() => setFeedback(null), 2000);
  }

  async function spendPoint(stat: string) {
    setConfirmStat(null);
    setSpending(stat);
    const res = await fetch("/api/skills/spend-point", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stat }),
    });
    const data = await res.json();
    setSpending(null);
    if (data.success) {
      const label = stat.replace("_stat", "").toUpperCase();
      showFeedback(`+1 ${label}`, true);
      fetchData();
    } else {
      showFeedback(data.error, false);
    }
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#6b6b80", fontFamily: "Georgia, serif" }}>Memuat...</span>
    </div>
  );

  const skillsByCategory = skillData?.skills?.reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {}) ?? {};

  const activeSkills = skillsByCategory[activeCategory] ?? [];

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#0a0a0f", color: "#e2e0d8", fontFamily: "Georgia, serif" }}>
      <GameSidebar character={character} />

      <main style={{ flex: 1, padding: "28px 24px", overflow: "auto", minWidth: 0 }}>
        <div className="game-mobile-spacer" style={{ height: 0 }} />

        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#f0ece0", margin: 0 }}>
            📊 Skills
          </h1>
          <p style={{ fontSize: "12px", color: "#6b6b80", margin: "3px 0 0" }}>
            Leveling skill untuk membuka konten dan meningkatkan stat
          </p>
        </div>

        {/* Feedback toast */}
        {feedback && (
          <div style={{
            position: "fixed", top: "20px", right: "20px", zIndex: 100,
            background: feedback.ok ? "#052e16" : "#1a0a0a",
            border: `1px solid ${feedback.ok ? "#166534" : "#7f1d1d"}`,
            borderRadius: "10px", padding: "10px 16px",
            color: feedback.ok ? "#4ade80" : "#ef4444",
            fontSize: "13px", fontFamily: "Georgia, serif",
          }}>
            {feedback.msg}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px" }}>

          {/* Left: Skills */}
          <div>
            {/* Category tabs */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
              {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "6px 16px", borderRadius: "20px",
                    background: activeCategory === cat
                      ? `rgba(${cat === "combat" ? "239,68,68" : cat === "gathering" ? "34,197,94" : cat === "production" ? "245,158,11" : "129,140,248"},0.15)`
                      : "#111118",
                    border: activeCategory === cat
                      ? `1px solid ${CATEGORY_COLORS[cat]}44`
                      : "1px solid #2a2a3a",
                    color: activeCategory === cat ? CATEGORY_COLORS[cat] : "#6b6b80",
                    fontSize: "12px", fontFamily: "Georgia, serif", cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Skill list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {activeSkills.map((skill: any) => {
                const color = CATEGORY_COLORS[skill.category];
                const isMax = skill.level >= skill.maxLevel;
                return (
                  <div
                    key={skill.skillId}
                    style={{
                      background: "#111118", border: "1px solid #2a2a3a",
                      borderRadius: "12px", padding: "14px 16px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {/* Icon + level badge */}
                      <div style={{
                        width: "44px", height: "44px", flexShrink: 0,
                        background: "#0f0f1a", border: `1px solid ${color}33`,
                        borderRadius: "10px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "22px",
                      }}>
                        {skill.icon}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontSize: "14px", fontWeight: "bold", color: "#f0ece0" }}>
                            {skill.name}
                          </span>
                          <span style={{
                            fontSize: "12px", fontWeight: "bold",
                            color: isMax ? "#f59e0b" : color,
                            background: isMax ? "rgba(245,158,11,0.1)" : `rgba(${color.replace("#", "").match(/.{2}/g)?.map(h => parseInt(h, 16)).join(",")},0.1)`,
                            border: `1px solid ${isMax ? "rgba(245,158,11,0.3)" : color + "44"}`,
                            borderRadius: "6px", padding: "1px 10px",
                          }}>
                            {isMax ? "MAX" : `Lv ${skill.level}`}
                          </span>
                        </div>

                        <p style={{ fontSize: "11px", color: "#6b6b80", margin: "0 0 8px", lineHeight: "1.4" }}>
                          {skill.description}
                        </p>

                        {/* EXP bar */}
                        {!isMax && (
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#4a4a5a", marginBottom: "3px" }}>
                              <span>{skill.experience.toLocaleString()} / {skill.expToNext.toLocaleString()} exp</span>
                              <span>{skill.expPct}%</span>
                            </div>
                            <div style={{ height: "4px", background: "#1a1a28", borderRadius: "2px", overflow: "hidden" }}>
                              <div style={{
                                height: "100%",
                                width: `${skill.expPct}%`,
                                background: color,
                                borderRadius: "2px",
                                transition: "width 0.5s",
                              }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Unlock hints */}
                    {skill.skillId === "excavation" && (
                      <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #1e1e2e" }}>
                        <div style={{ fontSize: "10px", color: "#4a4a5a", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                          {[
                            { lv: 10, text: "Unlock Zona Gurun Timur" },
                            { lv: 30, text: "Unlock Makam Tersembunyi" },
                            { lv: 60, text: "Artifact Langka" },
                          ].map((u) => (
                            <span key={u.lv} style={{ color: skill.level >= u.lv ? "#4ade80" : "#4a4a5a" }}>
                              {skill.level >= u.lv ? "✓" : `Lv ${u.lv}`} {u.text}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Attribute points */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Attribute points card */}
            <div style={{
              background: "#111118", border: "1px solid #2a2a3a",
              borderRadius: "14px", padding: "18px",
            }}>
              <div style={{
                fontSize: "10px", letterSpacing: "0.15em", color: "#6b6b80",
                textTransform: "uppercase", marginBottom: "12px",
                paddingBottom: "8px", borderBottom: "1px solid #1e1e2e",
              }}>
                Attribute Points
              </div>

              {/* Reset button */}
                <div style={{
                  background: "#111118", border: "1px solid #2a2a3a",
                  borderRadius: "14px", padding: "14px 18px",
                }}>
                  <div style={{ fontSize: "11px", color: "#6b6b80", marginBottom: "8px" }}>
                    Salah distribusi stat? Reset semua attribute points.
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <span style={{ fontSize: "12px", color: "#4a4a5a" }}>Biaya reset</span>
                    <span style={{ fontSize: "13px", fontWeight: "bold", color: "#f59e0b" }}>5,000 Gold</span>
                  </div>
                  <button
                    onClick={async () => {
                      if (!confirm("Reset semua attribute points? Biaya 5,000 Gold.")) return;
                      const res = await fetch("/api/skills/reset-points", { method: "POST" });
                      const data = await res.json();
                      if (data.success) {
                        showFeedback(`Reset berhasil! +${data.data.refunded} points dikembalikan`, true);
                        fetchData();
                      } else {
                        showFeedback(data.error, false);
                      }
                    }}
                    style={{
                      width: "100%", padding: "8px", borderRadius: "8px",
                      background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)",
                      color: "#ef4444", fontSize: "12px",
                      fontFamily: "Georgia, serif", cursor: "pointer",
                    }}
                  >
                    🔄 Reset Attribute Points
                  </button>
                </div>

              {/* Points available */}
              <div style={{
                background: skillData?.attributePoints > 0
                  ? "rgba(245,158,11,0.08)"
                  : "#0f0f1a",
                border: `1px solid ${skillData?.attributePoints > 0 ? "rgba(245,158,11,0.25)" : "#1e1e2e"}`,
                borderRadius: "10px", padding: "14px", textAlign: "center", marginBottom: "16px",
              }}>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: skillData?.attributePoints > 0 ? "#f59e0b" : "#4a4a5a" }}>
                  {skillData?.attributePoints ?? 0}
                </div>
                <div style={{ fontSize: "11px", color: "#6b6b80", marginTop: "2px" }}>
                  Point tersedia
                </div>
                {skillData?.attributePoints > 0 && (
                  <div style={{ fontSize: "10px", color: "#f59e0b", marginTop: "6px", fontStyle: "italic" }}>
                    Klik stat di bawah untuk upgrade!
                  </div>
                )}
              </div>

              {/* Stat buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {STAT_INFO.map((stat) => {
                  const currentVal = skillData?.[stat.key] ?? 0;
                  const canSpend = (skillData?.attributePoints ?? 0) > 0;
                  const isSpending = spending === stat.key;
                  return (
                    <div
                      key={stat.key}
                      style={{
                        background: "#0f0f1a", border: "1px solid #2a2a3a",
                        borderRadius: "10px", padding: "10px 12px",
                        display: "flex", alignItems: "center", gap: "10px",
                      }}
                    >
                      <span style={{ fontSize: "18px" }}>{stat.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1px" }}>
                          <span style={{ fontSize: "13px", fontWeight: "bold", color: stat.color }}>
                            {stat.label}
                          </span>
                          <span style={{ fontSize: "16px", fontWeight: "bold", color: "#f0ece0" }}>
                            {currentVal}
                          </span>
                        </div>
                        <div style={{ fontSize: "10px", color: "#4a4a5a" }}>{stat.desc}</div>
                      </div>
                        <button
                          onClick={() => canSpend ? setConfirmStat(stat.key) : null}
                          disabled={!canSpend || isSpending}
                          style={{
                            width: "28px", height: "28px", borderRadius: "7px",
                            background: canSpend ? `${stat.color}22` : "#1a1a28",
                            border: canSpend ? `1px solid ${stat.color}44` : "1px solid #2a2a3a",
                            color: canSpend ? stat.color : "#4a4a5a",
                            fontSize: "16px", cursor: canSpend ? "pointer" : "not-allowed",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {isSpending ? "…" : "+"}
                        </button>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: "12px", padding: "10px", background: "#0f0f1a", borderRadius: "8px" }}>
                <div style={{ fontSize: "10px", color: "#4a4a5a", lineHeight: "1.6" }}>
                  <div>Point didapat dari:</div>
                  <div>• Selesaikan quest</div>
                  <div>• Milestone skill (tiap Lv 10)</div>
                  <div>• Kalahkan Zone Boss</div>
                  <div>• Ascension</div>
                </div>
              </div>
            </div>

            {/* Current stats summary */}
            <div style={{
              background: "#111118", border: "1px solid #2a2a3a",
              borderRadius: "14px", padding: "18px",
            }}>
              <div style={{
                fontSize: "10px", letterSpacing: "0.15em", color: "#6b6b80",
                textTransform: "uppercase", marginBottom: "12px",
                paddingBottom: "8px", borderBottom: "1px solid #1e1e2e",
              }}>
                Stat Saat Ini
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                {[
                  { label: "HP", val: `${skillData?.hp}/${skillData?.maxHp}`, color: "#ef4444" },
                  { label: "MP", val: `${skillData?.mp}/${skillData?.maxMp}`, color: "#3b82f6" },
                  { label: "STR", val: skillData?.str, color: "#ef4444" },
                  { label: "AGI", val: skillData?.agi, color: "#22c55e" },
                  { label: "INT", val: skillData?.int_stat, color: "#818cf8" },
                  { label: "VIT", val: skillData?.vit, color: "#eab308" },
                ].map((s) => (
                  <div key={s.label} style={{
                    background: "#0f0f1a", border: "1px solid #1e1e2e",
                    borderRadius: "8px", padding: "8px 10px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <span style={{ fontSize: "11px", color: "#6b6b80" }}>{s.label}</span>
                    <span style={{ fontSize: "13px", fontWeight: "bold", color: s.color }}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Confirm stat modal */}
        {confirmStat && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Georgia, serif", padding: "20px",
          }}>
            <div style={{
              background: "#111118", border: "1px solid #2a2a3a",
              borderRadius: "16px", padding: "24px",
              width: "100%", maxWidth: "320px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "28px", marginBottom: "10px" }}>
                {STAT_INFO.find((s) => s.key === confirmStat)?.icon}
              </div>
              <h3 style={{ color: "#f0ece0", fontSize: "16px", margin: "0 0 8px" }}>
                Tambah +1 {confirmStat.replace("_stat", "").toUpperCase()}?
              </h3>
              <p style={{ color: "#6b6b80", fontSize: "12px", margin: "0 0 6px", lineHeight: "1.5" }}>
                {STAT_INFO.find((s) => s.key === confirmStat)?.desc}
              </p>
              <p style={{ color: "#4a4a5a", fontSize: "11px", margin: "0 0 20px" }}>
                Sisa point: {skillData?.attributePoints ?? 0}
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setConfirmStat(null)}
                  style={{
                    flex: 1, padding: "9px", borderRadius: "8px",
                    background: "transparent", border: "1px solid #2a2a3a",
                    color: "#6b6b80", fontSize: "13px",
                    fontFamily: "Georgia, serif", cursor: "pointer",
                  }}
                >
                  Batal
                </button>
                <button
                  onClick={() => spendPoint(confirmStat)}
                  style={{
                    flex: 2, padding: "9px", borderRadius: "8px",
                    background: "#f59e0b", border: "none",
                    color: "#0a0a0f", fontSize: "13px", fontWeight: "bold",
                    fontFamily: "Georgia, serif", cursor: "pointer",
                  }}
                >
                  Konfirmasi
                </button>
              </div>
            </div>
          </div>
        )}

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