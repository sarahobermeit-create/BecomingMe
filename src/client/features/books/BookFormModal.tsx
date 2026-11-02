import { Loader2, Search, X } from "lucide-react";
import { useState } from "react";
import { lookupBookByIsbn, searchBooksOnline, useSaveBook } from "#client/features/books/books.api.ts";
import type { Book, BookFormat, BookStatus, BookWrite, ExternalBookInfo } from "#shared/books.ts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialBook?: Book;
}

export function BookFormModal({ isOpen, onClose, initialBook }: Props) {
  const saveBook = useSaveBook();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ExternalBookInfo[]>([]);

  const [title, setTitle] = useState(initialBook?.title ?? "");
  const [author, setAuthor] = useState(initialBook?.author ?? "");
  const [format, setFormat] = useState<BookFormat>(initialBook?.format ?? "physical");
  const [status, setStatus] = useState<BookStatus>(initialBook?.status ?? "want_to_read");
  const [totalPages, setTotalPages] = useState(initialBook?.totalPages ?? 0);
  const [currentPage, setCurrentPage] = useState(initialBook?.currentPage ?? 0);
  const [audioDurationMinutes, setAudioDurationMinutes] = useState(initialBook?.audioDurationMinutes ?? 0);
  const [currentAudioMinutes, setCurrentAudioMinutes] = useState(initialBook?.currentAudioMinutes ?? 0);
  const [coverUrl, setCoverUrl] = useState(initialBook?.coverUrl ?? "");
  const [rating, setRating] = useState(initialBook?.rating ?? 0);
  const [notes, setNotes] = useState(initialBook?.notes ?? "");

  if (!isOpen) return null;

  const handleSearchOnline = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const cleanIsbn = searchQuery.trim().replace(/[^0-9X]/gi, "");
      if (cleanIsbn.length === 10 || cleanIsbn.length === 13) {
        const item = await lookupBookByIsbn(cleanIsbn);
        applyExternalBook(item);
      } else {
        const items = await searchBooksOnline(searchQuery);
        setSearchResults(items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const applyExternalBook = (item: ExternalBookInfo) => {
    setTitle(item.title);
    setAuthor(item.author);
    if (item.totalPages) setTotalPages(item.totalPages);
    if (item.coverUrl) setCoverUrl(item.coverUrl);
    if (item.description && !notes) setNotes(item.description);
    setSearchResults([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const write: BookWrite = {
      id: initialBook?.id ?? crypto.randomUUID(),
      title: title.trim(),
      author: author.trim() || "Unknown Author",
      status,
      format,
      totalPages: Number(totalPages) || 0,
      currentPage: Number(currentPage) || 0,
      audioDurationMinutes: format === "audiobook" ? Number(audioDurationMinutes) || 0 : undefined,
      currentAudioMinutes: format === "audiobook" ? Number(currentAudioMinutes) || 0 : undefined,
      rating: rating > 0 ? rating : undefined,
      coverUrl: coverUrl.trim() || undefined,
      notes: notes.trim() || undefined,
      deleted: false,
      changedAt: Date.now(),
    };

    saveBook.mutate(write);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-2xl glass-panel text-slate-100 shadow-2xl border border-emerald-500/30">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h2 className="text-lg font-bold">{initialBook ? "Edit Book" : "Add New Book"}</h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Online Search / ISBN Helper */}
        <div className="my-4 p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
          <label className="text-xs font-semibold text-emerald-400">Search online by Title or ISBN</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. 9780141439518 or Pride and Prejudice"
              className="flex-1 px-3 py-1.5 text-xs rounded-lg glass-input"
            />
            <button
              type="button"
              onClick={() => void handleSearchOnline()}
              disabled={isSearching}
              className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1 disabled:opacity-50"
            >
              {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              Find
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-2 space-y-1.5 max-h-36 overflow-y-auto">
              {searchResults.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => applyExternalBook(item)}
                  className="p-2 text-xs rounded bg-white/[0.04] hover:bg-emerald-950/40 border border-white/5 hover:border-emerald-500/30 cursor-pointer flex justify-between"
                >
                  <span className="font-semibold text-slate-200 truncate max-w-[70%]">{item.title}</span>
                  <span className="text-slate-400 truncate max-w-[25%]">{item.author}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg glass-input"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg glass-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as BookFormat)}
                className="w-full px-3 py-2 text-sm rounded-lg glass-input"
              >
                <option value="physical">Physical Book</option>
                <option value="ebook">E-Book (Kindle)</option>
                <option value="audiobook">Audiobook</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BookStatus)}
                className="w-full px-3 py-2 text-sm rounded-lg glass-input"
              >
                <option value="want_to_read">Want to Read</option>
                <option value="reading">Currently Reading</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
                <option value="dnf">Did Not Finish</option>
              </select>
            </div>
          </div>

          {format === "audiobook" ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Total Minutes</label>
                <input
                  type="number"
                  min="0"
                  value={audioDurationMinutes}
                  onChange={(e) => setAudioDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Minutes Listened</label>
                <input
                  type="number"
                  min="0"
                  value={currentAudioMinutes}
                  onChange={(e) => setCurrentAudioMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Total Pages</label>
                <input
                  type="number"
                  min="0"
                  value={totalPages}
                  onChange={(e) => setTotalPages(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Current Page</label>
                <input
                  type="number"
                  min="0"
                  value={currentPage}
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Rating (1 to 5)</label>
            <input
              type="number"
              min="0"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-lg glass-input"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Cover Image URL</label>
            <input
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm rounded-lg glass-input"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Notes / Review</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg glass-input"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveBook.isPending}
              className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-lg shadow-emerald-900/40"
            >
              {initialBook ? "Save Changes" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
