"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { CHARACTER_CLASSES, CLASS_ICONS } from "@/data/characters";
import { useCombatStore } from "@/stores/combatStore";
import { useGatheringStore } from "@/stores/gatheringStore";

const NAV_ITEMS = [
  { href: "/dashboard",    label: "Home",         icon: "⚱" },
  { href: "/combat",       label: "Combat",       icon: "⚔️" },
  { href: "/gathering",    label: "Gathering",    icon: "⛏️" },
  { href: "/world-boss",   label: "World Boss",   icon: "👹" },
  { href: "/inventory",    label: "Inventory",    icon: "🎒" },
  { href: "/skills",       label: "Skills",       icon: "📊" },
  { href: "/crafting",     label: "Crafting",     icon: "🔨" },
  { href: "/quests",       label: "Quests",       icon: "📋" },
  { href: "/achievements", label: "Achievements", icon: "🏆" },
  { href: "/leaderboard",  label: "Leaderboard",  icon: "🥇" },
  { href: "/profile",      label: "Profile",      icon: "👤" },
  { href: "/guild",        label: "Guild",        icon: "🏛️" },
  { href: "/ascension",    label: "Ascension",    icon: "🌟" },
];

const MOBILE_NAV = [
  { href: "/dashboard", label: "Home",    icon: "⚱" },
  { href: "/combat",    label: "Combat",  icon: "⚔️" },
  { href: "/gathering", label: "Gather",  icon: "⛏️" },
  { href: "/inventory", label: "Bag",     icon: "🎒" },
  { href: "/profile",   label: "Profile", icon: "👤" },
];

interface Props {
  character: any;
}

export default function GameSidebar({ character }: Props) {
  const pathname  = usePathname();
  const [open, setOpen] = useState(false);

  const classData = CHARACTER_CLASSES.find((c) => c.id === character?.classId);
  const hpPct     = character ? Math.round((character.hp / character.maxHp) * 100) : 0;

  const { isActive: combatActive, currentAreaName } = useCombatStore();
  const { isActive: gatherActive, currentSkill }    = useGatheringStore();

  return (
    <>
      {/* ── Mobile topbar ── */}
      <div
        className="game-mobile-topbar"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 30,
          background: "#111118", borderBottom: "1px solid #2a2a3a",
          padding: "10px 16px",
          alignItems: "center", justifyContent: "space-between",
          fontFamily: "Georgia, serif",
        }}
      >
        <button
          onClick={() => setOpen(true)}
          style={{
            background: "#1a1a28", border: "1px solid #2a2a3a",
            borderRadius: "8px", padding: "6px 12px",
            color: "#e2e0d8", fontSize: "16px", cursor: "pointer",
          }}
        >
          ☰
        </button>
        <div style={{ fontSize: "13px", fontWeight: "bold", color: "#f59e0b" }}>
          ⚱ SANDS OF ETERNITY
        </div>
        <div style={{ fontSize: "11px", color: "#6b6b80" }}>
          {character?.name ?? ""}
        </div>
      </div>

      {/* ── Overlay when mobile sidebar open ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 40,
          }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`game-sidebar${open ? " open" : ""}`}
        style={{
          background: "linear-gradient(180deg,#111118,#0d0d14)",
          borderRight: "1px solid #2a2a3a",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Logo */}
        <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid #1e1e2e" }}>
          <div style={{ fontSize: "10px", letterSpacing: "0.3em", color: "#6b6b80", marginBottom: "3px" }}>
            IDLE MMO
          </div>
          <div style={{ fontSize: "14px", fontWeight: "bold", color: "#f59e0b" }}>
            ⚱ SANDS OF ETERNITY
          </div>
        </div>

        {/* Character info */}
        {character && (
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #1e1e2e" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "10px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "8px",
                background: "#1a1a28", border: "1px solid #2e2e44",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px",
              }}>
                {classData ? CLASS_ICONS[classData.id] : "⚔️"}
              </div>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "13px", color: "#f0ece0" }}>
                  {character.name}
                </div>
                <div style={{ fontSize: "10px", color: "#6b6b80" }}>
                  {classData?.name} · Lv {character.level}
                </div>
              </div>
            </div>

            {/* HP bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#6b6b80", marginBottom: "3px" }}>
                <span>HP</span>
                <span style={{ color: "#ef4444" }}>{character.hp}/{character.maxHp}</span>
              </div>
              <div style={{ height: "4px", background: "#1a1a28", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${hpPct}%`,
                  background: "linear-gradient(90deg,#dc2626,#ef4444)",
                  borderRadius: "2px",
                }} />
              </div>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
          {NAV_ITEMS.map((item) => {
            const isActivePage   = pathname === item.href;
            const isCombat       = item.href === "/combat";
            const isGathering    = item.href === "/gathering";

            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: "9px",
                    padding: "9px 12px", borderRadius: "8px", marginBottom: "2px",
                    textDecoration: "none",
                    background: isActivePage ? "rgba(245,158,11,0.1)" : "transparent",
                    border: isActivePage ? "1px solid rgba(245,158,11,0.2)" : "1px solid transparent",
                    color: isActivePage ? "#f59e0b" : "#8a8a9a",
                    fontSize: "13px", fontFamily: "Georgia, serif",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: "15px" }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>

                  {/* Combat active indicator */}
                  {isCombat && combatActive && (
                    <span style={{
                      width: "7px", height: "7px", borderRadius: "50%",
                      background: "#22c55e", flexShrink: 0,
                      boxShadow: "0 0 6px #22c55e",
                      animation: "pulse 1.5s infinite",
                    }} />
                  )}

                  {/* DI SINI TEMPATNYA: Gathering active indicator */}
                  {isGathering && gatherActive && (
                    <span style={{
                      width: "7px", height: "7px", borderRadius: "50%",
                      background: "#16a34a", flexShrink: 0,
                      boxShadow: "0 0 6px #16a34a",
                      animation: "pulse 1.5s infinite",
                    }} />
                  )}
                </Link>

                {/* Combat area sublabel */}
                {isCombat && combatActive && currentAreaName && (
                  <div style={{
                    marginTop: "-4px", marginBottom: "4px",
                    paddingLeft: "38px",
                    fontSize: "9px", color: "#22c55e",
                    letterSpacing: "0.05em",
                  }}>
                    ↳ {currentAreaName}
                  </div>
                )}

                {/* Gathering skill sublabel */}
                {isGathering && gatherActive && currentSkill && (
                  <div style={{
                    marginTop: "-4px", marginBottom: "4px",
                    paddingLeft: "38px",
                    fontSize: "9px", color: "#16a34a",
                    letterSpacing: "0.05em",
                  }}>
                    ↳ {currentSkill}
                  </div>
                )}
              </div>
            );
          })}
        </nav>


        {/* Sign out */}
        <div style={{ padding: "10px 8px", borderTop: "1px solid #1e1e2e" }}>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={{
              width: "100%", padding: "8px", borderRadius: "8px",
              background: "transparent", border: "1px solid #2a2a3a",
              color: "#6b6b80", fontSize: "12px",
              fontFamily: "Georgia, serif", cursor: "pointer",
            }}
          >
            ← Keluar
          </button>
        </div>
      </aside>

      {/* ── Mobile bottom nav ── */}
      <nav
        className="mobile-bottom-nav"
        style={{ display: "none" }}
      >
        {MOBILE_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname === item.href ? "active" : ""}
            style={{ textDecoration: "none" }}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </>
  );
}