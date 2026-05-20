"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { CHARACTER_CLASSES, CLASS_ICONS } from "@/data/characters";
import { SKILLS } from "@/data/skills";

interface Props {
  character: any;
  onRefresh: () => void;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: "⚱" },
  { href: "/combat", label: "Combat", icon: "⚔️" },
  { href: "/inventory", label: "Inventory", icon: "🎒" },
  { href: "/skills", label: "Skills", icon: "📊" },
  { href: "/crafting", label: "Crafting", icon: "🔨" },
  { href: "/guild", label: "Guild", icon: "🏛️" },
];

export default function Dashboard({ character, onRefresh }: Props) {
  const classData = CHARACTER_CLASSES.find((c) => c.id === character.classId);
  const hpPct = Math.round((character.hp / character.maxHp) * 100);
  const mpPct = Math.round((character.mp / character.maxMp) * 100);
  const alignPct = ((character.alignment + 100) / 200) * 100;

  const alignLabel =
    character.alignment <= -60 ? "Mesir Sejati"
    : character.alignment <= -30 ? "Condong Mesir"
    : character.alignment >= 60 ? "Mesopotamia Sejati"
    : character.alignment >= 30 ? "Condong Mesopotamia"
    : "Netral";

  const combatSkills = character.skills?.filter((s: any) =>
    ["melee", "ranged", "magic", "defense"].includes(s.skillId)
  ) ?? [];

  const gatherSkills = character.skills?.filter((s: any) =>
    ["excavation", "inscription", "herbalism", "fishing"].includes(s.skillId)
  ) ?? [];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e2e0d8", fontFamily: "Georgia, serif", display: "flex" }}>

      {/* Sidebar */}
      <aside style={{
        width: "220px",
        flexShrink: 0,
        background: "linear-gradient(180deg, #111118 0%, #0d0d14 100%)",
        borderRight: "1px solid #2a2a3a",
        display: "flex",
        flexDirection: "column",
        padding: "0",
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #1e1e2e" }}>
          <div style={{ fontSize: "11px", letterSpacing: "0.3em", color: "#6b6b80", marginBottom: "4px" }}>IDLE MMO</div>
          <div style={{ fontSize: "16px", fontWeight: "bold", color: "#f59e0b", letterSpacing: "0.1em" }}>⚱ SANDS OF ETERNITY</div>
        </div>

        {/* Character mini */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e1e2e" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "10px",
              background: "#1a1a28", border: "1px solid #2e2e44",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px"
            }}>
              {classData ? CLASS_ICONS[classData.id] : "⚔️"}
            </div>
            <div>
              <div style={{ fontWeight: "bold", fontSize: "14px", color: "#f0ece0" }}>{character.name}</div>
              <div style={{ fontSize: "11px", color: "#6b6b80" }}>{classData?.name} · Lv {character.level}</div>
            </div>
          </div>

          {/* HP */}
          <div style={{ marginBottom: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#6b6b80", marginBottom: "3px" }}>
              <span>HP</span><span>{character.hp}/{character.maxHp}</span>
            </div>
            <div style={{ height: "5px", background: "#1a1a28", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${hpPct}%`, background: "linear-gradient(90deg, #dc2626, #ef4444)", borderRadius: "3px", transition: "width 0.5s" }} />
            </div>
          </div>

          {/* MP */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#6b6b80", marginBottom: "3px" }}>
              <span>MP</span><span>{character.mp}/{character.maxMp}</span>
            </div>
            <div style={{ height: "5px", background: "#1a1a28", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${mpPct}%`, background: "linear-gradient(90deg, #1d4ed8, #3b82f6)", borderRadius: "3px", transition: "width 0.5s" }} />
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {NAV_ITEMS.map((item) => {
            const isActive = typeof window !== "undefined" && window.location.pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "9px 12px", borderRadius: "8px", marginBottom: "2px",
                textDecoration: "none",
                background: isActive ? "rgba(245,158,11,0.1)" : "transparent",
                border: isActive ? "1px solid rgba(245,158,11,0.2)" : "1px solid transparent",
                color: isActive ? "#f59e0b" : "#8a8a9a",
                fontSize: "13px", fontFamily: "Georgia, serif",
                transition: "all 0.2s",
              }}>
                <span style={{ fontSize: "15px" }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div style={{ padding: "12px 10px", borderTop: "1px solid #1e1e2e" }}>
          <button onClick={() => signOut({ callbackUrl: "/login" })} style={{
            width: "100%", padding: "8px 12px", borderRadius: "8px",
            background: "transparent", border: "1px solid #2a2a3a",
            color: "#6b6b80", fontSize: "12px", fontFamily: "Georgia, serif",
            cursor: "pointer", transition: "all 0.2s",
          }}>
            ← Keluar
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: "auto", padding: "28px 32px" }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "#f0ece0", margin: 0 }}>Dashboard</h1>
            <p style={{ fontSize: "12px", color: "#6b6b80", margin: "4px 0 0" }}>Selamat datang kembali, {character.name}</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { icon: "💰", val: character.gold.toLocaleString(), label: "Gold" },
              { icon: "🔮", val: character.soulShard, label: "Shard" },
            ].map((c) => (
              <div key={c.label} style={{
                background: "#111118", border: "1px solid #2a2a3a",
                borderRadius: "10px", padding: "8px 14px",
                display: "flex", alignItems: "center", gap: "7px",
              }}>
                <span style={{ fontSize: "16px" }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "bold", color: "#f59e0b" }}>{c.val}</div>
                  <div style={{ fontSize: "10px", color: "#6b6b80" }}>{c.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>

          {/* Card: Stats */}
          <div style={cardStyle}>
            <SectionTitle>Statistik Karakter</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
              {[
                { label: "STR", val: character.str, color: "#ef4444" },
                { label: "AGI", val: character.agi, color: "#22c55e" },
                { label: "INT", val: character.int_stat, color: "#818cf8" },
                { label: "VIT", val: character.vit, color: "#eab308" },
              ].map((s) => (
                <div key={s.label} style={{
                  background: "#0f0f1a", border: "1px solid #2a2a3a",
                  borderRadius: "8px", padding: "10px 12px",
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <span style={{ fontSize: "12px", color: "#6b6b80" }}>{s.label}</span>
                  <span style={{ fontSize: "16px", fontWeight: "bold", color: s.color }}>{s.val}</span>
                </div>
              ))}
            </div>

            {/* Alignment */}
            <div style={{ background: "#0f0f1a", border: "1px solid #2a2a3a", borderRadius: "8px", padding: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "8px" }}>
                <span style={{ color: "#f59e0b" }}>Mesir</span>
                <span style={{ color: "#9ca3af", fontSize: "10px" }}>{alignLabel}</span>
                <span style={{ color: "#60a5fa" }}>Mesopotamia</span>
              </div>
              <div style={{ height: "8px", background: "#1a1a28", borderRadius: "4px", position: "relative", overflow: "visible" }}>
                <div style={{
                  position: "absolute", top: "50%", transform: "translate(-50%, -50%)",
                  left: `${alignPct}%`,
                  width: "14px", height: "14px", borderRadius: "50%",
                  background: "#e2e0d8", border: "2px solid #0a0a0f",
                  boxShadow: "0 0 8px rgba(255,255,255,0.3)",
                  transition: "left 0.5s", zIndex: 2,
                }} />
                <div style={{
                  height: "100%", borderRadius: "4px",
                  background: "linear-gradient(90deg, #d97706, #1e3a8a)",
                  opacity: 0.4, width: "100%"
                }} />
              </div>
            </div>
          </div>

          {/* Card: Combat Skills */}
          <div style={cardStyle}>
            <SectionTitle>Combat Skills</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {combatSkills.map((skill: any) => {
                const def = SKILLS.find((s) => s.id === skill.skillId);
                const pct = Math.min(100, (skill.experience / 1000) * 100);
                return (
                  <div key={skill.skillId}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "13px", color: "#c4bfb0" }}>{def?.icon} {def?.name}</span>
                      <span style={{
                        fontSize: "12px", fontWeight: "bold", color: "#f59e0b",
                        background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
                        borderRadius: "6px", padding: "1px 8px"
                      }}>Lv {skill.level}</span>
                    </div>
                    <div style={{ height: "4px", background: "#1a1a28", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "#d97706", borderRadius: "2px", transition: "width 0.5s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card: Gathering Skills */}
          <div style={cardStyle}>
            <SectionTitle>Gathering Skills</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {gatherSkills.map((skill: any) => {
                const def = SKILLS.find((s) => s.id === skill.skillId);
                const pct = Math.min(100, (skill.experience / 1000) * 100);
                return (
                  <div key={skill.skillId}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "13px", color: "#c4bfb0" }}>{def?.icon} {def?.name}</span>
                      <span style={{
                        fontSize: "12px", fontWeight: "bold", color: "#6b8f6b",
                        background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)",
                        borderRadius: "6px", padding: "1px 8px"
                      }}>Lv {skill.level}</span>
                    </div>
                    <div style={{ height: "4px", background: "#1a1a28", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "#16a34a", borderRadius: "2px", transition: "width 0.5s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card: Passive */}
          <div style={{ ...cardStyle, gridColumn: "1 / 2" }}>
            <SectionTitle>Passive Ability</SectionTitle>
            {classData && (
              <div style={{
                background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)",
                borderRadius: "10px", padding: "14px"
              }}>
                <div style={{ fontSize: "13px", fontWeight: "bold", color: "#f59e0b", marginBottom: "6px" }}>
                  ✦ {classData.passive}
                </div>
                <div style={{ fontSize: "12px", color: "#8a8a9a", lineHeight: "1.6" }}>
                  {classData.passiveDescription}
                </div>
              </div>
            )}
          </div>

          {/* Card: Currencies */}
          <div style={{ ...cardStyle, gridColumn: "2 / 4" }}>
            <SectionTitle>Mata Uang</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px" }}>
              {[
                { icon: "💰", label: "Gold", val: character.gold.toLocaleString(), color: "#f59e0b" },
                { icon: "🔮", label: "Soul Shard", val: character.soulShard, color: "#818cf8" },
                { icon: "⚗️", label: "Offering", val: character.offering, color: "#34d399" },
                { icon: "🏛️", label: "Guild Token", val: character.guildToken, color: "#60a5fa" },
              ].map((c) => (
                <div key={c.label} style={{
                  background: "#0f0f1a", border: "1px solid #2a2a3a",
                  borderRadius: "10px", padding: "14px 12px", textAlign: "center"
                }}>
                  <div style={{ fontSize: "24px", marginBottom: "6px" }}>{c.icon}</div>
                  <div style={{ fontSize: "18px", fontWeight: "bold", color: c.color }}>{c.val}</div>
                  <div style={{ fontSize: "10px", color: "#6b6b80", marginTop: "2px" }}>{c.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#111118",
  border: "1px solid #2a2a3a",
  borderRadius: "14px",
  padding: "20px",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: "11px", letterSpacing: "0.15em", color: "#6b6b80",
      textTransform: "uppercase", marginBottom: "14px",
      paddingBottom: "10px", borderBottom: "1px solid #1e1e2e"
    }}>
      {children}
    </div>
  );
}