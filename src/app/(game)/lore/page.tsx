"use client";

import { useState, useEffect, useCallback } from "react";
import GameSidebar from "@/components/layout/GameSidebar";

const ZONE_INFO: Record<string, { name: string; icon: string; color: string; alignment: string }> = {
  zone1: { name: "Delta Nil",         icon: "🌊", color: "#16a34a", alignment: "Mesir" },
  zone2: { name: "Padang Pasir Barat",icon: "🏜️", color: "#d97706", alignment: "Mesir" },
  zone3: { name: "Nekropolis",         icon: "💀", color: "#7c3aed", alignment: "Mesir" },
  zone4: { name: "Kuil Karnak",        icon: "🏛️", color: "#dc2626", alignment: "Mesir" },
  zone5: { name: "Lembah Eufrat",      icon: "🌿", color: "#2563eb", alignment: "Mesopotamia" },
};

export default function LorePage() {
  const [character, setCharacter] = useState<any>(null);
  const [loreData, setLoreData]   = useState<any>(null);
  const [loading, setLoading]     = useState(true);
  const [selectedLore, setSelectedLore] = useState<any>(null);
  const [activeZone, setActiveZone]     = useState("all");

  const fetchData = useCallback(async () => {
    const [charRes, loreRes] = await Promise.all([
      fetch("/api/character"),
      fetch("/api/lore"),
    ]);
    const charData = await charRes.json();
    const loreDataRes = await loreRes.json();
    if (charData.success) setCharacter(charData.data);
    if (loreDataRes.success) setLoreData(loreDataRes.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#6b6b80", fontFamily: "Georgia, serif" }}>Memuat...</span>
    </div>
  );

  const fragments = loreData?.fragments ?? [];
  const collected = loreData?.collected ?? 0;
  const total     = loreData?.total ?? 0;

  const filtered = activeZone === "all"
    ? fragments
    : fragments.filter((f: any) => f.zoneId === activeZone);

  const collectedFiltered = filtered.filter((f: any) => f.collected);
  const uncollectedFiltered = filtered.filter((f: any) => !f.collected);

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#0a0a0f", color: "#e2e0d8", fontFamily: "Georgia, serif" }}>
      <GameSidebar character={character} />

      <main style={{ flex: 1, padding: "28px 24px", overflow: "auto", minWidth: 0 }}>
        <div className="game-mobile-spacer" style={{ height: 0 }} />

        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#f0ece0", margin: 0 }}>
            📜 Lore Fragments
          </h1>
          <p style={{ fontSize: "12px", color: "#6b6b80", margin: "3px 0 0" }}>
            {collected} / {total} fragment dikumpulkan
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: selectedLore ? "1fr 360px" : "1fr", gap: "20px" }}>

          {/* Left */}
          <div>
            {/* Zone filter tabs */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
              <button
                onClick={() => setActiveZone("all")}
                style={{
                  padding: "5px 14px", borderRadius: "20px", cursor: "pointer",
                  background: activeZone === "all" ? "rgba(245,158,11,0.15)" : "#111118",
                  border: activeZone === "all" ? "1px solid rgba(245,158,11,0.4)" : "1px solid #2a2a3a",
                  color: activeZone === "all" ? "#f59e0b" : "#6b6b80",
                  fontSize: "12px", fontFamily: "Georgia, serif",
                }}
              >
                Semua Zona
              </button>
              {Object.entries(ZONE_INFO).map(([zoneId, info]) => {
                const zoneLore     = fragments.filter((f: any) => f.zoneId === zoneId);
                const zoneCollected = zoneLore.filter((f: any) => f.collected).length;
                return (
                  <button
                    key={zoneId}
                    onClick={() => setActiveZone(zoneId)}
                    style={{
                      padding: "5px 14px", borderRadius: "20px", cursor: "pointer",
                      background: activeZone === zoneId ? `${info.color}22` : "#111118",
                      border: activeZone === zoneId ? `1px solid ${info.color}44` : "1px solid #2a2a3a",
                      color: activeZone === zoneId ? info.color : "#6b6b80",
                      fontSize: "12px", fontFamily: "Georgia, serif",
                    }}
                  >
                    {info.icon} {info.name}
                    <span style={{ fontSize: "10px", marginLeft: "4px", opacity: 0.7 }}>
                      {zoneCollected}/{zoneLore.length}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Collected fragments */}
            {collectedFiltered.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <div style={{
                  fontSize: "10px", letterSpacing: "0.15em", color: "#4ade80",
                  textTransform: "uppercase", marginBottom: "10px",
                }}>
                  ✓ Sudah Dikumpulkan ({collectedFiltered.length})
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {collectedFiltered.map((frag: any) => {
                    const zinfo = ZONE_INFO[frag.zoneId];
                    const isSelected = selectedLore?.id === frag.id;
                    return (
                      <button
                        key={frag.id}
                        onClick={() => setSelectedLore(isSelected ? null : frag)}
                        style={{
                          textAlign: "left", padding: "14px 16px",
                          borderRadius: "12px", border: "none", cursor: "pointer",
                          background: isSelected ? "#1a1a28" : "#111118",
                          outline: isSelected
                            ? `1px solid ${zinfo?.color ?? "#2a2a3a"}44`
                            : "1px solid #2a2a3a",
                          transition: "all 0.15s",
                          position: "relative", overflow: "hidden",
                        }}
                      >
                        {isSelected && (
                          <div style={{
                            position: "absolute", left: 0, top: 0, bottom: 0,
                            width: "3px", background: zinfo?.color ?? "#f59e0b",
                          }} />
                        )}
                        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                          <span style={{ fontSize: "20px" }}>📜</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                              <span style={{ fontSize: "13px", fontWeight: "bold", color: "#f0ece0" }}>
                                {frag.title}
                              </span>
                              <span style={{
                                fontSize: "9px", padding: "1px 7px", borderRadius: "8px",
                                color: zinfo?.color ?? "#6b6b80",
                                background: `${zinfo?.color ?? "#6b6b80"}15`,
                                border: `1px solid ${zinfo?.color ?? "#6b6b80"}33`,
                                flexShrink: 0, marginLeft: "8px",
                              }}>
                                {zinfo?.icon} {zinfo?.name}
                              </span>
                            </div>
                            <p style={{ fontSize: "11px", color: "#6b6b80", margin: 0, lineHeight: "1.5" }}>
                              {frag.content?.slice(0, 120)}...
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Uncollected fragments */}
            {uncollectedFiltered.length > 0 && (
              <div>
                <div style={{
                  fontSize: "10px", letterSpacing: "0.15em", color: "#4a4a5a",
                  textTransform: "uppercase", marginBottom: "10px",
                }}>
                  🔒 Belum Dikumpulkan ({uncollectedFiltered.length})
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {uncollectedFiltered.map((frag: any) => {
                    const zinfo = ZONE_INFO[frag.zoneId];
                    return (
                      <div
                        key={frag.id}
                        style={{
                          padding: "12px 16px", borderRadius: "10px",
                          background: "#0c0c14", border: "1px solid #1e1e2e",
                          opacity: 0.7,
                        }}
                      >
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <span style={{ fontSize: "16px", filter: "grayscale(1)", opacity: 0.4 }}>📜</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "12px", color: "#4a4a5a", marginBottom: "2px" }}>
                              ???
                            </div>
                            <div style={{ fontSize: "10px", color: "#3a3a4a" }}>
                              {zinfo?.icon} {zinfo?.name} · {frag.sourceDetail}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {filtered.length === 0 && (
              <div style={{
                background: "#111118", border: "1px solid #2a2a3a",
                borderRadius: "12px", padding: "40px", textAlign: "center",
              }}>
                <div style={{ fontSize: "28px", marginBottom: "8px", opacity: 0.3 }}>📜</div>
                <p style={{ color: "#4a4a5a", fontSize: "12px", fontStyle: "italic" }}>
                  Belum ada fragment di zona ini.
                </p>
              </div>
            )}
          </div>

          {/* Right: Lore reader */}
          {selectedLore && (
            <div style={{
              background: "#111118", border: "1px solid #2a2a3a",
              borderRadius: "14px", padding: "24px",
              alignSelf: "flex-start", position: "sticky", top: "20px",
            }}>
              {/* Zone badge */}
              {(() => {
                const zinfo = ZONE_INFO[selectedLore.zoneId];
                return (
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "5px",
                    background: `${zinfo?.color ?? "#6b6b80"}15`,
                    border: `1px solid ${zinfo?.color ?? "#6b6b80"}33`,
                    borderRadius: "8px", padding: "3px 10px",
                    fontSize: "10px", color: zinfo?.color ?? "#6b6b80",
                    marginBottom: "14px",
                  }}>
                    {zinfo?.icon} {zinfo?.name}
                  </div>
                );
              })()}

              <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#f0ece0", margin: "0 0 16px" }}>
                {selectedLore.title}
              </h2>

              {/* Decorative divider */}
              <div style={{
                height: "1px",
                background: "linear-gradient(90deg,transparent,#2a2a3a,transparent)",
                marginBottom: "16px",
              }} />

              <p style={{
                fontSize: "13px", color: "#c4bfb0",
                lineHeight: "1.9", margin: "0 0 20px",
                fontStyle: "italic",
              }}>
                "{selectedLore.content}"
              </p>

              <div style={{
                background: "#0f0f1a", borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "10px", color: "#4a4a5a",
              }}>
                <span style={{ color: "#6b6b80" }}>Sumber: </span>
                {selectedLore.sourceDetail}
              </div>

              <button
                onClick={() => setSelectedLore(null)}
                style={{
                  width: "100%", padding: "8px", borderRadius: "8px",
                  background: "transparent", border: "1px solid #2a2a3a",
                  color: "#6b6b80", fontSize: "12px",
                  fontFamily: "Georgia, serif", cursor: "pointer",
                  marginTop: "12px",
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