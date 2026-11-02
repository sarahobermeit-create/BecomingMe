export interface SpinePalette {
  gradient: string;
  border: string;
  rib: string;
  ribbon: string;
  name: string;
}

export const SPINE_PALETTES: SpinePalette[] = [
  {
    gradient: "from-[#450a11] via-[#6b1622] to-[#33050b]",
    border: "#7a1b28",
    rib: "#e6b325",
    ribbon: "#ef4444",
    name: "Crimson Leather",
  },
  {
    gradient: "from-[#0d331d] via-[#17522f] to-[#082413]",
    border: "#1f6e3f",
    rib: "#d4af37",
    ribbon: "#10b981",
    name: "Hunter Green",
  },
  {
    gradient: "from-[#0f1f3d] via-[#1b3668] to-[#0a152b]",
    border: "#284c8f",
    rib: "#dfb73c",
    ribbon: "#3b82f6",
    name: "Midnight Navy",
  },
  {
    gradient: "from-[#3e2311] via-[#5c351b] to-[#2b170a]",
    border: "#784624",
    rib: "#f0c75e",
    ribbon: "#f59e0b",
    name: "Saddle Tan",
  },
  {
    gradient: "from-[#300f36] via-[#4f1a58] to-[#200924]",
    border: "#6f267c",
    rib: "#deb643",
    ribbon: "#a855f7",
    name: "Imperial Plum",
  },
  {
    gradient: "from-[#222527] via-[#333b3d] to-[#171a1b]",
    border: "#455052",
    rib: "#cfc5a7",
    ribbon: "#64748b",
    name: "Charcoal Slate",
  },
];

export const EBOOK_TOME_PALETTES: SpinePalette[] = [
  { gradient: "from-[#0e2f1e] via-[#164a2f] to-[#092114]", border: "#236e45", rib: "#34d399", ribbon: "#34d399", name: "Forest Kindle" },
  { gradient: "from-[#381119] via-[#521b27] to-[#26080e]", border: "#7e2b3c", rib: "#f87171", ribbon: "#f87171", name: "Crimson Kindle" },
  { gradient: "from-[#10233e] via-[#1a3861] to-[#0a172a]", border: "#2b5691", rib: "#60a5fa", ribbon: "#60a5fa", name: "Navy Kindle" },
  { gradient: "from-[#3a2010] via-[#54301a] to-[#261408]", border: "#784627", rib: "#fbbf24", ribbon: "#fbbf24", name: "Tan Kindle" },
  { gradient: "from-[#2b1035] via-[#451c54] to-[#1c0824]", border: "#6c2e82", rib: "#c084fc", ribbon: "#c084fc", name: "Plum Kindle" },
  { gradient: "from-[#1f2427] via-[#2f383c] to-[#131719]", border: "#4a595e", rib: "#94a3b8", ribbon: "#94a3b8", name: "Slate Kindle" },
];

export const AUDIO_TOME_PALETTES: SpinePalette[] = [
  { gradient: "from-[#0b2b19] via-[#124227] to-[#071c10]", border: "#1e633c", rib: "#6ee7b7", ribbon: "#34d399", name: "Emerald Audio" },
  { gradient: "from-[#1e1338] via-[#2f1f54] to-[#120a24]", border: "#513491", rib: "#c4b5fd", ribbon: "#a78bfa", name: "Violet Audio" },
  { gradient: "from-[#2b160b] via-[#452414] to-[#1a0c06]", border: "#6e3c23", rib: "#fde68a", ribbon: "#f59e0b", name: "Amber Audio" },
  { gradient: "from-[#330f1b] via-[#4d192a] to-[#210811]", border: "#7a2b45", rib: "#fda4af", ribbon: "#f43f5e", name: "Rose Audio" },
  { gradient: "from-[#0b2133] via-[#143652] to-[#071521]", border: "#235987", rib: "#7dd3fc", ribbon: "#38bdf8", name: "Cyan Audio" },
  { gradient: "from-[#1b2124] via-[#2b3338] to-[#101416]", border: "#46535a", rib: "#cbd5e1", ribbon: "#94a3b8", name: "Slate Audio" },
];

export function getPaletteForBook(index: number, palettes: SpinePalette[] = SPINE_PALETTES): SpinePalette {
  return palettes[index % palettes.length] ?? palettes[0]!;
}
