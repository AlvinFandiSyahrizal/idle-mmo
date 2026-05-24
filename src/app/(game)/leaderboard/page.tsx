"use client";

import { useState, useEffect, useCallback } from "react";
import GameSidebar from "@/components/layout/GameSidebar";

const SORT_TYPES = [
  { id: "level", label: "Total Level" },
  { id: "melee", label: "Melee Level" },
  { id: "gold", label: "Gold" },
  { id: "ascension", label: "Ascension" },
];

const RANK_STYLES: Record<number, { bg: string; color: string; icon: string }> = {
  1: { bg: "rgba(251,191,36,0.12)", color: "#fbbf24", icon: "👑" },
  2: { bg: "rgba(156,163,175,0.1)", color: "#9ca3af", icon: "🥈" },
  3: { bg: "rgba(180,83,9,0.1)", color: "#b45309", icon: "🥉" },
};

export default function LeaderboardPage() {
  const [character, setCharacter] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("level");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [charRes, lbRes] = await Promise.all([
      fetch("/api/character"),
      fetch(`/api/leaderboard?type=${sortType}`),
    ]);
    const charData = await charRes.json();
    const lbData = await lbRes.json();
    if (charData.success) setCharacter(charData.data);
    if (lbData.success) setEntries(lbData.data);
    setLoading(false);
  }, [sortType]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const myEntry = entries.find((e) => e.isMe);
  const myRank = myEntry?.rank;

  function getSortValue(entry: any) {
    switch (sortType) {
      case "level": return `${entry.totalSkillLevels} total level`;
      case "melee": return `Melee Lv ${entry.meleeLevel}`;
      case "gold": return `${entry.gold.toLocaleString()} gold`;
      case "ascension": return `${entry.ascensionCount}x ascended`;
      default: return "";
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#0a0a0f", color: "#e2e0d8", fontFamily: "Georgia, serif" }}>
      <GameSidebar character={character} />

      <main style={{ flex: 1, padding: "28px 24px", overflow: "auto", minWidth: 0 }}>
        <div className="game-mobile-spacer" style={{ height: 0 }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#f0ece0", margin: 0 }}>
              🏆 Leaderboard
            </h1>
            <p style={{ fontSize: "12px", color: "#6b6b80", margin: "3px 0 0" }}>
              {entries.length} player terdaftar
              {myRank && (
                <span style={{ color: "#f59e0b", marginLeft: "8px" }}>
                  · Rankmu: #{myRank}
                </span>
              )}
            </p>
          </div>

          {/* Sort tabs */}
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
            {SORT_TYPES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSortType(s.id)}
                style={{
                  padding: "5px 14px", borderRadius: "20px",
                  background: sortType === s.id ? "rgba(245,158,11,0.15)" : "#111118",
                  border: sortType === s.id ? "1px solid rgba(245,158,11,0.4)" : "1px solid #2a2a3a",
                  color: sortType === s.id ? "#f59e0b" : "#6b6b80",
                  fontSize: "12px", fontFamily: "Georgia, serif", cursor: "pointer",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* My rank highlight */}
        {myEntry && myRank && myRank > 10 && (
          <div style={{
            background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: "12px", padding: "12px 16px", marginBottom: "16px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: "12px", color: "#f59e0b" }}>
              Posisimu saat ini: #{myRank}
            </span>
            <span style={{ fontSize: "12px", color: "#6b6b80" }}>
              {getSortValue(myEntry)}
            </span>
          </div>
        )}

        {/* Table */}
        <div style={{
          background: "#111118", border: "1px solid #2a2a3a",
          borderRadius: "16px", overflow: "hidden",
          maxWidth: "700px",
        }}>
          {/* Header */}
          <div style={{
            display: "grid", gridTemplateColumns: "50px 1fr 160px",
            padding: "10px 16px",
            background: "#0f0f1a", borderBottom: "1px solid #1e1e2e",
          }}>
            {["Rank", "Player", "Score"].map((h) => (
              <div key={h} style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#4a4a5a", textTransform: "uppercase" }}>
                {h}
              </div>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#4a4a5a", fontSize: "13px" }}>
              Memuat...
            </div>
          ) : entries.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#4a4a5a", fontSize: "13px", fontStyle: "italic" }}>
              Belum ada player terdaftar.
            </div>
          ) : (
            entries.slice(0, 50).map((entry) => {
              const rankStyle = RANK_STYLES[entry.rank];
              const isMe = entry.isMe;

              return (
                <div
                  key={entry.id}
                  style={{
                    display: "grid", gridTemplateColumns: "50px 1fr 160px",
                    padding: "12px 16px",
                    background: isMe
                      ? "rgba(245,158,11,0.06)"
                      : rankStyle?.bg ?? "transparent",
                    borderBottom: "1px solid #1a1a28",
                    borderLeft: isMe ? "2px solid #f59e0b" : "2px solid transparent",
                    transition: "background 0.2s",
                  }}
                >
                  {/* Rank */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {rankStyle ? (
                      <span style={{ fontSize: "18px" }}>{rankStyle.icon}</span>
                    ) : (
                      <span style={{ fontSize: "13px", color: "#4a4a5a", fontWeight: "bold" }}>
                        #{entry.rank}
                      </span>
                    )}
                  </div>

                  {/* Player info */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "34px", height: "34px", borderRadius: "8px",
                      background: "#1a1a28", border: "1px solid #2a2a3a",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "18px", flexShrink: 0,
                    }}>
                      {entry.classIcon}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "bold", color: isMe ? "#f59e0b" : "#f0ece0" }}>
                          {entry.name}
                        </span>
                        {isMe && (
                          <span style={{ fontSize: "9px", color: "#f59e0b", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "4px", padding: "1px 5px" }}>
                            KAMU
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "10px", color: "#4a4a5a" }}>
                        @{entry.username} · {entry.className} · Lv {entry.level}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{
                      fontSize: "13px", fontWeight: "bold",
                      color: rankStyle?.color ?? (isMe ? "#f59e0b" : "#c4bfb0"),
                    }}>
                      {getSortValue(entry)}
                    </span>
                  </div>
                </div>
              );
            })
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