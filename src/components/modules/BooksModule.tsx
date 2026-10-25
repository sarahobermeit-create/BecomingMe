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
  Sparkles,
  Sliders,
  X,
  ChevronRight,
  BookCheck,
  Library,
} from 'lucide-react';
import { Book, BookStatus } from '../../types';

type LibraryTab = 'bookshelf' | 'all' | 'reading' | 'want_to_read' | 'completed';

// Victorian leather spine color palettes
const SPINE_PALETTES = [
  {
    gradient: 'from-[#450a11] via-[#6b1622] to-[#33050b]',
    border: '#7a1b28',
    rib: '#e6b325',
    ribbon: '#ef4444',
    name: 'Crimson Leather',
  },
  {
    gradient: 'from-[#0d331d] via-[#17522f] to-[#082413]',
    border: '#1f6e3f',
    rib: '#d4af37',
    ribbon: '#10b981',
    name: 'Hunter Green',
  },
  {
    gradient: 'from-[#0f1f3d] via-[#1b3668] to-[#0a152b]',
    border: '#284c8f',
    rib: '#dfb73c',
    ribbon: '#3b82f6',
    name: 'Midnight Navy',
  },
  {
    gradient: 'from-[#3e2311] via-[#5c351b] to-[#2b170a]',
    border: '#784624',
    rib: '#f0c75e',
    ribbon: '#f59e0b',
    name: 'Saddle Tan',
  },
  {
    gradient: 'from-[#300f36] via-[#4f1a58] to-[#200924]',
    border: '#6f267c',
    rib: '#deb643',
    ribbon: '#a855f7',
    name: 'Imperial Plum',
  },
  {
    gradient: 'from-[#222527] via-[#333b3d] to-[#171a1b]',
    border: '#455052',
    rib: '#d1ab38',
    ribbon: '#94a3b8',
    name: 'Victorian Slate',
  },
];

