"use client";

import { useState, useEffect, useCallback } from "react";
import GameSidebar from "@/components/layout/GameSidebar";

const CATEGORY_COLORS: Record<string, string> = {
  combat: "#ef4444",
  crafting: "#f59e0b",
  gathering: "#22c55e",
  general: "#818cf8",
};

export default function QuestsPage() {
  const [character, setCharacter] = useState<any>(null);
  const [quests, setQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"daily" | "weekly">("daily");
  const [claiming, setClaiming] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);

  const fetchData = useCallback(async () => {
    const [charRes, questRes] = await Promise.all([
      fetch("/api/character"),
      fetch("/api/daily-quest"),
    ]);
    const charData = await charRes.json();
    const questData = await questRes.json();
    if (charData.success) setCharacter(charData.data);
    if (questData.success) setQuests(questData.data);
    setLoading(false);
  }, []);

    useEffect(() => {
      fetchData();

      const refresh = () => {
        fetchData();
      };

      // dari combat tick
      window.addEventListener(
        "quest-progress-updated",
        refresh
      );

      // kalau ada quest claim/update manual
      window.addEventListener(
        "quest-updated",
        refresh
      );

      return () => {
        window.removeEventListener(
          "quest-progress-updated",
          refresh
        );

        window.removeEventListener(
          "quest-updated",
          refresh
        );
      };
    }, [fetchData]);

  function showFeedback(msg: string, ok: boolean) {
    setFeedback({ msg, ok });
    setTimeout(() => setFeedback(null), 3000);
  }

  async function claimReward(questId: string) {
    setClaiming(questId);
    const res = await fetch("/api/daily-quest/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questId }),
    });
    const data = await res.json();
    setClaiming(null);
    if (data.success) {
      const r = data.data.rewards;
      const parts = [];
      if (r.gold) parts.push(`+${r.gold} Gold`);
      if (r.soulShard) parts.push(`+${r.soulShard} Soul Shard`);
      showFeedback(`✅ ${data.data.questTitle} — ${parts.join(", ")}`, true);
      fetchData();
    } else {
      showFeedback(`❌ ${data.error}`, false);
    }
  }

  const filtered = quests.filter((q) => q.type === tab);
  const completedCount = filtered.filter((q) => q.completed).length;
  const claimableCount = filtered.filter((q) => q.canClaim).length;

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#6b6b80", fontFamily: "Georgia, serif" }}>Memuat...</span>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#0a0a0f", color: "#e2e0d8", fontFamily: "Georgia, serif" }}>
      <GameSidebar character={character} />

      <main style={{ flex: 1, padding: "28px 24px", overflow: "auto", minWidth: 0 }}>
        <div className="game-mobile-spacer" style={{ height: 0 }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#f0ece0", margin: 0 }}>
              📋 Quests
            </h1>
            <p style={{ fontSize: "12px", color: "#6b6b80", margin: "3px 0 0" }}>
              {completedCount}/{filtered.length} selesai
              {claimableCount > 0 && (
                <span style={{ color: "#f59e0b", marginLeft: "8px" }}>
                  · {claimableCount} reward bisa diambil!
                </span>
              )}
            </p>
          </div>

          {/* Progress summary bar */}
<div style={{
  display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap",
}}>
  {[
    { label: "Belum mulai", count: filtered.filter(q => q.progress === 0 && !q.completed).length, color: "#4a4a5a" },
    { label: "Sedang berjalan", count: filtered.filter(q => q.progress > 0 && !q.completed).length, color: "#f59e0b" },
    { label: "Selesai", count: filtered.filter(q => q.completed && !q.claimed).length, color: "#22c55e" },
    { label: "Sudah diambil", count: filtered.filter(q => q.claimed).length, color: "#374151" },
  ].map((s) => (
    <div key={s.label} style={{
      background: "#111118", border: "1px solid #2a2a3a",
      borderRadius: "8px", padding: "6px 14px",
      display: "flex", alignItems: "center", gap: "6px",
    }}>
      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: s.color, display: "inline-block" }} />
      <span style={{ fontSize: "11px", color: "#6b6b80" }}>{s.label}</span>
      <span style={{ fontSize: "12px", fontWeight: "bold", color: s.color }}>{s.count}</span>
    </div>
  ))}
