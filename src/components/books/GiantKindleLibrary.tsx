import React, { useState } from 'react';
import {
  Wifi,
  Battery,
  Plus,
  BookOpen,
  CheckCircle,
  Bookmark,
  BookMarked,
  Sparkles,
  Sun,
  Moon,
  Library,
  ChevronRight,
  Clock,
  Layers,
} from 'lucide-react';
import { Book } from '../../types';

interface GiantKindleLibraryProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onAddBook: () => void;
}

export const GiantKindleLibrary: React.FC<GiantKindleLibraryProps> = ({
  books,
  onSelectBook,
  onAddBook,
}) => {
  // Option to switch between warm e-ink paper and dark-mode e-ink
  const [eInkMode, setEInkMode] = useState<'paper' | 'dark'>('paper');

  // Helper to chunk ebooks onto shelves (up to 4 per shelf on large screens)
  const chunkShelves = (items: Book[], size: number = 3) => {
    const shelves: Book[][] = [];
    for (let i = 0; i < items.length; i += size) {
      shelves.push(items.slice(i, i + size));
    }
    if (shelves.length === 0) shelves.push([]);
    return shelves;
  };

  const shelves = chunkShelves(books, 3);

  return (
    <div className="w-full max-w-5xl mx-auto py-2 px-1 sm:px-4">
      {/* GIANT DARK GREEN KINDLE CHASSIS */}
      <div className="relative rounded-[36px] sm:rounded-[48px] bg-gradient-to-b from-[#0a2615] via-[#0e361e] to-[#061a0e] p-4 sm:p-7 sm:pb-8 shadow-[0_28px_70px_rgba(0,0,0,0.92),0_10px_25px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.18),inset_0_-4px_8px_rgba(0,0,0,0.85)] border-4 sm:border-[6px] border-[#144226] select-none">
        {/* Subtle Kindle Top Sensor dot */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#05140b] shadow-inner" />

        {/* E-INK DISPLAY SCREEN */}
        <div
          className={`relative rounded-[22px] sm:rounded-[28px] overflow-hidden transition-colors duration-300 shadow-[inset_0_4px_12px_rgba(0,0,0,0.65),0_1px_2px_rgba(255,255,255,0.1)] border-2 ${
            eInkMode === 'paper'
              ? 'bg-[#f4efe4] border-[#d8d0be] text-[#181818]'
              : 'bg-[#101914] border-[#1c3024] text-[#e3ece5]'
          }`}
        >
          {/* Paper Grain Overlay for authentic E-Ink look */}
          <div
            className={`absolute inset-0 pointer-events-none opacity-[0.06] ${
              eInkMode === 'paper' ? 'bg-black' : 'bg-white'
            }`}
            style={{
              backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
              backgroundSize: '8px 8px',
            }}
          />

          {/* KINDLE STATUS BAR */}
          <div
            className={`relative px-4 sm:px-6 py-2.5 flex items-center justify-between text-[11px] font-mono border-b ${
              eInkMode === 'paper'
                ? 'bg-[#eae3d2] border-[#d6cdb9] text-[#423d33]'
                : 'bg-[#0d1611] border-[#18291f] text-[#8ea896]'
            }`}
          >
            {/* Left: Device & Wi-Fi */}
            <div className="flex items-center gap-2 font-serif font-bold tracking-wide">
              <span className="text-xs">Kindle Oasis</span>
              <span className="opacity-40">•</span>
              <div className="flex items-center gap-1 font-mono text-[10px] font-normal">
                <Wifi className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Wi-Fi</span>
              </div>
            </div>

            {/* Center: Device Library Title */}
            <div className="hidden sm:flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 opacity-70" />
              <span className="font-serif font-bold tracking-wider text-xs uppercase">
                Sarah's E-Book Folio
              </span>
              <span className="text-[10px] opacity-60">({books.length} tomes)</span>
            </div>

            {/* Right: Controls & Battery */}
            <div className="flex items-center gap-3">
              {/* E-Ink Tone Switcher */}
              <button
                type="button"
                onClick={() => setEInkMode(eInkMode === 'paper' ? 'dark' : 'paper')}
                className={`p-1 rounded flex items-center gap-1 text-[10px] font-sans font-medium transition-colors cursor-pointer border ${
                  eInkMode === 'paper'
                    ? 'hover:bg-[#dad0bc] border-[#c7bea8] text-[#332f27]'
                    : 'hover:bg-[#1a2c21] border-[#254230] text-[#a0c2ab]'
                }`}
                title="Toggle E-Ink day/night illumination"
              >
                {eInkMode === 'paper' ? (
                  <>
                    <Moon className="w-3 h-3 text-slate-700" />
                    <span className="hidden md:inline">Night Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3 h-3 text-amber-400" />
                    <span className="hidden md:inline">Day Paper</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onAddBook}
                className="px-2.5 py-0.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-sans text-[10px] font-semibold flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>+ Add Tome</span>
              </button>

              <div className="flex items-center gap-1 font-mono text-[10px]">
                <span>98%</span>
                <Battery className="w-3.5 h-3.5 fill-current opacity-80" />
              </div>
            </div>
          </div>

          {/* KINDLE SCREEN HEADER BANNER */}
          <div
            className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between ${
              eInkMode === 'paper'
                ? 'bg-[#eee7d8] border-[#ded4bf]'
                : 'bg-[#0f1b14] border-[#1c3224]'
            }`}
          >
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl tracking-wide flex items-center gap-2">
                <span>Digital E-Reader Shelves</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    eInkMode === 'paper'
                      ? 'bg-[#ded4bf] text-[#423d33] border-[#cdc2a8]'
                      : 'bg-[#1c3224] text-[#a3c9b0] border-[#284a34]'
                  }`}
                >
                  Glare-Free E-Ink
                </span>
              </h2>
              <p
                className={`text-xs font-serif italic mt-0.5 ${
                  eInkMode === 'paper' ? 'text-[#6b6252]' : 'text-[#8ea896]'
                }`}
              >
                Tap any digital edition to open reader folio and annotations
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-4 text-xs font-serif">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block shadow-sm" />
                <span>Reading</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block shadow-sm" />
                <span>Next Read</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block shadow-sm" />
                <span>Finished</span>
              </span>
            </div>
          </div>

          {/* SHELVES ON THE KINDLE SCREEN */}
          <div className="p-4 sm:p-8 space-y-10 sm:space-y-12 min-h-[420px]">
            {shelves.map((shelfBooks, shelfIdx) => (
              <div key={shelfIdx} className="relative">
                {/* Book Editions Sitting on this Shelf */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 items-end pb-1 px-2">
                  {shelfBooks.map((book) => {
                    const progressPct = Math.min(
                      100,
                      Math.round((book.currentPage / book.totalPages) * 100)
                    );

                    return (
                      <div
                        key={book.id}
                        onClick={() => onSelectBook(book)}
                        className={`group relative rounded-xl p-3 sm:p-4 border cursor-pointer transition-all duration-200 transform hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between min-h-[190px] select-none ${
                          eInkMode === 'paper'
                            ? 'bg-[#faf6ee] hover:bg-[#ffffff] border-[#d8d0be] shadow-[0_4px_12px_rgba(0,0,0,0.08)]'
                            : 'bg-[#132019] hover:bg-[#182a20] border-[#223d2d] shadow-[0_4px_16px_rgba(0,0,0,0.6)]'
                        }`}
                      >
                        {/* Status Stamp & Page Progress */}
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[9px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${
                              book.status === 'reading'
                                ? eInkMode === 'paper'
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                : book.status === 'want_to_read'
                                ? eInkMode === 'paper'
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : 'bg-amber-950 text-amber-300 border-amber-700'
                                : eInkMode === 'paper'
                                ? 'bg-slate-200 text-slate-800 border-slate-300'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {book.status === 'reading'
                              ? 'Reading'
                              : book.status === 'want_to_read'
                              ? 'Next Read'
                              : 'Completed'}
                          </span>

                          <span
                            className={`text-[10px] font-mono ${
                              eInkMode === 'paper' ? 'text-[#706657]' : 'text-[#85a38f]'
                            }`}
                          >
                            {progressPct}% Read
                          </span>
                        </div>

                        {/* PROMINENT EBOOK TITLE */}
                        <div className="my-3 space-y-1">
                          <h3
                            className={`font-serif font-black text-base sm:text-lg leading-snug tracking-tight line-clamp-2 group-hover:underline decoration-emerald-600 ${
                              eInkMode === 'paper' ? 'text-[#14120e]' : 'text-[#f0f6f2]'
                            }`}
                          >
                            {book.title}
                          </h3>
                          <p
                            className={`font-serif italic text-xs truncate ${
                              eInkMode === 'paper' ? 'text-[#5c5445]' : 'text-[#9ab7a4]'
                            }`}
                          >
                            by {book.author}
                          </p>
                        </div>

                        {/* Progress Dots Bar / Page Counter */}
                        <div className="space-y-1.5 pt-2 border-t border-current/10">
                          <div
                            className={`w-full h-1.5 rounded-full overflow-hidden ${
                              eInkMode === 'paper' ? 'bg-[#dfd7c5]' : 'bg-[#1d3527]'
                            }`}
                          >
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                book.status === 'completed'
                                  ? 'bg-emerald-600'
                                  : eInkMode === 'paper'
                                  ? 'bg-[#3d382f]'
                                  : 'bg-emerald-400'
                              }`}
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>

                          <div
                            className={`flex items-center justify-between text-[10px] font-mono ${
                              eInkMode === 'paper' ? 'text-[#756c5c]' : 'text-[#7f9e8a]'
                            }`}
                          >
                            <span>
                              Pg {book.currentPage} of {book.totalPages}
                            </span>
                            <span className="font-sans font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform text-emerald-700 dark:text-emerald-400">
                              Open <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add E-Book Tome Button on Last Shelf */}
                  {shelfIdx === shelves.length - 1 && (
                    <button
                      type="button"
                      onClick={onAddBook}
                      className={`h-[190px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                        eInkMode === 'paper'
                          ? 'border-[#c7bea8] hover:border-emerald-600 bg-[#eae3d4]/40 hover:bg-[#efe8da] text-[#544d41]'
                          : 'border-[#284834] hover:border-emerald-400 bg-[#0d1812]/50 hover:bg-[#12231a] text-[#8ea896]'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-700/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Plus className="w-6 h-6" />
                      </div>
                      <span className="font-serif font-bold text-xs uppercase tracking-wider">
                        + Add E-Book Tome
                      </span>
                      <span className="text-[10px] font-serif italic opacity-75">
                        Download to Kindle
                      </span>
                    </button>
                  )}
                </div>

                {/* THE KINDLE SHELF PLANK BASE */}
                <div className="relative mt-2 z-10">
                  {/* Top shelf wood/e-ink lip */}
                  <div
                    className={`h-2 rounded-t-sm shadow-sm ${
                      eInkMode === 'paper'
                        ? 'bg-gradient-to-r from-[#8a684b] via-[#a88260] to-[#8a684b] border-t border-[#6b5037]'
                        : 'bg-gradient-to-r from-[#173021] via-[#244933] to-[#173021] border-t border-[#316144]'
                    }`}
                  />
                  {/* Shelf front face */}
                  <div
                    className={`h-4.5 sm:h-5 rounded-b-md px-4 flex items-center justify-between shadow-md ${
                      eInkMode === 'paper'
                        ? 'bg-gradient-to-b from-[#6b5037] to-[#4d3824] text-[#e8dfcf]'
                        : 'bg-gradient-to-b from-[#112419] to-[#0a1710] text-[#7fa38a]'
                    }`}
                  >
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
              <div
                className={`p-10 text-center rounded-2xl border-2 border-dashed space-y-3 ${
                  eInkMode === 'paper'
                    ? 'border-[#cfc6b2] bg-[#eae3d4]/50 text-[#544d41]'
                    : 'border-[#233d2c] bg-[#0c1611]/50 text-[#8aa593]'
                }`}
              >
                <BookOpen className="w-10 h-10 mx-auto text-emerald-600 opacity-60" />
                <h4 className="font-serif font-bold text-base">Your Kindle Shelves are Empty</h4>
                <p className="text-xs font-serif italic max-w-sm mx-auto">
                  Add digital epubs to organize and read them on your giant Kindle Paperwhite display.
                </p>
                <button
                  type="button"
                  onClick={onAddBook}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-sans text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
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