export const BooksModule: React.FC = () => {
  const { state, addBook, updateBook, deleteBook } = useLife();
  const [activeTab, setActiveTab] = useState<LibraryTab>('bookshelf');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // New Book Form
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<BookStatus>('reading');
  const [totalPages, setTotalPages] = useState('320');
  const [currentPage, setCurrentPage] = useState('0');
  const [rating, setRating] = useState('5');
  const [coverUrl, setCoverUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [quoteInput, setQuoteInput] = useState('');

  // Inspection modal quote addition state
  const [newQuoteText, setNewQuoteText] = useState('');

  const filteredBooks = state.books.filter((b) => {
    if (activeTab === 'all' || activeTab === 'bookshelf') return true;
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
    const updated = {
      ...book,
      currentPage: validPage,
      status: newStatus,
    };
    updateBook(updated);
    if (selectedBook && selectedBook.id === book.id) {
      setSelectedBook(updated);
    }
  };

  const handleUpdateStatus = (book: Book, newStatus: BookStatus) => {
    let newCurrentPage = book.currentPage;
    if (newStatus === 'completed' && book.currentPage < book.totalPages) {
      newCurrentPage = book.totalPages;
    }
    const updated = {
      ...book,
      status: newStatus,
      currentPage: newCurrentPage,
    };
    updateBook(updated);
    if (selectedBook && selectedBook.id === book.id) {
      setSelectedBook(updated);
    }
  };

  const handleAddInspectionQuote = () => {
    if (!selectedBook || !newQuoteText.trim()) return;
    const existingQuotes = selectedBook.favoriteQuotes || [];
    const updated = {
      ...selectedBook,
      favoriteQuotes: [...existingQuotes, newQuoteText.trim()],
    };
    updateBook(updated);
    setSelectedBook(updated);
    setNewQuoteText('');
  };

  // Helper to chunk books into realistic shelves (up to 6 per shelf)
  const chunkShelves = (books: Book[], size: number = 6) => {
    const shelves: Book[][] = [];
    for (let i = 0; i < books.length; i += size) {
      shelves.push(books.slice(i, i + size));
    }
    if (shelves.length === 0) {
      shelves.push([]); // At least one empty shelf
    }
    return shelves;
  };

  const shelves = chunkShelves(state.books, 6);

  // Consistent palette generator for each book based on id/title
  const getBookPalette = (book: Book, index: number) => {
    const hash = (book.id + book.title).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return SPINE_PALETTES[(hash + index) % SPINE_PALETTES.length];
  };

  // Height variation for book spine realism (210px to 248px)
  const getBookHeight = (book: Book) => {
    const hash = (book.id + book.title).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 210 + (hash % 38);
  };

  // Thickness variation based on pages
  const getBookWidth = (book: Book) => {
    return Math.min(54, Math.max(38, Math.round(book.totalPages / 7)));
  };

  return (
    <div className="relative space-y-6">
      {/* Compact Atmospheric Victorian Header */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 p-4 sm:p-5 bg-[#06140b]/35 backdrop-blur-sm shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/25 text-[11px] font-medium text-emerald-300 mb-1.5">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Victorian Sanctuary</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              <span>Welcome To Your Library</span>
            </h2>
            <p className="text-[11px] text-emerald-100/70 mt-1 max-w-lg leading-relaxed">
              Warm hearth fire crackling, rain pouring against the arched glass, and floor-to-ceiling shelves of timeless stories.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-700/85 hover:bg-emerald-600 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/50 transition-all shrink-0 self-start sm:self-auto border border-emerald-400/25 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Book</span>
          </button>
        </div>
      </div>

      {/* Translucent Stats bar with Clickable Total Library Button */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Box 1: Currently Reading */}
        <button
          onClick={() => setActiveTab('reading')}
          className={`p-3.5 rounded-xl text-left bg-[#06140b]/35 backdrop-blur-sm border transition-all shadow-lg hover:border-emerald-500/40 cursor-pointer ${
            activeTab === 'reading'
              ? 'border-emerald-400/60 ring-1 ring-emerald-400/30 bg-[#092212]/50'
              : 'border-emerald-500/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
              Currently Reading
            </span>
            <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-xl font-black text-white font-mono mt-0.5">
            {state.books.filter((b) => b.status === 'reading').length}
          </p>
        </button>

        {/* Box 2: Next Reads (Renamed from Want to Read) */}
        <button
          onClick={() => setActiveTab('want_to_read')}
          className={`p-3.5 rounded-xl text-left bg-[#06140b]/35 backdrop-blur-sm border transition-all shadow-lg hover:border-amber-400/40 cursor-pointer ${
            activeTab === 'want_to_read'
              ? 'border-amber-400/60 ring-1 ring-amber-400/30 bg-[#221808]/50'
              : 'border-emerald-500/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
              Next Reads
            </span>
            <BookMarked className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-xl font-black text-amber-300 font-mono mt-0.5">
            {state.books.filter((b) => b.status === 'want_to_read').length}
          </p>
        </button>

        {/* Box 3: Completed */}
        <button
          onClick={() => setActiveTab('completed')}
          className={`p-3.5 rounded-xl text-left bg-[#06140b]/35 backdrop-blur-sm border transition-all shadow-lg hover:border-emerald-500/40 cursor-pointer ${
            activeTab === 'completed'
              ? 'border-emerald-400/60 ring-1 ring-emerald-400/30 bg-[#092212]/50'
              : 'border-emerald-500/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
              Completed
            </span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-xl font-black text-emerald-400 font-mono mt-0.5">
            {state.books.filter((b) => b.status === 'completed').length}
          </p>
        </button>

        {/* Box 4: Total Library - Clickable button that opens Victorian Bookshelf */}
        <button
          onClick={() => setActiveTab('bookshelf')}
          className={`p-3.5 rounded-xl text-left transition-all shadow-xl group relative overflow-hidden border cursor-pointer ${
            activeTab === 'bookshelf'
              ? 'bg-gradient-to-br from-[#1b3b27]/85 to-[#0b1c11]/90 border-emerald-400 ring-2 ring-emerald-400/40 shadow-emerald-950/60'
              : 'bg-[#06140b]/45 backdrop-blur-md border-emerald-500/30 hover:border-emerald-400 hover:bg-[#0a2013]/60 hover:shadow-emerald-900/30'
          }`}
          title="Click to view all books sitting on the Victorian wooden bookshelves"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
              <span>Total Library</span>
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/25 text-emerald-200 border border-emerald-400/30 font-semibold group-hover:bg-emerald-500/35 transition-colors">
              Bookshelf 🪵
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <p className="text-xl font-black text-emerald-300 font-mono">
              {state.books.length}
            </p>
            <span className="text-[10px] text-emerald-200/80 group-hover:text-emerald-100 flex items-center gap-0.5 font-medium">
              View Shelves →
            </span>
          </div>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setActiveTab('bookshelf')}
          className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'bookshelf'
              ? 'bg-gradient-to-r from-emerald-800 to-emerald-700 text-white border border-emerald-400/40 shadow-lg shadow-emerald-950/40'
              : 'text-emerald-200/80 hover:text-white bg-[#06140b]/40 border border-emerald-500/20 hover:border-emerald-500/40'
          }`}
        >
          <Library className="w-3.5 h-3.5 text-emerald-300" />
          <span>Victorian Bookshelf</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px] font-mono text-emerald-200">
            {state.books.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'all'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white bg-[#06140b]/30 border border-emerald-500/10'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> All Cards ({state.books.length})
        </button>

        <button
          onClick={() => setActiveTab('reading')}
          className={`px-3.5 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'reading'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white bg-[#06140b]/30 border border-emerald-500/10'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 text-emerald-400" /> Reading ({state.books.filter((b) => b.status === 'reading').length})
        </button>

        <button
          onClick={() => setActiveTab('want_to_read')}
          className={`px-3.5 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'want_to_read'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white bg-[#06140b]/30 border border-emerald-500/10'
          }`}
        >
          <BookMarked className="w-3.5 h-3.5 text-amber-400" /> Next Reads ({state.books.filter((b) => b.status === 'want_to_read').length})
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-3.5 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white bg-[#06140b]/30 border border-emerald-500/10'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Completed ({state.books.filter((b) => b.status === 'completed').length})
        </button>
      </div>

      {/* VIEW 1: VICTORIAN BOOKSHELVES VIEW */}
      {activeTab === 'bookshelf' && (
        <div className="relative rounded-2xl border-2 border-[#5a3219]/60 shadow-2xl overflow-hidden bg-gradient-to-b from-[#180d07] via-[#100703] to-[#0a0402]">
          {/* Top Arch Bookcase Header with Brass Plaque */}
          <div className="relative px-4 py-3 bg-gradient-to-r from-[#2a1308] via-[#4a2412] to-[#2a1308] border-b border-[#734020]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-3">
              {/* Antique Engraved Brass Plaque */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded bg-gradient-to-r from-[#b8860b] via-[#f5d77f] to-[#aa771c] text-[#241305] shadow-md border border-[#7a5410]">
                <span className="text-[10px] font-serif font-black tracking-widest uppercase">
                  Victorian Library • Master Collection
                </span>
              </div>
              <span className="text-[11px] text-amber-200/70 font-serif italic hidden md:inline">
                Click any tome to pull it from the shelf
              </span>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto text-[11px] text-amber-100/80">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                <span>Reading</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                <span>Next Read</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-300 inline-block shadow-[0_0_6px_rgba(253,224,71,0.8)]" />
                <span>Completed</span>
              </span>
            </div>
          </div>

          {/* Shelves Container */}
          <div className="p-3 sm:p-6 space-y-10 victorian-wood-panel relative">
            {/* Ambient warm candlelight background glow */}
            <div className="absolute top-1/4 right-8 w-72 h-72 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 left-8 w-72 h-72 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

            {shelves.map((shelfBooks, shelfIdx) => (
              <div key={shelfIdx} className="relative">
                {/* Book Spines Row sitting on the shelf */}
                <div className="relative flex items-end px-2 sm:px-6 min-h-[255px] overflow-x-auto no-scrollbar gap-3 sm:gap-4.5 pb-0">
                  {/* Left Carved Bronze Bookend */}
                  <div className="shrink-0 flex flex-col items-center justify-end mr-1 select-none pointer-events-none pb-0">
                    <div className="w-5 sm:w-6 h-28 sm:h-32 rounded-t-lg bg-gradient-to-r from-[#4d3215] via-[#8f642a] to-[#38230c] border border-[#a87a38]/40 shadow-lg flex flex-col items-center justify-center p-0.5">
                      <div className="w-full h-full rounded border border-dashed border-amber-300/30 flex items-center justify-center">
                        <span className="text-[9px] font-serif text-amber-200/70 writing-mode-vertical">
                          ARCHIVE
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Books on this shelf */}
                  {shelfBooks.map((book, bookIdx) => {
                    const palette = getBookPalette(book, bookIdx);
                    const bookHeight = getBookHeight(book);
                    const bookWidth = getBookWidth(book);
                    const progressPct = Math.min(100, Math.round((book.currentPage / book.totalPages) * 100));

                    return (
                      <div
                        key={book.id}
                        onClick={() => setSelectedBook(book)}
                        style={{
                          height: `${bookHeight}px`,
                          width: `${bookWidth}px`,
                        }}
                        className={`group relative shrink-0 cursor-pointer rounded-t-md transition-all duration-300 ease-out hover:-translate-y-4 hover:scale-[1.03] select-none shadow-[2px_6px_14px_rgba(0,0,0,0.85)] hover:shadow-[0_20px_35px_rgba(0,0,0,0.95),0_0_24px_rgba(245,158,11,0.45)] bg-gradient-to-r ${palette.gradient} flex flex-col justify-between p-1.5 border-t border-x border-[${palette.border}] z-10 hover:z-30`}
                      >
                        {/* 3D Cylindrical Spine Shading & Leather Texture */}
                        <div className="absolute inset-0 rounded-t-md pointer-events-none shadow-[inset_3px_0_4px_rgba(255,255,255,0.22),inset_-4px_0_6px_rgba(0,0,0,0.7)] wood-grain opacity-40" />

                        {/* Top Gilt Filigree Band & Status Emblem */}
                        <div className="relative z-10 flex flex-col items-center">
                          {/* Top Rib */}
                          <div className="w-full h-1 bg-gradient-to-r from-amber-600/60 via-amber-300 to-amber-600/60 rounded shadow-sm border-y border-amber-950/70 mb-1" />

                          {/* Status Marker at top of spine */}
                          {book.status === 'reading' && (
                            <div
                              className="w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-emerald-300/60 shadow-[0_0_10px_rgba(52,211,153,0.95)] flex items-center justify-center my-0.5"
                              title={`Currently reading (${progressPct}%)`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            </div>
                          )}
                          {book.status === 'completed' && (
                            <div
                              className="w-3.5 h-3.5 rounded-full bg-amber-400 ring-1 ring-amber-300/80 shadow-[0_0_8px_rgba(245,158,11,0.9)] flex items-center justify-center my-0.5 text-[#2b1807] font-bold text-[8px]"
                              title="Completed"
                            >
                              ★
                            </div>
                          )}
                          {book.status === 'want_to_read' && (
                            <div
                              className="w-3.5 h-3.5 rounded-full bg-amber-600/80 ring-1 ring-amber-400/50 shadow-[0_0_6px_rgba(217,119,6,0.8)] flex items-center justify-center my-0.5 text-amber-200 text-[8px]"
                              title="Next Read"
                            >
                              ✦
                            </div>
                          )}

                          {/* Mid-top Rib */}
                          <div className="w-full h-1 bg-gradient-to-r from-amber-600/60 via-amber-300 to-amber-600/60 rounded shadow-sm border-y border-amber-950/70 mt-1" />
                        </div>

                        {/* Gold Foil Embossed Title down the Spine */}
                        <div className="relative z-10 flex-1 flex items-center justify-center overflow-hidden my-1">
                          <span className="writing-mode-vertical font-serif font-bold text-amber-100/90 tracking-wide text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] max-h-[140px] truncate leading-tight">
                            {book.title}
                          </span>
                        </div>

                        {/* Lower Bands & Author */}
                        <div className="relative z-10 flex flex-col items-center">
                          {/* Lower Mid Rib */}
                          <div className="w-full h-1 bg-gradient-to-r from-amber-600/60 via-amber-300 to-amber-600/60 rounded shadow-sm border-y border-amber-950/70 mb-1" />

                          {/* Author in gold foil */}
                          <span className="writing-mode-vertical font-serif text-[9px] text-amber-300/75 tracking-wider truncate max-h-[45px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
                            {book.author}
                          </span>

                          {/* Bottom Rib */}
                          <div className="w-full h-1 bg-gradient-to-r from-amber-600/60 via-amber-300 to-amber-600/60 rounded shadow-sm border-y border-amber-950/70 mt-1" />
                        </div>

                        {/* Silk Bookmark Ribbon dangling over the shelf plank */}
                        <div
                          style={{ backgroundColor: palette.ribbon }}
                          className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-3.5 h-5 shadow-md z-20 pointer-events-none transition-transform group-hover:translate-y-1"
                        >
                          {/* Swallowtail ribbon cut */}
                          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#120703] [clip-path:polygon(0_100%,50%_0,100%_100%)]" />
                        </div>

                        {/* Hover Tooltip / Floating Card Preview */}
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap bg-[#0b1c11]/95 text-white text-[11px] px-3 py-1.5 rounded-lg border border-emerald-400/50 shadow-2xl backdrop-blur-md flex items-center gap-2">
                          <span className="font-serif font-bold text-amber-200">{book.title}</span>
                          <span className="text-emerald-300/80 font-mono text-[10px]">
                            {book.status === 'reading'
                              ? `${progressPct}%`
                              : book.status === 'completed'
                              ? 'Finished'
                              : 'Next Read'}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add New Tome Button Slot (shown on the last shelf) */}
                  {shelfIdx === shelves.length - 1 && (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="shrink-0 h-[220px] w-12 sm:w-14 rounded-t-md border-2 border-dashed border-amber-500/40 hover:border-amber-400/80 bg-amber-950/15 hover:bg-amber-900/30 transition-all flex flex-col items-center justify-center gap-2 p-1.5 text-amber-300/70 hover:text-amber-100 group cursor-pointer shadow-inner"
                      title="Add a new book to this shelf"
                    >
                      <Plus className="w-5 h-5 group-hover:scale-125 transition-transform text-amber-400" />
                      <span className="writing-mode-vertical font-serif text-[10px] tracking-wider uppercase font-semibold">
                        + New Tome
                      </span>
                    </button>
                  )}

                  {/* Right Carved Bronze Bookend */}
                  <div className="shrink-0 flex flex-col items-center justify-end ml-1 select-none pointer-events-none pb-0">
                    <div className="w-5 sm:w-6 h-28 sm:h-32 rounded-t-lg bg-gradient-to-r from-[#38230c] via-[#8f642a] to-[#4d3215] border border-[#a87a38]/40 shadow-lg flex flex-col items-center justify-center p-0.5">
                      <div className="w-full h-full rounded border border-dashed border-amber-300/30 flex items-center justify-center">
                        <span className="text-[9px] font-serif text-amber-200/70 writing-mode-vertical">
                          ARCHIVE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* The Heavy Wooden Shelf Base (Plank) */}
                <div className="relative z-20">
                  {/* Shelf Top Surface (where books rest, with contact shadow) */}
                  <div className="h-3.5 bg-gradient-to-r from-[#381c0e] via-[#5e3118] to-[#381c0e] border-t border-[#8e4d25]/60 shadow-inner" />

                  {/* Shelf Front Beveled Fascia */}
                  <div className="h-6 sm:h-7 bg-gradient-to-b from-[#2e1509] via-[#1f0e05] to-[#120703] border-b-2 border-black flex items-center justify-between px-4 sm:px-6 shadow-md">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60 shadow-sm" />
                      <span className="text-[10px] font-serif font-bold text-amber-200/60 tracking-widest uppercase">
                        Tier {shelfIdx + 1} • Mahogany Section
                      </span>
                    </div>

                    <span className="text-[10px] font-serif text-amber-300/40 hidden sm:inline">
                      Hand-Carved Victorian Oak
                    </span>
                  </div>

                  {/* Deep Under-Shelf Cast Shadow */}
                  <div className="h-5 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: CARDS GRID VIEW (For All Cards, Reading, Next Reads, Completed) */}
      {activeTab !== 'bookshelf' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium">
              Showing {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
            </span>
            <button
              onClick={() => setActiveTab('bookshelf')}
              className="text-xs text-emerald-300 hover:text-emerald-200 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/25 cursor-pointer"
            >
              <span>🪵 Switch to Victorian Bookshelf</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBooks.map((book) => {
              const progressPct = Math.min(100, Math.round((book.currentPage / book.totalPages) * 100));

              return (
                <div
                  key={book.id}
                  className="p-5 rounded-2xl bg-[#06140b]/35 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-xl"
                >
                  <div className="flex gap-4">
                    {/* Book Cover */}
                    <div
                      onClick={() => setSelectedBook(book)}
                      className="w-20 h-28 rounded-lg overflow-hidden shrink-0 border border-white/10 shadow-lg bg-slate-800 cursor-pointer group-hover:scale-105 transition-transform"
                    >
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
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                              book.status === 'reading'
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : book.status === 'want_to_read'
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                : 'bg-slate-500/15 text-slate-300 border-slate-500/30'
                            }`}
                          >
                            {book.status === 'want_to_read' ? 'Next Read' : book.status.replace('_', ' ')}
                          </span>
                          <h3
                            onClick={() => setSelectedBook(book)}
                            className="text-sm font-bold text-white mt-1.5 truncate cursor-pointer hover:text-emerald-300 transition-colors"
                          >
                            {book.title}
                          </h3>
                          <p className="text-xs text-slate-400">{book.author}</p>
                        </div>

                        <button
                          onClick={() => deleteBook(book.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity cursor-pointer"
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
                              className="px-1.5 py-0.5 bg-white/[0.04] hover:bg-white/[0.08] rounded text-[10px] text-slate-300 cursor-pointer"
                            >
                              -10
                            </button>
                            <button
                              onClick={() => handleUpdatePage(book, book.currentPage + 10)}
                              className="px-1.5 py-0.5 bg-white/[0.04] hover:bg-white/[0.08] rounded text-[10px] text-slate-300 cursor-pointer"
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
                        <div className="flex items-start gap-2 text-xs text-slate-300 italic bg-black/30 p-2.5 rounded-lg border border-emerald-500/15">
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
        </div>
      )}

      {/* MODAL 1: VICTORIAN BOOK INSPECTION PARLOR (When clicking any book on shelf or card) */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="relative bg-[#0d1610] border-2 border-emerald-500/30 rounded-2xl w-full max-w-2xl p-5 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/25">
                  <BookCheck className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white font-serif tracking-wide">
                    Tome Inspection
                  </h3>
                  <p className="text-[10px] text-emerald-200/70">
                    Pulled from Victorian Bookshelf Tier
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBook(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Book Details Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Cover Column */}
              <div className="sm:col-span-1 flex flex-col items-center">
                <div className="w-32 h-44 rounded-xl overflow-hidden shadow-2xl border-2 border-amber-500/30 bg-slate-900 mb-3">
                  <img
                    src={selectedBook.coverUrl}
                    alt={selectedBook.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const updated = { ...selectedBook, rating: i + 1 };
                        updateBook(updated);
                        setSelectedBook(updated);
                      }}
                      className="cursor-pointer hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          i < (selectedBook.rating || 0)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 mt-1">Tap star to rate</span>
              </div>

              {/* Main Info Column */}
              <div className="sm:col-span-2 space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-white font-serif">{selectedBook.title}</h4>
                  <p className="text-xs text-emerald-300 font-medium">{selectedBook.author}</p>
                </div>

                {/* Status Switcher */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Reading Status
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      onClick={() => handleUpdateStatus(selectedBook, 'reading')}
                      className={`py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer text-center ${
                        selectedBook.status === 'reading'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]'
                      }`}
                    >
                      📖 Reading
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedBook, 'want_to_read')}
                      className={`py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer text-center ${
                        selectedBook.status === 'want_to_read'
                          ? 'bg-amber-600 text-white shadow-md'
                          : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]'
                      }`}
                    >
                      🔖 Next Reads
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedBook, 'completed')}
                      className={`py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer text-center ${
                        selectedBook.status === 'completed'
                          ? 'bg-emerald-700 text-white shadow-md'
                          : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]'
                      }`}
                    >
                      ✅ Completed
                    </button>
                  </div>
                </div>

                {/* Page Progress Control */}
                <div className="bg-[#08120a] p-3.5 rounded-xl border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">Page Progress</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {selectedBook.currentPage} / {selectedBook.totalPages} (
                      {Math.min(100, Math.round((selectedBook.currentPage / selectedBook.totalPages) * 100))}%)
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max={selectedBook.totalPages}
                    value={selectedBook.currentPage}
                    onChange={(e) => handleUpdatePage(selectedBook, parseInt(e.target.value, 10) || 0)}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdatePage(selectedBook, selectedBook.currentPage - 25)}
                        className="px-2 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.12] text-[11px] text-slate-300 cursor-pointer"
                      >
                        -25
                      </button>
                      <button
                        onClick={() => handleUpdatePage(selectedBook, selectedBook.currentPage - 10)}
                        className="px-2 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.12] text-[11px] text-slate-300 cursor-pointer"
                      >
                        -10
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdatePage(selectedBook, selectedBook.currentPage + 10)}
                        className="px-2 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.12] text-[11px] text-slate-300 cursor-pointer"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => handleUpdatePage(selectedBook, selectedBook.currentPage + 25)}
                        className="px-2 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.12] text-[11px] text-slate-300 cursor-pointer"
                      >
                        +25
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quotes Section */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                    Favorite Passages & Quotes
                  </label>
                  {selectedBook.favoriteQuotes && selectedBook.favoriteQuotes.length > 0 ? (
                    <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                      {selectedBook.favoriteQuotes.map((quote, qIdx) => (
                        <div
                          key={qIdx}
                          className="flex items-start gap-2 text-xs text-slate-300 italic bg-black/40 p-2 rounded-lg border border-emerald-500/15"
                        >
                          <Quote className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>"{quote}"</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 italic">No quotes recorded yet.</p>
                  )}

                  {/* Add quote input */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="text"
                      placeholder="Add an inspiring line..."
                      value={newQuoteText}
                      onChange={(e) => setNewQuoteText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddInspectionQuote();
                        }
                      }}
                      className="flex-1 glass-input px-3 py-1.5 rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddInspectionQuote}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Notes */}
                {selectedBook.notes && (
                  <div className="text-xs text-slate-300 bg-black/30 p-2.5 rounded-lg border border-white/5">
                    <span className="text-emerald-400 font-semibold">Notes:</span> {selectedBook.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  deleteBook(selectedBook.id);
                  setSelectedBook(null);
                }}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-500/10 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove from Library</span>
              </button>

              <button
                onClick={() => setSelectedBook(null)}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs shadow-md shadow-emerald-950/40 cursor-pointer"
              >
                Close & Return to Shelf 🪵
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW BOOK */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1711] border border-emerald-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Add Tome to Library</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded cursor-pointer"
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
                    <option value="reading" className="bg-[#0e1711]">Reading</option>
                    <option value="want_to_read" className="bg-[#0e1711]">Next Reads</option>
                    <option value="completed" className="bg-[#0e1711]">Completed</option>
                    <option value="on_hold" className="bg-[#0e1711]">On Hold</option>
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
                  className="px-3 py-2 rounded-xl bg-white/[0.05] text-slate-300 hover:bg-white/[0.1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-medium shadow-md shadow-emerald-950/40 cursor-pointer"
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
