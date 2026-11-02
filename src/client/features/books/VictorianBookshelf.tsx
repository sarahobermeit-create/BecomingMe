import { useState, useMemo } from "react";
import { RealisticRavenBookend } from "#client/components/RealisticRavenBookend.tsx";
import { BookshelfControls, type BookSortOption } from "#client/features/books/BookshelfControls.tsx";
import { VictorianBookSpine } from "#client/features/books/VictorianBookSpine.tsx";
import type { Book } from "#shared/books.ts";

interface Props {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onAddBook: () => void;
}

export function VictorianBookshelf({ books, onSelectBook, onAddBook }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<BookSortOption>("recent");
  const [currentPage, setCurrentPage] = useState(1);

  const booksPerShelf = 10;
  const shelvesPerPage = 3;
  const pageSize = booksPerShelf * shelvesPerPage;

  const filteredBooks = useMemo(() => {
    let result = books;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    }

    return [...result].sort((a, b) => {
      if (sortBy === "author") return a.author.localeCompare(b.author);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      return (b.sortOrder ?? 0) - (a.sortOrder ?? 0);
    });
  }, [books, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pagedBooks = filteredBooks.slice((safePage - 1) * pageSize, safePage * pageSize);

  const shelves: Book[][] = [];
  for (let i = 0; i < pagedBooks.length; i += booksPerShelf) {
    shelves.push(pagedBooks.slice(i, i + booksPerShelf));
  }
  if (shelves.length === 0) shelves.push([]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 py-2">
      <BookshelfControls
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        onSortChange={setSortBy}
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalFiltered={filteredBooks.length}
      />

      <div className="space-y-8">
        {shelves.map((shelfBooks, sIdx) => (
          <div key={sIdx} className="relative flex flex-col items-center">
            <div className="w-full flex items-end justify-center px-4 sm:px-8 overflow-x-auto no-scrollbar gap-1 sm:gap-2 min-h-[220px]">
              <RealisticRavenBookend flip={false} compact={true} />

              {shelfBooks.map((book, bIdx) => (
                <VictorianBookSpine
                  key={book.id}
                  book={book}
                  index={(safePage - 1) * pageSize + sIdx * booksPerShelf + bIdx}
                  onSelect={onSelectBook}
                />
              ))}

              {shelfBooks.length === 0 && (
                <div
                  onClick={onAddBook}
                  className="my-auto py-6 px-8 rounded-xl border border-dashed border-emerald-500/30 hover:border-emerald-400 cursor-pointer text-center text-xs text-slate-400 hover:text-emerald-300"
                >
                  {searchQuery ? `No tomes found matching "${searchQuery}"` : "Your library shelf is empty. Click here to add or import books."}
                </div>
              )}

              <RealisticRavenBookend flip={true} compact={true} />
            </div>

            {/* Heavy Victorian Oak Shelf Plank */}
            <div className="w-full relative">
              <div className="w-full h-3 sm:h-4 bg-gradient-to-r from-[#2c180e] via-[#482817] to-[#2c180e] rounded-t-sm border-t border-[#6b3c22]/50 shadow-[0_4px_10px_rgba(0,0,0,0.8)] wood-grain" />
              <div className="w-full h-6 sm:h-8 bg-gradient-to-b from-[#331b0f] via-[#24130a] to-[#120904] rounded-b border-b-2 border-black/80 shadow-[0_12px_24px_rgba(0,0,0,0.9)] flex items-center justify-between px-6">
                <span className="w-2 h-2 rounded-full bg-[#170c06] shadow-inner" />
                <div className="w-16 h-1 rounded-full bg-[#522c19]/30" />
                <span className="w-2 h-2 rounded-full bg-[#170c06] shadow-inner" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
