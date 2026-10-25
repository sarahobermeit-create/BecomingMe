import React from 'react';
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Plus,
  Volume2,
  Trash2,
  Wifi,
  Battery,
  Disc,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Book } from '../../types';

interface PhoneAudiobookLibraryProps {
  books: Book[];
  selectedBook: Book | null;
  onSelectBook: (book: Book) => void;
  onAddBook: () => void;
  playingAudioId: string | null;
  onTogglePlay: (bookId: string) => void;
  onDeleteBook: (bookId: string) => void;
}

// Deterministic palettes for Audiobook tomes
const AUDIO_TOME_PALETTES = [
  { gradient: 'from-[#0b2b19] via-[#124227] to-[#071c10]', border: '#1e633c', ribbon: '#34d399', accent: '#6ee7b7' },
  { gradient: 'from-[#1e1338] via-[#2f1f54] to-[#120a24]', border: '#513491', ribbon: '#a78bfa', accent: '#c4b5fd' },
  { gradient: 'from-[#2b160b] via-[#452414] to-[#1a0c06]', border: '#6e3c23', ribbon: '#f59e0b', accent: '#fde68a' },
  { gradient: 'from-[#330f1b] via-[#4d192a] to-[#210811]', border: '#7a2b45', ribbon: '#f43f5e', accent: '#fda4af' },
  { gradient: 'from-[#0b2133] via-[#143652] to-[#071521]', border: '#235987', ribbon: '#38bdf8', accent: '#7dd3fc' },
  { gradient: 'from-[#1b2124] via-[#2b3338] to-[#101416]', border: '#46535a', ribbon: '#94a3b8', accent: '#cbd5e1' },
];

