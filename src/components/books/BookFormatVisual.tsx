import React from 'react';
import { Book } from '../../types';
import { Wifi, Battery, Headphones, Disc, Volume2, BookOpen } from 'lucide-react';

interface BookFormatVisualProps {
  book: Book;
  size?: 'sm' | 'md';
  className?: string;
}

// Deterministic spine palettes for physical books
const SPINE_PALETTES = [
  { gradient: 'from-[#450a11] via-[#6b1622] to-[#33050b]', border: '#7a1b28', ribbon: '#ef4444' },
  { gradient: 'from-[#0d331d] via-[#17522f] to-[#082413]', border: '#1f6e3f', ribbon: '#10b981' },
  { gradient: 'from-[#0f1f3d] via-[#1b3668] to-[#0a152b]', border: '#284c8f', ribbon: '#3b82f6' },
  { gradient: 'from-[#3e2311] via-[#5c351b] to-[#2b170a]', border: '#784624', ribbon: '#f59e0b' },
  { gradient: 'from-[#300f36] via-[#4f1a58] to-[#200924]', border: '#6f267c', ribbon: '#a855f7' },
  { gradient: 'from-[#222527] via-[#333b3d] to-[#171a1b]', border: '#455052', ribbon: '#94a3b8' },
];

export const BookFormatVisual: React.FC<BookFormatVisualProps> = ({
  book,
  size = 'sm',
  className = '',
}) => {
  const format = book.format || 'physical';

  // Deterministic palette for physical book
  const hash = (book.id + (book.title || '')).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const palette = SPINE_PALETTES[Math.abs(hash) % SPINE_PALETTES.length];

  // Progress percentage
  const progressPct =
    format === 'audiobook'
      ? Math.min(100, Math.round(((book.currentAudioMinutes || 0) / (book.audioDurationMinutes || 360)) * 100))
      : Math.min(100, Math.round((book.currentPage / (book.totalPages || 100)) * 100));

  // =========================================================================
  // 1. PHYSICAL BOOK: Realistic hardcover tome with 3D leather spine & bookmark ribbon
  // =========================================================================
  if (format === 'physical') {
    return (
      <div
        className={`relative shrink-0 select-none cursor-pointer group-hover:scale-105 transition-transform duration-200 ${
          size === 'sm' ? 'w-[72px] h-[98px]' : 'w-[82px] h-[112px]'
        } ${className}`}
      >
        {/* Book Body / Hardcover Leather Block */}
        <div
          style={{ borderColor: palette.border }}
          className={`w-full h-full rounded-r-md rounded-l-[3px] p-1.5 flex flex-col justify-between shadow-[2px_5px_12px_rgba(0,0,0,0.85)] border-y border-r bg-gradient-to-r ${palette.gradient} relative overflow-hidden`}
        >
          {/* Spine crease and 3D lighting reflection */}
          <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/60 via-transparent to-black/30 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-l from-black/50 to-transparent pointer-events-none" />

          {/* Top Gold Gilt Band */}
          <div className="w-full flex flex-col items-center gap-0.5 relative z-10">
            <div className="w-full h-[1.5px] bg-gradient-to-r from-amber-600/70 via-amber-300 to-amber-600/70 rounded shadow-sm" />
            <div className="w-4 h-[1px] bg-amber-400/80" />
          </div>

          {/* Center Book Title & Embossed Emblem */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-0.5 overflow-hidden my-0.5">
            <BookOpen className="w-3 h-3 text-amber-300/80 mb-0.5 shrink-0" />
            <span className="font-serif font-black text-amber-100 text-[10px] leading-tight line-clamp-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              {book.title}
            </span>
            <span className="font-serif italic text-amber-300/70 text-[8px] truncate max-w-full mt-0.5">
              {book.author}
            </span>
          </div>

          {/* Bottom Gold Gilt Band */}
          <div className="w-full flex flex-col items-center gap-0.5 relative z-10">
            <div className="w-4 h-[1px] bg-amber-400/80" />
            <div className="w-full h-[1.5px] bg-gradient-to-r from-amber-600/70 via-amber-300 to-amber-600/70 rounded shadow-sm" />
          </div>

          {/* Silk Bookmark Ribbon dangling from the bottom */}
          <div
            style={{ backgroundColor: palette.ribbon }}
            className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-2.5 h-3 shadow-md pointer-events-none z-20"
          >
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0b0503] [clip-path:polygon(0_100%,50%_0,100%_100%)]" />
          </div>
        </div>

        {/* Realistic Book Pages Rim (Right edge) */}
        <div className="absolute top-1 bottom-1 -right-1 w-1 rounded-r-xs bg-gradient-to-r from-[#dfd6c5] to-[#f2ebdc] shadow-[1px_1px_2px_rgba(0,0,0,0.5)] border-y border-r border-[#beb5a2] pointer-events-none" />
      </div>
    );
  }

  // =========================================================================
  // 2. E-BOOK: Miniature Dark Green Kindle Paperwhite with E-Ink Screen
  // =========================================================================
  if (format === 'ebook') {
    return (
      <div
        className={`relative shrink-0 select-none cursor-pointer group-hover:scale-105 transition-transform duration-200 ${
          size === 'sm' ? 'w-[72px] h-[98px]' : 'w-[82px] h-[112px]'
        } ${className}`}
      >
        {/* Dark Green Kindle Outer Chassis */}
        <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-[#082213] via-[#0d331c] to-[#05180d] p-1.5 shadow-[0_6px_16px_rgba(0,0,0,0.85)] border-2 border-[#154627] flex flex-col justify-between">
          {/* E-Ink Matte Paper Screen */}
          <div className="flex-1 rounded-[8px] bg-[#f4efe4] border border-[#d6cfbe] p-1 flex flex-col justify-between overflow-hidden shadow-inner text-[#1b1916]">
            {/* Kindle Mini Status Bar */}
            <div className="flex items-center justify-between text-[7px] font-mono text-[#57534c] pb-0.5 border-b border-[#ded7c8]">
              <span className="font-bold tracking-tight">KINDLE</span>
              <div className="flex items-center gap-0.5">
                <Wifi className="w-2 h-2 text-[#57534c]" />
                <span>{progressPct}%</span>
              </div>
            </div>

            {/* E-Ink Screen Content: Title & Author */}
            <div className="flex-1 flex flex-col items-center justify-center text-center px-0.5 my-1 overflow-hidden">
              <span className="font-serif font-black text-[#14120f] text-[10px] leading-tight line-clamp-3">
                {book.title}
              </span>
              <span className="font-serif italic text-[#5c5445] text-[7.5px] truncate max-w-full mt-1">
                {book.author}
              </span>
            </div>
          </div>

          {/* Bottom Kindle Bezel Logo */}
          <div className="pt-0.5 text-center">
            <span className="font-serif italic font-bold tracking-widest text-[#2f6643] text-[7px]">
              kindle
            </span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. AUDIOBOOK: Miniature Dark Green Phone Screen with Headphones around it
  // =========================================================================
  return (
    <div
      className={`relative shrink-0 select-none cursor-pointer group-hover:scale-105 transition-transform duration-200 ${
        size === 'sm' ? 'w-[74px] h-[98px]' : 'w-[84px] h-[112px]'
      } ${className}`}
    >
      {/* Over-Ear Headphones Draped Around the Phone */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[86%] pointer-events-none z-30">
        <svg viewBox="0 0 100 28" className="w-full drop-shadow-md" fill="none">
          {/* Metallic Headband Arch */}
          <path
            d="M 10 26 C 20 6, 80 6, 90 26"
            stroke="#1b4d2e"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Gold Trim Line */}
          <path
            d="M 22 20 C 32 10, 68 10, 78 20"
            stroke="#d4af37"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>

        {/* Left Ear Cup */}
        <div className="absolute -left-2.5 top-3 w-3 h-5 rounded-md bg-[#081f12] border border-[#d4af37] shadow-md flex items-center justify-center">
          <div className="w-1.5 h-3 rounded-sm bg-[#163b24]" />
        </div>

        {/* Right Ear Cup */}
        <div className="absolute -right-2.5 top-3 w-3 h-5 rounded-md bg-[#081f12] border border-[#d4af37] shadow-md flex items-center justify-center">
          <div className="w-1.5 h-3 rounded-sm bg-[#163b24]" />
        </div>
      </div>

      {/* Dark Green Phone Chassis */}
      <div className="w-full h-full rounded-[16px] bg-gradient-to-b from-[#072415] via-[#0b331f] to-[#04150b] p-1.5 shadow-[0_6px_16px_rgba(0,0,0,0.85)] border-2 border-[#123e23] flex flex-col justify-between relative overflow-hidden">
        {/* Dynamic Island Speaker Pill at top */}
        <div className="flex justify-center pb-0.5 relative z-20">
          <div className="w-6 h-1 rounded-full bg-black/90 border border-emerald-500/30" />
        </div>

        {/* Phone Screen Display */}
        <div className="flex-1 rounded-[10px] bg-gradient-to-b from-[#05190e] via-[#092b1a] to-[#020e06] border border-[#144226] p-1 flex flex-col justify-between overflow-hidden shadow-inner relative">
          {/* Top Phone Audio Status */}
          <div className="flex items-center justify-between text-[6.5px] font-mono text-emerald-300/80 pb-0.5 border-b border-emerald-950">
            <span className="font-bold flex items-center gap-0.5">
              <Headphones className="w-2 h-2 text-emerald-400" /> Audio
            </span>
            <span>{progressPct}%</span>
          </div>

          {/* Artwork & Prominent Title */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-0.5 my-1 overflow-hidden">
            <Volume2 className="w-3 h-3 text-emerald-400 mb-0.5 shrink-0" />
            <span className="font-serif font-black text-white text-[9.5px] leading-tight line-clamp-3">
              {book.title}
            </span>
            <span className="font-serif italic text-emerald-200/70 text-[7.5px] truncate max-w-full mt-1">
              {book.author}
            </span>
          </div>
        </div>

        {/* Phone Bottom Home Indicator */}
        <div className="pt-0.5 flex justify-center">
          <div className="w-6 h-0.5 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  );
};
