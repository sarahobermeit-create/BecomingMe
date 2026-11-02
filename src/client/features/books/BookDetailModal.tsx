import confetti from "canvas-confetti";
import { Check, Edit3, Headphones, Plus, Tablet, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useDeleteBook, useSaveBook } from "#client/features/books/books.api.ts";
import type { Book, BookStatus } from "#shared/books.ts";

interface Props {
  book: Book | null;
  onClose: () => void;
  onEdit: (book: Book) => void;
}

export function BookDetailModal({ book, onClose, onEdit }: Props) {
  const saveBook = useSaveBook();
  const { deleteBook } = useDeleteBook();
  const [newQuote, setNewQuote] = useState("");

  if (!book) return null;

  const isAudio = book.format === "audiobook";
  const total = isAudio ? book.audioDurationMinutes ?? 0 : book.totalPages;
  const current = isAudio ? book.currentAudioMinutes ?? 0 : book.currentPage;
  const progressPct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  const handleUpdateProgress = (newVal: number) => {
    const clamped = Math.max(0, Math.min(total || newVal, newVal));
    const isCompleted = total > 0 && clamped >= total;
    if (isCompleted && book.status !== "completed") {
      void confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }

    saveBook.mutate({
      ...book,
      currentPage: isAudio ? book.currentPage : clamped,
      currentAudioMinutes: isAudio ? clamped : book.currentAudioMinutes,
      status: isCompleted ? "completed" : book.status === "want_to_read" ? "reading" : book.status,
      finishDate: isCompleted ? new Date().toISOString().split("T")[0] : book.finishDate,
      deleted: false,
      changedAt: Date.now(),
    });
  };

  const handleStatusChange = (newStatus: BookStatus) => {
    if (newStatus === "completed" && book.status !== "completed") {
      void confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
    saveBook.mutate({
      ...book,
      status: newStatus,
      finishDate: newStatus === "completed" ? new Date().toISOString().split("T")[0] : undefined,
      deleted: false,
      changedAt: Date.now(),
    });
  };

  const handleAddQuote = () => {
    if (!newQuote.trim()) return;
    const quotes = [...(book.favoriteQuotes ?? []), newQuote.trim()];
    saveBook.mutate({
      ...book,
      favoriteQuotes: quotes,
      deleted: false,
      changedAt: Date.now(),
    });
    setNewQuote("");
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      deleteBook(book);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl glass-panel text-slate-100 shadow-2xl border border-emerald-500/30">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex gap-4">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-20 h-28 object-cover rounded-lg shadow-lg border border-white/10 shrink-0"
              />
            ) : (
              <div className="w-20 h-28 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center shrink-0">
                {book.format === "ebook" ? (
                  <Tablet className="w-8 h-8 text-emerald-400" />
                ) : book.format === "audiobook" ? (
                  <Headphones className="w-8 h-8 text-cyan-400" />
                ) : (
                  <span className="font-serif text-lg text-emerald-300 font-bold">📖</span>
                )}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold leading-tight">{book.title}</h2>
              <p className="text-sm text-slate-300 mt-0.5">by {book.author}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium capitalize">
                  {book.status.replace(/_/g, " ")}
                </span>
                <span className="text-xs text-slate-400 capitalize">{book.format ?? "physical"}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reading Progress */}
        <div className="my-5 p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-slate-300">
              {isAudio ? "Listening Progress" : "Reading Progress"} ({progressPct}%)
            </span>
            <span className="font-mono text-emerald-400">
              {current} / {total} {isAudio ? "mins" : "pages"}
            </span>
          </div>

          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${progressPct}%` }} />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-slate-400">Quick adjust:</span>
            <button
              onClick={() => handleUpdateProgress(current + 10)}
              className="px-2 py-1 text-xs font-semibold rounded bg-white/10 hover:bg-emerald-600 transition-colors"
            >
              +10
            </button>
            <button
              onClick={() => handleUpdateProgress(current + 25)}
              className="px-2 py-1 text-xs font-semibold rounded bg-white/10 hover:bg-emerald-600 transition-colors"
            >
              +25
            </button>
            <button
              onClick={() => handleUpdateProgress(current + 50)}
              className="px-2 py-1 text-xs font-semibold rounded bg-white/10 hover:bg-emerald-600 transition-colors"
            >
              +50
            </button>
            <button
              onClick={() => handleUpdateProgress(total)}
              className="ml-auto flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-emerald-700/50 hover:bg-emerald-600 text-emerald-200 border border-emerald-500/40"
            >
              <Check className="w-3.5 h-3.5" /> Mark Finished
            </button>
          </div>
        </div>

        {/* Status Selector */}
        <div className="my-4">
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Change Status</label>
          <div className="flex flex-wrap gap-2 text-xs">
            {(["reading", "want_to_read", "completed", "on_hold", "dnf"] as BookStatus[]).map((st) => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                className={`px-3 py-1.5 rounded-lg border font-medium capitalize transition-all ${
                  book.status === st
                    ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/50"
                    : "bg-white/[0.03] text-slate-400 border-white/10 hover:bg-white/[0.08]"
                }`}
              >
                {st.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Favorite Quotes */}
        <div className="my-4">
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Favorite Quotes</label>
          <div className="space-y-2">
            {(book.favoriteQuotes ?? []).map((quote, idx) => (
              <div
                key={idx}
                className="p-3 text-xs italic font-serif text-slate-200 rounded-lg bg-emerald-950/20 border border-emerald-500/20"
              >
                "{quote}"
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={newQuote}
                onChange={(e) => setNewQuote(e.target.value)}
                placeholder="Add a favorite passage..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg glass-input"
              />
              <button
                type="button"
                onClick={handleAddQuote}
                className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Notes */}
        {book.notes && (
          <div className="my-4">
            <label className="block text-xs font-medium text-slate-400 mb-1">Notes & Summary</label>
            <p className="p-3 text-xs text-slate-300 rounded-lg bg-white/[0.02] border border-white/10 whitespace-pre-wrap">
              {book.notes}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-6">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-950/30"
          >
            <Trash2 className="w-4 h-4" /> Delete Book
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onEdit(book);
                onClose();
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-200 bg-white/10 hover:bg-white/15 rounded-lg"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Details
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
