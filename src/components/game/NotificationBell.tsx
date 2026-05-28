"use client";

import { useState } from "react";
import { useNotificationStore } from "@/stores/notificationStore";

const NOTIF_COLORS: Record<string, string> = {
  levelup:    "#34d399",
  quest:      "#f59e0b",
  world_boss: "#ef4444",
  streak:     "#f97316",
  reward:     "#818cf8",
  system:     "#60a5fa",
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAllRead, clearAll } =
    useNotificationStore();

  function handleOpen() {
    setOpen((v) => !v);
    if (!open && unreadCount > 0) markAllRead();
  }

  return (
    <div style={{ position: "relative" }}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: open ? "rgba(245,158,11,0.15)" : "#1a1a28",
          border: open ? "1px solid rgba(245,158,11,0.3)" : "1px solid #2a2a3a",
          color: unreadCount > 0 ? "#f59e0b" : "#6b6b80",
          fontSize: "16px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", transition: "all 0.2s",
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: "-4px", right: "-4px",
            background: "#ef4444", color: "#fff",
            fontSize: "9px", fontWeight: "bold",
            width: "16px", height: "16px", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Georgia, serif",
            border: "1.5px solid #0a0a0f",
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            style={{ position: "fixed", inset: 0, zIndex: 40 }}
            onClick={() => setOpen(false)}
          />

          <div style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0,
            width: "300px", zIndex: 50,
            background: "#111118", border: "1px solid #2a2a3a",
            borderRadius: "14px", overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            fontFamily: "Georgia, serif",
          }}>
            {/* Header */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 14px",
              borderBottom: "1px solid #1e1e2e",
            }}>
              <span style={{ fontSize: "12px", fontWeight: "bold", color: "#f0ece0" }}>
                Notifikasi
              </span>
              {notifications.length > 0 && (
                <button onClick={clearAll} style={{
                  background: "transparent", border: "none",
                  color: "#4a4a5a", fontSize: "10px", cursor: "pointer",
                  fontFamily: "Georgia, serif",
                }}>
                  Hapus semua
                </button>
              )}
            </div>

            {/* List */}
            <div style={{ maxHeight: "320px", overflowY: "auto" }}>
              {notifications.length === 0 ? (
                <div style={{
                  padding: "30px", textAlign: "center",
                  color: "#4a4a5a", fontSize: "12px", fontStyle: "italic",
                }}>
                  Belum ada notifikasi.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} style={{
                    padding: "10px 14px",
                    borderBottom: "1px solid #1a1a28",
                    background: notif.read ? "transparent" : "rgba(245,158,11,0.03)",
                    display: "flex", gap: "10px", alignItems: "flex-start",
                  }}>
                    <span style={{ fontSize: "18px", flexShrink: 0 }}>{notif.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: "12px", fontWeight: "bold",
                        color: NOTIF_COLORS[notif.type] ?? "#f0ece0",
                        marginBottom: "2px",
                      }}>
                        {notif.title}
                      </div>
                      <div style={{ fontSize: "11px", color: "#6b6b80", lineHeight: "1.4" }}>
                        {notif.message}
                      </div>
                      <div style={{ fontSize: "9px", color: "#3a3a4a", marginTop: "3px" }}>
                        {notif.createdAt.toLocaleTimeString("id-ID", {
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </div>
                    </div>
                    {!notif.read && (
                      <div style={{
                        width: "6px", height: "6px", borderRadius: "50%",
                        background: "#f59e0b", flexShrink: 0, marginTop: "4px",
                      }} />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
