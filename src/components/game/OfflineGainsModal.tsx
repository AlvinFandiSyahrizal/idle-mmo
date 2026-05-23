"use client";

import { OfflineResult } from "@/systems/OfflineGains";
import { getItemById } from "@/data/items";

interface Props {
  gains: OfflineResult;
  onClose: () => void;
}

export default function OfflineGainsModal({ gains, onClose }: Props) {
  const lootEntries = Object.entries(gains.loot);
  const levelUps = Object.entries(gains.skillLevelsGained);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.8)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Georgia, serif",
      padding: "20px",
    }}>
      <div style={{
        background: "#111118", border: "1px solid #2a2a3a",
        borderRadius: "20px", padding: "32px",
        width: "100%", maxWidth: "440px",
        boxShadow: "0 0 60px rgba(245,158,11,0.1)",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>⏰</div>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#f0ece0", margin: 0 }}>
            Kamu Sudah Kembali!
          </h2>
          <p style={{ fontSize: "12px", color: "#6b6b80", marginTop: "4px" }}>
            Kamu offline selama <span style={{ color: "#f59e0b" }}>{gains.durationText}</span>
            {gains.duration >= gains.cappedAt * 3600 && (
              <span style={{ color: "#ef4444" }}> (maksimal {gains.cappedAt} jam)</span>
            )}
          </p>
        </div>

        {/* Main stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "20px" }}>
          {[
            { icon: "⚔️", label: "Monster Kill", val: gains.kills.toLocaleString(), color: "#c4bfb0" },
            { icon: "✨", label: "EXP", val: `+${gains.expGained.toLocaleString()}`, color: "#34d399" },
            { icon: "💰", label: "Gold", val: `+${gains.goldGained.toLocaleString()}`, color: "#f59e0b" },
          ].map((s) => (
            <div key={s.label} style={{
              background: "#0f0f1a", border: "1px solid #2a2a3a",
              borderRadius: "10px", padding: "12px 8px", textAlign: "center",
            }}>
              <div style={{ fontSize: "20px", marginBottom: "4px" }}>{s.icon}</div>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: s.color }}>{s.val}</div>
              <div style={{ fontSize: "9px", color: "#6b6b80", marginTop: "2px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Level ups */}
        {levelUps.length > 0 && (
          <div style={{
            background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.2)",
            borderRadius: "10px", padding: "12px", marginBottom: "16px",
          }}>
            <div style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#34d399", marginBottom: "8px" }}>
              🎉 LEVEL UP!
            </div>
            {levelUps.map(([skillId, levels]) => (
              <div key={skillId} style={{ fontSize: "12px", color: "#c4bfb0" }}>
                {skillId.charAt(0).toUpperCase() + skillId.slice(1)} naik <span style={{ color: "#34d399", fontWeight: "bold" }}>+{levels} level</span>
              </div>
            ))}
          </div>
        )}

        {/* Loot */}
        {lootEntries.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#6b6b80", marginBottom: "8px" }}>
              ITEM DIDAPAT
            </div>
            <div style={{
              maxHeight: "120px", overflowY: "auto",
              display: "flex", flexDirection: "column", gap: "4px",
            }}>
              {lootEntries.map(([itemId, qty]) => {
                const item = getItemById(itemId);
                return (
                  <div key={itemId} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "#0f0f1a", borderRadius: "6px", padding: "6px 10px",
                  }}>
                    <span style={{ fontSize: "12px", color: "#c4bfb0" }}>
                      {item?.name ?? itemId}
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: "bold", color: "#f59e0b" }}>
                      x{qty}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            width: "100%", padding: "12px", borderRadius: "10px",
            background: "#f59e0b", border: "none",
            color: "#0a0a0f", fontSize: "14px", fontWeight: "bold",
            fontFamily: "Georgia, serif", cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          Lanjutkan Petualangan →
        </button>
      </div>
    </div>
  );
}