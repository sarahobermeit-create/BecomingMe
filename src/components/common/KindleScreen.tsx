import React from 'react';
import { Book } from '../../types';
import { Wifi, BatteryMedium, Bookmark, Star } from 'lucide-react';

interface KindleScreenProps {
  book: Book;
  onSelect: () => void;
}

export const KindleScreen: React.FC<KindleScreenProps> = ({ book, onSelect }) => {
  const progressPct = Math.min(100, Math.round((book.currentPage / book.totalPages) * 100));
  const minsLeft = Math.max(1, Math.round((book.totalPages - book.currentPage) * 1.3));

  return (
    <div
      onClick={onSelect}
      className="group relative cursor-pointer flex flex-col items-center transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] w-full max-w-[280px] sm:max-w-[300px]"
    >
      {/* Kindle Outer Chassis with Soft Bevel & Grip */}
      <div className="w-full rounded-2xl bg-gradient-to-b from-[#22242a] via-[#16171b] to-[#0e0f12] p-3 sm:p-3.5 border-2 border-[#373a44] shadow-[0_20px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(82,183,136,0.15)] group-hover:border-emerald-400/60 group-hover:shadow-[0_24px_50px_rgba(0,0,0,0.95),0_0_28px_rgba(82,183,136,0.35)] transition-all">
        {/* Top Bezel: Ambient light sensor & speaker micro-mesh */}
        <div className="flex items-center justify-between px-3 mb-2 opacity-35">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <div className="w-8 h-1 rounded-full bg-slate-600" />
          <span className="w-1 h-1 rounded-full bg-slate-500" />
        </div>

        {/* E-Ink Matte Glare-Free Paper Screen */}
        <div className="relative rounded-xl overflow-hidden bg-[#f4efe4] border border-[#d6cfc0] shadow-[inset_0_3px_6px_rgba(0,0,0,0.22)] p-4 flex flex-col justify-between min-h-[355px] text-[#1c1917]">
          {/* Paper Texture Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:6px_6px]" />

          {/* Kindle Top Status Bar */}
          <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-[#57534e] pb-2 border-b border-[#ded7c8]">
            <div className="flex items-center gap-1">
              <span className="font-sans font-black tracking-tight text-[10px] text-[#44403c]">KINDLE</span>
              <span className="text-[9px] text-[#78716c]">• E-INK</span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px]">
              <Wifi className="w-2.5 h-2.5 text-[#57534e]" />
              <span>{progressPct}%</span>
              <BatteryMedium className="w-3 h-3 text-[#57534e]" />
            </div>
          </div>

          {/* Screen Content: Book Title, Author & Chapter Excerpt */}
          <div className="relative z-10 my-auto text-center px-1 py-3 space-y-2.5">
            {/* Status indicator tag */}
            <span
              className={`inline-block text-[9px] uppercase tracking-widest font-sans font-bold px-2 py-0.5 rounded border ${
                book.status === 'reading'
                  ? 'bg-[#1b4332]/10 text-[#1b4332] border-[#1b4332]/30'
                  : book.status === 'want_to_read'
                  ? 'bg-[#b45309]/10 text-[#92400e] border-[#b45309]/30'
                  : 'bg-[#475569]/10 text-[#334155] border-[#475569]/30'
              }`}
            >
              {book.status === 'reading' ? 'Currently Reading' : book.status === 'want_to_read' ? 'Next Read' : 'Completed'}
            </span>

            {/* Book Title prominently displayed on the Kindle screen */}
            <h3 className="font-serif font-black text-lg sm:text-xl text-[#1c1917] tracking-tight leading-snug drop-shadow-none px-1">
              {book.title}
            </h3>

            {/* Author */}
            <p className="font-serif italic text-xs text-[#57534e]">
              by {book.author}
            </p>

            {/* Rating Stars on Kindle */}
            {book.rating && (
              <div className="flex items-center justify-center gap-0.5 text-[#b45309]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < (book.rating || 0) ? 'fill-[#b45309] text-[#b45309]' : 'text-[#d6cebe]'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Ornate Flourish Divider */}
            <div className="flex items-center justify-center gap-2 my-1.5 opacity-60">
              <div className="w-8 h-px bg-[#a8a29e]" />
              <span className="text-[10px] text-[#78716c]">✦</span>
              <div className="w-8 h-px bg-[#a8a29e]" />
            </div>

            {/* Excerpt / Quotes or Reading Note snippet */}
            {book.favoriteQuotes && book.favoriteQuotes[0] ? (
              <p className="font-serif text-[11px] text-[#44403c] italic line-clamp-3 px-1 leading-relaxed">
                "{book.favoriteQuotes[0]}"
              </p>
            ) : book.notes ? (
              <p className="font-serif text-[11px] text-[#57534e] line-clamp-3 px-1 leading-relaxed">
                {book.notes}
              </p>
            ) : (
              <p className="font-serif text-[11px] text-[#78716c] italic">
                Tap Kindle screen to inspect book...
              </p>
            )}
          </div>

          {/* Kindle Bottom Reading Progress Bar */}
          <div className="relative z-10 pt-2 border-t border-[#ded7c8] text-[10px] font-mono text-[#57534e]">
            <div className="flex items-center justify-between mb-1.5 text-[9px]">
              <span>Page {book.currentPage} of {book.totalPages}</span>
              <span>{minsLeft} mins left in book</span>
            </div>
            {/* E-Ink dark progress bar */}
            <div className="w-full bg-[#d6cebe] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#292524] h-full rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Bezel with Embossed "kindle" Branding */}
        <div className="pt-3 pb-1 text-center select-none">
          <span className="font-sans font-semibold text-[10px] tracking-[0.28em] text-[#6b7280] uppercase">
            kindle
          </span>
        </div>
      </div>
    </div>
  );
};
