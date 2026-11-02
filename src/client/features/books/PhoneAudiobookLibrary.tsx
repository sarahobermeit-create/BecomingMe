import { Battery, Headphones, Plus, Wifi } from "lucide-react";
import { useState } from "react";
import { AudiobookPlayerDock } from "#client/features/books/AudiobookPlayerDock.tsx";
import { AudiobookTomeSpine } from "#client/features/books/AudiobookTomeSpine.tsx";
import { useSaveBook } from "#client/features/books/books.api.ts";
import type { Book } from "#shared/books.ts";

interface Props {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onAddBook: () => void;
}

export function PhoneAudiobookLibrary({ books, onSelectBook, onAddBook }: Props) {
  const saveBook = useSaveBook();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const activeBook = books.find((b) => b.id === playingId) ?? books[0] ?? null;

  const handleTogglePlay = (e: React.MouseEvent, bookId: string) => {
    e.stopPropagation();
    setPlayingId(playingId === bookId ? null : bookId);
  };

  const handleForward = (mins: number) => {
    if (!activeBook) return;
    const cur = activeBook.currentAudioMinutes ?? 0;
    const total = activeBook.audioDurationMinutes ?? 600;
    const nextVal = Math.max(0, Math.min(total, cur + mins));
    saveBook.mutate({
      ...activeBook,
      currentAudioMinutes: nextVal,
      deleted: false,
      changedAt: Date.now(),
    });
  };

  return (
    <div className="w-full max-w-md mx-auto py-4">
      {/* Phone Chassis */}
      <div className="relative rounded-[40px] bg-gradient-to-b from-[#14231b] via-[#0e1913] to-[#070e0a] p-3 sm:p-4 border-4 border-[#244131] shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
        {/* Dynamic Island / Notch */}
        <div className="flex justify-center mb-2">
          <div className="w-24 h-4 rounded-full bg-black/90 flex items-center justify-between px-3">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#1b3826] border border-emerald-500/40" />
          </div>
        </div>

        {/* Screen Status Bar */}
        <div className="flex items-center justify-between px-4 py-1 text-[11px] text-slate-400 font-mono">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3 text-emerald-400" />
            <Battery className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Screen Header */}
        <div className="px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white tracking-wide uppercase">Audiobooks</span>
          </div>
          <button
            onClick={onAddBook}
            className="p-1 rounded-full bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Audiobook Grid */}
        <div className="p-2 sm:p-3 grid grid-cols-3 gap-2 sm:gap-3 min-h-[300px] max-h-[460px] overflow-y-auto no-scrollbar">
          {books.map((book, idx) => (
            <AudiobookTomeSpine
              key={book.id}
              book={book}
              index={idx}
              isPlaying={playingId === book.id}
              onSelect={onSelectBook}
              onTogglePlay={(e) => handleTogglePlay(e, book.id)}
            />
          ))}
          {books.length === 0 && (
            <div
              onClick={onAddBook}
              className="col-span-3 py-16 text-center text-xs text-slate-400 hover:text-emerald-300 cursor-pointer"
            >
              No audiobooks yet. Tap here to add one.
            </div>
          )}
        </div>

        {/* Bottom Audio Player Dock */}
        {activeBook && (
          <div className="mt-3">
            <AudiobookPlayerDock
              book={activeBook}
              isPlaying={playingId === activeBook.id}
              onTogglePlay={() => setPlayingId(playingId === activeBook.id ? null : activeBook.id)}
              onForward={handleForward}
            />
          </div>
        )}
      </div>
    </div>
  );
}
