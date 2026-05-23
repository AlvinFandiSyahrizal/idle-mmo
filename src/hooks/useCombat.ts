import { useState, useEffect, useRef, useCallback } from "react";

export interface CombatLog {
  id: string;
  message: string;
  type: "combat" | "loot" | "levelup" | "death" | "system";
  timestamp: Date;
}

interface CombatState {
  isActive: boolean;
  currentAreaId: string | null;
  currentAreaName: string | null;
  logs: CombatLog[];
  stats: {
    totalExp: number;
    totalGold: number;
    killCount: number;
  };
}

const TICK_INTERVAL = 3000;

export function useCombat(onStatsUpdate?: () => void) {
  const [state, setState] = useState<CombatState>({
    isActive: false,
    currentAreaId: null,
    currentAreaName: null,
    logs: [],
    stats: { totalExp: 0, totalGold: 0, killCount: 0 },
  });

  const tickRef = useRef<NodeJS.Timeout | null>(null);
  const counterRef = useRef(0);

  function makeId(): string {
    counterRef.current += 1;
    return `log_${Date.now()}_${counterRef.current}`;
  }

  function addLog(message: string, type: CombatLog["type"] = "combat") {
    const entry: CombatLog = {
      id: makeId(),
      message,
      type,
      timestamp: new Date(),
    };
    setState((prev) => ({
      ...prev,
      logs: [entry, ...prev.logs.slice(0, 49)],
    }));
  }

  const runTick = useCallback(async () => {
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
            addLog(msg, type);
          }, i * 10);
        });
      }

      if (playerDied) {
        setTimeout(() => addLog("💀 Kamu pingsan! Combat dihentikan.", "death"), (logs?.length ?? 0) * 10 + 20);
        setState((prev) => ({
          ...prev,
          isActive: false,
          currentAreaId: null,
          currentAreaName: null,
        }));
        if (tickRef.current) clearInterval(tickRef.current);
        onStatsUpdate?.();
        return;
      }

      setState((prev) => ({
        ...prev,
        stats: {
          totalExp: prev.stats.totalExp + (expGained ?? 0),
          totalGold: prev.stats.totalGold + (goldGained ?? 0),
          killCount: prev.stats.killCount + (monsterName ? 1 : 0),
        },
      }));

      onStatsUpdate?.();
    } catch (err) {
      console.error("Combat tick error:", err);
    }
  }, [onStatsUpdate]);

  async function startCombat(areaId: string, areaName: string) {
    const res = await fetch("/api/combat/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ areaId }),
    });
    const data = await res.json();
    if (!data.success) {
      addLog(`❌ ${data.error}`, "system");
      return false;
    }

    setState((prev) => ({
      ...prev,
      isActive: true,
      currentAreaId: areaId,
      currentAreaName: areaName,
      stats: { totalExp: 0, totalGold: 0, killCount: 0 },
    }));

    addLog(`⚔️ Memasuki ${areaName}... Combat dimulai!`, "system");
    tickRef.current = setInterval(runTick, TICK_INTERVAL);
    return true;
  }

  async function stopCombat() {
    if (tickRef.current) clearInterval(tickRef.current);
    await fetch("/api/combat/stop", { method: "POST" });
    setState((prev) => ({
      ...prev,
      isActive: false,
      currentAreaId: null,
      currentAreaName: null,
    }));
    addLog("🛑 Combat dihentikan.", "system");
    onStatsUpdate?.();
  }

  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  return { state, startCombat, stopCombat };
}