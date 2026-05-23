"use client";

import { useState, useEffect, useCallback } from "react";
import GameSidebar from "@/components/layout/GameSidebar";

const TIER_COLORS: Record<string, { text: string; border: string; bg: string }> = {
  common:    { text: "#9ca3af", border: "#374151", bg: "#1a1a28" },
  uncommon:  { text: "#4ade80", border: "#166534", bg: "#052e16" },
  rare:      { text: "#60a5fa", border: "#1e40af", bg: "#0f172a" },
  epic:      { text: "#c084fc", border: "#6b21a8", bg: "#1a0a2e" },
  legendary: { text: "#f59e0b", border: "#92400e", bg: "#1c0a00" },
  divine:    { text: "#f0ece0", border: "#6b6b80", bg: "#0a0a14" },
};

const TYPE_ICONS: Record<string, string> = {
  weapon: "⚔️", helmet: "⛑️", chest: "🥋", gloves: "🧤",
  boots: "👢", accessory: "💍", material: "🪨", consumable: "🧪",
};

export default function InventoryPage() {
  const [character, setCharacter] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [gold, setGold] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [sellQty, setSellQty] = useState(1);
  const [filter, setFilter] = useState<string>("all");
  const [feedback, setFeedback] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [selling, setSelling] = useState(false);

  const fetchData = useCallback(async () => {
    const [charRes, invRes] = await Promise.all([
      fetch("/api/character"),
      fetch("/api/inventory"),
    ]);
    const charData = await charRes.json();
    const invData = await invRes.json();
    if (charData.success) setCharacter(charData.data);
    if (invData.success) {
      setItems(invData.data.items);
      setGold(invData.data.gold);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function showFeedback(msg: string, type: "success" | "error") {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 2500);
  }

  async function handleSell(item: any, qty: number) {
    setSelling(true);
    const res = await fetch("/api/inventory/sell", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inventoryItemId: item.id, quantity: qty }),
    });
    const data = await res.json();
    setSelling(false);
    if (data.success) {
      showFeedback(`Terjual ${data.data.soldQty}x ${item.name} → +${data.data.goldGained} Gold`, "success");
      setSelectedItem(null);
      fetchData();
    } else {
      showFeedback(data.error, "error");
    }
  }

  async function handleSellAll() {
    setSelling(true);
    const res = await fetch("/api/inventory/sell-all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ excludeIds: [] }),
    });
    const data = await res.json();
    setSelling(false);
    if (data.success) {
      showFeedback(`Semua item terjual → +${data.data.totalGold} Gold`, "success");
      setSelectedItem(null);
      fetchData();
    } else {
      showFeedback(data.error, "error");
    }
  }

  const filteredItems = filter === "all"
    ? items
    : items.filter((i) => i.type === filter);

  const totalSellValue = filteredItems.reduce((sum, i) => sum + (i.sellPrice * i.quantity), 0);

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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#f0ece0", margin: 0 }}>🎒 Inventory</h1>
            <p style={{ fontSize: "12px", color: "#6b6b80", margin: "3px 0 0" }}>
              {items.length} jenis item · Total nilai: <span style={{ color: "#f59e0b" }}>{totalSellValue.toLocaleString()} Gold</span>
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              background: "#111118", border: "1px solid #2a2a3a",
              borderRadius: "10px", padding: "8px 16px",
              display: "flex", alignItems: "center", gap: "7px",
            }}>
              <span>💰</span>
              <span style={{ fontSize: "15px", fontWeight: "bold", color: "#f59e0b" }}>{gold.toLocaleString()}</span>
            </div>
            <button
              onClick={handleSellAll}
              disabled={selling || items.length === 0}
              style={{
                padding: "8px 16px", borderRadius: "10px",
                background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)",
                color: "#f59e0b", fontSize: "12px", fontFamily: "Georgia, serif",
                cursor: "pointer", fontWeight: "bold",
                opacity: selling || items.length === 0 ? 0.5 : 1,
              }}
            >
              Jual Semua
            </button>
          </div>
        </div>

        {/* Feedback toast */}
        {feedback && (
          <div style={{
            position: "fixed", top: "20px", right: "20px", zIndex: 100,
            background: feedback.type === "success" ? "#052e16" : "#1a0a0a",
            border: `1px solid ${feedback.type === "success" ? "#166534" : "#7f1d1d"}`,
            borderRadius: "10px", padding: "12px 18px",
            color: feedback.type === "success" ? "#4ade80" : "#ef4444",
            fontSize: "13px", fontFamily: "Georgia, serif",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}>
            {feedback.msg}
          </div>
        )}

        <div style={{ display: "flex", gap: "20px" }}>

          {/* Left: item grid */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Filter tabs */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
              {["all", "material", "weapon", "consumable"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "5px 14px", borderRadius: "20px",
                    background: filter === f ? "rgba(245,158,11,0.15)" : "#111118",
                    border: filter === f ? "1px solid rgba(245,158,11,0.4)" : "1px solid #2a2a3a",
                    color: filter === f ? "#f59e0b" : "#6b6b80",
                    fontSize: "12px", fontFamily: "Georgia, serif", cursor: "pointer",
                  }}
                >
                  {f === "all" ? "Semua" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Item grid */}
            {filteredItems.length === 0 ? (
              <div style={{
                background: "#111118", border: "1px solid #2a2a3a",
                borderRadius: "14px", padding: "60px 20px", textAlign: "center",
              }}>
                <div style={{ fontSize: "32px", marginBottom: "10px", opacity: 0.3 }}>🎒</div>
                <p style={{ color: "#4a4a5a", fontSize: "13px", fontStyle: "italic" }}>
                  Inventory kosong. Mulai farming untuk dapat item!
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
                {filteredItems.map((item) => {
                  const tier = TIER_COLORS[item.tier] ?? TIER_COLORS.common;
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setSelectedItem(isSelected ? null : item); setSellQty(1); }}
                      style={{
                        textAlign: "left", padding: "12px",
                        borderRadius: "10px", border: "none", cursor: "pointer",
                        background: isSelected ? tier.bg : "#111118",
                        outline: isSelected ? `1px solid ${tier.border}` : "1px solid #2a2a3a",
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "22px" }}>{TYPE_ICONS[item.type] ?? "📦"}</span>
                        <span style={{
                          fontSize: "9px", padding: "2px 6px", borderRadius: "4px",
                          background: tier.bg, border: `1px solid ${tier.border}`,
                          color: tier.text, textTransform: "capitalize",
                        }}>{item.tier}</span>
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: "bold", color: "#f0ece0", marginBottom: "2px" }}>
                        {item.name}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "11px", color: "#6b6b80" }}>x{item.quantity}</span>
                        <span style={{ fontSize: "11px", color: "#f59e0b" }}>
                          {(item.sellPrice * item.quantity).toLocaleString()}g
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: item detail / sell panel */}
          {selectedItem && (
            <div style={{
              width: "240px", flexShrink: 0,
              background: "#111118", border: "1px solid #2a2a3a",
              borderRadius: "14px", padding: "18px",
              alignSelf: "flex-start", position: "sticky", top: "20px",
            }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#6b6b80", marginBottom: "12px", paddingBottom: "8px", borderBottom: "1px solid #1e1e2e" }}>
                DETAIL ITEM
              </div>

              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <div style={{ fontSize: "40px", marginBottom: "8px" }}>{TYPE_ICONS[selectedItem.type] ?? "📦"}</div>
                <div style={{ fontSize: "15px", fontWeight: "bold", color: "#f0ece0", marginBottom: "4px" }}>
                  {selectedItem.name}
                </div>
                <div style={{
                  display: "inline-block", fontSize: "10px", padding: "2px 10px",
                  borderRadius: "10px",
                  background: TIER_COLORS[selectedItem.tier]?.bg,
                  border: `1px solid ${TIER_COLORS[selectedItem.tier]?.border}`,
                  color: TIER_COLORS[selectedItem.tier]?.text,
                  textTransform: "capitalize", marginBottom: "8px",
                }}>{selectedItem.tier}</div>
                <p style={{ fontSize: "11px", color: "#6b6b80", lineHeight: "1.5", margin: 0 }}>
                  {selectedItem.description}
                </p>
              </div>

              <div style={{ background: "#0f0f1a", borderRadius: "8px", padding: "10px", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                  <span style={{ color: "#6b6b80" }}>Jumlah</span>
                  <span style={{ color: "#f0ece0" }}>x{selectedItem.quantity}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "#6b6b80" }}>Harga jual</span>
                  <span style={{ color: "#f59e0b" }}>{selectedItem.sellPrice}g / item</span>
                </div>
              </div>

              {/* Sell controls */}
              <div style={{ marginBottom: "10px" }}>
                <div style={{ fontSize: "10px", color: "#6b6b80", marginBottom: "6px" }}>Jumlah jual</div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <button
                    onClick={() => setSellQty(Math.max(1, sellQty - 1))}
                    style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#1a1a28", border: "1px solid #2a2a3a", color: "#e2e0d8", cursor: "pointer", fontSize: "14px" }}
                  >-</button>
                  <input
                    type="number"
                    value={sellQty}
                    min={1}
                    max={selectedItem.quantity}
                    onChange={(e) => setSellQty(Math.min(selectedItem.quantity, Math.max(1, parseInt(e.target.value) || 1)))}
                    style={{
                      flex: 1, textAlign: "center", background: "#1a1a28",
                      border: "1px solid #2a2a3a", borderRadius: "6px",
                      color: "#f0ece0", padding: "4px", fontSize: "13px",
                      fontFamily: "Georgia, serif",
                    }}
                  />
                  <button
                    onClick={() => setSellQty(Math.min(selectedItem.quantity, sellQty + 1))}
                    style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#1a1a28", border: "1px solid #2a2a3a", color: "#e2e0d8", cursor: "pointer", fontSize: "14px" }}
                  >+</button>
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                  {[1, 10, 100].map((n) => (
                    <button
                      key={n}
                      onClick={() => setSellQty(Math.min(selectedItem.quantity, n))}
                      style={{
                        flex: 1, padding: "4px", borderRadius: "5px",
                        background: "#1a1a28", border: "1px solid #2a2a3a",
                        color: "#6b6b80", fontSize: "10px", cursor: "pointer",
                        fontFamily: "Georgia, serif",
                      }}
                    >{n}</button>
                  ))}
                  <button
                    onClick={() => setSellQty(selectedItem.quantity)}
                    style={{
                      flex: 1, padding: "4px", borderRadius: "5px",
                      background: "#1a1a28", border: "1px solid #2a2a3a",
                      color: "#6b6b80", fontSize: "10px", cursor: "pointer",
                      fontFamily: "Georgia, serif",
                    }}
                  >Max</button>
                </div>
              </div>

              <div style={{ background: "#0f0f1a", borderRadius: "8px", padding: "8px 10px", marginBottom: "12px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "#6b6b80" }}>Total</span>
                <span style={{ fontSize: "14px", fontWeight: "bold", color: "#f59e0b" }}>
                  +{(selectedItem.sellPrice * sellQty).toLocaleString()} Gold
                </span>
              </div>

              <button
                onClick={() => handleSell(selectedItem, sellQty)}
                disabled={selling}
                style={{
                  width: "100%", padding: "10px", borderRadius: "8px",
                  background: "#f59e0b", border: "none",
                  color: "#0a0a0f", fontSize: "13px", fontWeight: "bold",
                  fontFamily: "Georgia, serif", cursor: "pointer",
                  opacity: selling ? 0.5 : 1,
                }}
              >
                Jual {sellQty}x {selectedItem.name}
              </button>

              <button
                onClick={() => setSelectedItem(null)}
                style={{
                  width: "100%", padding: "8px", borderRadius: "8px",
                  background: "transparent", border: "1px solid #2a2a3a",
                  color: "#6b6b80", fontSize: "12px",
                  fontFamily: "Georgia, serif", cursor: "pointer", marginTop: "6px",
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