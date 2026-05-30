import { useEffect, useRef } from "react";
import { useNotificationStore } from "@/stores/notificationStore";

export function useAchievementCheck(intervalMs = 30000) {
  const addNotification = useNotificationStore((s) => s.addNotification);
  const lastGrantedRef  = useRef<Set<string>>(new Set());

  useEffect(() => {
    async function check() {
      try {
        const res  = await fetch("/api/achievements");
        const data = await res.json();
        if (!data.success) return;

        const newGrants = data.data.newlyGranted ?? [];
        for (const achievement of newGrants) {
          if (lastGrantedRef.current.has(achievement.id)) continue;
          lastGrantedRef.current.add(achievement.id);

          const parts = [];
          if (achievement.reward.gold)            parts.push(`+${achievement.reward.gold} Gold`);
          if (achievement.reward.soulShard)        parts.push(`+${achievement.reward.soulShard} Shard`);
          if (achievement.reward.attributePoints)  parts.push(`+${achievement.reward.attributePoints} Attr Pts`);

          addNotification({
            type: "quest",
            title: `🏆 Achievement: ${achievement.title}`,
            message: parts.length > 0 ? parts.join(", ") : "Achievement unlocked!",
            icon: achievement.icon,
          });
        }
      } catch { /* silent */ }
    }

    check();
    const iv = setInterval(check, intervalMs);
    return () => clearInterval(iv);
  }, []);
}