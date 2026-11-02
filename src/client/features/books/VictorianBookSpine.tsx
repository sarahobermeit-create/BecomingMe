import { Star } from "lucide-react";
import { getPaletteForBook } from "#client/features/books/tomePalettes.ts";
import type { Book } from "#shared/books.ts";

interface Props {
  book: Book;
  index: number;
  onSelect: (book: Book) => void;
}

export function VictorianBookSpine({ book, index, onSelect }: Props) {
  const palette = getPaletteForBook(index);
  const total = book.format === "audiobook" ? book.audioDurationMinutes ?? 0 : book.totalPages;
  const current = book.format === "audiobook" ? book.currentAudioMinutes ?? 0 : book.currentPage;
  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  // Varied book height based on total pages
  const heightClass =
    total > 600
      ? "h-[195px] sm:h-[220px]"
      : total > 400
        ? "h-[180px] sm:h-[205px]"
        : "h-[165px] sm:h-[190px]";

  const widthClass = total > 500 ? "w-[42px] sm:w-[48px]" : "w-[36px] sm:w-[42px]";

  return (
    <div
      onClick={() => onSelect(book)}
      className={`group relative shrink-0 cursor-pointer ${heightClass} ${widthClass} transition-all duration-300 hover:-translate-y-3 hover:scale-105 select-none`}
    >
      {/* Silk Bookmark Ribbon dropping from top */}
      {book.status === "reading" && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-5 rounded-b z-30 shadow-md transition-transform group-hover:-translate-y-1"
          style={{ backgroundColor: palette.ribbon }}
        />
      )}

      {/* Leather Spine Box */}
      <div
        className={`relative w-full h-full rounded-[4px] bg-gradient-to-r ${palette.gradient} flex flex-col justify-between py-2 px-1 text-center shadow-[2px_4px_12px_rgba(0,0,0,0.85)] border`}
        style={{ borderColor: palette.border }}
      >
        {/* Top Gold Spine Rib */}
        <div className="w-full flex flex-col gap-[3px] items-center">
          <div className="w-full h-[2px] rounded-full opacity-80" style={{ backgroundColor: palette.rib }} />
          <div className="w-full h-[1px] rounded-full opacity-50" style={{ backgroundColor: palette.rib }} />
        </div>

        {/* Title & Author in vertical writing */}
        <div className="flex-1 flex flex-col items-center justify-center my-1 overflow-hidden">
          <span
            className="writing-mode-vertical text-[10px] sm:text-[11px] font-serif font-bold tracking-wider text-amber-100/90 truncate max-h-[110px] sm:max-h-[130px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
            title={book.title}
          >
            {book.title}
          </span>
        </div>

        {/* Star rating or Status dot */}
        <div className="flex flex-col items-center gap-1">
          {book.rating ? (
            <div className="flex items-center text-[#f0c75e]">
              <Star className="w-2.5 h-2.5 fill-current" />
            </div>
          ) : (
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                book.status === "completed"
                  ? "bg-emerald-400"
                  : book.status === "reading"
                    ? "bg-amber-400 animate-pulse"
                    : "bg-slate-500"
              }`}
            />
          )}

          {/* Bottom Gold Spine Ribs */}
          <div className="w-full flex flex-col gap-[3px] items-center">
            <div className="w-full h-[1px] rounded-full opacity-50" style={{ backgroundColor: palette.rib }} />
            <div className="w-full h-[2px] rounded-full opacity-80" style={{ backgroundColor: palette.rib }} />
          </div>

          {/* Progress bar line at the very bottom */}
          {book.status === "reading" && (
            <div className="w-full bg-black/40 h-1 rounded-full overflow-hidden mt-0.5">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${pct}%` }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
