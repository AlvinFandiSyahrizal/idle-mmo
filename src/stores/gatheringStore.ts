import { create } from "zustand";

export interface GatherLog {
  id: string;
  message: string;
  type: "gather" | "levelup" | "system";
  timestamp: Date;
}

interface GatheringStore {
  isActive: boolean;
  currentAreaId: string | null;
  currentAreaName: string | null;
  currentSkill: string | null;
  logs: GatherLog[];
  stats: { totalGathered: number; expGained: number };
  tickInterval: NodeJS.Timeout | null;
  counter: number;

  start: (areaId: string, areaName: string, skill: string, onUpdate?: () => void) => void;
  stop: () => void;
  addLog: (msg: string, type?: GatherLog["type"]) => void;
}

export const useGatheringStore = create<GatheringStore>((set, get) => ({
  isActive: false,
  currentAreaId: null,
  currentAreaName: null,
  currentSkill: null,
  logs: [],
  stats: { totalGathered: 0, expGained: 0 },
  tickInterval: null,
  counter: 0,

  addLog(msg, type = "gather") {
    const c = get().counter + 1;
    const entry: GatherLog = {
      id: `glog_${Date.now()}_${c}`,
      message: msg, type,
      timestamp: new Date(),
    };
    set((s) => ({ counter: c, logs: [entry, ...s.logs.slice(0, 49)] }));
  },

  start(areaId, areaName, skill, onUpdate) {
    const state = get();
    if (state.tickInterval) clearInterval(state.tickInterval);

    set({
      isActive: true,
      currentAreaId: areaId,
      currentAreaName: areaName,
      currentSkill: skill,
      stats: { totalGathered: 0, expGained: 0 },
    });

    get().addLog(`⛏️ Mulai gathering di ${areaName}...`, "system");

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/gathering", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "tick", areaId }),
        });
        const data = await res.json();
        if (!data.success) return;

        const { gathered, expGained, leveledUp, skillId, skillLevel } = data.data;

        if (gathered.length > 0) {
          const items = gathered.map((g: any) => `${g.itemName} x${g.quantity}`).join(", ");
          get().addLog(`📦 ${items}`, "gather");
        }

        if (leveledUp) {
          get().addLog(`🎉 ${skillId} naik ke Level ${skillLevel}!`, "levelup");
        }

        set((s) => ({
          stats: {
            totalGathered: s.stats.totalGathered + gathered.length,
            expGained: s.stats.expGained + expGained,
          },
        }));

        onUpdate?.();
      } catch (err) {
        console.error("Gathering tick error:", err);
      }
    }, 4000);

    set({ tickInterval: interval });
  },

  stop() {
    const state = get();
    if (state.tickInterval) clearInterval(state.tickInterval);
    set({
      isActive: false,
      currentAreaId: null,
      currentAreaName: null,
      currentSkill: null,
      tickInterval: null,
    });
    get().addLog("⏹️ Gathering dihentikan.", "system");
  },
}));