"use client";

import { useState, useEffect, useCallback } from "react";
import GameSidebar from "@/components/layout/GameSidebar";
import { RARITY_CONFIG, MAX_PET_LEVEL } from "@/data/pets";

export default function PetsPage() {
  const [character, setCharacter] = useState<any>(null);
  const [petData, setPetData]     = useState<any>(null);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState<any>(null);
  const [filter, setFilter]       = useState<"all" | "owned">("all");
  const [processing, setProcessing] = useState(false);
  const [feedback, setFeedback]   = useState<{ msg: string; ok: boolean } | null>(null);

  const fetchData = useCallback(async () => {
    const [charRes, petRes] = await Promise.all([
      fetch("/api/character"),
      fetch("/api/pets"),
    ]);
    const charData = await charRes.json();
    const petDataRes = await petRes.json();
    if (charData.success) setCharacter(charData.data);
    if (petDataRes.success) setPetData(petDataRes.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function showFeedback(msg: string, ok: boolean) {
    setFeedback({ msg, ok });
    setTimeout(() => setFeedback(null), 3000);
  }

  async function handleAction(action: string, petId: string) {
    setProcessing(true);
    const res  = await fetch("/api/pets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, petId }),
    });
    const data = await res.json();
    setProcessing(false);
    if (data.success) {
      const msgs: Record<string, string> = {
        activate:   `✅ Pet diaktifkan!`,
        deactivate: `Pet dinonaktifkan.`,
        feed:       data.data?.leveledUp
          ? `🎉 Pet naik ke Level ${data.data.newLevel}!`
          : `🍖 Pet diberi makan! +${data.data?.expGained} EXP`,
      };
      showFeedback(msgs[action] ?? "Berhasil!", true);
      fetchData();
      setSelected((prev: any) => prev ? { ...prev } : null);
    } else {
      showFeedback(data.error, false);
    }
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#6b6b80", fontFamily: "Georgia, serif" }}>Memuat...</span>
    </div>
  );

  const pets   = petData?.pets ?? [];
  const active = petData?.activePet;

  const filtered = filter === "owned"
    ? pets.filter((p: any) => p.owned)
    : pets;

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#0a0a0f", color: "#e2e0d8", fontFamily: "Georgia, serif" }}>
      <GameSidebar character={character} />

      <main style={{ flex: 1, padding: "28px 24px", overflow: "auto", minWidth: 0 }}>
        <div className="game-mobile-spacer" style={{ height: 0 }} />

        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#f0ece0", margin: 0 }}>
            🐾 Pets
          </h1>
          <p style={{ fontSize: "12px", color: "#6b6b80", margin: "3px 0 0" }}>
            {petData?.totalOwned ?? 0} / {pets.length} pet dimiliki
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

        {/* Active pet banner */}
        {active && active.def && (
          <div style={{
            background: `linear-gradient(135deg,#111118,${active.def.color}11)`,
            border: `1px solid ${active.def.color}33`,
            borderRadius: "14px", padding: "16px 20px",
            marginBottom: "20px",
            display: "flex", alignItems: "center", gap: "16px",
          }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "14px",
              background: `${active.def.color}15`,
              border: `2px solid ${active.def.color}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "28px",
              boxShadow: `0 0 20px ${active.def.color}22`,
            }}>
              {active.def.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                <span style={{ fontSize: "14px", fontWeight: "bold", color: "#f0ece0" }}>
                  {active.def.name}
                </span>
                <span style={{ fontSize: "10px", color: "#4ade80", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "4px", padding: "1px 6px" }}>
                  AKTIF
                </span>
                <span style={{ fontSize: "10px", color: active.def.color }}>
                  Lv {active.level}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "#6b6b80" }}>
                {active.def.bonus.description}
              </div>
            </div>
            <button
              onClick={() => handleAction("deactivate", active.petId)}
              disabled={processing}
              style={{
                padding: "6px 14px", borderRadius: "8px",
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                color: "#ef4444", fontSize: "12px",
                fontFamily: "Georgia, serif", cursor: "pointer",
              }}
            >
              Nonaktifkan
            </button>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 300px" : "1fr", gap: "20px" }}>

          {/* Left: Pet grid */}
          <div>
            {/* Filter */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
              {[
                { id: "all",   label: "Semua Pet" },
                { id: "owned", label: "Dimiliki" },
              ].map((f) => (
                <button key={f.id} onClick={() => setFilter(f.id as any)} style={{
                  padding: "5px 14px", borderRadius: "20px", cursor: "pointer",
                  background: filter === f.id ? "rgba(245,158,11,0.15)" : "#111118",
                  border: filter === f.id ? "1px solid rgba(245,158,11,0.4)" : "1px solid #2a2a3a",
                  color: filter === f.id ? "#f59e0b" : "#6b6b80",
                  fontSize: "12px", fontFamily: "Georgia, serif",
                }}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Pet grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "10px" }}>
              {filtered.map((pet: any) => {
                const rarity     = RARITY_CONFIG[pet.rarity];
                const isSelected = selected?.id === pet.id;
                const isActive   = pet.isActive;

                return (
                  <button
                    key={pet.id}
                    onClick={() => setSelected(isSelected ? null : pet)}
                    style={{
                      textAlign: "left", padding: "14px",
                      borderRadius: "12px", border: "none", cursor: "pointer",
                      background: isSelected ? rarity.bg : pet.owned ? "#111118" : "#0c0c14",
                      outline: isSelected
                        ? `2px solid ${rarity.border}`
                        : isActive
                        ? `1px solid ${pet.color}44`
                        : `1px solid ${pet.owned ? "#2a2a3a" : "#1e1e2e"}`,
                      opacity: pet.owned ? 1 : 0.55,
                      transition: "all 0.15s",
                      position: "relative", overflow: "hidden",
                    }}
                  >
                    {isActive && (
                      <div style={{
                        position: "absolute", top: "8px", right: "8px",
                        fontSize: "8px", color: "#4ade80",
                        background: "rgba(34,197,94,0.15)", borderRadius: "3px",
                        padding: "1px 5px",
                      }}>
                        AKTIF
                      </div>
                    )}

                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <div style={{
                        width: "48px", height: "48px", borderRadius: "12px", flexShrink: 0,
                        background: pet.owned ? `${pet.color}15` : "#0f0f1a",
                        border: `1px solid ${pet.owned ? pet.color + "33" : "#1e1e2e"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "24px",
                        filter: pet.owned ? "none" : "grayscale(1)",
                      }}>
                        {pet.emoji}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px" }}>
                          <span style={{ fontSize: "13px", fontWeight: "bold", color: pet.owned ? "#f0ece0" : "#4a4a5a" }}>
                            {pet.name}
                          </span>
                        </div>
                        <div style={{
                          fontSize: "9px", padding: "1px 6px", borderRadius: "4px", display: "inline-block",
                          color: rarity.color, background: rarity.bg,
                          border: `1px solid ${rarity.border}`, marginBottom: "5px",
                        }}>
                          {rarity.label}
                        </div>
                        <div style={{ fontSize: "11px", color: "#6b6b80", lineHeight: "1.3" }}>
                          {pet.bonus.description}
                        </div>
                      </div>
                    </div>

                    {/* Level bar */}
                    {pet.owned && (
                      <div style={{ marginTop: "10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#4a4a5a", marginBottom: "3px" }}>
                          <span>Lv {pet.level}</span>
                          <span>{pet.level >= MAX_PET_LEVEL ? "MAX" : `${pet.expPct}%`}</span>
                        </div>
                        <div style={{ height: "3px", background: "#1a1a28", borderRadius: "2px", overflow: "hidden" }}>
                          <div style={{
                            height: "100%",
                            width: pet.level >= MAX_PET_LEVEL ? "100%" : `${pet.expPct}%`,
                            background: pet.color, borderRadius: "2px",
                          }} />
                        </div>
                      </div>
                    )}

                    {!pet.owned && (
                      <div style={{ marginTop: "8px", fontSize: "10px", color: "#3a3a4a", fontStyle: "italic" }}>
                        {pet.source}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Pet detail */}
          {selected && (
            <div style={{
              background: "#111118", border: "1px solid #2a2a3a",
              borderRadius: "14px", padding: "20px",
              alignSelf: "flex-start", position: "sticky", top: "20px",
            }}>
              {/* Pet header */}
              <div style={{ textAlign: "center", marginBottom: "18px" }}>
                <div style={{
                  width: "70px", height: "70px", borderRadius: "18px",
                  background: selected.owned ? `${selected.color}15` : "#0f0f1a",
                  border: `2px solid ${selected.owned ? selected.color + "44" : "#2a2a3a"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "36px", margin: "0 auto 10px",
                  filter: selected.owned ? "none" : "grayscale(1)",
                  boxShadow: selected.owned ? `0 0 24px ${selected.color}22` : "none",
                }}>
                  {selected.emoji}
                </div>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#f0ece0", marginBottom: "4px" }}>
                  {selected.name}
                </div>
                <div style={{
                  display: "inline-block", fontSize: "10px", padding: "2px 10px",
                  borderRadius: "10px",
                  color: RARITY_CONFIG[selected.rarity].color,
                  background: RARITY_CONFIG[selected.rarity].bg,
                  border: `1px solid ${RARITY_CONFIG[selected.rarity].border}`,
                }}>
                  {RARITY_CONFIG[selected.rarity].label}
                </div>
              </div>

              <p style={{ fontSize: "12px", color: "#6b6b80", lineHeight: "1.5", marginBottom: "14px", textAlign: "center" }}>
                {selected.description}
              </p>

              {/* Bonus */}
              <div style={{ background: "#0f0f1a", borderRadius: "8px", padding: "10px 12px", marginBottom: "10px" }}>
                <div style={{ fontSize: "10px", color: "#4a4a5a", marginBottom: "5px" }}>BONUS PASIF</div>
                <div style={{ fontSize: "12px", color: "#4ade80", fontWeight: "bold" }}>
                  {selected.bonus.description}
                </div>
                {selected.owned && selected.level > 1 && (
                  <div style={{ fontSize: "10px", color: "#4a4a5a", marginTop: "3px" }}>
                    +{((selected.level - 1) * 10).toFixed(0)}% lebih kuat dari level 1
                  </div>
                )}
              </div>

              {/* Ability */}
              <div style={{ background: "#0f0f1a", borderRadius: "8px", padding: "10px 12px", marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", color: "#4a4a5a", marginBottom: "5px" }}>SPECIAL ABILITY</div>
                <div style={{ fontSize: "12px", color: selected.color, fontWeight: "bold", marginBottom: "3px" }}>
                  ✦ {selected.ability.name}
                </div>
                <div style={{ fontSize: "11px", color: "#6b6b80", lineHeight: "1.4" }}>
                  {selected.ability.description}
                </div>
              </div>

              {selected.owned ? (
                <>
                  {/* Level info */}
                  <div style={{ marginBottom: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
                      <span style={{ color: "#6b6b80" }}>Level</span>
                      <span style={{ color: selected.color, fontWeight: "bold" }}>
                        {selected.level} / {MAX_PET_LEVEL}
                        {selected.level >= MAX_PET_LEVEL && " (MAX)"}
                      </span>
                    </div>
                    {selected.level < MAX_PET_LEVEL && (
                      <>
                        <div style={{ height: "6px", background: "#0f0f1a", borderRadius: "3px", overflow: "hidden", marginBottom: "4px" }}>
                          <div style={{ height: "100%", width: `${selected.expPct}%`, background: selected.color, borderRadius: "3px" }} />
                        </div>
                        <div style={{ fontSize: "10px", color: "#4a4a5a", textAlign: "right" }}>
                          {selected.experience} / {selected.expToNext} EXP
                        </div>
                      </>
                    )}
                  </div>

                  {/* Feed info */}
                  {selected.level < MAX_PET_LEVEL && (
                    <div style={{ background: "#0f0f1a", borderRadius: "8px", padding: "8px 12px", marginBottom: "12px" }}>
                      <div style={{ fontSize: "10px", color: "#4a4a5a", marginBottom: "4px" }}>FEED</div>
                      <div style={{ fontSize: "12px", color: "#c4bfb0" }}>
                        {selected.feedCost}x {selected.feedItem.replace(/_/g, " ")}
                      </div>
                      <div style={{ fontSize: "10px", color: "#4a4a5a", marginTop: "2px" }}>
                        Sudah diberi makan {selected.totalFed} kali
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {selected.isActive ? (
                      <button
                        onClick={() => handleAction("deactivate", selected.id)}
                        disabled={processing}
                        style={{
                          width: "100%", padding: "10px", borderRadius: "8px",
                          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                          color: "#ef4444", fontSize: "13px", fontWeight: "bold",
                          fontFamily: "Georgia, serif", cursor: "pointer",
                        }}
                      >
                        Nonaktifkan Pet
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction("activate", selected.id)}
                        disabled={processing}
                        style={{
                          width: "100%", padding: "10px", borderRadius: "8px",
                          background: `${selected.color}22`,
                          border: `1px solid ${selected.color}44`,
                          color: selected.color, fontSize: "13px", fontWeight: "bold",
                          fontFamily: "Georgia, serif", cursor: "pointer",
                        }}
                      >
                        ✓ Aktifkan Pet
                      </button>
                    )}

                    {selected.level < MAX_PET_LEVEL && (
                      <button
                        onClick={() => handleAction("feed", selected.id)}
                        disabled={processing}
                        style={{
                          width: "100%", padding: "10px", borderRadius: "8px",
                          background: "rgba(245,158,11,0.1)",
                          border: "1px solid rgba(245,158,11,0.25)",
                          color: "#f59e0b", fontSize: "13px", fontWeight: "bold",
                          fontFamily: "Georgia, serif", cursor: "pointer",
                        }}
                      >
                        🍖 Beri Makan
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div style={{
                  background: "#0f0f1a", borderRadius: "8px", padding: "12px",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: "11px", color: "#4a4a5a", marginBottom: "6px" }}>
                    Cara mendapatkan:
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b6b80", lineHeight: "1.5" }}>
                    {selected.source}
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelected(null)}
                style={{
                  width: "100%", padding: "8px", borderRadius: "8px", marginTop: "8px",
                  background: "transparent", border: "1px solid #2a2a3a",
                  color: "#6b6b80", fontSize: "12px",
                  fontFamily: "Georgia, serif", cursor: "pointer",
                }}
              >
                Tutup
              </button>
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