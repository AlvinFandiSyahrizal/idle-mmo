"use client";

import { useEffect, useState } from "react";
import CharacterSelect from "@/components/game/CharacterSelect";
import Dashboard from "@/components/game/Dashboard";
import OfflineGainsModal from "@/components/game/OfflineGainsModal";
import { useOfflineGains } from "@/hooks/useOfflineGains";

export default function DashboardPage() {
  const [character, setCharacter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function fetchCharacter() {
    const res = await fetch("/api/character");
    const data = await res.json();
    if (data.success) setCharacter(data.data);
    setLoading(false);
  }

  const { gains, checked, dismiss } = useOfflineGains(fetchCharacter);

  useEffect(() => {
    fetchCharacter();
  }, []);

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
      <Dashboard character={character} onRefresh={fetchCharacter} />
    </>
  );
}