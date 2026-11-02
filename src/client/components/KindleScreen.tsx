import { BatteryMedium, Wifi } from "lucide-react";
import type { Book } from "#shared/books.ts";

interface KindleScreenProps {
  book: Book;
  onSelect: () => void;
}

export function KindleScreen({ book, onSelect }: KindleScreenProps) {
  const progressPct = book.totalPages > 0 ? Math.min(100, Math.round((book.currentPage / book.totalPages) * 100)) : 0;
  const minsLeft = Math.max(1, Math.round((book.totalPages - book.currentPage) * 1.3));

  return (
    <div
      onClick={onSelect}
      className="group relative cursor-pointer flex flex-col items-center transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] w-full max-w-[280px] sm:max-w-[300px]"
    >
      <div className="w-full rounded-2xl bg-gradient-to-b from-[#22242a] via-[#16171b] to-[#0e0f12] p-3 sm:p-3.5 border-2 border-[#373a44] shadow-[0_20px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(82,183,136,0.15)] group-hover:border-emerald-400/60 group-hover:shadow-[0_24px_50px_rgba(0,0,0,0.95),0_0_28px_rgba(82,183,136,0.35)] transition-all">
        <div className="flex items-center justify-between px-3 mb-2 opacity-35">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <div className="w-8 h-1 rounded-full bg-slate-600" />
          <span className="w-1 h-1 rounded-full bg-slate-500" />
        </div>

        <div className="relative rounded-xl overflow-hidden bg-[#f4efe4] border border-[#d6cfc0] shadow-[inset_0_3px_6px_rgba(0,0,0,0.22)] p-4 flex flex-col justify-between min-h-[355px] text-[#1c1917]">
          <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:6px_6px]" />

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

          <div className="relative z-10 my-auto text-center px-1 py-3 space-y-2.5">
            <span
              className={`inline-block text-[9px] uppercase tracking-widest font-sans font-bold px-2 py-0.5 rounded border ${
                book.status === "reading"
                  ? "bg-[#1b4332]/10 text-[#1b4332] border-[#1b4332]/30"
                  : book.status === "want_to_read"
                    ? "bg-[#b45309]/10 text-[#92400e] border-[#b45309]/30"
                    : "bg-[#475569]/10 text-[#334155] border-[#475569]/30"
              }`}
            >
              {book.status === "reading"
                ? "Currently Reading"
                : book.status === "want_to_read"
                  ? "Next Read"
                  : "Completed"}
            </span>

            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1c1917] leading-tight line-clamp-2">
              {book.title}
            </h3>
            <p className="font-serif text-xs text-[#57534e] italic tracking-wide">by {book.author}</p>

            {book.notes && (
              <p className="text-[11px] font-serif text-[#44403c] italic leading-relaxed line-clamp-3 bg-[#e8e1d3]/40 p-2 rounded border border-[#ded6c5]">
                "{book.notes}"
              </p>
            )}
          </div>

          <div className="relative z-10 pt-2 border-t border-[#ded7c8] space-y-1.5 text-[10px] text-[#57534e]">
            <div className="flex justify-between items-center font-mono">
              <span>
                Pg {book.currentPage} of {book.totalPages}
              </span>
              <span>{minsLeft} mins left</span>
            </div>
            <div className="w-full bg-[#ded7c8] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#1c1917] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="text-center pt-2 pb-0.5">
          <span className="text-[10px] tracking-[0.25em] font-sans font-semibold text-slate-500 uppercase">
            kindle paperwhite
          </span>
        </div>
      </div>
    </div>
  );
}
