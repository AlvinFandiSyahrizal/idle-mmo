"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import GameSidebar from "@/components/layout/GameSidebar";

function formatTimeLeft(ms: number): string {
  if (ms <= 0) return "Kedaluwarsa";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (h > 0) return `${h}j ${m}m`;
  if (m > 0) return `${m}m ${s}d`;
  return `${s}d`;
}

interface AttackLog {
  id: string;
  message: string;
  type: "hit" | "boss" | "defeat" | "system";
  timestamp: Date;
}

export default function WorldBossPage() {
  const [character, setCharacter]   = useState<any>(null);
  const [bossData, setBossData]     = useState<any>(null);
  const [loading, setLoading]       = useState(true);
  const [attacking, setAttacking]   = useState(false);
  const [autoAttack, setAutoAttack] = useState(false);
  const [logs, setLogs]             = useState<AttackLog[]>([]);
  const [timeLeft, setTimeLeft]     = useState(0);
  const autoRef                     = useRef<NodeJS.Timeout | null>(null);
  const counterRef                  = useRef(0);

  function addLog(msg: string, type: AttackLog["type"] = "hit") {
    counterRef.current += 1;
    const entry: AttackLog = {
      id: `wbl_${Date.now()}_${counterRef.current}`,
      message: msg, type,
      timestamp: new Date(),
    };
    setLogs((prev) => [entry, ...prev.slice(0, 39)]);
  }

  const fetchBoss = useCallback(async () => {
    const [charRes, bossRes] = await Promise.all([
      fetch("/api/character"),
      fetch("/api/world-boss"),
    ]);
    const charData = await charRes.json();
    const bossDataRes = await bossRes.json();
    if (charData.success) setCharacter(charData.data);
    if (bossDataRes.success) {
      setBossData(bossDataRes.data);
      setTimeLeft(bossDataRes.data.boss.timeLeft);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchBoss(); }, [fetchBoss]);

  // Countdown timer
  useEffect(() => {
    const iv = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1000)), 1000);
    return () => clearInterval(iv);
  }, []);

  async function handleAttack() {
    if (attacking) return;
    setAttacking(true);
    try {
      const res  = await fetch("/api/world-boss/attack", { method: "POST" });
      const data = await res.json();
      if (!data.success) {
        addLog(`❌ ${data.error}`, "system");
        setAutoAttack(false);
        return;
      }
      const d = data.data;
      addLog(`⚔️ Kamu menyerang ${bossData?.boss?.name} untuk ${d.damage.toLocaleString()} damage!`, "hit");
      addLog(`💥 ${bossData?.boss?.name} menyerang balik ${d.bossDmgToPlayer} damage! (HP tidak berkurang)`, "boss");
      if (d.bossDefeated) {
        addLog(`🏆 ${bossData?.boss?.name} DIKALAHKAN! Reward sudah dibagikan!`, "defeat");
        setAutoAttack(false);
      }
      await fetchBoss();
    } catch {
      addLog("❌ Gagal menyerang, coba lagi.", "system");
    } finally {
      setAttacking(false);
    }
  }

  // Auto attack
  useEffect(() => {
    if (autoAttack) {
      autoRef.current = setInterval(handleAttack, 3500);
    } else {
      if (autoRef.current) clearInterval(autoRef.current);
    }
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [autoAttack, bossData]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#6b6b80", fontFamily: "Georgia, serif" }}>Memuat...</span>
    </div>
  );

  const boss     = bossData?.boss;
  const bossDef  = bossData?.bossDef;
  const myData   = bossData?.myParticipation;
  const parts    = bossData?.participants ?? [];
  const isActive = boss?.status === "active" && timeLeft > 0;

  const LOG_COLORS: Record<string, string> = {
    hit: "#f59e0b", boss: "#ef4444", defeat: "#34d399", system: "#60a5fa",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#0a0a0f", color: "#e2e0d8", fontFamily: "Georgia, serif" }}>
      <GameSidebar character={character} />

      <main style={{ flex: 1, padding: "28px 24px", overflow: "auto", minWidth: 0 }}>
        <div className="game-mobile-spacer" style={{ height: 0 }} />

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#f0ece0", margin: 0 }}>
            ⚔️ World Boss
          </h1>
          <p style={{ fontSize: "12px", color: "#6b6b80", margin: "3px 0 0" }}>
            Server-wide event — semua player bisa ikut menyerang
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px", alignItems: "start" }}>

          {/* Main boss area */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Boss card */}
            <div style={{
              background: boss?.status === "defeated"
                ? "linear-gradient(135deg,#0a0a0f,#0f0a0a)"
                : `linear-gradient(135deg,#0d0d18,${bossDef?.color ?? "#7c3aed"}11)`,
              border: `1px solid ${boss?.status === "defeated" ? "#2a1a1a" : (bossDef?.color ?? "#7c3aed") + "33"}`,
              borderRadius: "18px", padding: "28px",
              position: "relative", overflow: "hidden",
              transition: "all 0.5s",
            }}>
              {/* Decorative glow */}
              {isActive && (
                <div style={{
                  position: "absolute", top: "-80px", right: "-80px",
                  width: "250px", height: "250px", borderRadius: "50%",
                  background: `${bossDef?.color ?? "#7c3aed"}08`,
                  pointerEvents: "none",
                }} />
              )}

              {/* Boss info */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", marginBottom: "24px", flexWrap: "wrap" }}>
                <div style={{
                  width: "80px", height: "80px", borderRadius: "20px", flexShrink: 0,
                  background: `${bossDef?.color ?? "#7c3aed"}15`,
                  border: `2px solid ${bossDef?.color ?? "#7c3aed"}33`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "44px",
                  boxShadow: isActive ? `0 0 40px ${bossDef?.color ?? "#7c3aed"}22` : "none",
                  transition: "box-shadow 0.5s",
                }}>
                  {bossDef?.emoji ?? "👹"}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px", flexWrap: "wrap" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#f0ece0", margin: 0 }}>
                      {boss?.name}
                    </h2>
                    <span style={{
                      fontSize: "10px", padding: "2px 10px", borderRadius: "10px",
                      background: boss?.status === "defeated" ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)",
                      border: `1px solid ${boss?.status === "defeated" ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
                      color: boss?.status === "defeated" ? "#ef4444" : "#4ade80",
                      letterSpacing: "0.1em",
                    }}>
                      {boss?.status === "defeated" ? "DEFEATED" : boss?.status === "expired" ? "EXPIRED" : "● AKTIF"}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: bossDef?.color ?? "#818cf8", marginBottom: "6px" }}>
                    {bossDef?.title}
                  </div>
                  <p style={{ fontSize: "12px", color: "#6b6b80", margin: 0, lineHeight: "1.5", maxWidth: "400px" }}>
                    {bossDef?.description}
                  </p>
                </div>

                {/* Timer */}
                <div style={{
                  background: "#0f0f1a", border: "1px solid #2a2a3a",
                  borderRadius: "10px", padding: "10px 14px", textAlign: "center", flexShrink: 0,
                }}>
                  <div style={{ fontSize: "18px", fontWeight: "bold", color: timeLeft < 600000 ? "#ef4444" : "#f59e0b" }}>
                    {formatTimeLeft(timeLeft)}
                  </div>
                  <div style={{ fontSize: "9px", color: "#4a4a5a", marginTop: "2px" }}>
                    {boss?.status === "defeated" ? "SELESAI" : "SISA WAKTU"}
                  </div>
                </div>
              </div>

              {/* HP bar */}
              <div style={{ marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "6px" }}>
                  <span style={{ color: "#6b6b80" }}>Boss HP</span>
                  <span style={{ color: "#f0ece0", fontWeight: "bold" }}>
                    {Math.round(boss?.hpPct ?? 0)}%
                  </span>
                </div>
                <div style={{ height: "12px", background: "#0f0f1a", borderRadius: "6px", overflow: "hidden", position: "relative" }}>
                  <div style={{
                    height: "100%",
                    width: `${boss?.hpPct ?? 0}%`,
                    background: boss?.hpPct > 50
                      ? `linear-gradient(90deg,${bossDef?.color ?? "#7c3aed"},${bossDef?.color ?? "#7c3aed"}cc)`
                      : boss?.hpPct > 25
                      ? "linear-gradient(90deg,#d97706,#f59e0b)"
                      : "linear-gradient(90deg,#dc2626,#ef4444)",
                    borderRadius: "6px",
                    transition: "width 0.5s ease, background 0.5s",
                  }} />
                </div>
                <div style={{ fontSize: "10px", color: "#4a4a5a", marginTop: "4px", textAlign: "right" }}>
                  {bossData?.totalParticipants ?? 0} player ikut serta
                </div>
              </div>

              {/* Attack controls */}
              {isActive && (
                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                  <button
                    onClick={handleAttack}
                    disabled={attacking}
                    style={{
                      flex: 1, padding: "13px", borderRadius: "10px",
                      background: attacking
                        ? "#1a1a28"
                        : `linear-gradient(135deg,${bossDef?.color ?? "#7c3aed"},${bossDef?.color ?? "#7c3aed"}cc)`,
                      border: "none",
                      color: attacking ? "#4a4a5a" : "#fff",
                      fontSize: "14px", fontWeight: "bold",
                      fontFamily: "Georgia, serif", cursor: attacking ? "not-allowed" : "pointer",
                      boxShadow: attacking ? "none" : `0 0 20px ${bossDef?.color ?? "#7c3aed"}33`,
                      transition: "all 0.2s",
                    }}
                  >
                    {attacking ? "⚔️ Menyerang..." : "⚔️ Serang!"}
                  </button>

                  <button
                    onClick={() => setAutoAttack((v) => !v)}
                    style={{
                      padding: "13px 18px", borderRadius: "10px",
                      background: autoAttack ? "rgba(34,197,94,0.15)" : "#111118",
                      border: autoAttack ? "1px solid rgba(34,197,94,0.4)" : "1px solid #2a2a3a",
                      color: autoAttack ? "#4ade80" : "#6b6b80",
                      fontSize: "13px", fontWeight: "bold",
                      fontFamily: "Georgia, serif", cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex", alignItems: "center", gap: "6px",
                    }}
                  >
                    {autoAttack && (
                      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "pulse 1.5s infinite" }} />
                    )}
                    Auto
                  </button>
                </div>
              )}

              {boss?.status === "defeated" && (
                <div style={{
                  marginTop: "16px", padding: "14px", borderRadius: "10px",
                  background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: "24px", marginBottom: "4px" }}>🏆</div>
                  <div style={{ fontSize: "13px", color: "#4ade80", fontWeight: "bold" }}>
                    {bossDef?.defeatMessage ?? "World Boss dikalahkan!"}
                  </div>
                </div>
              )}
            </div>

            {/* My contribution */}
            {myData && (
              <div style={{
                background: "#111118", border: "1px solid #2a2a3a",
                borderRadius: "12px", padding: "16px",
                display: "flex", gap: "16px", flexWrap: "wrap",
              }}>
                <div style={{
                  fontSize: "10px", letterSpacing: "0.15em", color: "#6b6b80",
                  textTransform: "uppercase", width: "100%",
                  paddingBottom: "10px", borderBottom: "1px solid #1e1e2e",
                }}>
                  Kontribusimu
                </div>
                {[
                  { label: "Total Damage", val: parseInt(myData.damage).toLocaleString(), color: "#ef4444" },
                  { label: "Hits", val: myData.hits, color: "#f59e0b" },
                  { label: "Damage %", val: `${myData.damagePct.toFixed(2)}%`, color: "#818cf8" },
                ].map((s) => (
                  <div key={s.label} style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: "20px", fontWeight: "bold", color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: "10px", color: "#4a4a5a", marginTop: "2px" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Attack log */}
            <div style={{
              background: "#111118", border: "1px solid #2a2a3a",
              borderRadius: "12px", padding: "14px",
            }}>
              <div style={{
                fontSize: "10px", letterSpacing: "0.15em", color: "#6b6b80",
                textTransform: "uppercase", marginBottom: "10px",
                paddingBottom: "8px", borderBottom: "1px solid #1e1e2e",
                display: "flex", justifyContent: "space-between",
              }}>
                <span>Battle Log</span>
                {autoAttack && (
                  <span style={{ color: "#4ade80", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "pulse 1.5s infinite" }} />
                    Auto aktif
                  </span>
                )}
              </div>
              <div style={{ height: "120px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "3px" }}>
                {logs.length === 0 ? (
                  <div style={{ color: "#3a3a4a", fontSize: "11px", fontStyle: "italic" }}>
                    Tekan Serang untuk mulai...
                  </div>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} style={{ display: "flex", gap: "8px" }}>
                      <span style={{ fontSize: "9px", color: "#3a3a4a", flexShrink: 0, marginTop: "1px" }}>
                        {log.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </span>
                      <span style={{ fontSize: "11px", color: LOG_COLORS[log.type], lineHeight: "1.4" }}>
                        {log.message}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Leaderboard */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Reward tiers */}
            <div style={{
              background: "#111118", border: "1px solid #2a2a3a",
              borderRadius: "12px", padding: "16px",
            }}>
              <div style={{
                fontSize: "10px", letterSpacing: "0.15em", color: "#6b6b80",
                textTransform: "uppercase", marginBottom: "12px",
                paddingBottom: "8px", borderBottom: "1px solid #1e1e2e",
              }}>
                Reward Tiers
              </div>
              {[
                { range: "≥10% damage", gold: "5,000", shard: "20", color: "#f59e0b", icon: "👑" },
                { range: "≥5% damage",  gold: "3,000", shard: "12", color: "#9ca3af", icon: "🥈" },
                { range: "≥1% damage",  gold: "1,500", shard: "6",  color: "#b45309", icon: "🥉" },
                { range: "Ikut serta",  gold: "500",   shard: "2",  color: "#4a4a5a", icon: "⚔️" },
              ].map((tier) => (
                <div key={tier.range} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "7px 0", borderBottom: "1px solid #1a1a28",
                }}>
                  <span style={{ fontSize: "14px" }}>{tier.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "11px", color: tier.color, fontWeight: "bold" }}>{tier.range}</div>
                    <div style={{ fontSize: "10px", color: "#4a4a5a" }}>
                      💰 {tier.gold} · 🔮 {tier.shard} Shard
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Top damage */}
            <div style={{
              background: "#111118", border: "1px solid #2a2a3a",
              borderRadius: "12px", padding: "16px",
            }}>
              <div style={{
                fontSize: "10px", letterSpacing: "0.15em", color: "#6b6b80",
                textTransform: "uppercase", marginBottom: "12px",
                paddingBottom: "8px", borderBottom: "1px solid #1e1e2e",
              }}>
                Top Damage
              </div>
              {parts.length === 0 ? (
                <div style={{ fontSize: "11px", color: "#4a4a5a", fontStyle: "italic", textAlign: "center", padding: "10px" }}>
                  Belum ada yang menyerang.
                </div>
              ) : (
                parts.map((p: any, i: number) => {
                  const rankIcon = i === 0 ? "👑" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
                  return (
                    <div key={p.characterId} style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      padding: "7px 0", borderBottom: "1px solid #1a1a28",
                    }}>
                      <span style={{ fontSize: rankIcon ? "16px" : "11px", width: "20px", textAlign: "center", color: "#4a4a5a" }}>
                        {rankIcon ?? `${i + 1}`}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "12px", color: "#f0ece0" }}>{p.characterName}</div>
                        <div style={{ fontSize: "10px", color: "#4a4a5a" }}>{p.hits} hits</div>
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: "bold", color: "#ef4444" }}>
                        {parseInt(p.damage).toLocaleString()}
                      </span>
                    </div>
                  );
                })
              )}
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