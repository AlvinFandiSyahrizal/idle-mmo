import { create } from "zustand";

const QUEST_PROGRESS_EVENT =
  "quest-progress-updated";

export interface CombatLog {
  id: string;
  message: string;
  type: "combat" | "loot" | "levelup" | "death" | "system";
  timestamp: Date;
}

interface CombatStats {
  totalExp: number;
  totalGold: number;
  killCount: number;
}

interface CombatStore {
  isActive: boolean;
  currentAreaId: string | null;
  currentAreaName: string | null;
  logs: CombatLog[];
  stats: CombatStats;
  tickInterval: NodeJS.Timeout | null;
  counter: number;

  // Actions
  startCombat: (areaId: string, areaName: string, onUpdate?: () => void) => Promise<boolean>;
  stopCombat: (onUpdate?: () => void) => Promise<void>;
  addLog: (message: string, type?: CombatLog["type"]) => void;
  clearLogs: () => void;
}

export const useCombatStore = create<CombatStore>((set, get) => ({
  isActive: false,
  currentAreaId: null,
  currentAreaName: null,
  logs: [],
  stats: { totalExp: 0, totalGold: 0, killCount: 0 },
  tickInterval: null,
  counter: 0,

  addLog(message, type = "combat") {
    const state = get();
    const newCounter = state.counter + 1;
    const entry: CombatLog = {
      id: `log_${Date.now()}_${newCounter}`,
      message,
      type,
      timestamp: new Date(),
    };
    set((s) => ({
      counter: newCounter,
      logs: [entry, ...s.logs.slice(0, 49)],
    }));
  },

  clearLogs() {
    set({ logs: [] });
  },

  async startCombat(areaId, areaName, onUpdate) {
    const state = get();

    // Stop existing interval if any
    if (state.tickInterval) clearInterval(state.tickInterval);

    const res = await fetch("/api/combat/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ areaId }),
    });
    const data = await res.json();

    if (!data.success) {
      get().addLog(`❌ ${data.error}`, "system");
      return false;
    }

    set({
      isActive: true,
      currentAreaId: areaId,
      currentAreaName: areaName,
      stats: { totalExp: 0, totalGold: 0, killCount: 0 },
    });

    get().addLog(`⚔️ Memasuki ${areaName}... Combat dimulai!`, "system");

    // Start tick
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/combat/tick", { method: "POST" });
        const data = await res.json();
        if (!data.success) return;

        const { playerDied, logs, expGained, goldGained, monsterName } = data.data;

        if (logs?.length) {
          logs.forEach((msg: string, i: number) => {
            setTimeout(() => {
              const type: CombatLog["type"] =
                msg.includes("🎉") ? "levelup"
                : msg.includes("dikalahkan oleh") ? "death"
                : msg.includes("Drop:") ? "loot"
                : "combat";
              get().addLog(msg, type);
            }, i * 10);
          });
        }

        if (playerDied) {
          setTimeout(() => get().addLog("💀 Kamu pingsan! Combat dihentikan.", "death"), (logs?.length ?? 0) * 10 + 20);
          const iv = get().tickInterval;
          if (iv) clearInterval(iv);
          set({ isActive: false, currentAreaId: null, currentAreaName: null, tickInterval: null });
          onUpdate?.();
          return;
        }

        set((s) => ({
          stats: {
            totalExp: s.stats.totalExp + (expGained ?? 0),
            totalGold: s.stats.totalGold + (goldGained ?? 0),
            killCount: s.stats.killCount + (monsterName ? 1 : 0),
          },
        }));

        if (monsterName) {
          window.dispatchEvent(
            new CustomEvent(
              QUEST_PROGRESS_EVENT
            )
          );
        }

        onUpdate?.();
      } catch (err) {
        console.error("Combat tick error:", err);
      }
    }, 3000);

    set({ tickInterval: interval });
    return true;
  },

  async stopCombat(onUpdate) {
    const state = get();
    if (state.tickInterval) clearInterval(state.tickInterval);

    await fetch("/api/combat/stop", { method: "POST" });

    set({
      isActive: false,
      currentAreaId: null,
      currentAreaName: null,
      tickInterval: null,
    });

    get().addLog("🛑 Combat dihentikan.", "system");
    onUpdate?.();
  },
}));