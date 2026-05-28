"use client";

import { useEffect, useState } from "react";
import CharacterSelect from "@/components/game/CharacterSelect";
import Dashboard from "@/components/game/Dashboard";
import OfflineGainsModal from "@/components/game/OfflineGainsModal";
import LoginStreakModal from "@/components/game/LoginStreakModal";
import { useOfflineGains } from "@/hooks/useOfflineGains";

export default function DashboardPage() {
  const [character, setCharacter]       = useState<any>(null);
  const [loading, setLoading]           = useState(true);
  const [showStreak, setShowStreak]     = useState(false);
  const [streakChecked, setStreakChecked] = useState(false);

  async function fetchCharacter() {
    const res  = await fetch("/api/character");
    const data = await res.json();
    if (data.success) setCharacter(data.data);
    setLoading(false);
  }

  const { gains, checked, dismiss } = useOfflineGains(fetchCharacter);

  useEffect(() => {
    fetchCharacter();
  }, []);

  // Show streak modal after character loaded
  useEffect(() => {
    if (!loading && character && !streakChecked) {
      setStreakChecked(true);
      // Show streak after a short delay
      setTimeout(() => setShowStreak(true), 800);
    }
  }, [loading, character, streakChecked]);

  if (loading || !checked) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", fontFamily: "Georgia, serif" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚱</div>
          <p style={{ color: "#6b6b80", fontSize: "13px" }}>Memuat dunia...</p>
        </div>
      </div>
    );
  }

  if (!character) {
    return <CharacterSelect onCreated={fetchCharacter} />;
  }

  return (
    <>
      {gains && <OfflineGainsModal gains={gains} onClose={dismiss} />}
      {showStreak && !gains && (
        <LoginStreakModal onClose={() => setShowStreak(false)} />
      )}
      <Dashboard character={character} onRefresh={fetchCharacter} />
    </>
  );
}