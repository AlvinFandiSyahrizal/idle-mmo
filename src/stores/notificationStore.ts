import { create } from "zustand";
import { NotificationItem } from "@/types";

interface NotificationStore {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (notif: Omit<NotificationItem, "id" | "read" | "createdAt">) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clearAll: () => void;
}

let notifCounter = 0;

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification(notif) {
    notifCounter += 1;
    const entry: NotificationItem = {
      id: `notif_${Date.now()}_${notifCounter}`,
      ...notif,
      read: false,
      createdAt: new Date(),
    };
    set((s) => ({
      notifications: [entry, ...s.notifications.slice(0, 29)],
      unreadCount: s.unreadCount + 1,
    }));
  },

  markAllRead() {
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  markRead(id) {
    set((s) => ({
      notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
      unreadCount: Math.max(0, s.unreadCount - 1),
    }));
  },

  clearAll() {
    set({ notifications: [], unreadCount: 0 });
  },
}));
