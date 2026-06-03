"use client";

import { useState, useEffect } from "react";
import { useCombatStore } from "@/stores/combatStore";
import { getAvailableAreas } from "@/data/zones";
import { CHARACTER_CLASSES, CLASS_ICONS } from "@/data/characters";
import GameSidebar from "@/components/layout/GameSidebar";

const LOG_COLORS: Record<string, string> = {
  combat: "#c4bfb0",
  loot: "#f59e0b",
  levelup: "#34d399",
  death: "#ef4444",
  system: "#60a5fa",
};

const STYLE_INFO: Record<string, { icon: string; label: string; color: string }> = {
  melee:  { icon: "⚔️", label: "Melee",  color: "#ef4444" },
  ranged: { icon: "🏹", label: "Ranged", color: "#22c55e" },
  magic:  { icon: "🔮", label: "Magic",  color: "#818cf8" },
};

const AREA_MONSTERS: Record<string, { name: string; emoji: string; color: string }[]> = {
  // Zone 1
  area1_1: [
    { name: "Crocodile Hatchling", emoji: "🐊", color: "#16a34a" },
    { name: "Reed Sprite", emoji: "🌿", color: "#15803d" },
  ],
  area1_2: [
    { name: "Cursed Ibis", emoji: "🦅", color: "#7c3aed" },
    { name: "Marsh Lurker", emoji: "👁️", color: "#6d28d9" },
  ],
  area1_3: [
    { name: "Flood Elemental", emoji: "💧", color: "#1d4ed8" },
    { name: "Silt Golem", emoji: "🪨", color: "#78716c" },
  ],
  area1_4: [
    { name: "Sobek Cultist", emoji: "🐍", color: "#b45309" },
    { name: "Alpha Crocodile", emoji: "🐊", color: "#dc2626" },
  ],
  // Zone 2
  area2_1: [
    { name: "Sand Scarab", emoji: "🪲", color: "#d97706" },
    { name: "Desert Wanderer", emoji: "🧟", color: "#92400e" },
  ],
  area2_2: [
    { name: "Desert Wraith", emoji: "👻", color: "#7c3aed" },
    { name: "Sand Scarab", emoji: "🪲", color: "#d97706" },
  ],
  area2_3: [
    { name: "Cursed Palm", emoji: "🌴", color: "#15803d" },
    { name: "Desiccated Warrior", emoji: "💀", color: "#78716c" },
  ],
  area2_4: [
    { name: "Apep Cultist", emoji: "🐍", color: "#6d28d9" },
    { name: "Void Serpent", emoji: "🌑", color: "#1e1b4b" },
  ],
  // Zone 3
  area3_1: [
    { name: "Restless Mummy", emoji: "🧟", color: "#d97706" },
    { name: "Ka Spirit", emoji: "👻", color: "#818cf8" },
  ],
  area3_2: [
    { name: "Ushabti Golem", emoji: "🗿", color: "#78716c" },
    { name: "Tomb Guardian", emoji: "⚔️", color: "#92400e" },
  ],
  area3_3: [
    { name: "Judgment Shade", emoji: "⚖️", color: "#6b21a8" },
    { name: "Cursed Priest", emoji: "🧙", color: "#7c3aed" },
  ],
  area3_4: [
    { name: "Soul Eater", emoji: "💀", color: "#dc2626" },
    { name: "Ammit Spawn", emoji: "🦁", color: "#991b1b" },
  ],
  // Zone 4
  area4_1: [
    { name: "Corrupted Priest", emoji: "🧙", color: "#7c3aed" },
    { name: "Stone Guardian", emoji: "🗿", color: "#57534e" },
  ],
  area4_2: [
    { name: "Curse Scarab", emoji: "🪲", color: "#6d28d9" },
    { name: "Dark Acolyte", emoji: "🌑", color: "#1e1b4b" },
  ],
  area4_3: [
    { name: "Set Cultist", emoji: "😈", color: "#b91c1c" },
    { name: "Shadow Sentinel", emoji: "👁️", color: "#374151" },
  ],
  area4_4: [
    { name: "Set Champion Guard", emoji: "⚔️", color: "#dc2626" },
    { name: "Chaos Elemental", emoji: "🌀", color: "#7c3aed" },
  ],
  // Zone 5
  area5_1: [
    { name: "Mud Golem", emoji: "🪨", color: "#92400e" },
    { name: "River Demon", emoji: "😈", color: "#1d4ed8" },
  ],
  area5_2: [
    { name: "Marsh Stalker", emoji: "👁️", color: "#166534" },
    { name: "Swamp Horror", emoji: "👾", color: "#14532d" },
  ],
  area5_3: [
    { name: "Forest Guardian", emoji: "🌲", color: "#15803d" },
    { name: "Ancient Treant", emoji: "🌳", color: "#166534" },
  ],
  area5_4: [
    { name: "Humbaba Servant", emoji: "👹", color: "#b45309" },
    { name: "Wild Lion", emoji: "🦁", color: "#d97706" },
  ],
  // Zone 6
  area6_1: [
    { name: "Steppe Lion Elder", emoji: "🦁", color: "#d97706" },
    { name: "Dust Djinn",        emoji: "🌪️", color: "#92400e" },
  ],
  area6_2: [
    { name: "Rogue Soldier",  emoji: "⚔️", color: "#78716c" },
    { name: "Ur Guardian",    emoji: "🗿", color: "#57534e" },
  ],
  area6_3: [
    { name: "Ziggurat Shade", emoji: "👁️", color: "#6d28d9" },
    { name: "Copper Golem",   emoji: "🤖", color: "#b45309" },
  ],
  area6_4: [
    { name: "Bull Cultist",      emoji: "🐂", color: "#dc2626" },
    { name: "Heaven Fragment",   emoji: "✨", color: "#7c3aed" },
  ],
  // Zone 7
  area7_1: [
    { name: "Temple Shade",  emoji: "👻", color: "#4c1d95" },
    { name: "Gate Guardian", emoji: "🚪", color: "#5b21b6" },
  ],
  area7_2: [
    { name: "Anunnaki Remnant",   emoji: "👼", color: "#1d4ed8" },
    { name: "Starfire Elemental", emoji: "⭐", color: "#d97706" },
  ],
  area7_3: [
    { name: "Death Shade",     emoji: "💀", color: "#374151" },
    { name: "Underworld Spawn",emoji: "🌑", color: "#111827" },
  ],
  area7_4: [
    { name: "Kur Demon",       emoji: "😈", color: "#991b1b" },
    { name: "Nergal's Champion",emoji: "⚔️", color: "#7f1d1d" },
  ],
  // Zone 8
  area8_1: [
    { name: "Reality Fracture", emoji: "🌀", color: "#7c3aed" },
    { name: "Void Scarab",      emoji: "🪲", color: "#1e1b4b" },
  ],
  area8_2: [
    { name: "Dimensional Rift",    emoji: "🕳️", color: "#312e81" },
    { name: "Lost Deity Fragment", emoji: "💫", color: "#4338ca" },
  ],
  area8_3: [
    { name: "Frozen Time Guardian", emoji: "⏳", color: "#0e7490" },
    { name: "Ancient Construct",    emoji: "🗿", color: "#164e63" },
  ],
  area8_4: [
    { name: "Cosmic Horror", emoji: "👾", color: "#1e1b4b" },
    { name: "Void Titan",    emoji: "🌑", color: "#0f0f1a" },
  ],
  // Zone 9
  area9_1: [
    { name: "Soul Ferry Guardian", emoji: "⛵", color: "#4b5563" },
    { name: "Death Current",       emoji: "🌊", color: "#1f2937" },
  ],
  area9_2: [
    { name: "Judgment Shade Elder", emoji: "⚖️", color: "#4c1d95" },
    { name: "Divine Exile",         emoji: "👤", color: "#5b21b6" },
  ],
  area9_3: [
    { name: "Truth Guardian", emoji: "🪶", color: "#d97706" },
    { name: "Scale Keeper",   emoji: "⚖️", color: "#b45309" },
  ],
  area9_4: [
    { name: "Fallen Divine",            emoji: "😇", color: "#6b7280" },
    { name: "Corrupted Osiris Fragment", emoji: "💔", color: "#374151" },
  ],
  // Zone 10
  area10_1: [
    { name: "Duality Construct", emoji: "☯️", color: "#f0ece0" },
    { name: "Primordial Shade",  emoji: "🌑", color: "#111118" },
  ],
  area10_2: [
    { name: "World Root Guardian", emoji: "🌳", color: "#15803d" },
    { name: "Cosmic Parasite",     emoji: "🦠", color: "#166534" },
  ],
  area10_3: [
    { name: "Between Horror", emoji: "👁️", color: "#1e1b4b" },
    { name: "Reality Eater",  emoji: "🕳️", color: "#0f0f1a" },
  ],
  area10_4: [
    { name: "The Unnamed",          emoji: "❓", color: "#374151" },
    { name: "Primordial Construct", emoji: "⚙️", color: "#1f2937" },
  ],
};