</div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "6px" }}>
            {(["daily", "weekly"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "6px 18px", borderRadius: "20px",
                  background: tab === t ? "rgba(245,158,11,0.15)" : "#111118",
                  border: tab === t ? "1px solid rgba(245,158,11,0.4)" : "1px solid #2a2a3a",
                  color: tab === t ? "#f59e0b" : "#6b6b80",
                  fontSize: "13px", fontFamily: "Georgia, serif", cursor: "pointer",
                }}
              >
                {t === "daily" ? "📅 Harian" : "📆 Mingguan"}
              </button>
            ))}
          </div>
        </div>

        {/* Toast */}
        {feedback && (
          <div style={{
            position: "fixed", top: "20px", right: "20px", zIndex: 100,
            background: feedback.ok ? "#052e16" : "#1a0a0a",
            border: `1px solid ${feedback.ok ? "#166534" : "#7f1d1d"}`,
            borderRadius: "10px", padding: "12px 18px",
            color: feedback.ok ? "#4ade80" : "#ef4444",
            fontSize: "12px", fontFamily: "Georgia, serif",
            maxWidth: "320px",
          }}>
            {feedback.msg}
          </div>
        )}

        {/* Quest list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "680px" }}>
          {filtered.map((quest) => {
            const catColor = CATEGORY_COLORS[quest.category] ?? "#6b6b80";
            const isClaiming = claiming === quest.id;

            return (
              <div
                key={quest.id}
                style={{
                  background: "#111118",
                  border: `1px solid ${quest.canClaim ? "rgba(245,158,11,0.3)" : quest.completed ? "#1e3a1e" : "#2a2a3a"}`,
                  borderRadius: "14px",
                  padding: "16px 18px",
                  transition: "border-color 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  {/* Icon */}
                  <div style={{
                    width: "44px", height: "44px", flexShrink: 0,
                    background: "#0f0f1a", border: `1px solid ${catColor}33`,
                    borderRadius: "10px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "22px",
                  }}>
                    {quest.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px", gap: "8px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "bold", color: quest.claimed ? "#4a4a5a" : "#f0ece0" }}>
                        {quest.title}
                      </span>
                      <span style={{
                        fontSize: "9px", padding: "2px 8px", borderRadius: "10px",
                        color: catColor, border: `1px solid ${catColor}33`,
                        background: `${catColor}11`, flexShrink: 0,
                        textTransform: "capitalize",
                      }}>
                        {quest.category}
                      </span>
                    </div>

                    <p style={{ fontSize: "12px", color: "#6b6b80", margin: "0 0 10px", lineHeight: "1.4" }}>
                      {quest.description}
                    </p>

                    {/* Progress bar */}
                    <div style={{ marginBottom: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#4a4a5a", marginBottom: "4px" }}>
                        <span>Progress</span>
                        <span style={{ color: quest.completed ? "#4ade80" : "#c4bfb0" }}>
                          {quest.progress} / {quest.objective.target}
                          {quest.completed && " ✓"}
                        </span>
                      </div>
                      <div style={{ height: "5px", background: "#1a1a28", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{
                          height: "100%",
                          width: `${quest.pct}%`,
                          background: quest.completed ? "#22c55e" : catColor,
                          borderRadius: "3px",
                          transition: "width 0.5s",
                        }} />
                      </div>
                    </div>

                    {/* Rewards + claim */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                      {/* Reward preview */}
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {quest.rewards.gold && (
                          <span style={{ fontSize: "11px", color: "#f59e0b", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "6px", padding: "2px 8px" }}>
                            💰 +{quest.rewards.gold}
                          </span>
                        )}
                        {quest.rewards.exp && (
                          <span style={{ fontSize: "11px", color: "#34d399", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "6px", padding: "2px 8px" }}>
                            ✨ +{quest.rewards.exp} EXP
                          </span>
                        )}
                        {quest.rewards.soulShard && (
                          <span style={{ fontSize: "11px", color: "#818cf8", background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.2)", borderRadius: "6px", padding: "2px 8px" }}>
                            🔮 +{quest.rewards.soulShard}
                          </span>
                        )}
                      </div>

                      {/* Claim / status button */}
                      {quest.claimed ? (
                        <span style={{ fontSize: "11px", color: "#4a4a5a", flexShrink: 0 }}>
                          ✓ Sudah diambil
                        </span>
                      ) : quest.canClaim ? (
                        <button
                          onClick={() => claimReward(quest.id)}
                          disabled={isClaiming}
                          style={{
                            padding: "6px 16px", borderRadius: "8px",
                            background: isClaiming ? "#1a3a1a" : "#f59e0b",
                            border: "none",
                            color: "#0a0a0f", fontSize: "12px", fontWeight: "bold",
                            fontFamily: "Georgia, serif", cursor: "pointer",
                            flexShrink: 0, transition: "all 0.2s",
                          }}
                        >
                          {isClaiming ? "..." : "Ambil Reward"}
                        </button>
                      ) : (
                        <span style={{ fontSize: "11px", color: "#4a4a5a", flexShrink: 0 }}>
                          {quest.pct}% selesai
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
