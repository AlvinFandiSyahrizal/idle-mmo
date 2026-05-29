"use client";

import { useState, useEffect, useCallback } from "react";
import GameSidebar from "@/components/layout/GameSidebar";
import { getItemById } from "@/data/items";

const TIER_STYLE: Record<string, { text: string; border: string; bg: string }> = {
  common:    { text: "#9ca3af", border: "#374151",  bg: "#1a1a28" },
  uncommon:  { text: "#4ade80", border: "#166534",  bg: "#052e16" },
  rare:      { text: "#60a5fa", border: "#1e40af",  bg: "#0f172a" },
  epic:      { text: "#c084fc", border: "#6b21a8",  bg: "#1a0a2e" },
  legendary: { text: "#f59e0b", border: "#92400e",  bg: "#1c0a00" },
  divine:    { text: "#f0ece0", border: "#6b6b80",  bg: "#0a0a14" },
};

const TYPE_ICONS: Record<string, string> = {
  weapon: "⚔️", helmet: "⛑️", chest: "🥋", gloves: "🧤",
  boots: "👢", accessory: "💍", material: "🪨", consumable: "🧪",
};

const GEAR_SLOTS = [
  { key: "weapon",     label: "Weapon",    icon: "⚔️" },
  { key: "helmet",     label: "Helmet",    icon: "⛑️" },
  { key: "chest",      label: "Chest",     icon: "🥋" },
  { key: "gloves",     label: "Gloves",    icon: "🧤" },
  { key: "boots",      label: "Boots",     icon: "👢" },
  { key: "accessory1", label: "Accessory", icon: "💍" },
];

const EQUIPPABLE_TYPES = ["weapon", "helmet", "chest", "gloves", "boots", "accessory"];