export default function CombatPage() {
  const [character, setCharacter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentMonster, setCurrentMonster] = useState<{ name: string; emoji: string; color: string } | null>(null);
  const [attackAnim, setAttackAnim] = useState(false);

  async function fetchCharacter() {
    const res = await fetch("/api/character");
    const data = await res.json();
    if (data.success) setCharacter(data.data);
    setLoading(false);
  }

  function handleStatsUpdate() {
    fetchCharacter();
    setAttackAnim(true);
    setTimeout(() => setAttackAnim(false), 300);
  }

  const { isActive, currentAreaId, currentAreaName, logs, stats, startCombat, stopCombat } = useCombatStore();

  // Wrap startCombat dan stopCombat dengan handleStatsUpdate
  async function handleStart(areaId: string, areaName: string) {
    await startCombat(areaId, areaName, handleStatsUpdate);
  }

  async function handleStop() {
    await stopCombat(handleStatsUpdate);
  }

  useEffect(() => {
    if (!isActive || !currentAreaId) {
      setCurrentMonster(null);
      return;
    }
    const monsters = AREA_MONSTERS[currentAreaId] ?? [];
    if (!monsters.length) return;
    function pickRandom() {
      setCurrentMonster(monsters[Math.floor(Math.random() * monsters.length)]);
    }
    pickRandom();
    const iv = setInterval(pickRandom, 3500);
    return () => clearInterval(iv);
  }, [isActive, currentAreaId]);

  useEffect(() => { fetchCharacter(); }, []);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#6b6b80", fontFamily: "Georgia, serif" }}>Memuat...</span>
    </div>
  );
  if (!character) return null;

  const classData = CHARACTER_CLASSES.find((c) => c.id === character.classId);
  const meleeSkill = character.skills?.find((s: any) => s.skillId === "melee");
  const meleeLevel = meleeSkill?.level ?? 1;
  const meleeExp = meleeSkill?.experience ?? 0;
  const availableAreas = getAvailableAreas(meleeLevel);
  const hpPct = Math.round((character.hp / character.maxHp) * 100);
  const meleePct = Math.min(100, Math.round((meleeExp / 1000) * 100));

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#0a0a0f", color: "#e2e0d8", fontFamily: "Georgia, serif" }}>
      <GameSidebar character={character} />

      <main style={{ flex: 1, padding: "28px 24px", display: "flex", flexDirection: "column", gap: "20px", overflow: "auto", minWidth: 0 }}>
        {/* Mobile spacer */}
        <div style={{ height: "0px" }} className="game-mobile-spacer" />

        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#f0ece0", margin: 0 }}>⚔️ Combat</h1>
          <p style={{ fontSize: "12px", color: "#6b6b80", margin: "3px 0 0" }}>Auto-battle area farming</p>
        </div>

        <div style={{ display: "flex", gap: "20px", flex: 1, minHeight: 0 }}>

          {/* Left panel */}
          <div style={{ width: "220px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Melee skill */}
            <div style={card}>
              <Label>Melee Skill</Label>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "13px", color: "#c4bfb0" }}>⚔️ Melee</span>
                <span style={{
                  fontSize: "12px", fontWeight: "bold", color: "#f59e0b",
                  background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
                  borderRadius: "6px", padding: "1px 8px",
                }}>Lv {meleeLevel}</span>
              </div>
              <div style={{ height: "4px", background: "#0f0f1a", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${meleePct}%`, background: "#d97706", borderRadius: "2px", transition: "width 0.5s" }} />
              </div>
              <div style={{ fontSize: "10px", color: "#4a4a5a", marginTop: "4px", textAlign: "right" }}>
                {meleeExp} / 1000 exp
              </div>
            </div>

            {/* Session stats */}
            {isActive && (
              <div style={card}>
                <Label>Sesi Ini</Label>
                {[
                  { label: "Kill", val: stats.killCount, color: "#c4bfb0" },
                  { label: "EXP", val: `+${stats.totalExp}`, color: "#34d399" },
                  { label: "Gold", val: `+${stats.totalGold}`, color: "#f59e0b" },
                ].map((s) => (
                  <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #1a1a28" }}>
                    <span style={{ fontSize: "11px", color: "#6b6b80" }}>{s.label}</span>
                    <span style={{ fontSize: "12px", fontWeight: "bold", color: s.color }}>{s.val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Area list */}
            <div style={card}>
              <Label>Area Farming</Label>
              <ZoneAreaList
                availableAreas={availableAreas}
                currentAreaId={currentAreaId}
                onSelectArea={(areaId, areaName) => handleStart(areaId, areaName)}
                onStop={handleStop}
                isActive={isActive}
              />
              {isActive && (
                <button
                  onClick={stopCombat}
                  style={{
                    marginTop: "8px", width: "100%", padding: "8px", borderRadius: "7px",
                    background: "rgba(220,38,38,0.08)", border: "1px solid #3a2020",
                    color: "#ef4444", fontSize: "12px", fontFamily: "Georgia, serif",
                    cursor: "pointer", fontWeight: "bold",
                  }}
                >
                  🛑 Hentikan
                </button>
              )}
            </div>

          </div>

          {/* Center: Arena + log */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "14px", minWidth: 0 }}>

            {/* Arena */}
            <div style={{
              ...card,
              flex: 1,
              background: "linear-gradient(180deg,#0d0d18,#0a0a12)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              position: "relative", overflow: "hidden", minHeight: "300px",
            }}>
              {currentAreaName && (
                <div style={{
                  position: "absolute", top: "14px", left: "50%", transform: "translateX(-50%)",
                  fontSize: "10px", letterSpacing: "0.2em", color: "#4a4a5a",
                  background: "#111118", border: "1px solid #2a2a3a",
                  borderRadius: "20px", padding: "3px 14px", whiteSpace: "nowrap",
                }}>
                  {currentAreaName.toUpperCase()}
                </div>
              )}

              {isActive && currentMonster ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "50px", width: "100%", padding: "0 20px" }}>

                  {/* Player */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "90px", height: "90px", borderRadius: "50%",
                      background: "#1a1a28", border: "2px solid #2e2e44",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "48px",
                      transform: attackAnim ? "translateX(10px)" : "translateX(0)",
                      transition: "transform 0.15s ease-out",
                      boxShadow: "0 0 25px rgba(245,158,11,0.15)",
                    }}>
                      {classData ? CLASS_ICONS[classData.id] : "⚔️"}
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", fontWeight: "bold", color: "#f0ece0" }}>{character.name}</div>
                      {/* Combat style badge */}
                          {(() => {
                            const styleId = character.classId === "siptu" ? "ranged"
                              : character.classId === "kher-heb" || character.classId === "ashipu" ? "magic"
                              : "melee";
                            const style = STYLE_INFO[styleId];
                            return (
                              <div style={{
                                display: "inline-flex", alignItems: "center", gap: "3px",
                                background: `${style.color}18`, border: `1px solid ${style.color}33`,
                                borderRadius: "6px", padding: "2px 8px", marginTop: "3px",
                                fontSize: "10px", color: style.color,
                              }}>
                                {style.icon} {style.label}
                              </div>
                            );
                          })()}
                      <div style={{ marginTop: "4px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#6b6b80", marginBottom: "2px" }}>
                          <span>HP</span><span style={{ color: "#ef4444" }}>{character.hp}/{character.maxHp}</span>
                        </div>
                        <div style={{ width: "80px", height: "4px", background: "#1a1a28", borderRadius: "2px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${hpPct}%`, background: "#ef4444", borderRadius: "2px" }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* VS */}
                  <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#2a2a3a", fontWeight: "bold" }}>VS</div>

                  {/* Monster */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "90px", height: "90px", borderRadius: "50%",
                      background: "#1a0f0f", border: `2px solid ${currentMonster.color}44`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "48px",
                      boxShadow: `0 0 25px ${currentMonster.color}22`,
                      transition: "all 0.4s ease",
                    }}>
                      {currentMonster.emoji}
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", fontWeight: "bold", color: currentMonster.color }}>
                        {currentMonster.name}
                      </div>
                      <div style={{ fontSize: "9px", color: "#4a4a5a", marginTop: "2px" }}>Zone 1 · Delta Nil</div>
                    </div>
                  </div>

                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px", opacity: 0.2 }}>⚔️</div>
                  <div style={{ fontSize: "12px", color: "#3a3a4a", fontStyle: "italic" }}>
                    Pilih area untuk mulai bertarung...
                  </div>
                </div>
              )}

              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: "50px",
                background: "linear-gradient(0deg,rgba(0,0,0,0.5),transparent)",
                pointerEvents: "none",
              }} />
            </div>

            {/* Combat log — compact */}
            <div style={{ ...card, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#6b6b80", textTransform: "uppercase" }}>
                  Combat Log
                </span>
                {isActive && (
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "10px", color: "#34d399" }}>
                    <span style={{
                      width: "6px", height: "6px", borderRadius: "50%",
                      background: "#34d399", display: "inline-block",
                      animation: "pulse 1.5s infinite",
                    }} />
                    Berjalan
                  </span>
                )}
              </div>

              <div style={{
                height: "90px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "3px",
              }}>
                {logs.length === 0 ? (
                  <div style={{ color: "#3a3a4a", fontSize: "11px", fontStyle: "italic" }}>
                    Belum ada aktivitas...
                  </div>
                ) : (
                  logs.slice(0, 20).map((log) => (
                    <div key={log.id} style={{ display: "flex", gap: "8px", alignItems: "flex-start", flexShrink: 0 }}>
                      <span style={{ fontSize: "9px", color: "#3a3a4a", flexShrink: 0, marginTop: "1px" }}>
                        {log.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </span>
                      <span style={{ fontSize: "11px", color: LOG_COLORS[log.type] ?? "#c4bfb0", lineHeight: "1.4" }}>
                        {log.message}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
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


const ZONE_INFO: Record<string, { name: string; alignment: string; color: string; icon: string }> = {
  zone1:  { name: "Delta Nil",          alignment: "egypt",        color: "#d97706", icon: "🌊" },
  zone2:  { name: "Padang Pasir Barat", alignment: "egypt",        color: "#f59e0b", icon: "🏜️" },
  zone3:  { name: "Nekropolis",          alignment: "egypt",        color: "#7c3aed", icon: "💀" },
  zone4:  { name: "Kuil Karnak",         alignment: "egypt",        color: "#dc2626", icon: "🏛️" },
  zone5:  { name: "Lembah Eufrat",       alignment: "mesopotamia",  color: "#3b82f6", icon: "🌿" },
  zone6:  { name: "Padang Sumeria",      alignment: "mesopotamia",  color: "#d97706", icon: "🦁" },
  zone7:  { name: "Ziggurat Ur",         alignment: "mesopotamia",  color: "#6d28d9", icon: "🏯" },
  zone8:  { name: "Gurun Axis Mundi",    alignment: "neutral",      color: "#818cf8", icon: "🌀" },
  zone9:  { name: "Gerbang Aaru/Kur",    alignment: "neutral",      color: "#6b7280", icon: "⚖️" },
  zone10: { name: "Axis Mundi",          alignment: "neutral",      color: "#f0ece0", icon: "☯️" },
};

function ZoneAreaList({
  availableAreas,
  currentAreaId,
  onSelectArea,
  onStop,
  isActive,
}: {
  availableAreas: { area: any; zone: any }[];
  currentAreaId: string | null;
  onSelectArea: (id: string, name: string) => void;
  onStop: () => void;
  isActive: boolean;
}) {
  // Group areas by zone
  const grouped: Record<string, { area: any; zone: any }[]> = {};
  for (const item of availableAreas) {
    const zid = item.zone.id;
    if (!grouped[zid]) grouped[zid] = [];
    grouped[zid].push(item);
  }

  // Track which zones are expanded — default expand zone of active area
  const defaultOpen = currentAreaId
    ? availableAreas.find((a) => a.area.id === currentAreaId)?.zone.id
    : Object.keys(grouped)[0];

  const [openZone, setOpenZone] = useState<string | null>(defaultOpen ?? null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {Object.entries(grouped).map(([zoneId, items]) => {
        const zinfo = ZONE_INFO[zoneId] ?? { name: zoneId, color: "#6b6b80", icon: "🗺️" };
        const isOpen = openZone === zoneId;
        const hasActive = items.some((i) => i.area.id === currentAreaId);

        return (
          <div key={zoneId} style={{
            border: `1px solid ${hasActive ? zinfo.color + "44" : "#1e1e2e"}`,
            borderRadius: "9px",
            overflow: "hidden",
            background: hasActive ? `${zinfo.color}08` : "transparent",
          }}>
            {/* Zone header — clickable */}
            <button
              onClick={() => setOpenZone(isOpen ? null : zoneId)}
              style={{
                width: "100%", textAlign: "left",
                padding: "8px 10px", border: "none", cursor: "pointer",
                background: "transparent",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "13px" }}>{zinfo.icon}</span>
                <span style={{ fontSize: "11px", fontWeight: "bold", color: hasActive ? zinfo.color : "#8a8a9a", fontFamily: "Georgia, serif" }}>
                  {zinfo.name}
                </span>
                {hasActive && (
                  <span style={{ fontSize: "8px", color: zinfo.color, background: `${zinfo.color}22`, borderRadius: "3px", padding: "1px 4px" }}>
                    AKTIF
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ fontSize: "9px", color: "#4a4a5a" }}>
                  {items.length} area
                </span>
                <span style={{ fontSize: "10px", color: "#4a4a5a", transition: "transform 0.2s", display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                  ▼
                </span>
              </div>
            </button>

            {/* Area list inside zone */}
            {isOpen && (
              <div style={{ padding: "0 6px 6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                {items.map(({ area }) => {
                  const isAreaActive = currentAreaId === area.id;
                  return (
                    <button
                      key={area.id}
                      onClick={() => isAreaActive ? onStop() : onSelectArea(area.id, area.name)}
                      style={{
                        textAlign: "left", padding: "8px 10px", borderRadius: "6px",
                        background: isAreaActive ? `${zinfo.color}18` : "#0f0f1a",
                        outline: isAreaActive ? `1px solid ${zinfo.color}44` : "1px solid #1a1a28",
                        border: "none", cursor: "pointer", transition: "all 0.15s",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: "11px", fontWeight: "bold", color: isAreaActive ? zinfo.color : "#c4bfb0", fontFamily: "Georgia, serif" }}>
                            {area.name}
                          </div>
                          <div style={{ fontSize: "9px", color: "#4a4a5a", marginTop: "1px" }}>
                            Min Melee Lv {area.minCombatLevel}
                          </div>
                        </div>
                        {isAreaActive && (
                          <span style={{ fontSize: "8px", color: "#ef4444", background: "rgba(220,38,38,0.2)", borderRadius: "3px", padding: "1px 5px" }}>
                            ● AKTIF
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


const card: React.CSSProperties = {
  background: "#111118",
  border: "1px solid #2a2a3a",
  borderRadius: "12px",
  padding: "16px",
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: "10px", letterSpacing: "0.15em", color: "#6b6b80",
      textTransform: "uppercase", marginBottom: "10px",
      paddingBottom: "8px", borderBottom: "1px solid #1e1e2e",
    }}>
      {children}
    </div>
  );
}