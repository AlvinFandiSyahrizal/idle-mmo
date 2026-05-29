"use client";

import { useState, useEffect } from "react";
import { useNotificationStore } from "@/stores/notificationStore";

interface StreakData {
  alreadyClaimed: boolean;
  streak: number;
  longestStreak: number;
  streakBroken?: boolean;
  previousStreak?: number;
  reward?: {
    gold: number;
    soulShard: number;
    label: string;
  };
}

interface Props {
  onClose: () => void;
}

export default function LoginStreakModal({ onClose }: Props) {
  const [data, setData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  const addNotification = useNotificationStore(
    (s) => s.addNotification
  );

  // claim streak
  useEffect(() => {
    async function claim() {
      try {
        const res = await fetch(
          "/api/character/login-streak",
          { method: "POST" }
        );

        const json = await res.json();

        if (json.success) {
          setData(json.data);

          if (
            !json.data.alreadyClaimed &&
            json.data.reward
          ) {
            addNotification({
              type: "streak",
              title: `🔥 Login Streak — Hari ${json.data.streak}`,
              message: `+${json.data.reward.gold} Gold${
                json.data.reward.soulShard
                  ? ` +${json.data.reward.soulShard} Soul Shard`
                  : ""
              }`,
              icon: "🔥",
            });
          }
        }
      } finally {
        setLoading(false);
      }
    }

    claim();
  }, [addNotification]);

  // auto close kalau udah pernah claim
  useEffect(() => {
    if (!loading && data?.alreadyClaimed) {
      onClose();
    }
  }, [
    loading,
    data?.alreadyClaimed,
    onClose,
  ]);

  // semua hook selesai → baru return
  if (loading) return null;

  if (!data || data.alreadyClaimed) {
    return null;
  }

  const {
    streak,
    reward,
    streakBroken,
    previousStreak,
  } = data;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 150,
        background: "rgba(0,0,0,.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Georgia, serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg,#111118,#0d0d18)",
          border: "1px solid #2a2a3a",
          borderRadius: "20px",
          padding: "32px",
          width: "100%",
          maxWidth: "400px",
          boxShadow:
            "0 0 60px rgba(245,158,11,.15)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          {streakBroken ? (
            <>
              <div
                style={{
                  fontSize: "40px",
                  marginBottom: "8px",
                }}
              >
                💔
              </div>

              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#ef4444",
                  margin: 0,
                }}
              >
                Streak Terputus!
              </h2>

              <p
                style={{
                  fontSize: "12px",
                  color: "#6b6b80",
                  marginTop: "6px",
                }}
              >
                Streak {previousStreak} hari-mu
                terputus.
              </p>
            </>
          ) : (
            <>
              <div
                style={{
                  fontSize: "40px",
                  marginBottom: "8px",
                }}
              >
                {streak >= 7
                  ? "⭐"
                  : streak >= 3
                  ? "🔥"
                  : "✨"}
              </div>

              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#f59e0b",
                  margin: 0,
                }}
              >
                Login Streak!
              </h2>

              <p
                style={{
                  fontSize: "12px",
                  color: "#6b6b80",
                  marginTop: "6px",
                }}
              >
                {reward?.label ??
                  `${streak} hari berturut-turut`}
              </p>
            </>
          )}
        </div>

        {reward && (
          <div
            style={{
              textAlign: "center",
              marginBottom: "18px",
              color: "#f59e0b",
            }}
          >
            💰 +{reward.gold}
            {reward.soulShard > 0 &&
              ` • 🔮 +${reward.soulShard}`}
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            background:
              "linear-gradient(135deg,#d97706,#f59e0b)",
            border: "none",
            color: "#0a0a0f",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Klaim & Lanjutkan →
        </button>
      </div>
    </div>
  );
}