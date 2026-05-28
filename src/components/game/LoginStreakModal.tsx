"use client";

import { useState, useEffect } from "react";
import { useNotificationStore } from "@/stores/notificationStore";

interface StreakData {
  alreadyClaimed: boolean;
  streak: number;
  longestStreak: number;
  streakBroken?: boolean;
  previousStreak?: number;
  reward?: { gold: number; soulShard: number; label: string };
}

interface Props {
  onClose: () => void;
}

const STREAK_DAYS = [1, 2, 3, 5, 7, 14, 30];

export default function LoginStreakModal({ onClose }: Props) {
  const [data, setData]       = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);
  const addNotification       = useNotificationStore((s) => s.addNotification);

  useEffect(() => {
    async function claim() {
      const res  = await fetch("/api/character/login-streak", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        if (!json.data.alreadyClaimed && json.data.reward) {
          addNotification({
            type: "streak",
            title: `🔥 Login Streak — Hari ${json.data.streak}`,
            message: `+${json.data.reward.gold} Gold${json.data.reward.soulShard ? ` +${json.data.reward.soulShard} Soul Shard` : ""}`,
            icon: "🔥",
          });
        }
      }
      setLoading(false);
    }
    claim();
  }, []);

  if (loading) return null;
  if (!data || data.alreadyClaimed) { onClose(); return null; }

  const { streak, reward, streakBroken, previousStreak } = data;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 150,
      background: "rgba(0,0,0,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Georgia, serif", padding: "20px",
    }}>
      <div style={{
        background: "linear-gradient(135deg,#111118,#0d0d18)",
        border: "1px solid #2a2a3a",
        borderRadius: "20px", padding: "32px",
        width: "100%", maxWidth: "400px",
        boxShadow: "0 0 60px rgba(245,158,11,0.15)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative glow */}
        <div style={{
          position: "absolute", top: "-60px", right: "-60px",
          width: "180px", height: "180px", borderRadius: "50%",
          background: "rgba(245,158,11,0.06)", pointerEvents: "none",
        }} />

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          {streakBroken ? (
            <>
              <div style={{ fontSize: "40px", marginBottom: "8px" }}>💔</div>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#ef4444", margin: 0 }}>
                Streak Terputus!
              </h2>
              <p style={{ fontSize: "12px", color: "#6b6b80", marginTop: "6px" }}>
                Streak {previousStreak} hari-mu terputus. Mulai lagi dari hari 1!
              </p>
            </>
          ) : (
            <>
              <div style={{ fontSize: "40px", marginBottom: "8px" }}>
                {streak >= 7 ? "⭐" : streak >= 3 ? "🔥" : "✨"}
              </div>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#f59e0b", margin: 0 }}>
                Login Streak!
              </h2>
              <p style={{ fontSize: "12px", color: "#6b6b80", marginTop: "6px" }}>
                {reward?.label ?? `${streak} hari berturut-turut`}
              </p>
            </>
          )}
        </div>

        {/* Streak visual */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "6px",
          marginBottom: "24px", flexWrap: "wrap",
        }}>
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const isCompleted = day <= streak;
            const isMilestone = [3, 5, 7].includes(day);
            return (
              <div key={day} style={{
                width: "40px", height: "40px", borderRadius: "10px",
                background: isCompleted
                  ? isMilestone ? "rgba(245,158,11,0.2)" : "rgba(34,197,94,0.15)"
                  : "#0f0f1a",
                border: `1px solid ${isCompleted
                  ? isMilestone ? "rgba(245,158,11,0.4)" : "rgba(34,197,94,0.3)"
                  : "#1e1e2e"}`,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: "1px",
                transition: "all 0.3s",
              }}>
                <span style={{ fontSize: "14px" }}>
                  {isCompleted ? (isMilestone ? "⭐" : "✓") : day}
                </span>
                {isMilestone && (
                  <span style={{ fontSize: "7px", color: isCompleted ? "#f59e0b" : "#4a4a5a" }}>
                    bonus
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Current streak badge */}
        <div style={{
          background: streak >= 7 ? "rgba(245,158,11,0.08)" : "rgba(34,197,94,0.06)",
          border: `1px solid ${streak >= 7 ? "rgba(245,158,11,0.2)" : "rgba(34,197,94,0.15)"}`,
          borderRadius: "12px", padding: "14px", textAlign: "center",
          marginBottom: "20px",
        }}>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: streak >= 7 ? "#f59e0b" : "#4ade80" }}>
            {streak}
          </div>
          <div style={{ fontSize: "11px", color: "#6b6b80" }}>
            Hari berturut-turut
            {data.longestStreak > streak && (
              <span style={{ color: "#4a4a5a", marginLeft: "6px" }}>
                (terbaik: {data.longestStreak})
              </span>
            )}
          </div>
        </div>

        {/* Reward */}
        {reward && (
          <div style={{
            display: "flex", gap: "8px", marginBottom: "20px", justifyContent: "center",
          }}>
            {reward.gold > 0 && (
              <div style={{
                background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: "10px", padding: "10px 16px", textAlign: "center",
                flex: 1,
              }}>
                <div style={{ fontSize: "20px", marginBottom: "3px" }}>💰</div>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#f59e0b" }}>
                  +{reward.gold.toLocaleString()}
                </div>
                <div style={{ fontSize: "10px", color: "#4a4a5a" }}>Gold</div>
              </div>
            )}
            {reward.soulShard > 0 && (
              <div style={{
                background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.2)",
                borderRadius: "10px", padding: "10px 16px", textAlign: "center",
                flex: 1,
              }}>
                <div style={{ fontSize: "20px", marginBottom: "3px" }}>🔮</div>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#818cf8" }}>
                  +{reward.soulShard}
                </div>
                <div style={{ fontSize: "10px", color: "#4a4a5a" }}>Soul Shard</div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            width: "100%", padding: "12px", borderRadius: "10px",
            background: "linear-gradient(135deg,#d97706,#f59e0b)",
            border: "none", color: "#0a0a0f",
            fontSize: "14px", fontWeight: "bold",
            fontFamily: "Georgia, serif", cursor: "pointer",
          }}
        >
          Klaim & Lanjutkan →
        </button>
      </div>
    </div>
  );
}