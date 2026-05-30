"use client";

import { useState, useEffect, useCallback } from "react";
import GameSidebar from "@/components/layout/GameSidebar";
import { ACHIEVEMENT_CATEGORIES } from "@/data/achievements";

export default function AchievementsPage() {
  const [character, setCharacter]     = useState<any>(null);
  const [data, setData]               = useState<any>(null);
  const [loading, setLoading]         = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showUnlocked, setShowUnlocked]     = useState<"all" | "unlocked" | "locked">("all");

  const fetchData = useCallback(async () => {
    const [charRes, achRes] = await Promise.all([
      fetch("/api/character"),
      fetch("/api/achievements"),
    ]);
    const charData = await charRes.json();
    const achData  = await achRes.json();
    if (charData.success) setCharacter(charData.data);
    if (achData.success)  setData(achData.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#6b6b80", fontFamily: "Georgia, serif" }}>Memuat...</span>
    </div>
  );

  const allAchievements = data?.achievements ?? [];

  const filtered = allAchievements
    .filter((a: any) => activeCategory === "all" || a.category === activeCategory)
    .filter((a: any) => {
      if (showUnlocked === "unlocked") return a.unlocked;
      if (showUnlocked === "locked")   return !a.unlocked;
      return true;
    });

  const unlockedCount = allAchievements.filter((a: any) => a.unlocked).length;
  const totalCount    = data?.total ?? 0;
  const pct           = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const CATEGORY_COLOR: Record<string, string> = Object.fromEntries(
    ACHIEVEMENT_CATEGORIES.map((c) => [c.id, c.color])
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#0a0a0f", color: "#e2e0d8", fontFamily: "Georgia, serif" }}>
      <GameSidebar character={character} />

      <main style={{ flex: 1, padding: "28px 24px", overflow: "auto", minWidth: 0 }}>
        <div className="game-mobile-spacer" style={{ height: 0 }} />

        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#f0ece0", margin: 0 }}>
            🏆 Achievements
          </h1>
          <p style={{ fontSize: "12px", color: "#6b6b80", margin: "3px 0 0" }}>
            {unlockedCount} / {totalCount} unlocked
          </p>
        </div>

        {/* Progress bar */}
        <div style={{
          background: "#111118", border: "1px solid #2a2a3a",
          borderRadius: "14px", padding: "16px 20px", marginBottom: "20px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ fontSize: "13px", color: "#c4bfb0" }}>Total Progress</span>
            <span style={{ fontSize: "14px", fontWeight: "bold", color: "#f59e0b" }}>{pct}%</span>
          </div>
          <div style={{ height: "8px", background: "#0f0f1a", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${pct}%`,
              background: "linear-gradient(90deg,#d97706,#f59e0b)",
              borderRadius: "4px", transition: "width 0.8s ease",
            }} />
          </div>
          {/* Category mini bars */}
          <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
            {ACHIEVEMENT_CATEGORIES.map((cat) => {
              const catAchs    = allAchievements.filter((a: any) => a.category === cat.id);
              const catUnlocked = catAchs.filter((a: any) => a.unlocked).length;
              const catPct     = catAchs.length > 0 ? Math.round((catUnlocked / catAchs.length) * 100) : 0;
              return (
                <div key={cat.id} style={{ flex: 1, minWidth: "80px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#4a4a5a", marginBottom: "3px" }}>
                    <span>{cat.label.split(" ")[1]}</span>
                    <span>{catUnlocked}/{catAchs.length}</span>
                  </div>
                  <div style={{ height: "3px", background: "#1a1a28", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${catPct}%`, background: cat.color, borderRadius: "2px" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveCategory("all")}
            style={{
              padding: "5px 14px", borderRadius: "20px", cursor: "pointer",
              background: activeCategory === "all" ? "rgba(245,158,11,0.15)" : "#111118",
              border: activeCategory === "all" ? "1px solid rgba(245,158,11,0.4)" : "1px solid #2a2a3a",
              color: activeCategory === "all" ? "#f59e0b" : "#6b6b80",
              fontSize: "12px", fontFamily: "Georgia, serif",
            }}
          >
            Semua
          </button>
          {ACHIEVEMENT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: "5px 14px", borderRadius: "20px", cursor: "pointer",
                background: activeCategory === cat.id ? `${cat.color}22` : "#111118",
                border: activeCategory === cat.id ? `1px solid ${cat.color}44` : "1px solid #2a2a3a",
                color: activeCategory === cat.id ? cat.color : "#6b6b80",
                fontSize: "12px", fontFamily: "Georgia, serif",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
          {[
            { id: "all",      label: "Semua" },
            { id: "unlocked", label: "✓ Unlocked" },
            { id: "locked",   label: "🔒 Locked" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setShowUnlocked(f.id as any)}
              style={{
                padding: "4px 12px", borderRadius: "20px", cursor: "pointer",
                background: showUnlocked === f.id ? "#1a1a28" : "transparent",
                border: showUnlocked === f.id ? "1px solid #3a3a4a" : "1px solid transparent",
                color: showUnlocked === f.id ? "#c4bfb0" : "#4a4a5a",
                fontSize: "11px", fontFamily: "Georgia, serif",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Achievement grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "10px" }}>
          {filtered.map((ach: any) => {
            const catColor = CATEGORY_COLOR[ach.category] ?? "#6b6b80";
            return (
              <div
                key={ach.id}
                style={{
                  background: ach.unlocked ? "#111118" : "#0c0c14",
                  border: `1px solid ${ach.unlocked ? catColor + "33" : "#1e1e2e"}`,
                  borderRadius: "12px", padding: "14px",
                  opacity: ach.unlocked ? 1 : 0.6,
                  transition: "all 0.2s",
                  position: "relative", overflow: "hidden",
                }}
              >
                {ach.unlocked && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                    background: `linear-gradient(90deg,transparent,${catColor},transparent)`,
                  }} />
                )}

                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  {/* Icon */}
                  <div style={{
                    width: "42px", height: "42px", flexShrink: 0,
                    background: ach.unlocked ? `${catColor}15` : "#0f0f1a",
                    border: `1px solid ${ach.unlocked ? catColor + "33" : "#1e1e2e"}`,
                    borderRadius: "10px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "20px",
                    filter: ach.unlocked ? "none" : "grayscale(1)",
                  }}>
                    {ach.icon}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "bold", color: ach.unlocked ? "#f0ece0" : "#4a4a5a" }}>
                        {ach.title}
                      </span>
                      {ach.unlocked && (
                        <span style={{ fontSize: "10px", color: "#4ade80" }}>✓</span>
                      )}
                    </div>
                    <p style={{ fontSize: "11px", color: "#6b6b80", margin: "0 0 8px", lineHeight: "1.4" }}>
                      {ach.description}
                    </p>

                    {/* Rewards */}
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                      {ach.reward.gold && (
                        <span style={{ fontSize: "9px", color: "#f59e0b", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: "4px", padding: "1px 6px" }}>
                          💰 {ach.reward.gold.toLocaleString()}
                        </span>
                      )}
                      {ach.reward.soulShard && (
                        <span style={{ fontSize: "9px", color: "#818cf8", background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.15)", borderRadius: "4px", padding: "1px 6px" }}>
                          🔮 {ach.reward.soulShard}
                        </span>
                      )}
                      {ach.reward.attributePoints && (
                        <span style={{ fontSize: "9px", color: "#34d399", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: "4px", padding: "1px 6px" }}>
                          ⬆️ +{ach.reward.attributePoints} pts
                        </span>
                      )}
                      {ach.reward.title && (
                        <span style={{ fontSize: "9px", color: "#f472b6", background: "rgba(244,114,182,0.08)", border: "1px solid rgba(244,114,182,0.15)", borderRadius: "4px", padding: "1px 6px" }}>
                          🎖️ "{ach.reward.title}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div style={{
              gridColumn: "1/-1",
              background: "#111118", border: "1px solid #2a2a3a",
              borderRadius: "12px", padding: "40px", textAlign: "center",
            }}>
              <div style={{ fontSize: "28px", marginBottom: "8px", opacity: 0.3 }}>🏆</div>
              <p style={{ color: "#4a4a5a", fontSize: "12px", fontStyle: "italic" }}>
                Tidak ada achievement di kategori ini.
              </p>
            </div>
          )}
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