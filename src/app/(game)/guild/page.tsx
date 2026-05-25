"use client";

import { useState, useEffect, useCallback } from "react";
import GameSidebar from "@/components/layout/GameSidebar";

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  leader:  { label: "Pemimpin", color: "#f59e0b" },
  officer: { label: "Officer",  color: "#60a5fa" },
  member:  { label: "Member",   color: "#6b7280" },
};

export default function GuildPage() {
  const [character, setCharacter] = useState<any>(null);
  const [guildData, setGuildData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"info" | "members" | "search" | "create">("info");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", description: "" });
  const [contributeAmount, setContributeAmount] = useState(100);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    const [charRes, guildRes] = await Promise.all([
      fetch("/api/character"),
      fetch("/api/guild"),
    ]);
    const charData = await charRes.json();
    const guildDataRes = await guildRes.json();
    if (charData.success) setCharacter(charData.data);
    if (guildDataRes.success) setGuildData(guildDataRes.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function showFeedback(msg: string, ok: boolean) {
    setFeedback({ msg, ok });
    setTimeout(() => setFeedback(null), 3000);
  }

  async function searchGuilds() {
    setSearching(true);
    const res = await fetch(`/api/guild/search?q=${encodeURIComponent(searchQuery)}`);
    const data = await res.json();
    if (data.success) setSearchResults(data.data);
    setSearching(false);
  }

  async function handleCreate() {
    if (createForm.name.length < 3) {
      showFeedback("Nama guild minimal 3 karakter", false);
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/guild", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", ...createForm }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.success) {
      showFeedback(`Guild "${createForm.name}" berhasil dibuat!`, true);
      fetchData();
      setTab("info");
    } else {
      showFeedback(data.error, false);
    }
  }

  async function handleJoin(guildId: string, guildName: string) {
    setSubmitting(true);
    const res = await fetch("/api/guild", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "join", guildId }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.success) {
      showFeedback(`Bergabung dengan guild "${guildName}"!`, true);
      fetchData();
      setTab("info");
    } else {
      showFeedback(data.error, false);
    }
  }

  async function handleLeave() {
    if (!confirm("Yakin mau keluar dari guild?")) return;
    setSubmitting(true);
    const res = await fetch("/api/guild", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "leave" }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.success) {
      showFeedback("Kamu keluar dari guild.", true);
      fetchData();
    } else {
      showFeedback(data.error, false);
    }
  }

  async function handleContribute() {
    setSubmitting(true);
    const res = await fetch("/api/guild/contribute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: contributeAmount }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.success) {
      showFeedback(`Kontribusi ${contributeAmount} Gold berhasil!`, true);
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

  const inGuild = !!guildData?.guild;
  const guild = guildData?.guild;
  const membership = guildData?.membership;

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#0a0a0f", color: "#e2e0d8", fontFamily: "Georgia, serif" }}>
      <GameSidebar character={character} />

      <main style={{ flex: 1, padding: "28px 24px", overflow: "auto", minWidth: 0 }}>
        <div className="game-mobile-spacer" style={{ height: 0 }} />

        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#f0ece0", margin: 0 }}>
            🏛️ Guild
          </h1>
          <p style={{ fontSize: "12px", color: "#6b6b80", margin: "3px 0 0" }}>
            {inGuild ? `Member dari ${guild.name}` : "Belum bergabung guild manapun"}
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

        <div style={{ maxWidth: "800px" }}>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "20px", flexWrap: "wrap" }}>
            {(inGuild
              ? [
                  { id: "info", label: "📋 Info Guild" },
                  { id: "members", label: "👥 Members" },
                ]
              : [
                  { id: "search", label: "🔍 Cari Guild" },
                  { id: "create", label: "➕ Buat Guild" },
                ]
            ).map((t) => (
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

          {/* ── NOT IN GUILD: Search ── */}
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
                    borderRadius: "10px", padding: "9px 14px",
                    color: "#f0ece0", fontSize: "13px", fontFamily: "Georgia, serif",
                    outline: "none",
                  }}
                />
                <button
                  onClick={searchGuilds}
                  disabled={searching}
                  style={{
                    padding: "9px 20px", borderRadius: "10px",
                    background: "#f59e0b", border: "none",
                    color: "#0a0a0f", fontSize: "13px", fontWeight: "bold",
                    fontFamily: "Georgia, serif", cursor: "pointer",
                  }}
                >
                  {searching ? "..." : "Cari"}
                </button>
              </div>

              {/* Load all guilds on mount */}
              {searchResults.length === 0 && !searching && (
                <button
                  onClick={() => { setSearchQuery(""); searchGuilds(); }}
                  style={{
                    padding: "8px", borderRadius: "8px",
                    background: "#111118", border: "1px solid #2a2a3a",
                    color: "#6b6b80", fontSize: "12px",
                    fontFamily: "Georgia, serif", cursor: "pointer",
                  }}
                >
                  Lihat semua guild
                </button>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {searchResults.map((g) => (
                  <div key={g.id} style={{
                    background: "#111118", border: "1px solid #2a2a3a",
                    borderRadius: "12px", padding: "16px",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "15px", fontWeight: "bold", color: "#f0ece0" }}>{g.name}</span>
                        <span style={{
                          fontSize: "10px", color: "#f59e0b",
                          background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
                          borderRadius: "5px", padding: "1px 6px",
                        }}>Lv {g.level}</span>
                      </div>
                      {g.description && (
                        <p style={{ fontSize: "11px", color: "#6b6b80", margin: "0 0 6px", lineHeight: "1.4" }}>
                          {g.description}
                        </p>
                      )}
                      <div style={{ fontSize: "10px", color: "#4a4a5a" }}>
                        👥 {g.memberCount}/{g.maxMembers} member
                      </div>
                    </div>
                    <button
                      onClick={() => handleJoin(g.id, g.name)}
                      disabled={submitting || g.memberCount >= g.maxMembers}
                      style={{
                        padding: "7px 16px", borderRadius: "8px",
                        background: g.memberCount >= g.maxMembers ? "#1a1a28" : "rgba(245,158,11,0.15)",
                        border: g.memberCount >= g.maxMembers ? "1px solid #2a2a3a" : "1px solid rgba(245,158,11,0.3)",
                        color: g.memberCount >= g.maxMembers ? "#4a4a5a" : "#f59e0b",
                        fontSize: "12px", fontFamily: "Georgia, serif",
                        cursor: g.memberCount >= g.maxMembers ? "not-allowed" : "pointer",
                        fontWeight: "bold", flexShrink: 0,
                      }}
                    >
                      {g.memberCount >= g.maxMembers ? "Penuh" : "Bergabung"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── NOT IN GUILD: Create ── */}
          {!inGuild && tab === "create" && (
            <div style={{
              background: "#111118", border: "1px solid #2a2a3a",
              borderRadius: "14px", padding: "24px", maxWidth: "440px",
            }}>
              <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#f0ece0", margin: "0 0 18px" }}>
                Buat Guild Baru
              </h2>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "11px", color: "#6b6b80", display: "block", marginBottom: "6px" }}>
                  Nama Guild
                </label>
                <input
                  value={createForm.name}
                  onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
                  maxLength={30}
                  placeholder="3-30 karakter"
                  style={{
                    width: "100%", background: "#0f0f1a",
                    border: "1px solid #2a2a3a", borderRadius: "8px",
                    padding: "9px 12px", color: "#f0ece0",
                    fontSize: "13px", fontFamily: "Georgia, serif", outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "11px", color: "#6b6b80", display: "block", marginBottom: "6px" }}>
                  Deskripsi (opsional)
                </label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm((p) => ({ ...p, description: e.target.value }))}
                  maxLength={200}
                  placeholder="Ceritakan tentang guildmu..."
                  rows={3}
                  style={{
                    width: "100%", background: "#0f0f1a",
                    border: "1px solid #2a2a3a", borderRadius: "8px",
                    padding: "9px 12px", color: "#f0ece0",
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
                  width: "100%", padding: "11px", borderRadius: "9px",
                  background: createForm.name.length >= 3 ? "#f59e0b" : "#1a1a28",
                  border: "none",
                  color: createForm.name.length >= 3 ? "#0a0a0f" : "#4a4a5a",
                  fontSize: "14px", fontWeight: "bold",
                  fontFamily: "Georgia, serif", cursor: "pointer",
                }}
              >
                {submitting ? "Membuat..." : "🏛️ Buat Guild"}
              </button>
            </div>
          )}

          {/* ── IN GUILD: Info ── */}
          {inGuild && tab === "info" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Guild hero */}
              <div style={{
                background: "linear-gradient(135deg,#111118,#0d0d18)",
                border: "1px solid #2a2a3a",
                borderRadius: "16px", padding: "24px",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                      <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#f0ece0", margin: 0 }}>
                        🏛️ {guild.name}
                      </h2>
                      <span style={{
                        fontSize: "11px", color: "#f59e0b",
                        background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
                        borderRadius: "6px", padding: "2px 8px",
                      }}>Lv {guild.level}</span>
                    </div>
                    {guild.description && (
                      <p style={{ fontSize: "13px", color: "#6b6b80", margin: "0 0 12px", lineHeight: "1.5" }}>
                        {guild.description}
                      </p>
                    )}
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                      {[
                        { label: "Members", val: `${guild.members.length}/20` },
                        { label: "Guild EXP", val: guild.experience.toLocaleString() },
                        { label: "Rolemu", val: ROLE_LABELS[membership.role]?.label ?? membership.role },
                        { label: "Kontribusimu", val: `${membership.contribution.toLocaleString()} Gold` },
                      ].map((s) => (
                        <div key={s.label} style={{ textAlign: "center" }}>
                          <div style={{ fontSize: "15px", fontWeight: "bold", color: "#f59e0b" }}>{s.val}</div>
                          <div style={{ fontSize: "10px", color: "#4a4a5a" }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Leave button */}
                  <button
                    onClick={handleLeave}
                    disabled={submitting}
                    style={{
                      padding: "7px 16px", borderRadius: "8px",
                      background: "rgba(220,38,38,0.08)", border: "1px solid #3a2020",
                      color: "#ef4444", fontSize: "12px",
                      fontFamily: "Georgia, serif", cursor: "pointer",
                    }}
                  >
                    Keluar Guild
                  </button>
                </div>

                {/* Guild exp bar */}
                <div style={{ marginTop: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#4a4a5a", marginBottom: "4px" }}>
                    <span>Guild EXP</span>
                    <span>{guild.experience % 1000} / 1000</span>
                  </div>
                  <div style={{ height: "5px", background: "#0f0f1a", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: `${(guild.experience % 1000) / 10}%`,
                      background: "linear-gradient(90deg,#d97706,#f59e0b)",
                      borderRadius: "3px",
                    }} />
                  </div>
                </div>
              </div>

              {/* Contribute card */}
              <div style={{
                background: "#111118", border: "1px solid #2a2a3a",
                borderRadius: "14px", padding: "18px",
              }}>
                <div style={{
                  fontSize: "10px", letterSpacing: "0.15em", color: "#6b6b80",
                  textTransform: "uppercase", marginBottom: "12px",
                  paddingBottom: "8px", borderBottom: "1px solid #1e1e2e",
                }}>
                  Kontribusi Guild
                </div>

                <p style={{ fontSize: "12px", color: "#6b6b80", marginBottom: "14px", lineHeight: "1.5" }}>
                  Kontribusi Gold untuk menaikkan level guild. Tiap 10 Gold = 1 Guild EXP.
                </p>

                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "10px" }}>
                  <input
                    type="number"
                    value={contributeAmount}
                    min={100}
                    max={character?.gold ?? 0}
                    onChange={(e) => setContributeAmount(Math.max(100, parseInt(e.target.value) || 100))}
                    style={{
                      flex: 1, background: "#0f0f1a", border: "1px solid #2a2a3a",
                      borderRadius: "8px", padding: "8px 12px",
                      color: "#f0ece0", fontSize: "13px",
                      fontFamily: "Georgia, serif", outline: "none",
                    }}
                  />
                  <span style={{ fontSize: "12px", color: "#6b6b80" }}>Gold</span>
                </div>

                <div style={{ display: "flex", gap: "4px", marginBottom: "12px" }}>
                  {[100, 500, 1000, 5000].map((n) => (
                    <button
                      key={n}
                      onClick={() => setContributeAmount(Math.min(character?.gold ?? 0, n))}
                      style={{
                        flex: 1, padding: "4px", borderRadius: "5px",
                        background: "#0f0f1a", border: "1px solid #1e1e2e",
                        color: "#6b6b80", fontSize: "10px", cursor: "pointer",
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {n >= 1000 ? `${n/1000}k` : n}
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#4a4a5a", marginBottom: "10px" }}>
                  <span>Gold kamu: {character?.gold?.toLocaleString()}</span>
                  <span>+{Math.floor(contributeAmount / 10)} Guild EXP</span>
                </div>

                <button
                  onClick={handleContribute}
                  disabled={submitting || (character?.gold ?? 0) < contributeAmount}
                  style={{
                    width: "100%", padding: "10px", borderRadius: "8px",
                    background: (character?.gold ?? 0) >= contributeAmount ? "rgba(245,158,11,0.15)" : "#1a1a28",
                    border: (character?.gold ?? 0) >= contributeAmount ? "1px solid rgba(245,158,11,0.3)" : "1px solid #2a2a3a",
                    color: (character?.gold ?? 0) >= contributeAmount ? "#f59e0b" : "#4a4a5a",
                    fontSize: "13px", fontWeight: "bold",
                    fontFamily: "Georgia, serif", cursor: "pointer",
                  }}
                >
                  {submitting ? "..." : `Kontribusi ${contributeAmount.toLocaleString()} Gold`}
                </button>
              </div>
            </div>
          )}

          {/* ── IN GUILD: Members ── */}
          {inGuild && tab === "members" && (
            <div style={{
              background: "#111118", border: "1px solid #2a2a3a",
              borderRadius: "14px", overflow: "hidden",
            }}>
              {/* Header */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 80px 80px 100px",
                padding: "10px 16px", background: "#0f0f1a",
                borderBottom: "1px solid #1e1e2e",
              }}>
                {["Player", "Level", "Melee", "Kontribusi"].map((h) => (
                  <div key={h} style={{ fontSize: "10px", letterSpacing: "0.1em", color: "#4a4a5a", textTransform: "uppercase" }}>
                    {h}
                  </div>
                ))}
              </div>

              {guild.members
                .sort((a: any, b: any) => b.contribution - a.contribution)
                .map((member: any) => {
                  const roleStyle = ROLE_LABELS[member.role] ?? { label: member.role, color: "#6b7280" };
                  return (
                    <div
                      key={member.characterId}
                      style={{
                        display: "grid", gridTemplateColumns: "1fr 80px 80px 100px",
                        padding: "12px 16px",
                        borderBottom: "1px solid #1a1a28",
                        background: member.isMe ? "rgba(245,158,11,0.04)" : "transparent",
                        borderLeft: member.isMe ? "2px solid #f59e0b" : "2px solid transparent",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "13px", fontWeight: "bold", color: member.isMe ? "#f59e0b" : "#f0ece0" }}>
                            {member.characterName}
                          </span>
                          {member.isMe && (
                            <span style={{ fontSize: "9px", color: "#f59e0b", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "4px", padding: "1px 4px" }}>
                              KAMU
                            </span>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                          <span style={{ fontSize: "10px", color: "#4a4a5a" }}>@{member.username}</span>
                          <span style={{ fontSize: "9px", color: roleStyle.color, background: `${roleStyle.color}22`, borderRadius: "4px", padding: "1px 5px" }}>
                            {roleStyle.label}
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: "13px", color: "#c4bfb0", display: "flex", alignItems: "center" }}>
                        Lv {member.level}
                      </div>
                      <div style={{ fontSize: "13px", color: "#ef4444", display: "flex", alignItems: "center" }}>
                        Lv {member.meleeLevel}
                      </div>
                      <div style={{ fontSize: "12px", color: "#f59e0b", display: "flex", alignItems: "center" }}>
                        {member.contribution.toLocaleString()}g
                      </div>
                    </div>
                  );
                })}
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