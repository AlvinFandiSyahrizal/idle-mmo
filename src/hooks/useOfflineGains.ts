import { useState, useEffect } from "react";
import { OfflineResult } from "@/systems/OfflineGains";

export function useOfflineGains(onComplete?: () => void) {
  const [gains, setGains] = useState<OfflineResult | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/combat/offline-gains", { method: "POST" });
        const data = await res.json();
        if (data.success && data.data && data.data.kills > 0) {
          setGains(data.data);
        }
      } catch (err) {
        console.error("Offline gains check error:", err);
      } finally {
        setChecked(true);
      }
    }
    check();
  }, []);

  function dismiss() {
    setGains(null);
    onComplete?.();
  }

  return { gains, checked, dismiss };
}