export const PhoneAudiobookLibrary: React.FC<PhoneAudiobookLibraryProps> = ({
  books,
  onSelectBook,
  onAddBook,
  playingAudioId,
  onTogglePlay,
  onDeleteBook,
}) => {
  // Helper to chunk audiobooks onto shelves (up to 3 per shelf on phone screen)
  const chunkShelves = (items: Book[], size: number = 3) => {
    const shelves: Book[][] = [];
    for (let i = 0; i < items.length; i += size) {
      shelves.push(items.slice(i, i + size));
    }
    if (shelves.length === 0) shelves.push([]);
    return shelves;
  };

  const shelves = chunkShelves(books, 3);

  // Active book playing or the first book for the bottom player dock
  const activePlayingBook =
    books.find((b) => b.id === playingAudioId) || (books.length > 0 ? books[0] : null);

  const formatAudioTime = (minutes: number = 0) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins}m`;
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-2 sm:px-4 relative">
      {/* ========================================================================= */}
      {/* REALISTIC OVER-EAR STUDIO HEADPHONES DRAPED OVER THE PHONE SCREEN         */}
      {/* ========================================================================= */}
      <div className="relative z-30 pointer-events-none select-none">
        {/* Headphone Arch spanning across the top */}
        <div className="relative -mb-10 sm:-mb-14 mx-auto w-[90%] sm:w-[84%] flex justify-between items-start">
          {/* Left Studio Ear Cup */}
          <div className="relative -ml-5 sm:-ml-8 -mt-2 drop-shadow-[0_15px_25px_rgba(0,0,0,0.95)]">
            {/* Gimbal brass connector */}
            <div className="w-5 h-7 rounded-md bg-gradient-to-b from-[#d4af37] via-[#8c6d1d] to-[#42330a] mx-auto -mb-2 shadow-md border border-[#f5d77f]/40" />
            {/* Outer Ear Cup Housing */}
            <div className="w-14 sm:w-18 h-22 sm:h-26 rounded-[24px] sm:rounded-[30px] bg-gradient-to-br from-[#122b1c] via-[#091b11] to-[#040e08] border-2 border-[#1f5936] p-1.5 shadow-2xl relative flex items-center justify-center">
              {/* Gold Ring Trim */}
              <div className="w-full h-full rounded-[18px] sm:rounded-[24px] border border-[#d4af37]/60 flex items-center justify-center bg-radial from-[#1e4a2e]/30 to-black/80">
                <Disc className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400/70" />
              </div>
              {/* Inner Cushion Shadow */}
              <div className="absolute -right-2 top-3 bottom-3 w-3 rounded-r-xl bg-[#030a06] border-l border-black/80" />
            </div>
          </div>

          {/* Curved Padded Leather Headband */}
          <div className="flex-1 px-2 pt-2 relative">
            <svg
              viewBox="0 0 400 90"
              className="w-full h-16 sm:h-22 drop-shadow-[0_12px_20px_rgba(0,0,0,0.95)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="headbandMetallicPhone" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1f4e30" />
                  <stop offset="25%" stopColor="#3d8256" />
                  <stop offset="50%" stopColor="#12331e" />
                  <stop offset="75%" stopColor="#3d8256" />
                  <stop offset="100%" stopColor="#1f4e30" />
                </linearGradient>
                <linearGradient id="leatherCushionPhone" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0c1e13" />
                  <stop offset="50%" stopColor="#06120b" />
                  <stop offset="100%" stopColor="#020804" />
                </linearGradient>
              </defs>

              {/* Metal Headband Outer Spring Band */}
              <path
                d="M 20 85 C 40 25, 360 25, 380 85"
                stroke="url(#headbandMetallicPhone)"
                strokeWidth="12"
                strokeLinecap="round"
              />
              {/* Inner Padded Leather Cushion Band */}
              <path
                d="M 50 80 C 80 35, 320 35, 350 80"
                stroke="url(#leatherCushionPhone)"
                strokeWidth="16"
                strokeLinecap="round"
              />
              {/* Golden Accent Trim on Headband */}
              <path
                d="M 70 70 C 110 38, 290 38, 330 70"
                stroke="#d4af37"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.8"
              />
            </svg>
          </div>

          {/* Right Studio Ear Cup */}
          <div className="relative -mr-5 sm:-mr-8 -mt-2 drop-shadow-[0_15px_25px_rgba(0,0,0,0.95)]">
            {/* Gimbal brass connector */}
            <div className="w-5 h-7 rounded-md bg-gradient-to-b from-[#d4af37] via-[#8c6d1d] to-[#42330a] mx-auto -mb-2 shadow-md border border-[#f5d77f]/40" />
            {/* Outer Ear Cup Housing */}
            <div className="w-14 sm:w-18 h-22 sm:h-26 rounded-[24px] sm:rounded-[30px] bg-gradient-to-bl from-[#122b1c] via-[#091b11] to-[#040e08] border-2 border-[#1f5936] p-1.5 shadow-2xl relative flex items-center justify-center">
              {/* Gold Ring Trim */}
              <div className="w-full h-full rounded-[18px] sm:rounded-[24px] border border-[#d4af37]/60 flex items-center justify-center bg-radial from-[#1e4a2e]/30 to-black/80">
                <Disc className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400/70" />
              </div>
              {/* Inner Cushion Shadow */}
              <div className="absolute -left-2 top-3 bottom-3 w-3 rounded-l-xl bg-[#030a06] border-r border-black/80" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* GIANT DARK GREEN PHONE CHASSIS                                            */}
      {/* ========================================================================= */}
      <div className="relative rounded-[44px] sm:rounded-[56px] bg-gradient-to-b from-[#072415] via-[#0b331f] to-[#04150b] p-3 sm:p-5 shadow-[0_30px_90px_rgba(0,0,0,0.95),inset_0_2px_4px_rgba(255,255,255,0.22),inset_0_-4px_8px_rgba(0,0,0,0.9)] border-4 sm:border-[6px] border-[#103d24] select-none">
        {/* Phone Volume Buttons on Left Edge */}
        <div className="absolute -left-2 top-32 w-1.5 h-10 rounded-l-md bg-[#092616] border-y border-l border-[#1b5030]" />
        <div className="absolute -left-2 top-46 w-1.5 h-10 rounded-l-md bg-[#092616] border-y border-l border-[#1b5030]" />
        {/* Phone Power Button on Right Edge */}
        <div className="absolute -right-2 top-36 w-1.5 h-14 rounded-r-md bg-[#092616] border-y border-r border-[#1b5030]" />

        {/* ======================================================================= */}
        {/* PHONE SCREEN DISPLAY                                                    */}
        {/* ======================================================================= */}
        <div className="relative rounded-[36px] sm:rounded-[46px] overflow-hidden bg-gradient-to-b from-[#05180e] via-[#082214] to-[#020d07] border-2 border-[#123821] shadow-[inset_0_4px_16px_rgba(0,0,0,0.85)] flex flex-col min-h-[620px]">
          {/* DYNAMIC ISLAND / SPEAKER NOTCH AT TOP */}
          <div className="pt-2 pb-1 flex justify-center relative z-20">
            <div className="h-5 sm:h-6 px-3 rounded-full bg-black/90 border border-emerald-500/20 shadow-md flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#081f12] ring-1 ring-emerald-500/40" />
              <div className="w-8 h-1 rounded-full bg-black/80" />
              <Headphones className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
            </div>
          </div>

          {/* PHONE STATUS BAR */}
          <div className="px-6 py-1.5 flex items-center justify-between text-[11px] font-mono text-emerald-200/70 border-b border-emerald-950/60">
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-100">5:24 PM</span>
              <span className="opacity-40">•</span>
              <span className="text-[10px] text-emerald-300">5G Audio</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-300">
              <div className="flex items-center gap-1 text-[9px] bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30 text-emerald-200">
                <Headphones className="w-2.5 h-2.5 text-emerald-400" />
                <span>Headphones On</span>
              </div>
              <Wifi className="w-2.5 h-2.5" />
              <div className="flex items-center gap-1 font-mono text-[10px]">
                <span>94%</span>
                <Battery className="w-3 h-3 fill-current text-emerald-400" />
              </div>
            </div>
          </div>

          {/* AUDIO PARLOR APP HEADER */}
          <div className="p-3.5 sm:p-4 pb-2.5 border-b border-emerald-500/20 bg-gradient-to-r from-[#072113]/90 via-[#0a2e1b]/80 to-[#072113]/90 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 shadow-md">
                <Volume2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-serif font-black text-white flex items-center gap-2">
                  <span>Audiobook Parlor</span>
                  <span className="text-[9px] font-mono font-normal px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {books.length} Narrations
                  </span>
                </h2>
                <p className="text-[10px] text-emerald-200/70 font-serif italic">
                  Studio headphones connected • Tap any audio case to listen or inspect
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onAddBook}
              className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-[11px] font-semibold flex items-center gap-1 shadow-md cursor-pointer border border-emerald-400/40 transition-all hover:scale-105"
            >
              <Plus className="w-3 h-3" />
              <span>+ Add Audio</span>
            </button>
          </div>

          {/* ======================================================================= */}
          {/* SHELVES ON THE PHONE SCREEN DISPLAYING THE AUDIO BOOK TITLES            */}
          {/* ======================================================================= */}
          <div className="flex-1 p-3 sm:p-6 space-y-10 sm:space-y-12 overflow-y-auto">
            {shelves.map((shelfBooks, shelfIdx) => (
              <div key={shelfIdx} className="relative">
                {/* Audiobook Tomes Sitting Directly on the Phone Shelf */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-6 items-end pb-0 px-2 sm:px-4">
                  {shelfBooks.map((book) => {
                    const isPlaying = playingAudioId === book.id;
                    const hash = (book.id + (book.title || '')).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                    const palette = AUDIO_TOME_PALETTES[Math.abs(hash) % AUDIO_TOME_PALETTES.length];

                    return (
                      <div
                        key={book.id}
                        onClick={() => onSelectBook(book)}
                        className={`group relative cursor-pointer select-none transition-all duration-300 transform hover:-translate-y-3.5 hover:scale-[1.03] z-10 hover:z-30 flex justify-center ${
                          isPlaying ? 'z-20' : ''
                        }`}
                      >
                        {/* Book Body: Upright Audiobook Tome Sitting on Shelf */}
                        <div
                          style={{ borderColor: palette.border }}
                          className={`relative w-[108px] sm:w-[124px] h-[170px] sm:h-[190px] rounded-r-lg rounded-l-[3px] p-2 flex flex-col justify-between shadow-[2px_8px_20px_rgba(0,0,0,0.85)] border-y border-r bg-gradient-to-r ${palette.gradient} transition-all duration-300 ${
                            isPlaying
                              ? 'ring-2 ring-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.5)] -translate-y-2'
                              : 'group-hover:shadow-[0_20px_35px_rgba(0,0,0,0.95),0_0_20px_rgba(52,211,153,0.3)]'
                          }`}
                        >
                          {/* 3D Cylindrical Spine Shading on Left */}
                          <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/70 via-transparent to-black/25 pointer-events-none rounded-l-[3px]" />
                          <div className="absolute inset-y-0 left-3 w-[1px] bg-black/40 pointer-events-none" />

                          {/* Top Filigree Band & Studio Headphones Icon */}
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
                                  ? 'Listening'
                                  : book.status === 'want_to_read'
                                  ? 'Next'
                                  : book.status === 'dnf'
                                  ? 'DNF'
                                  : 'Done'}
                              </span>

                              {/* Studio Headphone Emblem */}
                              <div className="p-0.5 rounded bg-black/50 border border-emerald-400/40 text-emerald-300">
                                <Headphones className="w-2.5 h-2.5" />
                              </div>
                            </div>
                            <div className="w-full h-1 bg-gradient-to-r from-amber-600/70 via-amber-300 to-amber-600/70 rounded shadow-sm border-y border-amber-950/70 mt-1" />
                          </div>

                          {/* Center: Framed Cover Bookplate with Play/Pause button */}
                          <div className="relative z-10 flex flex-col items-center my-0.5">
                            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-md overflow-hidden border border-emerald-400/40 shadow-md bg-black">
                              <img
                                src={book.coverUrl}
                                alt={book.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onTogglePlay(book.id);
                                }}
                                className={`absolute inset-0 m-auto w-6 h-6 rounded-full flex items-center justify-center transition-transform shadow-lg cursor-pointer ${
                                  isPlaying
                                    ? 'bg-emerald-500 text-black scale-110'
                                    : 'bg-black/60 hover:bg-emerald-600 text-white hover:scale-110'
                                }`}
                                title={isPlaying ? 'Pause narration' : 'Play narration'}
                              >
                                {isPlaying ? (
                                  <Pause className="w-3 h-3 fill-current" />
                                ) : (
                                  <Play className="w-3 h-3 fill-current ml-0.5" />
                                )}
                              </button>
                            </div>

                            <h3 className="font-serif font-black text-xs leading-snug line-clamp-2 text-white group-hover:text-emerald-300 transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] text-center mt-1.5 px-0.5">
                              {book.title}
                            </h3>
                            <p className="font-serif italic text-[9.5px] text-emerald-200/80 truncate max-w-full text-center mt-0.5">
                              by {book.author}
                            </p>
                          </div>

                          {/* Bottom Audio Info Band */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="w-full h-1 bg-gradient-to-r from-amber-600/70 via-amber-300 to-amber-600/70 rounded shadow-sm border-y border-amber-950/70 mb-0.5" />
                            <div className="flex items-center justify-between w-full px-1 text-[7.5px] font-mono text-emerald-300/70">
                              <span>Audio Tome</span>
                              <span className="flex items-center gap-0.5">
                                <Volume2 className="w-2 h-2 text-emerald-400" />
                                {formatAudioTime(book.audioDurationMinutes || 360)}
                              </span>
                            </div>
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

                  {/* Add New Audio Book Slot on the Last Shelf */}
                  {shelfIdx === shelves.length - 1 && (
                    <div className="flex justify-center pb-0">
                      <button
                        type="button"
                        onClick={onAddBook}
                        className="w-[108px] sm:w-[124px] h-[170px] sm:h-[190px] rounded-r-lg rounded-l-[3px] border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 bg-emerald-950/20 hover:bg-emerald-900/40 p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] text-emerald-200 text-center"
                      >
                        <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-inner">
                          <Plus className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-serif font-bold text-xs uppercase tracking-wider text-white">
                          + Add Audio
                        </span>
                        <span className="text-[9px] font-serif italic text-emerald-300/70">
                          Slot into phone
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* THE PHONE SCREEN SHELF RACK PLANK */}
                <div className="relative mt-2 z-10">
                  {/* Glassmorphic Dark Emerald Shelf Lip */}
                  <div className="h-2 rounded-t-sm bg-gradient-to-r from-[#0e3b22] via-[#1d5c38] to-[#0e3b22] border-t border-emerald-400/40 shadow-sm" />
                  {/* Shelf Face */}
                  <div className="h-5 rounded-b-md px-4 flex items-center justify-between bg-gradient-to-b from-[#092415] to-[#030e08] border-b border-black text-emerald-300/80 shadow-md">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                      <span className="text-[9px] font-serif font-bold tracking-widest uppercase">
                        Audio Tier {shelfIdx + 1}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400/50">
                      Hi-Res Lossless • Studio Headphones
                    </span>
                  </div>
                  {/* Shelf Shadow */}
                  <div className="h-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
                </div>
              </div>
            ))}

            {books.length === 0 && (
              <div className="p-8 text-center rounded-2xl border-2 border-dashed border-emerald-500/30 bg-emerald-950/20 text-emerald-200 space-y-3">
                <Headphones className="w-7 h-7 mx-auto text-emerald-400 opacity-60" />
                <h4 className="font-serif font-bold text-base text-white">
                  Your Phone Audio Shelves are Empty
                </h4>
                <p className="text-xs text-emerald-300/70 max-w-sm mx-auto">
                  Add spoken audiobooks to slot them onto your phone shelves and listen with studio headphones.
                </p>
                <button
                  type="button"
                  onClick={onAddBook}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-sans text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add First Audiobook</span>
                </button>
              </div>
            )}
          </div>

          {/* ======================================================================= */}
          {/* BOTTOM DOCKED "NOW PLAYING" PLAYER & PHONE HOME INDICATOR BAR            */}
          {/* ======================================================================= */}
          {activePlayingBook && (
            <div className="p-3 sm:p-4 bg-gradient-to-r from-[#061e12] via-[#092b1a] to-[#061e12] border-t border-emerald-500/30 shadow-2xl relative z-20">
              <div className="flex items-center gap-3">
                {/* Album Thumbnail */}
                <div
                  onClick={() => onSelectBook(activePlayingBook)}
                  className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-emerald-400/40 cursor-pointer shadow-md"
                >
                  <img
                    src={activePlayingBook.coverUrl}
                    alt={activePlayingBook.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title & Author */}
                <div
                  onClick={() => onSelectBook(activePlayingBook)}
                  className="flex-1 overflow-hidden cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] uppercase font-bold text-emerald-400 font-mono tracking-wider">
                      {playingAudioId === activePlayingBook.id ? 'Now Playing' : 'Selected'}
                    </span>
                    {playingAudioId === activePlayingBook.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white truncate font-serif">
                    {activePlayingBook.title}
                  </h4>
                  <p className="text-[10px] text-emerald-200/60 truncate">
                    {activePlayingBook.author}
                  </p>
                </div>

                {/* Player Controls */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => onTogglePlay(activePlayingBook.id)}
                    className="w-7 h-7 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer font-bold"
                  >
                    {playingAudioId === activePlayingBook.id ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PHONE HOME INDICATOR BAR */}
          <div className="py-2 flex justify-center bg-black/90">
            <div className="w-28 sm:w-36 h-1 rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    </div>
  );
};
