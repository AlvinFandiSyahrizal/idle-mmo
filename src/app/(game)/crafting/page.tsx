"use client";

import { useState, useEffect, useCallback } from "react";
import GameSidebar from "@/components/layout/GameSidebar";
import { ITEM_SOURCES } from "@/data/items/items/sources";

const CATEGORY_TABS = [
  { id: "all", label: "Semua" },
  { id: "consumable", label: "⚗️ Consumable" },
  { id: "weapon", label: "⚔️ Weapon" },
  { id: "armor", label: "🛡️ Armor" },
  { id: "material", label: "🪨 Material" },
];

const SKILL_COLORS: Record<string, string> = {
  alchemy: "#34d399",
  smithing: "#f59e0b",
  runecrafting: "#818cf8",
  enchanting: "#f472b6",
};

const TIER_COLORS: Record<string, string> = {
  common: "#9ca3af",
  uncommon: "#4ade80",
  rare: "#60a5fa",
  epic: "#c084fc",
  legendary: "#f59e0b",
  divine: "#f0ece0",
};

export default function CraftingPage() {
  const [character, setCharacter] = useState<any>(null);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<any>(null);
  const [crafting, setCrafting] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [sourcePopup, setSourcePopup] = useState<{ itemId: string; itemName: string; x: number; y: number } | null>(null);

  const fetchData = useCallback(async () => {
    const [charRes, craftRes] = await Promise.all([
      fetch("/api/character"),
      fetch("/api/crafting"),
    ]);
    const charData = await charRes.json();
    const craftData = await craftRes.json();
    if (charData.success) setCharacter(charData.data);
    if (craftData.success) setRecipes(craftData.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function showFeedback(msg: string, ok: boolean) {
    setFeedback({ msg, ok });
    setTimeout(() => setFeedback(null), 3000);
  }

  async function handleCraft(recipe: any) {
    setCrafting(true);
    const res = await fetch("/api/crafting/craft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeId: recipe.id }),
    });
    const data = await res.json();
    setCrafting(false);
    if (data.success) {
      const d = data.data;
      let msg = `✅ Berhasil craft ${recipe.outputName} x${recipe.outputQuantity}! +${d.expGained} EXP`;
      if (d.skillLevelUp) msg += ` 🎉 ${recipe.requiredSkill} naik ke Lv ${d.newSkillLevel}!`;
      showFeedback(msg, true);
      fetchData();
      // Update selected with fresh data
      setSelected((prev: any) => prev ? { ...prev } : null);
    } else {
      showFeedback(`❌ ${data.error}`, false);
    }
  }

  const filtered = category === "all"
    ? recipes
    : recipes.filter((r) => r.category === category);

  const craftableCount = filtered.filter((r) => r.canCraft).length;

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
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#f0ece0", margin: 0 }}>
            🔨 Crafting
          </h1>
          <p style={{ fontSize: "12px", color: "#6b6b80", margin: "3px 0 0" }}>
            {craftableCount} resep bisa di-craft sekarang
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
            maxWidth: "360px", lineHeight: "1.5",
          }}>
            {feedback.msg}
          </div>
        )}

        <div style={{ display: "flex", gap: "20px" }}>

          {/* Left: Recipe list */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Category tabs */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setCategory(tab.id); setSelected(null); }}
                  style={{
                    padding: "5px 14px", borderRadius: "20px",
                    background: category === tab.id ? "rgba(245,158,11,0.15)" : "#111118",
                    border: category === tab.id ? "1px solid rgba(245,158,11,0.4)" : "1px solid #2a2a3a",
                    color: category === tab.id ? "#f59e0b" : "#6b6b80",
                    fontSize: "12px", fontFamily: "Georgia, serif", cursor: "pointer",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Recipe grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {filtered.map((recipe) => {
                const isSelected = selected?.id === recipe.id;
                const skillColor = SKILL_COLORS[recipe.requiredSkill] ?? "#6b6b80";
                return (
                  <button
                    key={recipe.id}
                    onClick={() => setSelected(isSelected ? null : recipe)}
                    style={{
                      textAlign: "left", padding: "14px 16px",
                      borderRadius: "12px", border: "none", cursor: "pointer",
                      background: isSelected ? "#1a1a28" : "#111118",
                      outline: isSelected
                        ? "1px solid #3a3a5a"
                        : recipe.canCraft
                        ? "1px solid #1e3a1e"
                        : "1px solid #2a2a3a",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {/* Status indicator */}
                      <div style={{
                        width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
                        background: recipe.canCraft ? "#22c55e" : recipe.skillMet ? "#f59e0b" : "#4a4a5a",
                        boxShadow: recipe.canCraft ? "0 0 6px #22c55e88" : "none",
                      }} />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                          <span style={{ fontSize: "14px", fontWeight: "bold", color: recipe.canCraft ? "#f0ece0" : "#6b6b80" }}>
                            {recipe.outputName}
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                            <span style={{
                              fontSize: "9px", padding: "1px 7px", borderRadius: "10px",
                              color: TIER_COLORS[recipe.outputTier] ?? "#9ca3af",
                              border: `1px solid ${TIER_COLORS[recipe.outputTier] ?? "#374151"}44`,
                              background: "rgba(0,0,0,0.3)",
                              textTransform: "capitalize",
                            }}>{recipe.outputTier}</span>
                            <span style={{
                              fontSize: "10px", padding: "1px 8px", borderRadius: "10px",
                              color: skillColor,
                              border: `1px solid ${skillColor}33`,
                              background: `${skillColor}11`,
                            }}>
                              {recipe.requiredSkill} Lv {recipe.requiredSkillLevel}
                            </span>
                          </div>
                        </div>
                        <p style={{ fontSize: "11px", color: "#4a4a5a", margin: "3px 0 0", lineHeight: "1.4" }}>
                          {recipe.description}
                        </p>

                        {/* Ingredient preview */}
                        <div style={{ display: "flex", gap: "6px", marginTop: "6px", flexWrap: "wrap" }}>
                          {recipe.ingredientsDetail.map((ing: any) => (
                            <span key={ing.itemId} style={{
                              fontSize: "10px", padding: "1px 7px", borderRadius: "6px",
                              background: ing.enough ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                              border: `1px solid ${ing.enough ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                              color: ing.enough ? "#4ade80" : "#f87171",
                            }}>
                              {ing.name} {ing.owned}/{ing.required}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}

              {filtered.length === 0 && (
                <div style={{
                  background: "#111118", border: "1px solid #2a2a3a",
                  borderRadius: "12px", padding: "40px", textAlign: "center",
                }}>
                  <div style={{ fontSize: "28px", opacity: 0.3, marginBottom: "8px" }}>🔨</div>
                  <p style={{ color: "#4a4a5a", fontSize: "12px", fontStyle: "italic" }}>Tidak ada resep di kategori ini.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Craft panel */}
          {selected && (
            <div style={{
              width: "260px", flexShrink: 0,
              background: "#111118", border: "1px solid #2a2a3a",
              borderRadius: "14px", padding: "18px",
              alignSelf: "flex-start", position: "sticky", top: "20px",
            }}>
              <div style={{
                fontSize: "10px", letterSpacing: "0.15em", color: "#6b6b80",
                marginBottom: "12px", paddingBottom: "8px", borderBottom: "1px solid #1e1e2e",
              }}>
                DETAIL RESEP
              </div>

              {/* Output */}
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <div style={{ fontSize: "36px", marginBottom: "6px" }}>
                  {selected.category === "consumable" ? "⚗️"
                    : selected.category === "weapon" ? "⚔️"
                    : selected.category === "armor" ? "🛡️"
                    : "🪨"}
                </div>
                <div style={{ fontSize: "15px", fontWeight: "bold", color: "#f0ece0" }}>
                  {selected.outputName}
                </div>
                <div style={{ fontSize: "10px", color: TIER_COLORS[selected.outputTier], marginTop: "2px", textTransform: "capitalize" }}>
                  {selected.outputTier} · x{selected.outputQuantity}
                </div>
                <p style={{ fontSize: "11px", color: "#6b6b80", marginTop: "6px", lineHeight: "1.5" }}>
                  {selected.outputDescription}
                </p>
              </div>

              {/* Skill requirement */}
              <div style={{
                background: "#0f0f1a", borderRadius: "8px", padding: "10px 12px",
                marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontSize: "11px", color: "#6b6b80" }}>Skill dibutuhkan</span>
                <span style={{
                  fontSize: "11px", fontWeight: "bold",
                  color: selected.skillMet ? SKILL_COLORS[selected.requiredSkill] : "#ef4444",
                }}>
                  {selected.requiredSkill} Lv {selected.requiredSkillLevel}
                  {selected.skillMet ? " ✓" : ` (Lv kamu: ${selected.skillLevel})`}
                </span>
              </div>

              {/* Ingredients */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "10px", letterSpacing: "0.1em", color: "#6b6b80", marginBottom: "8px" }}>
                  BAHAN YANG DIBUTUHKAN
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
{selected.ingredientsDetail.map((ing: any) => {
  const sources = ITEM_SOURCES[ing.itemId] ?? [];
  return (
    <div key={ing.itemId} style={{ position: "relative" }}>
      <button
        onClick={() => setSourcePopup(
          sourcePopup?.itemId === ing.itemId ? null :
          { itemId: ing.itemId, itemName: ing.name, x: 0, y: 0 }
        )}
        style={{
          width: "100%", textAlign: "left",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "#0f0f1a", borderRadius: "7px", padding: "7px 10px",
          border: `1px solid ${ing.enough ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)"}`,
          cursor: sources.length > 0 ? "pointer" : "default",
        }}
      >
        <span style={{ fontSize: "12px", color: ing.enough ? "#c4bfb0" : "#f87171" }}>
          {ing.name}
          {sources.length > 0 && <span style={{ fontSize: "9px", color: "#4a4a5a", marginLeft: "4px" }}>📍</span>}
        </span>
        <span style={{ fontSize: "12px", fontWeight: "bold", color: ing.enough ? "#4ade80" : "#ef4444" }}>
          {ing.owned} / {ing.required}
        </span>
      </button>

      {/* Source popup */}
      {sourcePopup?.itemId === ing.itemId && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 6px)", left: 0, right: 0,
          background: "#1a1a28", border: "1px solid #2a2a3a",
          borderRadius: "8px", padding: "10px", zIndex: 10,
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}>
          <div style={{ fontSize: "10px", color: "#6b6b80", marginBottom: "6px" }}>
            📍 Drop dari:
          </div>
          {sources.length === 0 ? (
            <div style={{ fontSize: "11px", color: "#4a4a5a", fontStyle: "italic" }}>
              Info area belum tersedia
            </div>
          ) : (
            sources.map((src) => (
              <div key={src.areaId} style={{
                fontSize: "11px", padding: "4px 0",
                borderBottom: "1px solid #1e1e2e",
                display: "flex", justifyContent: "space-between",
              }}>
                <span style={{ color: "#c4bfb0" }}>{src.areaName}</span>
                <span style={{ color: src.minLevel <= 55 ? "#4ade80" : "#f59e0b", fontSize: "10px" }}>
                  Melee Lv {src.minLevel}+
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
})}
                </div>
              </div>

              {/* Craft time + exp */}
              <div style={{
                background: "#0f0f1a", borderRadius: "8px", padding: "8px 12px",
                marginBottom: "14px", display: "flex", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: "11px", color: "#6b6b80" }}>
                  ⏱ {selected.craftTime}s · +{selected.requiredSkillLevel * 5 + 10} EXP
                </span>
                <span style={{ fontSize: "11px", color: SKILL_COLORS[selected.requiredSkill] ?? "#6b6b80" }}>
                  {selected.requiredSkill}
                </span>
              </div>

              {/* Craft button */}
              <button
                onClick={() => handleCraft(selected)}
                disabled={!selected.canCraft || crafting}
                style={{
                  width: "100%", padding: "11px", borderRadius: "9px",
                  background: selected.canCraft
                    ? (crafting ? "#1a3a1a" : "#16a34a")
                    : "#1a1a28",
                  border: "none",
                  color: selected.canCraft ? "#f0ece0" : "#4a4a5a",
                  fontSize: "13px", fontWeight: "bold",
                  fontFamily: "Georgia, serif", cursor: selected.canCraft ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
              >
                {crafting ? "Crafting..." : selected.canCraft ? `🔨 Craft ${selected.outputName}` : "Bahan tidak cukup"}
              </button>

              {!selected.skillMet && (
                <p style={{ fontSize: "10px", color: "#ef4444", marginTop: "8px", textAlign: "center" }}>
                  Skill level tidak cukup
                </p>
              )}

              <button
                onClick={() => setSelected(null)}
                style={{
                  width: "100%", padding: "8px", borderRadius: "8px", marginTop: "6px",
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