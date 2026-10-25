import React from 'react';
import {
  Wifi,
  Battery,
  Plus,
  BookOpen,
} from 'lucide-react';
import { Book } from '../../types';

interface GiantKindleLibraryProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onAddBook: () => void;
}

// Deterministic leather tome palettes for Kindle e-books
const EBOOK_TOME_PALETTES = [
  { gradient: 'from-[#0e2f1e] via-[#164a2f] to-[#092114]', border: '#236e45', ribbon: '#34d399' },
  { gradient: 'from-[#381119] via-[#521b27] to-[#26080e]', border: '#7e2b3c', ribbon: '#f87171' },
  { gradient: 'from-[#10233e] via-[#1a3861] to-[#0a172a]', border: '#2b5691', ribbon: '#60a5fa' },
  { gradient: 'from-[#3a2010] via-[#54301a] to-[#261408]', border: '#784627', ribbon: '#fbbf24' },
  { gradient: 'from-[#2b1035] via-[#451c54] to-[#1c0824]', border: '#6c2e82', ribbon: '#c084fc' },
  { gradient: 'from-[#1f2427] via-[#2f383c] to-[#131719]', border: '#4a595e', ribbon: '#94a3b8' },
];

export const GiantKindleLibrary: React.FC<GiantKindleLibraryProps> = ({
  books,
  onSelectBook,
  onAddBook,
}) => {
  // Helper to chunk ebooks onto shelves (up to 4 per shelf on Kindle screen)
  const chunkShelves = (items: Book[], size: number = 4) => {
    const shelves: Book[][] = [];
    for (let i = 0; i < items.length; i += size) {
      shelves.push(items.slice(i, i + size));
    }
    if (shelves.length === 0) shelves.push([]);
    return shelves;
  };

  const shelves = chunkShelves(books, 4);

  return (
    <div className="w-full max-w-5xl mx-auto py-2 px-1 sm:px-4">
      {/* GIANT TRANSLUCENT DARK GREEN KINDLE CHASSIS */}
      <div className="relative rounded-[36px] sm:rounded-[48px] bg-gradient-to-b from-[#072415]/85 via-[#0b331f]/80 to-[#04150b]/85 backdrop-blur-md p-4 sm:p-7 sm:pb-8 shadow-[0_28px_70px_rgba(0,0,0,0.88),inset_0_2px_4px_rgba(255,255,255,0.15),inset_0_-4px_8px_rgba(0,0,0,0.85)] border-4 sm:border-[6px] border-[#103d24]/75 select-none">
        {/* Subtle Kindle Top Sensor dot */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#05140b] shadow-inner" />

        {/* TRANSLUCENT DARK GREEN E-INK DISPLAY SCREEN */}
        <div className="relative rounded-[22px] sm:rounded-[28px] overflow-hidden shadow-[inset_0_4px_16px_rgba(0,0,0,0.85),0_1px_2px_rgba(255,255,255,0.1)] border-2 border-[#144226]/60 bg-gradient-to-b from-[#061d11]/75 via-[#082917]/70 to-[#03130a]/80 backdrop-blur-md text-emerald-100">
          {/* Paper Grain Overlay for authentic E-Ink look */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.05] bg-white"
            style={{
              backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
              backgroundSize: '8px 8px',
            }}
          />

          {/* KINDLE STATUS BAR */}
          <div className="relative px-4 sm:px-6 py-2.5 flex items-center justify-between text-[11px] font-mono border-b border-emerald-500/20 bg-[#072113]/70 backdrop-blur-sm text-emerald-300">
            {/* Left: Device & Wi-Fi */}
            <div className="flex items-center gap-2 font-serif font-bold tracking-wide">
              <span className="text-xs text-white">Kindle Oasis</span>
              <span className="opacity-40">•</span>
              <div className="flex items-center gap-1 font-mono text-[10px] font-normal text-emerald-300">
                <Wifi className="w-2.5 h-2.5 text-emerald-400" />
                <span>Wi-Fi</span>
              </div>
            </div>

            {/* Center: Device Library Title */}
            <div className="hidden sm:flex items-center gap-2">
              <BookOpen className="w-3 h-3 text-emerald-400 opacity-80" />
              <span className="font-serif font-bold tracking-wider text-xs uppercase text-emerald-200">
                Sarah's E-Book Folio
              </span>
              <span className="text-[10px] text-emerald-300/70">({books.length} tomes)</span>
            </div>

            {/* Right: Controls & Battery */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onAddBook}
                className="px-2.5 py-0.5 rounded-lg bg-emerald-700/90 hover:bg-emerald-600 text-white font-sans text-[10px] font-semibold flex items-center gap-1 cursor-pointer shadow-sm transition-colors border border-emerald-500/40"
              >
                <Plus className="w-2.5 h-2.5" />
                <span>+ Add Tome</span>
              </button>

              <div className="flex items-center gap-1 font-mono text-[10px] text-emerald-300">
                <span>98%</span>
                <Battery className="w-3 h-3 fill-current text-emerald-400 opacity-90" />
              </div>
            </div>
          </div>

          {/* KINDLE SCREEN HEADER BANNER */}
          <div className="px-4 sm:px-6 py-3 border-b border-emerald-500/20 bg-[#092b19]/60 backdrop-blur-sm flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl tracking-wide flex items-center gap-2 text-white">
                <span>Digital E-Reader Shelves</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-[#1c3224]/80 text-[#a3c9b0] border-[#284a34]">
                  Glare-Free E-Ink
                </span>
              </h2>
              <p className="text-xs font-serif italic mt-0.5 text-[#8ea896]">
                Tap any digital edition to open reader folio and annotations
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-4 text-xs font-serif">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-sm" />
                <span className="text-emerald-200">Reading</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-sm" />
                <span className="text-amber-200">Next Read</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block shadow-sm" />
                <span className="text-slate-300">Finished</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-sm" />
                <span className="text-rose-300">DNF</span>
              </span>
            </div>
          </div>

          {/* SHELVES ON THE KINDLE SCREEN */}
          <div className="p-4 sm:p-8 space-y-10 sm:space-y-12 min-h-[420px]">
            {shelves.map((shelfBooks, shelfIdx) => (
              <div key={shelfIdx} className="relative">
                {/* Book Editions Sitting Directly on this Shelf */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 items-end pb-0 px-2 sm:px-6">
                  {shelfBooks.map((book) => {
                    const hash = (book.id + (book.title || '')).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                    const palette = EBOOK_TOME_PALETTES[Math.abs(hash) % EBOOK_TOME_PALETTES.length];

                    return (
                      <div
                        key={book.id}
                        onClick={() => onSelectBook(book)}
                        className="group relative cursor-pointer select-none transition-all duration-300 transform hover:-translate-y-3.5 hover:scale-[1.03] z-10 hover:z-30 flex justify-center"
                      >
                        {/* Book Body: Upright Hardcover Sitting on Shelf Plank */}
                        <div
                          style={{ borderColor: palette.border }}
                          className={`relative w-[112px] sm:w-[130px] h-[170px] sm:h-[195px] rounded-r-lg rounded-l-[3px] p-2 flex flex-col justify-between shadow-[2px_8px_20px_rgba(0,0,0,0.85)] border-y border-r bg-gradient-to-r ${palette.gradient} transition-shadow duration-300 group-hover:shadow-[0_20px_35px_rgba(0,0,0,0.95),0_0_20px_rgba(52,211,153,0.35)]`}
                        >
                          {/* 3D Cylindrical Spine Shading on Left */}
                          <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/70 via-transparent to-black/25 pointer-events-none rounded-l-[3px]" />
                          <div className="absolute inset-y-0 left-3 w-[1px] bg-black/40 pointer-events-none" />

                          {/* Top Filigree Band & Status Emblem */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="w-full h-1 bg-gradient-to-r from-amber-600/70 via-amber-300 to-amber-600/70 rounded shadow-sm border-y border-amber-950/70 mb-1" />
                            <div className="flex items-center justify-between w-full px-0.5">
                              <span
                                className={`text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full border ${
                                  book.status === 'reading'
                                    ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400/50'
                                    : book.status === 'want_to_read'
                                    ? 'bg-amber-500/30 text-amber-300 border-amber-400/50'
                                    : book.status === 'dnf'
                                    ? 'bg-rose-500/30 text-rose-300 border-rose-400/50'
                                    : 'bg-slate-700/50 text-slate-300 border-slate-500/40'
                                }`}
                              >
                                {book.status === 'reading'
                                  ? 'Reading'
                                  : book.status === 'want_to_read'
                                  ? 'Next'
                                  : book.status === 'dnf'
                                  ? 'DNF'
                                  : 'Done'}
                              </span>
                              <BookOpen className="w-3 h-3 text-amber-300/80" />
                            </div>
                            <div className="w-full h-1 bg-gradient-to-r from-amber-600/70 via-amber-300 to-amber-600/70 rounded shadow-sm border-y border-amber-950/70 mt-1" />
                          </div>

                          {/* Center Embossed Title & Author or Cover Art */}
                          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-1 my-0.5 overflow-hidden">
                            {book.coverUrl ? (
                              <div className="w-14 h-20 sm:w-16 sm:h-24 rounded overflow-hidden shadow-md border border-amber-400/40 bg-black shrink-0 mb-1">
                                <img
                                  src={book.coverUrl}
                                  alt={book.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  loading="lazy"
                                />
                              </div>
                            ) : null}
                            <h3 className="font-serif font-black text-xs leading-tight line-clamp-2 text-amber-100 group-hover:text-white transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
                              {book.title}
                            </h3>
                            <p className="font-serif italic text-[9.5px] text-amber-300/75 truncate max-w-full mt-0.5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
                              by {book.author}
                            </p>
                          </div>

                          {/* Bottom Filigree Band */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="w-full h-1 bg-gradient-to-r from-amber-600/70 via-amber-300 to-amber-600/70 rounded shadow-sm border-y border-amber-950/70 mb-0.5" />
                            <span className="text-[8px] font-mono text-amber-200/60 uppercase tracking-widest">
                              E-Reader Edition
                            </span>
                            <div className="w-full h-1 bg-gradient-to-r from-amber-600/70 via-amber-300 to-amber-600/70 rounded shadow-sm border-y border-amber-950/70 mt-0.5" />
                          </div>

                          {/* Silk Bookmark Ribbon dangling over the shelf plank */}
                          <div
                            style={{ backgroundColor: palette.ribbon }}
                            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3.5 h-4 shadow-md pointer-events-none z-20 transition-transform group-hover:translate-y-1"
                          >
                            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black [clip-path:polygon(0_100%,50%_0,100%_100%)]" />
                          </div>
                        </div>

                        {/* Realistic Book Pages Rim (Right edge) */}
                        <div className="absolute top-1 bottom-1 -right-1 w-1.5 rounded-r-xs bg-gradient-to-r from-[#dfd6c5] to-[#f4eee1] shadow-[1px_2px_4px_rgba(0,0,0,0.6)] border-y border-r border-[#c2b79e] pointer-events-none flex flex-col justify-around py-2">
                          <div className="w-full h-[0.5px] bg-[#beb196]/60" />
                          <div className="w-full h-[0.5px] bg-[#beb196]/60" />
                          <div className="w-full h-[0.5px] bg-[#beb196]/60" />
                        </div>
                      </div>
                    );
                  })}

                  {/* Add E-Book Tome Button on Last Shelf */}
                  {shelfIdx === shelves.length - 1 && (
                    <div className="flex justify-center pb-0">
                      <button
                        type="button"
                        onClick={onAddBook}
                        className="w-[112px] sm:w-[130px] h-[170px] sm:h-[195px] rounded-r-lg rounded-l-[3px] border-2 border-dashed border-[#284834] hover:border-emerald-400 bg-[#0d2215]/50 hover:bg-[#122e1d]/70 text-[#8ea896] flex flex-col items-center justify-center gap-2 p-3 text-center cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02]"
                      >
                        <div className="w-7 h-7 rounded-full bg-emerald-700/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                          <Plus className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-serif font-bold text-xs uppercase tracking-wider text-emerald-200">
                          + Add Tome
                        </span>
                        <span className="text-[9px] font-serif italic opacity-75 text-emerald-300/70">
                          Download to Kindle
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* THE KINDLE SHELF PLANK BASE */}
                <div className="relative mt-2 z-10">
                  {/* Top shelf dark green wood lip */}
                  <div className="h-2 rounded-t-sm shadow-sm bg-gradient-to-r from-[#173021] via-[#244933] to-[#173021] border-t border-[#316144]" />
                  {/* Shelf front face */}
                  <div className="h-4.5 sm:h-5 rounded-b-md px-4 flex items-center justify-between shadow-md bg-gradient-to-b from-[#112419] to-[#0a1710] text-[#7fa38a]">
                    <span className="text-[9px] font-serif font-bold tracking-widest uppercase opacity-85">
                      Shelf Tier {shelfIdx + 1}
                    </span>
                    <span className="text-[9px] font-mono opacity-65">Kindle Storage • E-Ink Glare Free</span>
                  </div>
                  {/* Shelf drop shadow */}
                  <div className="h-4 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />
                </div>
              </div>
            ))}

            {books.length === 0 && (
              <div className="p-10 text-center rounded-2xl border-2 border-dashed border-[#234832]/60 bg-[#071d11]/50 backdrop-blur-sm text-emerald-200/80 space-y-3">
                <BookOpen className="w-7 h-7 mx-auto text-emerald-600 opacity-60" />
                <h4 className="font-serif font-bold text-base">Your Kindle Shelves are Empty</h4>
                <p className="text-xs font-serif italic max-w-sm mx-auto">
                  Add digital epubs to organize and read them on your giant Kindle Paperwhite display.
                </p>
                <button
                  type="button"
                  onClick={onAddBook}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-sans text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                >
                  <Plus className="w-3 h-3" />
                  <span>Download First E-Book</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM KINDLE BEZEL WITH EMBOSSED LOGO */}
        <div className="pt-4 sm:pt-6 flex flex-col items-center justify-center">
          <span className="font-serif italic font-black tracking-[0.25em] text-emerald-400/40 text-base sm:text-lg select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            kindle
          </span>
          <span className="text-[9px] font-sans uppercase tracking-widest text-emerald-300/30 mt-0.5">
            Paperwhite Signature Edition • Dark Forest Chassis
          </span>
        </div>
      </div>
    </div>
  );
};
