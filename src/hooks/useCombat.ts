import { useState, useEffect, useRef, useCallback } from "react";

interface CombatLog {
  id: number;
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

const TICK_INTERVAL = 3000; // 3 detik per tick

export function useCombat(onStatsUpdate?: () => void) {
  const [state, setState] = useState<CombatState>({
    isActive: false,
    currentAreaId: null,
    currentAreaName: null,
    logs: [],
    stats: { totalExp: 0, totalGold: 0, killCount: 0 },
  });

  const tickRef = useRef<NodeJS.Timeout | null>(null);
  const logIdRef = useRef(0);

  function addLog(message: string, type: CombatLog["type"] = "combat") {
    logIdRef.current += 1;
    setState((prev) => ({
      ...prev,
      logs: [
        { id: logIdRef.current, message, type, timestamp: new Date() },
        ...prev.logs.slice(0, 49), // keep last 50
      ],
    }));
  }

  const runTick = useCallback(async () => {
    try {
      const res = await fetch("/api/combat/tick", { method: "POST" });
      const data = await res.json();
      if (!data.success) return;

      const { playerDied, logs, expGained, goldGained, loot, monsterName } = data.data;

      logs?.forEach((log: string) => {
        const type = log.includes("🎉")
          ? "levelup"
          : log.includes("dikalahkan")
          ? "death"
          : log.includes("Drop:")
          ? "loot"
          : "combat";
        addLog(log, type);
      });

      if (playerDied) {
        addLog("💀 Kamu pingsan! Combat dihentikan otomatis.", "death");
        setState((prev) => ({ ...prev, isActive: false, currentAreaId: null }));
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
    setState((prev) => ({ ...prev, isActive: false, currentAreaId: null, currentAreaName: null }));
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