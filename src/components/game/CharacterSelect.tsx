"use client";

import { useState } from "react";
import {
  CHARACTER_CLASSES,
  CLASS_ICONS,
  ALIGNMENT_LABELS,
} from "@/data/characters";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { ClassDefinition } from "@/types";

interface Props {
  onCreated: () => void;
}

const STATS = [
  {
    label: "HP",
    key: "hp",
    max: 140,
    color: "#ef4444",
  },
  {
    label: "MP",
    key: "mp",
    max: 120,
    color: "#3b82f6",
  },
  {
    label: "STR",
    key: "str",
    max: 20,
    color: "#f97316",
  },
  {
    label: "AGI",
    key: "agi",
    max: 20,
    color: "#22c55e",
  },
  {
    label: "INT",
    key: "int_stat",
    max: 20,
    color: "#a855f7",
  },
  {
    label: "VIT",
    key: "vit",
    max: 20,
    color: "#eab308",
  },
];

export default function CharacterSelect({
  onCreated,
}: Props) {
  const [index, setIndex] = useState(0);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selected: ClassDefinition =
    CHARACTER_CLASSES[index];

  const prevCharacter =
    CHARACTER_CLASSES[
      index === 0
        ? CHARACTER_CLASSES.length - 1
        : index - 1
    ];

  const nextCharacter =
    CHARACTER_CLASSES[
      (index + 1) % CHARACTER_CLASSES.length
    ];

  function next() {
    setIndex((prev) =>
      (prev + 1) % CHARACTER_CLASSES.length
    );
  }

  function prev() {
    setIndex((prev) =>
      prev === 0
        ? CHARACTER_CLASSES.length - 1
        : prev - 1
    );
  }

  function getTheme() {
    switch (selected.alignment) {
      case "egypt":
        return {
          glow:
            "0 0 80px rgba(251,191,36,0.35)",
          border:
            "rgba(251,191,36,0.35)",
          title:
            "rgb(253 224 71)",
          badgeBg:
            "rgba(251,191,36,0.12)",
          badgeBorder:
            "rgba(251,191,36,0.3)",
          button:
            "#f59e0b",
          aura:
            "rgba(251,191,36,0.18)",
          iconGlow:
            "rgba(251,191,36,0.4)",
        };

      case "mesopotamia":
        return {
          glow:
            "0 0 80px rgba(59,130,246,0.35)",
          border:
            "rgba(59,130,246,0.35)",
          title:
            "rgb(147 197 253)",
          badgeBg:
            "rgba(59,130,246,0.12)",
          badgeBorder:
            "rgba(59,130,246,0.3)",
          button:
            "#3b82f6",
          aura:
            "rgba(59,130,246,0.18)",
          iconGlow:
            "rgba(59,130,246,0.4)",
        };

      default:
        return {
          glow:
            "0 0 80px rgba(16,185,129,0.35)",
          border:
            "rgba(16,185,129,0.35)",
          title:
            "rgb(110 231 183)",
          badgeBg:
            "rgba(16,185,129,0.12)",
          badgeBorder:
            "rgba(16,185,129,0.3)",
          button:
            "#10b981",
          aura:
            "rgba(16,185,129,0.18)",
          iconGlow:
            "rgba(16,185,129,0.4)",
        };
    }
  }

  const theme = getTheme();

  async function handleCreate() {
    if (!name.trim() || name.trim().length < 3) {
      setError("Nama minimal 3 karakter");
      return;
    }

    setError("");
    setLoading(true);

    const res = await fetch(
      "/api/character/create",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          characterName: name.trim(),
          classId: selected.id,
        }),
      }
    );

    const data = await res.json();

    setLoading(false);

    if (!data.success) {
      setError(data.error);
      return;
    }

    onCreated();
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at top,
            ${theme.aura},
            transparent 35%),

            radial-gradient(circle at bottom,
            rgba(59,130,246,0.12),
            transparent 35%)
          `,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Decorative Blur */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full blur-3xl"
        style={{
          backgroundColor:
            theme.iconGlow,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-stone-500 tracking-[0.4em] text-xs uppercase mb-3">
            Egyptian × Mesopotamian RPG
          </p>

          <h1
            className="text-5xl md:text-6xl font-black tracking-[0.15em]"
            style={{
              color: "#fbbf24",
              textShadow:
                "0 0 25px rgba(251,191,36,0.45)",
            }}
          >
            ⚱ SANDS OF ETERNITY
          </h1>

          <p className="mt-4 text-stone-400 text-sm">
            Choose your destiny
          </p>
        </div>

        {/* Main */}
        <div className="flex items-center justify-center gap-6">

          {/* Left */}
          <button
            onClick={prev}
            className="
              w-14 h-14 rounded-full
              border border-stone-600
              bg-stone-900/80
              backdrop-blur
              hover:bg-stone-800
              transition
              flex items-center justify-center
            "
          >
            <ChevronLeft />
          </button>

          {/* Card */}
          <div
            className="
              relative overflow-hidden
              rounded-[32px]
              border
              backdrop-blur-xl
              bg-stone-900/75
              w-full
              max-w-md
              transition-all
              duration-500
            "
            style={{
              borderColor:
                theme.border,
              boxShadow:
                theme.glow,
            }}
          >

            {/* Aura */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  linear-gradient(
                    to bottom,
                    ${theme.aura},
                    transparent
                  )
                `,
              }}
            />

            {/* Top Shine */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="relative p-7">

              {/* Alignment */}
              <div className="flex justify-center mb-6">
                <div
                  className="
                    px-4 py-1 rounded-full
                    text-xs font-bold
                    tracking-wider
                    border
                  "
                  style={{
                    backgroundColor:
                      theme.badgeBg,
                    borderColor:
                      theme.badgeBorder,
                    color:
                      theme.title,
                  }}
                >
                  {
                    ALIGNMENT_LABELS[
                      selected.alignment
                    ]
                  }
                </div>
              </div>

              {/* Character */}
              <div className="flex items-center justify-center gap-5">

                {/* Prev */}
                <div className="text-5xl opacity-20">
                  {
                    CLASS_ICONS[
                      prevCharacter.id
                    ]
                  }
                </div>

                {/* Main Character */}
                <div className="relative">

                  {/* Glow */}
                  <div
                    className="
                      absolute inset-0
                      scale-150
                      blur-3xl
                      rounded-full
                    "
                    style={{
                      backgroundColor:
                        theme.iconGlow,
                    }}
                  />

                  {/* Circle */}
                  <div
                    className="
                      relative
                      w-72 h-72
                      rounded-full
                      border
                      bg-black/50
                      flex items-center justify-center
                      shadow-inner
                    "
                    style={{
                      borderColor:
                        theme.border,
                    }}
                  >
                    <div className="text-[220px] leading-none drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">
                      {
                        CLASS_ICONS[
                          selected.id
                        ]
                      }
                    </div>
                  </div>
                </div>

                {/* Next */}
                <div className="text-5xl opacity-20">
                  {
                    CLASS_ICONS[
                      nextCharacter.id
                    ]
                  }
                </div>
              </div>

              {/* Name */}
              <div className="mt-8 text-center">

                <h2
                  className="text-4xl font-black tracking-wide"
                  style={{
                    color:
                      theme.title,
                  }}
                >
                  {selected.name}
                </h2>

                <p className="mt-2 text-sm text-stone-400 leading-relaxed">
                  {
                    selected.description
                  }
                </p>
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                {STATS.map((stat) => {
                  const value =
                    selected.baseStats[
                      stat.key as keyof typeof selected.baseStats
                    ] as number;

                  const percent =
                    (value / stat.max) * 100;

                  return (
                    <div
                      key={stat.label}
                      className="
                        bg-stone-900/90
                        border border-stone-700
                        rounded-xl
                        p-3
                      "
                    >
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-stone-400">
                          {stat.label}
                        </span>

                        <span className="text-white font-bold">
                          {value}
                        </span>
                      </div>

                      <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                        <div
                          className="
                            h-full rounded-full
                            transition-all duration-500
                          "
                          style={{
                            width: `${percent}%`,
                            backgroundColor:
                              stat.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Passive */}
              <div
                className="
                  mt-6 rounded-2xl
                  border p-4
                "
                style={{
                  borderColor:
                    theme.border,
                  backgroundColor:
                    "rgba(255,255,255,0.03)",
                }}
              >
                <p
                  className="font-bold text-sm mb-1"
                  style={{
                    color:
                      theme.title,
                  }}
                >
                  ✦ {selected.passive}
                </p>

                <p className="text-stone-400 text-sm leading-relaxed">
                  {
                    selected.passiveDescription
                  }
                </p>
              </div>

              {/* Lore */}
              <p className="mt-6 text-center italic text-stone-500 text-sm leading-relaxed">
                "{selected.lore}"
              </p>

              {/* Input */}
              <div className="mt-8">

                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">
                  Character Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    handleCreate()
                  }
                  maxLength={20}
                  placeholder="Enter your character name..."
                  className="
                    w-full h-12 rounded-xl
                    bg-black/40
                    border border-stone-600
                    px-4
                    text-sm
                    text-white
                    placeholder:text-stone-600
                    outline-none
                    focus:border-amber-500
                    transition-colors
                  "
                />

                {error && (
                  <p className="mt-3 text-sm text-red-400">
                    {error}
                  </p>
                )}

                {/* Button */}
                <button
                  onClick={handleCreate}
                  disabled={loading}
                  className="
                    mt-5 w-full h-12 rounded-xl
                    font-black tracking-wide
                    transition-all duration-300
                    disabled:opacity-50
                    text-black
                  "
                  style={{
                    backgroundColor:
                      theme.button,
                    boxShadow:
                      "0 0 25px rgba(255,255,255,0.15)",
                  }}
                >
                  {loading
                    ? "Creating Character..."
                    : "Begin Journey"}
                </button>
              </div>
            </div>
          </div>

          {/* Right */}
          <button
            onClick={next}
            className="
              w-14 h-14 rounded-full
              border border-stone-600
              bg-stone-900/80
              backdrop-blur
              hover:bg-stone-800
              transition
              flex items-center justify-center
            "
          >
            <ChevronRight />
          </button>
        </div>

        {/* Bottom Selector */}
        <div className="flex justify-center gap-3 mt-8 flex-wrap">
          {CHARACTER_CLASSES.map(
            (cls, i) => (
              <button
                key={cls.id}
                onClick={() =>
                  setIndex(i)
                }
                className="
                  transition-all duration-300
                  rounded-2xl border
                  flex items-center justify-center
                "
                style={{
                  width:
                    i === index
                      ? 68
                      : 52,

                  height:
                    i === index
                      ? 68
                      : 52,

                  fontSize:
                    i === index
                      ? 34
                      : 22,

                  opacity:
                    i === index
                      ? 1
                      : 0.6,

                  borderColor:
                    i === index
                      ? theme.border
                      : "#444",

                  backgroundColor:
                    i === index
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(255,255,255,0.03)",

                  boxShadow:
                    i === index
                      ? theme.glow
                      : "none",

                  transform:
                    i === index
                      ? "scale(1.08)"
                      : "scale(1)",
                }}
              >
                {
                  CLASS_ICONS[
                    cls.id
                  ]
                }
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}