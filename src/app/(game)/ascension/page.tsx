"use client";

import { useState, useEffect, useCallback } from "react";
import GameSidebar from "@/components/layout/GameSidebar";

const PERK_ICONS: Record<string, string> = {
  exp: "✨", drop: "🎁", gold: "💰", combat: "⚔️",
};

export default function AscensionPage() {
  const [character, setCharacter] = useState<any>(null);
  const [ascData, setAscData] = useState<any>(null);
  const [perkData, setPerkData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"ascend" | "perks">("ascend");
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);

  const fetchData = useCallback(async () => {
    const [charRes, ascRes, perkRes] = await Promise.all([
      fetch("/api/character"),
      fetch("/api/character/ascend"),
      fetch("/api/character/ascend/spend"),
    ]);
    const charData = await charRes.json();
    const ascDataRes = await ascRes.json();
    const perkDataRes = await perkRes.json();
    if (charData.success) setCharacter(charData.data);
    if (ascDataRes.success) setAscData(ascDataRes.data);
    if (perkDataRes.success) setPerkData(perkDataRes.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function showFeedback(msg: string, ok: boolean) {
    setFeedback({ msg, ok });
    setTimeout(() => setFeedback(null), 3000);
  }

  async function handleAscend() {
    setSubmitting(true);
    const res = await fetch("/api/character/ascend", { method: "POST" });
    const data = await res.json();
    setSubmitting(false);
    setConfirming(false);
    if (data.success) {
      showFeedback(`🌟 Ascension berhasil! +${data.data.pointsGained} Ascension Points`, true);
      fetchData();
    } else {
      showFeedback(data.error, false);
    }
  }

  async function handleBuyPerk(perkId: string) {
    setSubmitting(true);
    const res = await fetch("/api/character/ascend/spend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ perkId }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.success) {
      showFeedback(`✅ ${data.data.perkName} dibeli!`, true);
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

  const melee = ascData?.meleeLevel ?? 0;
  const total = ascData?.totalSkillLevels ?? 0;
  const req = ascData?.requirements ?? { minMeleeLevel: 99, minTotalSkillLevels: 400 };
  const meetsReq = ascData?.meetsRequirements ?? false;

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#0a0a0f", color: "#e2e0d8", fontFamily: "Georgia, serif" }}>
      <GameSidebar character={character} />

      <main style={{ flex: 1, padding: "28px 24px", overflow: "auto", minWidth: 0 }}>
        <div className="game-mobile-spacer" style={{ height: 0 }} />

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#f0ece0", margin: 0 }}>
            🌟 Ascension
          </h1>
          <p style={{ fontSize: "12px", color: "#6b6b80", margin: "3px 0 0" }}>
            Transcend batas mortal dan jadilah Demi-God
          </p>
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
          }}>
            {feedback.msg}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
          {[
            { id: "ascend", label: "🌟 Ascend" },
            { id: "perks", label: "⚡ Perks" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              style={{
                padding: "6px 18px", borderRadius: "20px",
                background: tab === t.id ? "rgba(245,158,11,0.15)" : "#111118",
                border: tab === t.id ? "1px solid rgba(245,158,11,0.4)" : "1px solid #2a2a3a",
                color: tab === t.id ? "#f59e0b" : "#6b6b80",
                fontSize: "13px", fontFamily: "Georgia, serif", cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ maxWidth: "600px" }}>

          {/* ── Ascend tab ── */}
          {tab === "ascend" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Ascension count */}
              {ascData?.ascensionCount > 0 && (
                <div style={{
                  background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)",
                  borderRadius: "12px", padding: "14px 18px",
                  display: "flex", alignItems: "center", gap: "12px",
                }}>
                  <span style={{ fontSize: "28px" }}>⭐</span>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "bold", color: "#f59e0b" }}>
                      Ascension #{ascData.ascensionCount}
                    </div>
                    <div style={{ fontSize: "11px", color: "#6b6b80" }}>
                      {ascData.currentAscensionPoints} Ascension Points tersisa
                    </div>
                  </div>
                </div>
              )}

              {/* Requirements */}
              <div style={{
                background: "#111118", border: "1px solid #2a2a3a",
                borderRadius: "14px", padding: "20px",
              }}>
                <div style={{
                  fontSize: "10px", letterSpacing: "0.15em", color: "#6b6b80",
                  textTransform: "uppercase", marginBottom: "16px",
                  paddingBottom: "8px", borderBottom: "1px solid #1e1e2e",
                }}>
                  Syarat Ascension
                </div>

                {[
                  {
                    label: "Melee Level",
                    current: melee,
                    required: req.minMeleeLevel,
                    met: melee >= req.minMeleeLevel,
                  },
                  {
                    label: "Total Skill Levels",
                    current: total,
                    required: req.minTotalSkillLevels,
                    met: total >= req.minTotalSkillLevels,
                  },
                ].map((r) => (
                  <div key={r.label} style={{ marginBottom: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "13px", color: "#c4bfb0" }}>{r.label}</span>
                      <span style={{ fontSize: "12px", fontWeight: "bold", color: r.met ? "#4ade80" : "#ef4444" }}>
                        {r.current} / {r.required} {r.met ? "✓" : ""}
                      </span>
                    </div>
                    <div style={{ height: "6px", background: "#1a1a28", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${Math.min(100, (r.current / r.required) * 100)}%`,
                        background: r.met ? "#22c55e" : "#d97706",
                        borderRadius: "3px", transition: "width 0.5s",
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* What you lose / gain */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div style={{
                  background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)",
                  borderRadius: "12px", padding: "14px",
                }}>
                  <div style={{ fontSize: "11px", color: "#ef4444", marginBottom: "8px", fontWeight: "bold" }}>
                    ⬇ Yang Direset
                  </div>
                  {["Semua skill level → 1", "Semua stat → base", "Attribute points → 0", "Combat progress"].map((item) => (
                    <div key={item} style={{ fontSize: "11px", color: "#6b6b80", marginBottom: "4px" }}>
                      • {item}
                    </div>
                  ))}
                </div>
                <div style={{
                  background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)",
                  borderRadius: "12px", padding: "14px",
                }}>
                  <div style={{ fontSize: "11px", color: "#4ade80", marginBottom: "8px", fontWeight: "bold" }}>
                    ⬆ Yang Kamu Dapat
                  </div>
                  {[
                    `+${ascData?.ascensionPoints ?? 10} Ascension Points`,
                    "Gold & inventory tetap",
                    "Guild membership tetap",
                    "Perk permanent aktif",
                  ].map((item) => (
                    <div key={item} style={{ fontSize: "11px", color: "#6b6b80", marginBottom: "4px" }}>
                      • {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Ascend button / confirm */}
              {!confirming ? (
                <button
                  onClick={() => setConfirming(true)}
                  disabled={!meetsReq}
                  style={{
                    width: "100%", padding: "14px", borderRadius: "12px",
                    background: meetsReq
                      ? "linear-gradient(135deg,#d97706,#f59e0b)"
                      : "#1a1a28",
                    border: "none",
                    color: meetsReq ? "#0a0a0f" : "#4a4a5a",
                    fontSize: "15px", fontWeight: "bold",
                    fontFamily: "Georgia, serif", cursor: meetsReq ? "pointer" : "not-allowed",
                    boxShadow: meetsReq ? "0 0 30px rgba(245,158,11,0.3)" : "none",
                    transition: "all 0.3s",
                  }}
                >
                  {meetsReq ? "🌟 Mulai Ascension" : "Syarat belum terpenuhi"}
                </button>
              ) : (
                <div style={{
                  background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.3)",
                  borderRadius: "12px", padding: "18px", textAlign: "center",
                }}>
                  <p style={{ fontSize: "13px", color: "#f0ece0", marginBottom: "14px", lineHeight: "1.6" }}>
                    Yakin mau Ascend? Semua skill akan direset ke level 1.<br />
                    Kamu akan mendapat <span style={{ color: "#f59e0b", fontWeight: "bold" }}>{ascData?.ascensionPoints} Ascension Points</span>.
                  </p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => setConfirming(false)}
                      style={{
                        flex: 1, padding: "10px", borderRadius: "8px",
                        background: "#1a1a28", border: "1px solid #2a2a3a",
                        color: "#6b6b80", fontSize: "13px",
                        fontFamily: "Georgia, serif", cursor: "pointer",
                      }}
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleAscend}
                      disabled={submitting}
                      style={{
                        flex: 2, padding: "10px", borderRadius: "8px",
                        background: "#f59e0b", border: "none",
                        color: "#0a0a0f", fontSize: "13px", fontWeight: "bold",
                        fontFamily: "Georgia, serif", cursor: "pointer",
                      }}
                    >
                      {submitting ? "Ascending..." : "✅ Konfirmasi Ascension"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Perks tab ── */}
          {tab === "perks" && perkData && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

              {/* Points available */}
              <div style={{
                background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: "12px", padding: "14px 18px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontSize: "13px", color: "#c4bfb0" }}>Ascension Points tersisa</span>
                <span style={{ fontSize: "22px", fontWeight: "bold", color: "#f59e0b" }}>
                  {perkData.ascensionPoints}
                </span>
              </div>

              {perkData.perks.map((perk: any) => (
                <div
                  key={perk.id}
                  style={{
                    background: "#111118", border: "1px solid #2a2a3a",
                    borderRadius: "12px", padding: "16px",
                    display: "flex", alignItems: "center", gap: "14px",
                  }}
                >
                  <div style={{
                    width: "44px", height: "44px", flexShrink: 0,
                    background: "#0f0f1a", border: "1px solid #2a2a3a",
                    borderRadius: "10px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "22px",
                  }}>
                    {PERK_ICONS[perk.category] ?? "⭐"}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "bold", color: "#f0ece0" }}>
                        {perk.name}
                      </span>
                      <span style={{ fontSize: "10px", color: "#4a4a5a" }}>
                        {perk.owned}/{perk.maxStack} dimiliki
                      </span>
                    </div>
                    <p style={{ fontSize: "11px", color: "#6b6b80", margin: "0 0 8px" }}>
                      {perk.description}
                    </p>

                    {/* Stack bar */}
                    <div style={{ height: "3px", background: "#1a1a28", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${(perk.owned / perk.maxStack) * 100}%`,
                        background: "#f59e0b", borderRadius: "2px",
                      }} />
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuyPerk(perk.id)}
                    disabled={!perk.canBuy || submitting || perk.owned >= perk.maxStack}
                    style={{
                      padding: "8px 14px", borderRadius: "8px", flexShrink: 0,
                      background: perk.canBuy && perk.owned < perk.maxStack
                        ? "rgba(245,158,11,0.15)"
                        : "#1a1a28",
                      border: perk.canBuy && perk.owned < perk.maxStack
                        ? "1px solid rgba(245,158,11,0.3)"
                        : "1px solid #2a2a3a",
                      color: perk.canBuy && perk.owned < perk.maxStack
                        ? "#f59e0b"
                        : "#4a4a5a",
                      fontSize: "12px", fontFamily: "Georgia, serif",
                      cursor: perk.canBuy && perk.owned < perk.maxStack ? "pointer" : "not-allowed",
                    }}
                  >
                    {perk.owned >= perk.maxStack ? "Max" : `${perk.cost} pts`}
                  </button>
                </div>
              ))}

              {perkData.ascensionPoints === 0 && perkData.ascensionCount === 0 && (
                <div style={{
                  background: "#111118", border: "1px solid #2a2a3a",
                  borderRadius: "12px", padding: "30px", textAlign: "center",
                }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px", opacity: 0.3 }}>🌟</div>
                  <p style={{ color: "#4a4a5a", fontSize: "12px", fontStyle: "italic" }}>
                    Lakukan Ascension pertama untuk mendapatkan Ascension Points.
                  </p>
                </div>
              )}
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