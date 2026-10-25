import React, { useState } from 'react';
import { useLife } from '../../context/LifeContext';
import {
  BookOpen,
  Plus,
  Trash2,
  Star,
  Quote,
  CheckCircle,
  Bookmark,
  BookMarked,
} from 'lucide-react';
import { Book, BookStatus } from '../../types';

export const BooksModule: React.FC = () => {
  const { state, addBook, updateBook, deleteBook } = useLife();
  const [activeTab, setActiveTab] = useState<BookStatus | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Book Form
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<BookStatus>('reading');
  const [totalPages, setTotalPages] = useState('300');
  const [currentPage, setCurrentPage] = useState('0');
  const [rating, setRating] = useState('5');
  const [coverUrl, setCoverUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [quoteInput, setQuoteInput] = useState('');

  const filteredBooks = state.books.filter((b) => {
    if (activeTab === 'all') return true;
    return b.status === activeTab;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    const quotes = quoteInput
      .split('\n')
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    addBook({
      title: title.trim(),
      author: author.trim(),
      status,
      totalPages: Math.max(1, parseInt(totalPages, 10) || 100),
      currentPage: Math.max(0, parseInt(currentPage, 10) || 0),
      rating: parseInt(rating, 10) || 5,
      coverUrl: coverUrl.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
      notes: notes.trim() || undefined,
      favoriteQuotes: quotes.length > 0 ? quotes : undefined,
    });

    setTitle('');
    setAuthor('');
    setCoverUrl('');
    setNotes('');
    setQuoteInput('');
    setShowAddModal(false);
  };

  const handleUpdatePage = (book: Book, newPage: number) => {
    const validPage = Math.min(book.totalPages, Math.max(0, newPage));
    const newStatus = validPage >= book.totalPages ? 'completed' : book.status;
    updateBook({
      ...book,
      currentPage: validPage,
      status: newStatus,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <span>Library</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Build your personal library, track page progress, and save meaningful quotes.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Book</span>
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/[0.06]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Currently Reading
          </span>
          <p className="text-2xl font-black text-white font-mono mt-1">
            {state.books.filter((b) => b.status === 'reading').length}
          </p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/[0.06]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Want to Read
          </span>
          <p className="text-2xl font-black text-white font-mono mt-1">
            {state.books.filter((b) => b.status === 'want_to_read').length}
          </p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/[0.06]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Completed
          </span>
          <p className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {state.books.filter((b) => b.status === 'completed').length}
          </p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/[0.06]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Total Library
          </span>
          <p className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {state.books.length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white bg-white/[0.03]'
          }`}
        >
          All ({state.books.length})
        </button>
        <button
          onClick={() => setActiveTab('reading')}
          className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
            activeTab === 'reading'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white bg-white/[0.03]'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" /> Reading
        </button>
        <button
          onClick={() => setActiveTab('want_to_read')}
          className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
            activeTab === 'want_to_read'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white bg-white/[0.03]'
          }`}
        >
          <BookMarked className="w-3.5 h-3.5" /> Want to Read
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
            activeTab === 'completed'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white bg-white/[0.03]'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" /> Finished
        </button>
      </div>

      {/* Book Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBooks.map((book) => {
          const progressPct = Math.min(100, Math.round((book.currentPage / book.totalPages) * 100));

          return (
            <div
              key={book.id}
              className="glass-panel p-5 rounded-2xl border border-white/[0.08] hover:border-white/[0.14] transition-all flex flex-col justify-between group"
            >
              <div className="flex gap-4">
                {/* Book Cover */}
                <div className="w-20 h-28 rounded-lg overflow-hidden shrink-0 border border-white/10 shadow-lg bg-slate-800">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Book Info */}
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {book.status.replace('_', ' ')}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1.5 truncate">{book.title}</h3>
                      <p className="text-xs text-slate-400">{book.author}</p>
                    </div>

                    <button
                      onClick={() => deleteBook(book.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                      title="Delete book"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Rating */}
                  {book.rating && (
                    <div className="flex items-center gap-0.5 mt-2 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < (book.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Reading Progress Bar & Quick Page Updater */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>Progress</span>
                      <span className="font-mono text-emerald-300 font-bold">{progressPct}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>
                        Page {book.currentPage} / {book.totalPages}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleUpdatePage(book, book.currentPage - 10)}
                          className="px-1.5 py-0.5 bg-white/[0.04] hover:bg-white/[0.08] rounded text-[10px] text-slate-300"
                        >
                          -10
                        </button>
                        <button
                          onClick={() => handleUpdatePage(book, book.currentPage + 10)}
                          className="px-1.5 py-0.5 bg-white/[0.04] hover:bg-white/[0.08] rounded text-[10px] text-slate-300"
                        >
                          +10
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quotes & Notes if present */}
              {(book.favoriteQuotes?.length || book.notes) && (
                <div className="mt-4 pt-3 border-t border-white/[0.05] space-y-2">
                  {book.favoriteQuotes && book.favoriteQuotes.length > 0 && (
                    <div className="flex items-start gap-2 text-xs text-slate-300 italic bg-white/[0.02] p-2 rounded-lg border border-white/[0.04]">
                      <Quote className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>"{book.favoriteQuotes[0]}"</span>
                    </div>
                  )}
                  {book.notes && (
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      <span className="text-slate-500 font-semibold">Notes:</span> {book.notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141f] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Add Book to Library</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Book Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sapiens: A Brief History of Humankind"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Author</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yuval Noah Harari"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  >
                    <option value="reading" className="bg-[#12141f]">Reading</option>
                    <option value="want_to_read" className="bg-[#12141f]">Want to Read</option>
                    <option value="completed" className="bg-[#12141f]">Completed</option>
                    <option value="on_hold" className="bg-[#12141f]">On Hold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Total Pages</label>
                  <input
                    type="number"
                    value={totalPages}
                    onChange={(e) => setTotalPages(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Current Page</label>
                  <input
                    type="number"
                    value={currentPage}
                    onChange={(e) => setCurrentPage(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Cover Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Favorite Quote (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Add a favorite passage or memorable line..."
                  value={quoteInput}
                  onChange={(e) => setQuoteInput(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-xl bg-white/[0.05] text-slate-300 hover:bg-white/[0.1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-medium shadow-md shadow-emerald-950/40"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
