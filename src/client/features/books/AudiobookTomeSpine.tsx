import { Pause, Play } from "lucide-react";
import { HeadphonesOverCorner } from "#client/components/HeadphonesOverCorner.tsx";
import { AUDIO_TOME_PALETTES, getPaletteForBook } from "#client/features/books/tomePalettes.ts";
import type { Book } from "#shared/books.ts";

interface Props {
  book: Book;
  index: number;
  isPlaying: boolean;
  onSelect: (book: Book) => void;
  onTogglePlay: (e: React.MouseEvent, bookId: string) => void;
}

export function AudiobookTomeSpine({ book, index, isPlaying, onSelect, onTogglePlay }: Props) {
  const palette = getPaletteForBook(index, AUDIO_TOME_PALETTES);
  const total = book.audioDurationMinutes || 600;
  const current = book.currentAudioMinutes || 0;
  const pct = Math.min(100, Math.round((current / total) * 100));

  return (
    <div
      onClick={() => onSelect(book)}
      className="group relative cursor-pointer flex flex-col items-center transition-all duration-300 hover:-translate-y-2 select-none w-24 sm:w-28 shrink-0"
    >
      <div
        className={`relative w-full h-36 sm:h-40 rounded-xl bg-gradient-to-br ${palette.gradient} p-2 flex flex-col justify-between shadow-[0_8px_20px_rgba(0,0,0,0.8)] border transition-all group-hover:shadow-[0_12px_28px_rgba(52,211,153,0.3)]`}
        style={{ borderColor: palette.border }}
      >
        <HeadphonesOverCorner />

        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover rounded shadow" />
        ) : (
          <div className="text-center my-auto space-y-1">
            <span className="text-[10px] font-serif font-bold text-amber-100 line-clamp-3 leading-tight">
              {book.title}
            </span>
            <span className="text-[9px] text-slate-300/80 truncate block">{book.author}</span>
          </div>
        )}

        {/* Play/Pause Button overlay */}
        <button
          onClick={(e) => onTogglePlay(e, book.id)}
          className="absolute inset-0 m-auto w-9 h-9 rounded-full bg-black/60 hover:bg-emerald-600/90 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity border border-white/20 shadow-lg"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        <div className="w-full pt-1 border-t border-white/10 text-center">
          <span className="text-[9px] font-mono text-emerald-300">{pct}%</span>
        </div>
      </div>

      <span className="text-[11px] text-slate-200 font-medium truncate w-full text-center mt-2">
        {book.title}
      </span>
    </div>
  );
}
