"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import CharacterSelect from "@/components/game/CharacterSelect";
import Dashboard from "@/components/game/Dashboard";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [character, setCharacter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function fetchCharacter() {
    const res = await fetch("/api/character");
    const data = await res.json();
    if (data.success) {
      setCharacter(data.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCharacter();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <div className="text-center">
          <div className="text-4xl mb-4">⚱</div>
          <p className="text-stone-400 animate-pulse">Memuat dunia...</p>
        </div>
      </div>
    );
  }

  if (!character) {
    return <CharacterSelect onCreated={fetchCharacter} />;
  }

  return <Dashboard character={character} onRefresh={fetchCharacter} />;
}