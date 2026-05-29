import { useEffect } from "react";
import { useCombatStore } from "@/stores/combatStore";

export function useRegen(onHeal?: () => void) {
  const isActive = useCombatStore((s) => s.isActive);

  useEffect(() => {
    if (isActive) return; // Jangan regen saat combat

    const interval = setInterval(async () => {
      try {
        const res  = await fetch("/api/character/regen", { method: "POST" });
        const data = await res.json();
        if (data.success && data.data.healed > 0) {
          onHeal?.();
        }
      } catch {
        // Silent fail
      }
    }, 10000); // Regen tiap 10 detik saat idle

    return () => clearInterval(interval);
  }, [isActive, onHeal]);
}