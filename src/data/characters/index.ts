import { ClassDefinition } from "@/types";

export const CHARACTER_CLASSES: ClassDefinition[] = [
  {
    id: "medjay",
    name: "Medjay",
    description: "Prajurit elite pengawal Firaun",
    lore: "Para Medjay adalah penjaga terpilih yang mengabdikan hidup mereka untuk melindungi tanah Mesir. Kekuatan Ra mengalir dalam setiap pukulan mereka.",
    alignment: "egypt",
    primaryStat: "STR",
    passive: "Blessing of Ra",
    passiveDescription: "Setiap kill memiliki 15% chance untuk mendapat buff damage Ra selama 30 detik.",
    baseStats: { hp: 140, mp: 40, str: 16, agi: 10, int_stat: 6, vit: 14 },
  },
  {
    id: "siptu",
    name: "Siptu",
    description: "Pemanah dan pemburu dari padang Sumeria",
    lore: "Lahir di bawah berkah Ishtar, para Siptu adalah pemburu tanpa tandingan. Setiap anak panah mereka membawa kutukan dewi cinta dan perang.",
    alignment: "mesopotamia",
    primaryStat: "AGI",
    passive: "Ishtar's Mark",
    passiveDescription: "Setiap critical hit memberikan stack Ishtar's Mark. Tiap stack meningkatkan damage 3%, maksimal 10 stack.",
    baseStats: { hp: 110, mp: 50, str: 8, agi: 18, int_stat: 10, vit: 10 },
  },
  {
    id: "kher-heb",
    name: "Kher-Heb",
    description: "Pendeta dan ahli mantra hieroglif",
    lore: "Kher-Heb adalah penjaga ilmu Thoth yang tersembunyi. Mereka membaca mantra dari gulungan papirus kuno dan memanggil kekuatan langit.",
    alignment: "egypt",
    primaryStat: "INT",
    passive: "Thoth's Wisdom",
    passiveDescription: "Setiap spell cast memiliki 20% chance untuk proc Thoth's Wisdom, meregenerasi 15% MP secara instan.",
    baseStats: { hp: 90, mp: 100, str: 6, agi: 8, int_stat: 20, vit: 8 },
  },
  {
    id: "ashipu",
    name: "Ashipu",
    description: "Exorcist dan dukun ritual Babilonia",
    lore: "Ashipu berjalan di batas antara dunia hidup dan mati. Mereka memanggil jiwa-jiwa tersesat sebagai senjata, menggunakan sihir gelap Babilonia.",
    alignment: "mesopotamia",
    primaryStat: "INT",
    passive: "Soul Harvest",
    passiveDescription: "Setiap debuff aktif pada musuh menghasilkan Soul Shard. Soul Shard meningkatkan damage magic 5% per shard.",
    baseStats: { hp: 100, mp: 90, str: 12, agi: 8, int_stat: 16, vit: 10 },
  },
  {
    id: "seba",
    name: "Seba",
    description: "Pengembara netral pencari keseimbangan",
    lore: "Seba tidak berpihak pada Mesir maupun Mesopotamia. Mereka percaya bahwa kekuatan sejati datang dari keseimbangan antara dua kekuatan kosmik.",
    alignment: "neutral",
    primaryStat: "Balanced",
    passive: "Axis Balance",
    passiveDescription: "Mendapat bonus kecil dari kedua alignment. Bisa menggunakan gear dari semua alignment tanpa penalti.",
    baseStats: { hp: 120, mp: 70, str: 12, agi: 12, int_stat: 12, vit: 12 },
  },
];

export const CLASS_ICONS: Record<string, string> = {
  medjay: "⚔️",
  siptu: "🏹",
  "kher-heb": "🔮",
  ashipu: "⚗️",
  seba: "⚖️",
};

export const ALIGNMENT_COLORS: Record<string, string> = {
  egypt: "text-amber-400 border-amber-600 bg-amber-950/30",
  mesopotamia: "text-blue-400 border-blue-600 bg-blue-950/30",
  neutral: "text-emerald-400 border-emerald-600 bg-emerald-950/30",
};

export const ALIGNMENT_LABELS: Record<string, string> = {
  egypt: "Mesir",
  mesopotamia: "Mesopotamia",
  neutral: "Netral",
};
