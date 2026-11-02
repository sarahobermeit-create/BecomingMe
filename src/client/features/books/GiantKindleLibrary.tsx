import { Battery, BookOpen, Plus, Wifi } from "lucide-react";
import { KindleTomeSpine } from "#client/features/books/KindleTomeSpine.tsx";
import type { Book } from "#shared/books.ts";

interface Props {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onAddBook: () => void;
}

export function GiantKindleLibrary({ books, onSelectBook, onAddBook }: Props) {
  const chunkShelves = (items: Book[], size = 4) => {
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
      {/* Giant Translucent Dark Green Kindle Chassis */}
      <div className="relative rounded-[36px] sm:rounded-[48px] bg-gradient-to-b from-[#072415]/85 via-[#0b331f]/80 to-[#04150b]/85 backdrop-blur-md p-4 sm:p-7 shadow-[0_28px_70px_rgba(0,0,0,0.88),inset_0_2px_4px_rgba(255,255,255,0.15),inset_0_-4px_8px_rgba(0,0,0,0.85)] border-4 sm:border-[6px] border-[#103d24]/75 select-none">
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#05140b] shadow-inner" />

        {/* E-Ink Display Screen */}
        <div className="relative rounded-[22px] sm:rounded-[28px] overflow-hidden shadow-[inset_0_4px_16px_rgba(0,0,0,0.85)] border-2 border-[#144226]/60 bg-gradient-to-b from-[#061d11]/75 via-[#082917]/70 to-[#03130a]/80 backdrop-blur-md text-emerald-100">
          {/* Status Bar */}
          <div className="relative px-4 sm:px-6 py-2.5 flex items-center justify-between text-[11px] font-mono border-b border-emerald-500/20 bg-[#072113]/70 backdrop-blur-sm text-emerald-300">
            <div className="flex items-center gap-2 font-serif font-bold">
              <span className="text-xs text-white">Kindle Oasis</span>
              <span className="opacity-40">•</span>
              <div className="flex items-center gap-1 font-mono text-[10px] text-emerald-300">
                <Wifi className="w-2.5 h-2.5 text-emerald-400" />
                <span>Wi-Fi</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <BookOpen className="w-3 h-3 text-emerald-400 opacity-80" />
              <span className="font-serif font-bold tracking-wider text-xs uppercase text-emerald-200">
                E-Book Folio
              </span>
              <span className="text-[10px] text-emerald-300/70">({books.length} tomes)</span>
            </div>

            <div className="flex items-center gap-1.5 text-[10px]">
              <span>100%</span>
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>

          {/* Shelves on Screen */}
          <div className="p-4 sm:p-8 space-y-8 min-h-[420px]">
            {shelves.map((shelfBooks, sIdx) => (
              <div key={sIdx} className="space-y-2">
                <div className="flex justify-around items-end gap-3 px-2">
                  {shelfBooks.map((book, bIdx) => (
                    <KindleTomeSpine
                      key={book.id}
                      book={book}
                      index={sIdx * 4 + bIdx}
                      onSelect={onSelectBook}
                    />
                  ))}
                  {shelfBooks.length === 0 && (
                    <div
                      onClick={onAddBook}
                      className="py-12 text-center text-xs text-emerald-300/70 cursor-pointer hover:text-emerald-200"
                    >
                      No e-books on your Kindle shelf. Tap here to add one.
                    </div>
                  )}
                </div>
                {/* Thin E-Ink Shelf Line */}
                <div className="w-full h-[2px] bg-emerald-500/30 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
              </div>
            ))}
          </div>

          {/* Bottom Toolbar */}
          <div className="px-6 py-2 border-t border-emerald-500/20 bg-[#072113]/70 flex justify-between items-center text-xs text-emerald-300">
            <span className="text-[11px] font-mono">Page 1 of {shelves.length}</span>
            <button
              onClick={onAddBook}
              className="flex items-center gap-1 px-3 py-1 rounded bg-emerald-700/40 hover:bg-emerald-600/60 text-emerald-100 text-xs font-medium border border-emerald-500/30 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add E-Book
            </button>
          </div>
        </div>

        {/* Bottom Logo */}
        <div className="text-center pt-3 pb-1">
          <span className="text-[11px] tracking-[0.3em] font-serif font-bold text-emerald-400/80 uppercase">
            amazon kindle
          </span>
        </div>
      </div>
    </div>
  );
}
