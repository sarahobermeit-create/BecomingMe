import { BookOpen, Headphones, Library, Tablet } from "lucide-react";
import { useState } from "react";
import { QueryBoundary } from "#client/components/QueryBoundary.tsx";
import { BookCsvImporterModal } from "#client/features/books/BookCsvImporterModal.tsx";
import { BookDetailModal } from "#client/features/books/BookDetailModal.tsx";
import { BookFormModal } from "#client/features/books/BookFormModal.tsx";
import { BooksStatsHeader } from "#client/features/books/BooksStatsHeader.tsx";
import { GiantKindleLibrary } from "#client/features/books/GiantKindleLibrary.tsx";
import { PhoneAudiobookLibrary } from "#client/features/books/PhoneAudiobookLibrary.tsx";
import { VictorianBookshelf } from "#client/features/books/VictorianBookshelf.tsx";
import { useBooks } from "#client/features/books/books.api.ts";
import type { Book } from "#shared/books.ts";

type ViewMode = "bookshelf" | "kindle" | "audiobook" | "reading";

export function BooksPage() {
  const booksQuery = useBooks();
  const [viewMode, setViewMode] = useState<ViewMode>("bookshelf");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      <QueryBoundary query={booksQuery}>
        {(books) => {
          const readingBooks = books.filter((b) => b.status === "reading");
          const ebookBooks = books.filter((b) => b.format === "ebook");
          const audioBooks = books.filter((b) => b.format === "audiobook");

          return (
            <>
              <BooksStatsHeader
                books={books}
                onOpenAdd={() => setIsAddOpen(true)}
                onOpenImport={() => setIsImportOpen(true)}
              />

              {/* View Selector Tabs */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex flex-wrap gap-2 text-xs font-medium">
                  <button
                    onClick={() => setViewMode("bookshelf")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                      viewMode === "bookshelf"
                        ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/60"
                        : "bg-white/[0.03] text-slate-400 border-white/10 hover:text-white"
                    }`}
                  >
                    <Library className="w-3.5 h-3.5" />
                    <span>Victorian Shelves</span>
                  </button>
                  <button
                    onClick={() => setViewMode("reading")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                      viewMode === "reading"
                        ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/60"
                        : "bg-white/[0.03] text-slate-400 border-white/10 hover:text-white"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Currently Reading ({readingBooks.length})</span>
                  </button>
                  <button
                    onClick={() => setViewMode("kindle")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                      viewMode === "kindle"
                        ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/60"
                        : "bg-white/[0.03] text-slate-400 border-white/10 hover:text-white"
                    }`}
                  >
                    <Tablet className="w-3.5 h-3.5" />
                    <span>Kindle Oasis ({ebookBooks.length})</span>
                  </button>
                  <button
                    onClick={() => setViewMode("audiobook")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                      viewMode === "audiobook"
                        ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/60"
                        : "bg-white/[0.03] text-slate-400 border-white/10 hover:text-white"
                    }`}
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Audiobooks ({audioBooks.length})</span>
                  </button>
                </div>
              </div>

              {/* View Render Area */}
              {viewMode === "bookshelf" && (
                <VictorianBookshelf
                  books={books}
                  onSelectBook={setSelectedBook}
                  onAddBook={() => setIsAddOpen(true)}
                />
              )}

              {viewMode === "reading" && (
                <VictorianBookshelf
                  books={readingBooks.length > 0 ? readingBooks : books}
                  onSelectBook={setSelectedBook}
                  onAddBook={() => setIsAddOpen(true)}
                />
              )}

              {viewMode === "kindle" && (
                <GiantKindleLibrary
                  books={ebookBooks.length > 0 ? ebookBooks : books}
                  onSelectBook={setSelectedBook}
                  onAddBook={() => setIsAddOpen(true)}
                />
              )}

              {viewMode === "audiobook" && (
                <PhoneAudiobookLibrary
                  books={audioBooks.length > 0 ? audioBooks : books}
                  onSelectBook={setSelectedBook}
                  onAddBook={() => setIsAddOpen(true)}
                />
              )}

              {/* Modals */}
              <BookDetailModal
                book={selectedBook}
                onClose={() => setSelectedBook(null)}
                onEdit={(b) => setEditingBook(b)}
              />

              <BookFormModal
                isOpen={isAddOpen || editingBook !== undefined}
                initialBook={editingBook}
                onClose={() => {
                  setIsAddOpen(false);
                  setEditingBook(undefined);
                }}
              />

              <BookCsvImporterModal
                isOpen={isImportOpen}
                onClose={() => setIsImportOpen(false)}
              />
            </>
          );
        }}
      </QueryBoundary>
    </div>
  );
}