export default function InventoryPage() {
  const [character, setCharacter]     = useState<any>(null);
  const [items, setItems]             = useState<any[]>([]);
  const [gold, setGold]               = useState(0);
  const [equipment, setEquipment]     = useState<any>({});
  const [loading, setLoading]         = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [sellQty, setSellQty]         = useState(1);
  const [filter, setFilter]           = useState("all");
  const [feedback, setFeedback]       = useState<{ msg: string; ok: boolean } | null>(null);
  const [processing, setProcessing]   = useState(false);

  const fetchData = useCallback(async () => {
    const [charRes, invRes] = await Promise.all([
      fetch("/api/character"),
      fetch("/api/inventory"),
    ]);
    const charData = await charRes.json();
    const invData  = await invRes.json();

    if (charData.success) {
      setCharacter(charData.data);
      setEquipment(charData.data.enrichedEquipment ?? {});
    }
    if (invData.success) {
      setItems(invData.data.items);
      setGold(invData.data.gold);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function showFeedback(msg: string, ok: boolean) {
    setFeedback({ msg, ok });
    setTimeout(() => setFeedback(null), 2500);
  }

  async function handleEquip(item: any) {
    setProcessing(true);
    const res  = await fetch("/api/inventory/equip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "equip", inventoryItemId: item.id }),
    });
    const data = await res.json();
    setProcessing(false);
    if (data.success) {
      showFeedback(`✅ ${item.name} di-equip!`, true);
      await fetchData();
      setSelectedItem(null);
    } else {
      showFeedback(data.error, false);
    }
  }

  async function handleUnequip(slot: string) {
    setProcessing(true);
    const res  = await fetch("/api/inventory/equip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "unequip", slot }),
    });
    const data = await res.json();
    setProcessing(false);
    if (data.success) {
      showFeedback("Item di-unequip.", true);
      await fetchData();
      setSelectedItem(null);
    } else {
      showFeedback(data.error, false);
    }
  }

  async function handleSell(item: any, qty: number) {
    setProcessing(true);
    const res  = await fetch("/api/inventory/sell", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inventoryItemId: item.id, quantity: qty }),
    });
    const data = await res.json();
    setProcessing(false);
    if (data.success) {
      showFeedback(`Terjual ${data.data.soldQty}x ${item.name} → +${data.data.goldGained} Gold`, true);
      setSelectedItem(null);
      fetchData();
    } else {
      showFeedback(data.error, false);
    }
  }

  async function handleSellAll() {
    // Don't sell equipped items
    const equippedIds = Object.values(equipment)
      .filter(Boolean)
      .map((e: any) => e.id);

    setProcessing(true);
    const res  = await fetch("/api/inventory/sell-all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ excludeIds: equippedIds }),
    });
    const data = await res.json();
    setProcessing(false);
    if (data.success) {
      showFeedback(`Semua item terjual → +${data.data.totalGold} Gold`, true);
      setSelectedItem(null);
      fetchData();
    } else {
      showFeedback(data.error, false);
    }
  }

  const filteredItems = filter === "all" ? items
    : filter === "equippable" ? items.filter((i) => EQUIPPABLE_TYPES.includes(i.type))
    : items.filter((i) => i.type === filter);

  const isItemEquipped = (itemId: string) =>
    Object.values(equipment).some((e: any) => e?.id === itemId);

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
              {items.length} jenis item · 💰 {gold.toLocaleString()} Gold
            </p>
          </div>
          <button
            onClick={handleSellAll}
            disabled={processing || items.length === 0}
            style={{
              padding: "8px 16px", borderRadius: "10px",
              background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)",
              color: "#f59e0b", fontSize: "12px", fontFamily: "Georgia, serif",
              cursor: "pointer", fontWeight: "bold",
              opacity: processing || items.length === 0 ? 0.5 : 1,
            }}
          >
            Jual Semua (non-equip)
          </button>
        </div>

        {/* Toast */}
        {feedback && (
          <div style={{
            position: "fixed", top: "20px", right: "20px", zIndex: 100,
            background: feedback.ok ? "#052e16" : "#1a0a0a",
            border: `1px solid ${feedback.ok ? "#166534" : "#7f1d1d"}`,
            borderRadius: "10px", padding: "12px 18px",
            color: feedback.ok ? "#4ade80" : "#ef4444",
            fontSize: "13px", fontFamily: "Georgia, serif",
          }}>
            {feedback.msg}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px" }}>

          {/* Left: Equipment + Inventory */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Equipment slots */}
            <div style={{
              background: "#111118", border: "1px solid #2a2a3a",
              borderRadius: "14px", padding: "16px",
            }}>
              <div style={{
                fontSize: "10px", letterSpacing: "0.15em", color: "#6b6b80",
                textTransform: "uppercase", marginBottom: "12px",
                paddingBottom: "8px", borderBottom: "1px solid #1e1e2e",
              }}>
                Equipment
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "8px" }}>
                {GEAR_SLOTS.map((slot) => {
                  const equipped = equipment[slot.key];
                  const tier     = equipped ? TIER_STYLE[equipped.tier] ?? TIER_STYLE.common : null;
                  return (
                    <div
                      key={slot.key}
                      style={{
                        background: equipped ? tier!.bg : "#0f0f1a",
                        border: `1px solid ${equipped ? tier!.border : "#1e1e2e"}`,
                        borderRadius: "10px", padding: "10px",
                        cursor: equipped ? "pointer" : "default",
                        transition: "all 0.2s",
                      }}
                      onClick={() => equipped && setSelectedItem({ ...equipped, isEquipped: true, equippedSlot: slot.key })}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "16px" }}>{slot.icon}</span>
                        <span style={{ fontSize: "10px", color: "#4a4a5a" }}>{slot.label}</span>
                      </div>
                      {equipped ? (
                        <>
                          <div style={{ fontSize: "11px", fontWeight: "bold", color: tier!.text, lineHeight: "1.3" }}>
                            {equipped.name}
                          </div>
                          {equipped.stats && Object.keys(equipped.stats).length > 0 && (
                            <div style={{ marginTop: "4px", display: "flex", flexWrap: "wrap", gap: "3px" }}>
                              {Object.entries(equipped.stats).map(([k, v]) => v ? (
                                <span key={k} style={{
                                  fontSize: "9px", color: "#4ade80",
                                  background: "rgba(34,197,94,0.08)",
                                  borderRadius: "3px", padding: "1px 4px",
                                }}>
                                  +{v as number} {k.replace("_stat", "").toUpperCase()}
                                </span>
                              ) : null)}
                            </div>
                          )}
                        </>
                      ) : (
                        <div style={{ fontSize: "10px", color: "#3a3a4a", fontStyle: "italic" }}>
                          Kosong
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filter tabs */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {[
                { id: "all",       label: "Semua" },
                { id: "equippable",label: "⚔️ Gear" },
                { id: "material",  label: "🪨 Material" },
                { id: "consumable",label: "🧪 Consumable" },
              ].map((f) => (
                <button key={f.id} onClick={() => setFilter(f.id)} style={{
                  padding: "5px 14px", borderRadius: "20px",
                  background: filter === f.id ? "rgba(245,158,11,0.15)" : "#111118",
                  border: filter === f.id ? "1px solid rgba(245,158,11,0.4)" : "1px solid #2a2a3a",
                  color: filter === f.id ? "#f59e0b" : "#6b6b80",
                  fontSize: "12px", fontFamily: "Georgia, serif", cursor: "pointer",
                }}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Item grid */}
            {filteredItems.length === 0 ? (
              <div style={{
                background: "#111118", border: "1px solid #2a2a3a",
                borderRadius: "14px", padding: "50px", textAlign: "center",
              }}>
                <div style={{ fontSize: "28px", opacity: 0.3, marginBottom: "8px" }}>🎒</div>
                <p style={{ color: "#4a4a5a", fontSize: "12px", fontStyle: "italic" }}>
                  Inventory kosong di kategori ini.
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "8px" }}>
                {filteredItems.map((item) => {
                  const tier       = TIER_STYLE[item.tier] ?? TIER_STYLE.common;
                  const isSelected = selectedItem?.id === item.id;
                  const isEquipped = isItemEquipped(item.id);

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedItem(
                          isSelected
                            ? null
                            : {
                                ...item,
                                isEquipped,
                                equippedSlot:
                                  item.type === "accessory"
                                    ? "accessory1"
                                    : item.type,
                              }
                        ); 
                          setSellQty(1);
                      }}
                      style={{
                        textAlign: "left", padding: "10px 12px",
                        borderRadius: "10px", border: "none", cursor: "pointer",
                        background: isSelected ? tier.bg : "#111118",
                        outline: isSelected
                          ? `2px solid ${tier.border}`
                          : isEquipped
                          ? `1px solid ${tier.border}66`
                          : "1px solid #2a2a3a",
                        transition: "all 0.15s", position: "relative",
                      }}
                    >
                      {isEquipped && (
                        <div style={{
                          position: "absolute", top: "6px", right: "6px",
                          fontSize: "8px", color: "#4ade80",
                          background: "rgba(34,197,94,0.15)", borderRadius: "3px",
                          padding: "1px 4px",
                        }}>
                          EQUIPPED
                        </div>
                      )}
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "20px" }}>{TYPE_ICONS[item.type] ?? "📦"}</span>
                        <span style={{
                          fontSize: "8px", padding: "1px 5px", borderRadius: "4px",
                          background: tier.bg, border: `1px solid ${tier.border}`,
                          color: tier.text, textTransform: "capitalize",
                        }}>{item.tier}</span>
                      </div>
                      <div style={{ fontSize: "11px", fontWeight: "bold", color: "#f0ece0", marginBottom: "2px", lineHeight: "1.3" }}>
                        {item.name}
                      </div>
                      {/* Stats preview */}
                      {item.stats && Object.keys(item.stats).length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "2px", marginBottom: "4px" }}>
                          {Object.entries(item.stats).map(([k, v]) => v ? (
                            <span key={k} style={{ fontSize: "9px", color: "#4ade80" }}>
                              +{v as number}{k.replace("_stat","").toUpperCase().slice(0,3)}
                            </span>
                          ) : null)}
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "10px", color: "#6b6b80" }}>x{item.quantity}</span>
                        <span style={{ fontSize: "10px", color: "#f59e0b" }}>{(item.sellPrice * item.quantity).toLocaleString()}g</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Item detail panel */}
          {selectedItem && (
            <div style={{
              background: "#111118", border: "1px solid #2a2a3a",
              borderRadius: "14px", padding: "18px",
              alignSelf: "flex-start", position: "sticky", top: "20px",
            }}>
              <div style={{
                fontSize: "10px", letterSpacing: "0.15em", color: "#6b6b80",
                marginBottom: "12px", paddingBottom: "8px", borderBottom: "1px solid #1e1e2e",
              }}>
                DETAIL ITEM
              </div>

              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <div style={{ fontSize: "36px", marginBottom: "8px" }}>
                  {TYPE_ICONS[selectedItem.type] ?? "📦"}
                </div>
                <div style={{ fontSize: "15px", fontWeight: "bold", color: "#f0ece0", marginBottom: "4px" }}>
                  {selectedItem.name}
                </div>
                <span style={{
                  fontSize: "10px", padding: "2px 10px", borderRadius: "10px",
                  background: TIER_STYLE[selectedItem.tier]?.bg,
                  border: `1px solid ${TIER_STYLE[selectedItem.tier]?.border}`,
                  color: TIER_STYLE[selectedItem.tier]?.text,
                  textTransform: "capitalize",
                }}>
                  {selectedItem.tier}
                </span>
                <p style={{ fontSize: "11px", color: "#6b6b80", marginTop: "8px", lineHeight: "1.5" }}>
                  {selectedItem.description}
                </p>
              </div>

              {/* Stats */}
              {selectedItem.stats && Object.keys(selectedItem.stats).length > 0 && (
                <div style={{
                  background: "#0f0f1a", borderRadius: "8px", padding: "10px 12px",
                  marginBottom: "14px",
                }}>
                  <div style={{ fontSize: "10px", color: "#4a4a5a", marginBottom: "6px" }}>STATS</div>
                  {Object.entries(selectedItem.stats).map(([k, v]) => v ? (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", padding: "2px 0" }}>
                      <span style={{ color: "#6b6b80" }}>{k.replace("_stat", "").toUpperCase()}</span>
                      <span style={{ color: "#4ade80", fontWeight: "bold" }}>+{v as number}</span>
                    </div>
                  ) : null)}
                </div>
              )}

              {/* Equip / Unequip / Sell */}
              {EQUIPPABLE_TYPES.includes(selectedItem.type) ? (
                selectedItem.isEquipped ? (
                  <button
                    onClick={() => handleUnequip(selectedItem.equippedSlot)}
                    disabled={processing}
                    style={{
                      width: "100%", padding: "10px", borderRadius: "8px", marginBottom: "8px",
                      background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                      color: "#ef4444", fontSize: "13px", fontWeight: "bold",
                      fontFamily: "Georgia, serif", cursor: "pointer",
                    }}
                  >
                    Lepas Item
                  </button>
                ) : (
                  <button
                    onClick={() => handleEquip(selectedItem)}
                    disabled={processing}
                    style={{
                      width: "100%", padding: "10px", borderRadius: "8px", marginBottom: "8px",
                      background: "linear-gradient(135deg,#d97706,#f59e0b)",
                      border: "none",
                      color: "#0a0a0f", fontSize: "13px", fontWeight: "bold",
                      fontFamily: "Georgia, serif", cursor: "pointer",
                    }}
                  >
                    ⚔️ Equip Item
                  </button>
                )
              ) : null}

              {/* Sell controls */}
              {!selectedItem.isEquipped && (
                <>
                  <div style={{ marginBottom: "8px" }}>
                    <div style={{ fontSize: "10px", color: "#6b6b80", marginBottom: "6px" }}>Jumlah jual</div>
                    <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
                      {[1, 10, selectedItem.quantity].map((n, i) => (
                        <button key={i} onClick={() => setSellQty(Math.min(selectedItem.quantity, n))} style={{
                          flex: 1, padding: "4px", borderRadius: "5px",
                          background: "#0f0f1a", border: "1px solid #1e1e2e",
                          color: "#6b6b80", fontSize: "10px", cursor: "pointer",
                          fontFamily: "Georgia, serif",
                        }}>
                          {i === 2 ? "Max" : n}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <button onClick={() => setSellQty(Math.max(1, sellQty - 1))} style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#1a1a28", border: "1px solid #2a2a3a", color: "#e2e0d8", cursor: "pointer", fontSize: "14px" }}>-</button>
                      <input
                        type="number" value={sellQty} min={1} max={selectedItem.quantity}
                        onChange={(e) => setSellQty(Math.min(selectedItem.quantity, Math.max(1, parseInt(e.target.value) || 1)))}
                        style={{ flex: 1, textAlign: "center", background: "#1a1a28", border: "1px solid #2a2a3a", borderRadius: "6px", color: "#f0ece0", padding: "4px", fontSize: "13px", fontFamily: "Georgia, serif" }}
                      />
                      <button onClick={() => setSellQty(Math.min(selectedItem.quantity, sellQty + 1))} style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#1a1a28", border: "1px solid #2a2a3a", color: "#e2e0d8", cursor: "pointer", fontSize: "14px" }}>+</button>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#6b6b80" }}>Total</span>
                    <span style={{ fontSize: "14px", fontWeight: "bold", color: "#f59e0b" }}>
                      +{(selectedItem.sellPrice * sellQty).toLocaleString()} Gold
                    </span>
                  </div>

                  <button
                    onClick={() => handleSell(selectedItem, sellQty)}
                    disabled={processing}
                    style={{
                      width: "100%", padding: "10px", borderRadius: "8px",
                      background: "#f59e0b", border: "none",
                      color: "#0a0a0f", fontSize: "13px", fontWeight: "bold",
                      fontFamily: "Georgia, serif", cursor: "pointer",
                    }}
                  >
                    Jual {sellQty}x
                  </button>
                </>
              )}

              <button onClick={() => setSelectedItem(null)} style={{
                width: "100%", padding: "8px", borderRadius: "8px", marginTop: "6px",
                background: "transparent", border: "1px solid #2a2a3a",
                color: "#6b6b80", fontSize: "12px",
                fontFamily: "Georgia, serif", cursor: "pointer",
              }}>
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