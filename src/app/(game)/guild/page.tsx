"use client";

import { useState, useEffect, useCallback } from "react";
import GameSidebar from "@/components/layout/GameSidebar";

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  leader:  { label: "Pemimpin", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  officer: { label: "Officer",  color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  member:  { label: "Member",   color: "#6b7280", bg: "rgba(107,114,128,0.12)" },
};

// SVG emblem untuk guild — Egyptian themed
function GuildEmblem({ name, level, size = 80 }: { name: string; level: number; size?: number }) {
  const initial = name.charAt(0).toUpperCase();
  const tierColor = level >= 10 ? "#f59e0b" : level >= 5 ? "#c084fc" : "#60a5fa";
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      {/* Outer ring */}
      <circle cx="40" cy="40" r="38" fill="none" stroke={tierColor} strokeWidth="1.5" opacity="0.4" />
      <circle cx="40" cy="40" r="34" fill={`${tierColor}08`} stroke={tierColor} strokeWidth="0.5" opacity="0.6" />
      {/* Background */}
      <circle cx="40" cy="40" r="30" fill="#0f0f1a" />
      {/* Corner ornaments */}
      {[0, 90, 180, 270].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 40 40)`}>
          <line x1="40" y1="8" x2="40" y2="14" stroke={tierColor} strokeWidth="1.5" opacity="0.5" />
        </g>
      ))}
      {/* Initial */}
      <text x="40" y="40" textAnchor="middle" dominantBaseline="central"
        fill={tierColor} fontSize="22" fontWeight="bold" fontFamily="Georgia, serif">
        {initial}
      </text>
      {/* Level badge */}
      <circle cx="58" cy="58" r="10" fill="#0a0a0f" stroke={tierColor} strokeWidth="1" />
      <text x="58" y="58" textAnchor="middle" dominantBaseline="central"
        fill={tierColor} fontSize="8" fontWeight="bold" fontFamily="Georgia, serif">
        {level}
      </text>
    </svg>
  );
}

function StatBox({ icon, value, label, color = "#f59e0b" }: {
  icon: string; value: string | number; label: string; color?: string;
}) {
  return (
    <div style={{
      background: "#0f0f1a", border: "1px solid #1e1e2e",
      borderRadius: "10px", padding: "12px 14px",
      display: "flex", alignItems: "center", gap: "10px",
    }}>
      <span style={{ fontSize: "20px" }}>{icon}</span>
      <div>
        <div style={{ fontSize: "16px", fontWeight: "bold", color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: "10px", color: "#4a4a5a", marginTop: "3px" }}>{label}</div>
      </div>
    </div>
  );
}

export default function GuildPage() {
  const [character, setCharacter]   = useState<any>(null);
  const [guildData, setGuildData]   = useState<any>(null);
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState<"info" | "members" | "search" | "create">("info");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching]   = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", description: "" });
  const [contributeAmount, setContributeAmount] = useState(100);
  const [feedback, setFeedback]     = useState<{ msg: string; ok: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    const [charRes, guildRes] = await Promise.all([
      fetch("/api/character"),
      fetch("/api/guild"),
    ]);
    const charData  = await charRes.json();
    const guildRes2 = await guildRes.json();
    if (charData.success)  setCharacter(charData.data);
    if (guildRes2.success) setGuildData(guildRes2.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function showFeedback(msg: string, ok: boolean) {
    setFeedback({ msg, ok });
    setTimeout(() => setFeedback(null), 3000);
  }

  async function searchGuilds(q = searchQuery) {
    setSearching(true);
    const res  = await fetch(`/api/guild/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    if (data.success) setSearchResults(data.data);
    setSearching(false);
  }

  async function handleCreate() {
    if (createForm.name.length < 3) { showFeedback("Nama guild minimal 3 karakter", false); return; }
    setSubmitting(true);
    const res  = await fetch("/api/guild", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", ...createForm }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.success) { showFeedback(`Guild "${createForm.name}" berhasil dibuat!`, true); fetchData(); setTab("info"); }
    else showFeedback(data.error, false);
  }

  async function handleJoin(guildId: string, guildName: string) {
    setSubmitting(true);
    const res  = await fetch("/api/guild", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "join", guildId }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.success) { showFeedback(`Bergabung dengan "${guildName}"!`, true); fetchData(); setTab("info"); }
    else showFeedback(data.error, false);
  }

  async function handleLeave() {
    if (!confirm("Yakin mau keluar dari guild?")) return;
    setSubmitting(true);
    const res  = await fetch("/api/guild", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "leave" }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.success) { showFeedback("Kamu keluar dari guild.", true); fetchData(); }
    else showFeedback(data.error, false);
  }

  async function handleContribute() {
    setSubmitting(true);
    const res  = await fetch("/api/guild/contribute", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: contributeAmount }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.success) { showFeedback(`+${contributeAmount} Gold dikontribusikan!`, true); fetchData(); }
    else showFeedback(data.error, false);
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#6b6b80", fontFamily: "Georgia, serif" }}>Memuat...</span>
    </div>
  );

  const inGuild    = !!guildData?.guild;
  const guild      = guildData?.guild;
  const membership = guildData?.membership;
  const guildExpPct = guild ? (guild.experience % 1000) / 10 : 0;
  const myGold     = character?.gold ?? 0;

  const tabs = inGuild
    ? [{ id: "info", label: "Info Guild", icon: "🏛️" }, { id: "members", label: "Members", icon: "👥" }]
    : [{ id: "search", label: "Cari Guild", icon: "🔍" }, { id: "create", label: "Buat Guild", icon: "➕" }];

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#0a0a0f", color: "#e2e0d8", fontFamily: "Georgia, serif" }}>
      <GameSidebar character={character} />

      <main
        style={{
          flex: 1,
          padding: "clamp(16px, 2vw, 32px)",
          overflow: "auto",
          minWidth: 0,
          width: "100%",
        }} 
        >
        <div className="game-mobile-spacer" style={{ height: 0 }} />

        {/* Page header */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#f0ece0", margin: 0 }}>
            🏛️ Guild
          </h1>
          <p style={{ fontSize: "12px", color: "#6b6b80", margin: "4px 0 0" }}>
            {inGuild ? `Member dari ${guild.name}` : "Bergabung atau buat guild baru"}
          </p>
        </div>

        {/* Toast */}
        {feedback && (
          <div style={{
            position: "fixed", top: "20px", right: "20px", zIndex: 200,
            background: feedback.ok ? "#052e16" : "#1a0a0a",
            border: `1px solid ${feedback.ok ? "#166534" : "#7f1d1d"}`,
            borderRadius: "10px", padding: "12px 18px",
            color: feedback.ok ? "#4ade80" : "#ef4444",
            fontSize: "12px", fontFamily: "Georgia, serif",
            boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
          }}>
            {feedback.msg}
          </div>
        )}

        <div
            style={{
              width: "100%",
              maxWidth: "1600px",
              margin: "0 auto",
            }}
          >

          {/* Tab nav */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id as any)} style={{
                padding: "7px 18px", borderRadius: "20px", cursor: "pointer",
                background: tab === t.id ? "rgba(245,158,11,0.15)" : "#111118",
                border: tab === t.id ? "1px solid rgba(245,158,11,0.4)" : "1px solid #2a2a3a",
                color: tab === t.id ? "#f59e0b" : "#6b6b80",
                fontSize: "13px", fontFamily: "Georgia, serif",
                transition: "all 0.2s",
              }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* ══════════════════════════════════════
              NOT IN GUILD — Search
          ══════════════════════════════════════ */}
          {!inGuild && tab === "search" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchGuilds()}
                  placeholder="Cari nama guild..."
                  style={{
                    flex: 1, background: "#111118", border: "1px solid #2a2a3a",
                    borderRadius: "10px", padding: "10px 14px",
                    color: "#f0ece0", fontSize: "13px",
                    fontFamily: "Georgia, serif", outline: "none",
                  }}
                />
                <button onClick={() => searchGuilds()} disabled={searching} style={{
                  padding: "10px 22px", borderRadius: "10px",
                  background: "#f59e0b", border: "none",
                  color: "#0a0a0f", fontSize: "13px", fontWeight: "bold",
                  fontFamily: "Georgia, serif", cursor: "pointer",
                }}>
                  {searching ? "..." : "Cari"}
                </button>
              </div>

              <button onClick={() => searchGuilds("")} style={{
                padding: "7px", borderRadius: "8px", background: "#111118",
                border: "1px solid #2a2a3a", color: "#6b6b80",
                fontSize: "12px", fontFamily: "Georgia, serif", cursor: "pointer",
              }}>
                Tampilkan semua guild
              </button>

              <div
                style={{
                  display: "grid",
                  gap: "12px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px,1fr))",
                }}
              >
                {searchResults.length === 0 && !searching && (
                  <div style={{ textAlign: "center", padding: "30px", color: "#4a4a5a", fontSize: "12px", fontStyle: "italic" }}>
                    Belum ada guild ditemukan. Coba pencarian lain atau buat guild baru.
                  </div>
                )}
                {searchResults.map((g) => (
                  <div key={g.id} style={{
                    background: "#111118", border: "1px solid #2a2a3a",
                    borderRadius: "14px", padding: "16px 18px",
                    display: "flex", alignItems: "center", gap: "16px",
                    transition: "border-color 0.2s",
                  }}>
                    <GuildEmblem name={g.name} level={g.level} size={56} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "16px", fontWeight: "bold", color: "#f0ece0" }}>{g.name}</span>
                        <span style={{
                          fontSize: "10px", color: "#f59e0b",
                          background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
                          borderRadius: "5px", padding: "1px 6px",
                        }}>Lv {g.level}</span>
                      </div>
                      {g.description && (
                        <p style={{ fontSize: "12px", color: "#6b6b80", margin: "0 0 6px", lineHeight: "1.4" }}>
                          {g.description}
                        </p>
                      )}
                      <div style={{ display: "flex", gap: "12px", fontSize: "11px", color: "#4a4a5a" }}>
                        <span>👥 {g.memberCount}/{g.maxMembers} member</span>
                        <span>⭐ Guild Lv {g.level}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleJoin(g.id, g.name)}
                      disabled={submitting || g.memberCount >= g.maxMembers}
                      style={{
                        padding: "8px 18px", borderRadius: "9px", flexShrink: 0,
                        background: g.memberCount >= g.maxMembers ? "#1a1a28" : "rgba(245,158,11,0.15)",
                        border: g.memberCount >= g.maxMembers ? "1px solid #2a2a3a" : "1px solid rgba(245,158,11,0.35)",
                        color: g.memberCount >= g.maxMembers ? "#4a4a5a" : "#f59e0b",
                        fontSize: "12px", fontWeight: "bold",
                        fontFamily: "Georgia, serif",
                        cursor: g.memberCount >= g.maxMembers ? "not-allowed" : "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {g.memberCount >= g.maxMembers ? "Penuh" : "Bergabung"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              NOT IN GUILD — Create
          ══════════════════════════════════════ */}
          {!inGuild && tab === "create" && (
            <div style={{ maxWidth: "460px" }}>
              <div style={{
                background: "#111118", border: "1px solid #2a2a3a",
                borderRadius: "16px", padding: "28px",
              }}>
                {/* Preview emblem */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <GuildEmblem name={createForm.name || "?"} level={1} size={72} />
                  <p style={{ fontSize: "11px", color: "#4a4a5a", marginTop: "8px" }}>
                    Emblem preview
                  </p>
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={{ fontSize: "11px", color: "#6b6b80", display: "block", marginBottom: "6px", letterSpacing: "0.1em" }}>
                    NAMA GUILD
                  </label>
                  <input
                    value={createForm.name}
                    onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
                    maxLength={30} placeholder="3–30 karakter"
                    style={{
                      width: "100%", background: "#0f0f1a",
                      border: "1px solid #2a2a3a", borderRadius: "9px",
                      padding: "10px 14px", color: "#f0ece0",
                      fontSize: "14px", fontFamily: "Georgia, serif",
                      outline: "none", boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label style={{ fontSize: "11px", color: "#6b6b80", display: "block", marginBottom: "6px", letterSpacing: "0.1em" }}>
                    DESKRIPSI <span style={{ color: "#3a3a4a" }}>(opsional)</span>
                  </label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm((p) => ({ ...p, description: e.target.value }))}
                    maxLength={200} placeholder="Ceritakan tentang guildmu..." rows={3}
                    style={{
                      width: "100%", background: "#0f0f1a",
                      border: "1px solid #2a2a3a", borderRadius: "9px",
                      padding: "10px 14px", color: "#f0ece0",
                      fontSize: "13px", fontFamily: "Georgia, serif",
                      outline: "none", resize: "vertical",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <button
                  onClick={handleCreate}
                  disabled={submitting || createForm.name.length < 3}
                  style={{
                    width: "100%", padding: "12px", borderRadius: "10px",
                    background: createForm.name.length >= 3
                      ? "linear-gradient(135deg,#d97706,#f59e0b)"
                      : "#1a1a28",
                    border: "none",
                    color: createForm.name.length >= 3 ? "#0a0a0f" : "#4a4a5a",
                    fontSize: "14px", fontWeight: "bold",
                    fontFamily: "Georgia, serif", cursor: createForm.name.length >= 3 ? "pointer" : "not-allowed",
                    boxShadow: createForm.name.length >= 3 ? "0 0 20px rgba(245,158,11,0.2)" : "none",
                    transition: "all 0.3s",
                  }}
                >
                  {submitting ? "Membuat..." : "🏛️ Buat Guild"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              IN GUILD — Info
          ══════════════════════════════════════ */}
          {inGuild && tab === "info" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Hero banner */}
              <div style={{
                background: "linear-gradient(135deg, #0f0f1a 0%, #111120 50%, #0a0a14 100%)",
                border: "1px solid #2a2a3a",
                borderRadius: "18px", padding: "24px",
                position: "relative", overflow: "hidden",
              }}>
                {/* Decorative bg rings */}
                <div style={{
                  position: "absolute", top: "-60px", right: "-60px",
                  width: "200px", height: "200px", borderRadius: "50%",
                  border: "1px solid rgba(245,158,11,0.06)",
                  pointerEvents: "none",
                }} />
                <div style={{
                  position: "absolute", top: "-30px", right: "-30px",
                  width: "140px", height: "140px", borderRadius: "50%",
                  border: "1px solid rgba(245,158,11,0.04)",
                  pointerEvents: "none",
                }} />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto minmax(0,1fr) auto",
                    gap: "20px",
                    alignItems: "start",
                  }}
                  className="guild-hero-grid"
                >
                  <GuildEmblem name={guild.name} level={guild.level} size={80} />

                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                      <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#f0ece0", margin: 0 }}>
                        {guild.name}
                      </h2>
                      <span style={{
                        fontSize: "11px", padding: "2px 10px", borderRadius: "10px",
                        background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)",
                        color: "#f59e0b",
                      }}>Lv {guild.level}</span>
                      <span style={{
                        fontSize: "11px", padding: "2px 10px", borderRadius: "10px",
                        background: ROLE_CONFIG[membership.role]?.bg,
                        border: `1px solid ${ROLE_CONFIG[membership.role]?.color}44`,
                        color: ROLE_CONFIG[membership.role]?.color,
                      }}>
                        {ROLE_CONFIG[membership.role]?.label ?? membership.role}
                      </span>
                    </div>

                    {guild.description && (
                      <p style={{ fontSize: "13px", color: "#6b6b80", margin: "0 0 14px", lineHeight: "1.5" }}>
                        {guild.description}
                      </p>
                    )}

                    {/* Stats grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "8px" }}>
                      <StatBox icon="👥" value={`${guild.members.length}/20`} label="Members" />
                      <StatBox icon="⭐" value={guild.experience.toLocaleString()} label="Total Guild EXP" color="#818cf8" />
                      <StatBox icon="💰" value={`${membership.contribution.toLocaleString()} G`} label="Kontribusimu" color="#34d399" />
                    </div>
                  </div>

                  {/* Leave button — top right */}
                  <button onClick={handleLeave} disabled={submitting} style={{
                    padding: "7px 14px", borderRadius: "8px",
                    background: "rgba(220,38,38,0.06)",
                    border: "1px solid rgba(220,38,38,0.2)",
                    color: "#ef4444", fontSize: "12px",
                    fontFamily: "Georgia, serif", cursor: "pointer",
                    transition: "all 0.2s", flexShrink: 0,
                  }}>
                    Keluar Guild
                  </button>
                </div>

                {/* Guild EXP bar */}
                <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #1e1e2e" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "6px" }}>
                    <span style={{ color: "#6b6b80" }}>
                      Guild EXP — Lv {guild.level} → Lv {guild.level + 1}
                    </span>
                    <span style={{ color: "#f59e0b" }}>
                      {guild.experience % 1000} / 1000
                    </span>
                  </div>
                  <div style={{ height: "6px", background: "#0f0f1a", borderRadius: "3px", overflow: "hidden", position: "relative" }}>
                    <div style={{
                      height: "100%",
                      width: `${guildExpPct}%`,
                      background: "linear-gradient(90deg,#d97706,#f59e0b)",
                      borderRadius: "3px",
                      transition: "width 0.8s ease",
                    }} />
                  </div>
                </div>
              </div>

              {/* Contribute card */}
              <div style={{
                background: "#111118", border: "1px solid #2a2a3a",
                borderRadius: "14px", padding: "20px",
              }}>
                <div style={{
                  fontSize: "10px", letterSpacing: "0.15em", color: "#6b6b80",
                  textTransform: "uppercase", marginBottom: "14px",
                  paddingBottom: "10px", borderBottom: "1px solid #1e1e2e",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span>Kontribusi Guild</span>
                  <span style={{ color: "#4a4a5a", fontSize: "10px", textTransform: "none", letterSpacing: 0 }}>
                    Saldo: <span style={{ color: "#f59e0b" }}>{myGold.toLocaleString()} Gold</span>
                  </span>
                </div>

                <p style={{ fontSize: "12px", color: "#6b6b80", marginBottom: "14px", lineHeight: "1.5" }}>
                  Setiap <span style={{ color: "#f59e0b" }}>10 Gold</span> yang dikontribusikan memberikan <span style={{ color: "#818cf8" }}>1 Guild EXP</span> untuk menaikkan level guild.
                </p>

                {/* Quick amount buttons */}
                <div style={{ display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap" }}>
                  {[100, 500, 1000, 5000, 10000].map((n) => (
                    <button
                      key={n}
                      onClick={() => setContributeAmount(Math.min(myGold, n))}
                      style={{
                        flex: 1, minWidth: "50px", padding: "6px 4px",
                        borderRadius: "7px",
                        background: contributeAmount === n ? "rgba(245,158,11,0.15)" : "#0f0f1a",
                        border: contributeAmount === n ? "1px solid rgba(245,158,11,0.4)" : "1px solid #1e1e2e",
                        color: contributeAmount === n ? "#f59e0b" : "#6b6b80",
                        fontSize: "11px", cursor: "pointer",
                        fontFamily: "Georgia, serif", transition: "all 0.15s",
                      }}
                    >
                      {n >= 1000 ? `${n / 1000}k` : n}
                    </button>
                  ))}
                </div>

                {/* Custom input */}
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px" }}>
                  <input
                    type="number"
                    value={contributeAmount}
                    min={100} max={myGold}
                    onChange={(e) => setContributeAmount(Math.max(100, Math.min(myGold, parseInt(e.target.value) || 100)))}
                    style={{
                      flex: 1, background: "#0f0f1a", border: "1px solid #2a2a3a",
                      borderRadius: "8px", padding: "8px 12px",
                      color: "#f0ece0", fontSize: "14px",
                      fontFamily: "Georgia, serif", outline: "none",
                    }}
                  />
                  <span style={{ fontSize: "12px", color: "#4a4a5a" }}>Gold</span>
                  <span style={{ fontSize: "12px", color: "#818cf8", background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.2)", borderRadius: "6px", padding: "4px 8px", whiteSpace: "nowrap" }}>
                    +{Math.floor(contributeAmount / 10)} EXP
                  </span>
                </div>

                <button
                  onClick={handleContribute}
                  disabled={submitting || myGold < contributeAmount}
                  style={{
                    width: "100%", padding: "11px", borderRadius: "10px",
                    background: myGold >= contributeAmount
                      ? "linear-gradient(135deg,#d97706,#f59e0b)"
                      : "#1a1a28",
                    border: "none",
                    color: myGold >= contributeAmount ? "#0a0a0f" : "#4a4a5a",
                    fontSize: "14px", fontWeight: "bold",
                    fontFamily: "Georgia, serif",
                    cursor: myGold >= contributeAmount ? "pointer" : "not-allowed",
                    boxShadow: myGold >= contributeAmount ? "0 0 16px rgba(245,158,11,0.15)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  {submitting ? "Memproses..." : `Kontribusi ${contributeAmount.toLocaleString()} Gold`}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              IN GUILD — Members
          ══════════════════════════════════════ */}
          {inGuild && tab === "members" && (
            <div style={{
              background: "#111118", border: "1px solid #2a2a3a",
              borderRadius: "14px", overflow: "hidden",
            }}>
              {/* Header row */}
              <div style={{
                display: "grid",
                gridTemplateColumns:"36px minmax(140px,1fr) 80px 80px 120px",
                gap: "8px",
                padding: "10px 16px",
                background: "#0f0f1a", borderBottom: "1px solid #1e1e2e",
              }}>
                {["#", "Player", "Level", "Melee", "Kontribusi"].map((h) => (
                  <div key={h} style={{ fontSize: "9px", letterSpacing: "0.12em", color: "#4a4a5a", textTransform: "uppercase" }}>
                    {h}
                  </div>
                ))}
              </div>

              {guild.members
                .sort((a: any, b: any) => b.contribution - a.contribution)
                .map((m: any, idx: number) => {
                  const roleConf = ROLE_CONFIG[m.role] ?? ROLE_CONFIG.member;
                  const rankIcon = idx === 0 ? "👑" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : null;
                  return (
                    <div
                      key={m.characterId}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "32px 1fr 72px 72px 100px",
                        gap: "8px",
                        padding: "12px 16px",
                        borderBottom: "1px solid #1a1a28",
                        background: m.isMe ? "rgba(245,158,11,0.04)" : "transparent",
                        borderLeft: m.isMe ? "2px solid #f59e0b" : "2px solid transparent",
                        transition: "background 0.15s",
                      }}
                    >
                      {/* Rank */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {rankIcon
                          ? <span style={{ fontSize: "16px" }}>{rankIcon}</span>
                          : <span style={{ fontSize: "11px", color: "#3a3a4a" }}>{idx + 1}</span>
                        }
                      </div>

                      {/* Player info */}
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                        <div style={{
                          width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0,
                          background: "#1a1a28", border: `1px solid ${roleConf.color}33`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "14px",
                        }}>
                          {m.role === "leader" ? "👑" : m.role === "officer" ? "⭐" : "👤"}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap" }}>
                            <span style={{
                              fontSize: "13px", fontWeight: "bold",
                              color: m.isMe ? "#f59e0b" : "#f0ece0",
                              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                            }}>
                              {m.characterName}
                            </span>
                            {m.isMe && (
                              <span style={{ fontSize: "8px", color: "#f59e0b", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "4px", padding: "1px 4px", flexShrink: 0 }}>
                                KAMU
                              </span>
                            )}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "1px" }}>
                            <span style={{ fontSize: "10px", color: "#4a4a5a" }}>@{m.username}</span>
                            <span style={{
                              fontSize: "9px", color: roleConf.color,
                              background: roleConf.bg, borderRadius: "4px",
                              padding: "0px 5px",
                            }}>
                              {roleConf.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Level */}
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ fontSize: "13px", color: "#c4bfb0" }}>Lv {m.level}</span>
                      </div>

                      {/* Melee */}
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ fontSize: "13px", color: "#ef4444" }}>Lv {m.meleeLevel}</span>
                      </div>

                      {/* Contribution */}
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", color: "#f59e0b", fontWeight: "bold" }}>
                          {m.contribution.toLocaleString()}g
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

        </div>
      </main>

      <style>{`
        @keyframes pulse {
          0%,100% { opacity:1 }
          50% { opacity:.4 }
        }

        @media (max-width: 1024px) {
          .guild-hero-grid {
            grid-template-columns: 72px 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .game-mobile-spacer {
            height: 56px !important;
          }

          .game-mobile-topbar {
            display: flex !important;
          }

          .guild-hero-grid {
            grid-template-columns: 1fr !important;
          }

          main {
            padding: 14px !important;
          }
        }

        @media (min-width: 769px) {
          .game-mobile-topbar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}