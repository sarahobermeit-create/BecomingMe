import { RealisticRavenBookend } from "#client/components/RealisticRavenBookend.tsx";
import { VictorianBookSpine } from "#client/features/books/VictorianBookSpine.tsx";
import type { Book } from "#shared/books.ts";

interface Props {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onAddBook: () => void;
}

export function VictorianBookshelf({ books, onSelectBook, onAddBook }: Props) {
  // Chunk books onto shelves (e.g. 10-14 per shelf)
  const booksPerShelf = 12;
  const shelves: Book[][] = [];
  for (let i = 0; i < books.length; i += booksPerShelf) {
    shelves.push(books.slice(i, i + booksPerShelf));
  }
  if (shelves.length === 0) shelves.push([]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 py-4">
      {shelves.map((shelfBooks, sIdx) => (
        <div key={sIdx} className="relative flex flex-col items-center">
          {/* Books Lineup on Shelf */}
          <div className="w-full flex items-end justify-center px-4 sm:px-8 overflow-x-auto no-scrollbar gap-1 sm:gap-2 min-h-[220px]">
            {/* Left Raven Bookend */}
            <RealisticRavenBookend flip={false} compact={true} />

            {/* Books in this shelf */}
            {shelfBooks.map((book, bIdx) => (
              <VictorianBookSpine
                key={book.id}
                book={book}
                index={sIdx * booksPerShelf + bIdx}
                onSelect={onSelectBook}
              />
            ))}

            {/* Empty shelf invite */}
            {shelfBooks.length === 0 && (
              <div
                onClick={onAddBook}
                className="my-auto py-6 px-8 rounded-xl border border-dashed border-emerald-500/30 hover:border-emerald-400 cursor-pointer text-center text-xs text-slate-400 hover:text-emerald-300"
              >
                Your library shelf is empty. Click here to add or import your books.
              </div>
            )}

            {/* Right Raven Bookend */}
            <RealisticRavenBookend flip={true} compact={true} />
          </div>

          {/* Heavy Victorian Oak Shelf Plank */}
          <div className="w-full relative">
            {/* Shelf Top Edge with warm wood grain highlight */}
            <div className="w-full h-3 sm:h-4 bg-gradient-to-r from-[#2c180e] via-[#482817] to-[#2c180e] rounded-t-sm border-t border-[#6b3c22]/50 shadow-[0_4px_10px_rgba(0,0,0,0.8)] wood-grain" />
            {/* Shelf Front Face with deep shadow */}
            <div className="w-full h-6 sm:h-8 bg-gradient-to-b from-[#331b0f] via-[#24130a] to-[#120904] rounded-b border-b-2 border-black/80 shadow-[0_12px_24px_rgba(0,0,0,0.9)] flex items-center justify-between px-6">
              <span className="w-2 h-2 rounded-full bg-[#170c06] shadow-inner" />
              <div className="w-16 h-1 rounded-full bg-[#522c19]/30" />
              <span className="w-2 h-2 rounded-full bg-[#170c06] shadow-inner" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
