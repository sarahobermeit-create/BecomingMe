import { EBOOK_TOME_PALETTES, getPaletteForBook } from "#client/features/books/tomePalettes.ts";
import type { Book } from "#shared/books.ts";

interface Props {
  book: Book;
  index: number;
  onSelect: (book: Book) => void;
}

export function KindleTomeSpine({ book, index, onSelect }: Props) {
  const palette = getPaletteForBook(index, EBOOK_TOME_PALETTES);
  const total = book.totalPages || 300;
  const current = book.currentPage || 0;
  const pct = Math.min(100, Math.round((current / total) * 100));

  return (
    <div
      onClick={() => onSelect(book)}
      className="group relative cursor-pointer flex flex-col items-center transition-all duration-300 hover:-translate-y-2 select-none w-24 sm:w-28 shrink-0"
    >
      {/* Cover / Tome Face */}
      <div
        className={`relative w-full h-36 sm:h-40 rounded-lg bg-gradient-to-br ${palette.gradient} p-2 flex flex-col justify-between shadow-[0_8px_20px_rgba(0,0,0,0.8)] border transition-all group-hover:shadow-[0_12px_28px_rgba(82,183,136,0.3)]`}
        style={{ borderColor: palette.border }}
      >
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover rounded shadow" />
        ) : (
          <>
            <div className="text-center space-y-1 my-auto">
              <span className="text-[10px] font-serif font-bold text-emerald-100 line-clamp-3 leading-tight">
                {book.title}
              </span>
              <span className="text-[9px] font-serif text-emerald-300/80 italic block truncate">
                {book.author}
              </span>
            </div>
            <div className="w-full pt-1 border-t border-emerald-500/20 text-center">
              <span className="text-[9px] font-mono text-emerald-300">{pct}%</span>
            </div>
          </>
        )}
      </div>

      {/* Book title beneath */}
      <span className="text-[11px] text-emerald-100/90 font-medium truncate w-full text-center mt-2">
        {book.title}
      </span>
    </div>
  );
}
