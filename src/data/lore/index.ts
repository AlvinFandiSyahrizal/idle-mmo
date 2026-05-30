export interface LoreFragment {
  id: string;
  zoneId: string;
  title: string;
  content: string;
  source: "boss_kill" | "monster_drop" | "achievement" | "gathering";
  sourceDetail: string;
  order: number;
}

export const LORE_FRAGMENTS: LoreFragment[] = [
  // ── ZONE 1: Delta Nil ──
  {
    id: "lore_z1_01",
    zoneId: "zone1",
    title: "Asal Usul Delta Nil",
    content: "Di awal waktu, ketika Nun — lautan primordial — masih menyelimuti segalanya, Ra muncul dari bunga teratai pertama dan menciptakan cahaya. Delta Nil adalah titik pertama di mana cahaya itu menyentuh bumi, dan dari sana kehidupan pertama mulai tumbuh.",
    source: "monster_drop",
    sourceDetail: "Drop dari Crocodile Hatchling atau Reed Sprite",
    order: 1,
  },
  {
    id: "lore_z1_02",
    zoneId: "zone1",
    title: "Berkah Sobek",
    content: "Sobek, dewa buaya, adalah penjaga Sungai Nil. Ia bukan musuh — ia adalah penjaga. Para petani memberikan persembahan kepadanya agar banjir tahunan datang tepat waktu. Namun ada yang bilang, mereka yang mengambil terlalu banyak dari sungai akan mendapat murka Sobek.",
    source: "boss_kill",
    sourceDetail: "Kalahkan Sobek Manifestation untuk pertama kali",
    order: 2,
  },
  {
    id: "lore_z1_03",
    zoneId: "zone1",
    title: "Vessel Terpilih",
    content: "Legenda berkata bahwa sekali dalam seribu tahun, seorang mortal dipilih oleh kekuatan kosmik sebagai 'Vessel' — wadah yang mampu menampung energi para dewa tanpa hancur. Kamu adalah salah satunya. Tapi siapa yang memilihmu, dan untuk tujuan apa?",
    source: "gathering",
    sourceDetail: "Capai Excavation level 5",
    order: 3,
  },
  {
    id: "lore_z1_04",
    zoneId: "zone1",
    title: "Bisikan Papirus",
    content: "Ditemukan tertulis di gulungan papirus usang: 'Dua kekuatan kosmik saling berhadapan — Ennead dari barat dan Anunnaki dari timur. Di antara keduanya terdapat Axis Mundi, sumbu dunia yang menghubungkan langit, bumi, dan dunia bawah. Siapapun yang menguasainya, menguasai segalanya.'",
    source: "gathering",
    sourceDetail: "Capai Inscription level 3",
    order: 4,
  },
  {
    id: "lore_z1_05",
    zoneId: "zone1",
    title: "Tepi Sungai yang Terlupakan",
    content: "Ada area di tepi Nil yang tidak tercantum di peta manapun. Penduduk lokal menyebutnya 'Tempat di Mana Waktu Berhenti'. Di sana, reruntuhan dari peradaban yang lebih tua dari Mesir dapat ditemukan — sebuah peradaban yang tidak pernah tercatat dalam sejarah manapun.",
    source: "monster_drop",
    sourceDetail: "Drop dari Marsh Lurker (area 1-2)",
    order: 5,
  },

  // ── ZONE 2: Padang Pasir Barat ──
  {
    id: "lore_z2_01",
    zoneId: "zone2",
    title: "Apep dan Kegelapan Abadi",
    content: "Setiap malam, Ra harus melewati Duat — dunia bawah — dengan perahu sucinya. Dan setiap malam, Apep mencoba menghancurkan perahu itu. Sejauh ini Ra selalu menang. Tapi para imam berbisik bahwa suatu hari Apep akan menemukan cara untuk menang — dan hari itu mungkin lebih dekat dari yang kita kira.",
    source: "monster_drop",
    sourceDetail: "Drop dari Sand Scarab atau Desert Wraith",
    order: 1,
  },
  {
    id: "lore_z2_02",
    zoneId: "zone2",
    title: "Oasis Terkutuk",
    content: "Oasis ini dulunya adalah tempat suci — sebuah titik di mana energi kehidupan Nil merembes ke bawah tanah gurun. Tapi sesuatu mengubahnya. Para pengembara yang singgah di sini melaporkan mimpi aneh — mimpi tentang ular raksasa yang menelan matahari. Mimpi itu tidak pernah berhenti.",
    source: "boss_kill",
    sourceDetail: "Masuki area 2-3 Oasis Terkutuk",
    order: 2,
  },
  {
    id: "lore_z2_03",
    zoneId: "zone2",
    title: "Fragment Apep",
    content: "Apep bukan satu entitas — ia adalah kumpulan dari semua kegelapan dan kekacauan yang ada sejak sebelum penciptaan. Ketika serpihan energinya terlepas, ia membentuk makhluk-makhluk kegelapan yang menyebar ke dunia. Setiap serpihan yang kamu hancurkan melemahkan Apep secara keseluruhan.",
    source: "boss_kill",
    sourceDetail: "Kalahkan Apep Fragment untuk pertama kali",
    order: 3,
  },

  // ── ZONE 3: Nekropolis ──
  {
    id: "lore_z3_01",
    zoneId: "zone3",
    title: "Penghakiman Maat",
    content: "Ketika seorang mortal mati, jiwanya dibawa ke Aula Penghakiman. Di sana, jantung mereka ditimbang melawan Bulu Maat — simbol kebenaran. Jika jantung lebih ringan dari bulu itu, jiwa tersebut diizinkan masuk ke Aaru, surga para dewa. Jika lebih berat, Ammit menantinya.",
    source: "monster_drop",
    sourceDetail: "Drop dari Ka Spirit atau Restless Mummy",
    order: 1,
  },
  {
    id: "lore_z3_02",
    zoneId: "zone3",
    title: "Ammit Sang Pemakan Jiwa",
    content: "Ammit bukanlah dewa, bukan juga manusia. Ia adalah manifestasi dari hukuman — gabungan buaya, singa, dan kuda nil. Ia tidak jahat; ia hanyalah melakukan tugasnya. Tapi ada jiwa-jiwa yang berhasil lolos dari penghakiman dan berkeliaran di Nekropolis — jiwa-jiwa itulah yang menjadi ancaman.",
    source: "boss_kill",
    sourceDetail: "Kalahkan Ammit Spawn untuk pertama kali",
    order: 2,
  },
  {
    id: "lore_z3_03",
    zoneId: "zone3",
    title: "Jiwa yang Tersesat",
    content: "Ditemukan tertulis di dinding makam: 'Aku telah mengembara di tempat ini selama apa yang terasa seperti ribuan tahun. Aku tidak ingat siapa namaku, tapi aku ingat rasa sakitnya. Jika kamu membaca ini, tolong temukan jantungku dan bawa ke Aula Penghakiman. Aku ingin beristirahat.'",
    source: "gathering",
    sourceDetail: "Capai Inscription level 15 di area Nekropolis",
    order: 3,
  },

  // ── ZONE 4: Kuil Karnak ──
  {
    id: "lore_z4_01",
    zoneId: "zone4",
    title: "Set dan Pengkhianatan",
    content: "Set membunuh Osiris bukan karena kebencian, tapi karena ketakutan. Ia takut bahwa di bawah pemerintahan Osiris, kekuatannya sendiri akan pudar. Para pengikutnya menyebarkan ajaran bahwa Set adalah pahlawan — pelindung Ra dari Apep. Tapi kebenaran lebih kompleks dari itu.",
    source: "monster_drop",
    sourceDetail: "Drop dari Set Cultist atau Dark Acolyte",
    order: 1,
  },
  {
    id: "lore_z4_02",
    zoneId: "zone4",
    title: "Karnak yang Sejati",
    content: "Kuil Karnak dibangun bukan oleh manusia biasa. Legenda mengatakan bahwa para arsitek pertamanya adalah entitas setengah dewa yang menerima instruksi langsung dari Amun. Setiap batu yang dipasang, setiap hieroglif yang diukir, memiliki makna kosmik yang lebih dalam dari sekadar hiasan.",
    source: "boss_kill",
    sourceDetail: "Kalahkan Set Champion Guard untuk pertama kali",
    order: 2,
  },

  // ── ZONE 5: Lembah Eufrat ──
  {
    id: "lore_z5_01",
    zoneId: "zone5",
    title: "Gilgamesh dan Humbaba",
    content: "Dalam epik terbesar Mesopotamia, Gilgamesh dan Enkidu menghadapi Humbaba, penjaga Hutan Cedar yang sakral. Mereka mengalahkannya, tapi dewa-dewa tidak senang. Tindakan itu memulai serangkaian peristiwa yang berakhir dengan kematian Enkidu. Humbaba yang kamu temui di sini bukan ia yang asli — ia adalah bayangan dari trauma yang tertinggal.",
    source: "monster_drop",
    sourceDetail: "Drop dari Humbaba Servant",
    order: 1,
  },
  {
    id: "lore_z5_02",
    zoneId: "zone5",
    title: "Pertemuan Dua Peradaban",
    content: "Ditemukan di lempengan tanah liat kuno: 'Pedagang dari barat membawa emas dan linen. Pedagang dari timur membawa lapis lazuli dan cedar. Di titik pertemuan mereka, sebuah kota baru tumbuh — kota yang bukan Mesir, bukan Mesopotamia, tapi keduanya sekaligus. Kota itulah yang menjadi Axis Mundi pertama.'",
    source: "boss_kill",
    sourceDetail: "Kalahkan Humbaba Echo untuk pertama kali",
    order: 2,
  },
  {
    id: "lore_z5_03",
    zoneId: "zone5",
    title: "Anunnaki dan Ennead",
    content: "Para dewa Mesopotamia — Anunnaki — dan para dewa Mesir — Ennead — pernah bertemu. Bukan dalam perang, tapi dalam perjanjian. Mereka membagi dunia: barat untuk Ennead, timur untuk Anunnaki, dan Axis Mundi untuk keduanya. Perjanjian itu kini rusak. Tidak ada yang tahu siapa yang melanggarnya pertama.",
    source: "gathering",
    sourceDetail: "Capai Inscription level 25",
    order: 3,
  },
];

export const LORE_MAP = Object.fromEntries(LORE_FRAGMENTS.map((l) => [l.id, l]));

export function getLoreByZone(zoneId: string): LoreFragment[] {
  return LORE_FRAGMENTS.filter((l) => l.zoneId === zoneId);
}