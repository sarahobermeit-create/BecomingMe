import React, { useState } from 'react';
import { useLife } from '../../context/LifeContext';
import {
  BookOpen,
  Plus,
  Trash2,
  Star,
  Quote,
  CheckCircle,
  XCircle,
  Bookmark,
  BookMarked,
  Sparkles,
  X,
  Library,
  Tablet,
  Headphones,
  Play,
  Pause,
  Clock,
  Layers,
  Volume2,
  Move,
  ArrowLeft,
  ArrowRight,
  Hand,
  Check,
  Flame,
  Search,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { Book, BookStatus, BookFormat } from '../../types';
import { calculateDailyReadingStreak } from '../../utils/streak';
import { lookupBookByIsbn } from '../../utils/isbnLookup';
import { RealisticRavenBookend } from '../common/RealisticRavenBookend';
import { KindleScreen } from '../common/KindleScreen';
import { HeadphonesOverCorner } from '../common/HeadphonesOverCorner';
import { GiantKindleLibrary } from '../books/GiantKindleLibrary';
import { PhoneAudiobookLibrary } from '../books/PhoneAudiobookLibrary';
import { BookFormatVisual } from '../books/BookFormatVisual';

type LibraryTab =
  | 'bookshelf_physical'
  | 'bookshelf_ebook'
  | 'bookshelf_audiobook'
  | 'all'
  | 'reading'
  | 'want_to_read'
  | 'completed'
  | 'dnf';

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
  const { state, addBook, updateBook, deleteBook, reorderBooks } = useLife();
  const [activeTab, setActiveTab] = useState<LibraryTab>('bookshelf_physical');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Rearranging / Drag & Drop / Click & Move State for Physical Shelves
  const [rearrangeMode, setRearrangeMode] = useState(false);
  const [draggedBookId, setDraggedBookId] = useState<string | null>(null);
  const [dragOverBookId, setDragOverBookId] = useState<string | null>(null);
  const [pickedUpBookId, setPickedUpBookId] = useState<string | null>(null);

  // New Book Form
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<BookStatus>('reading');
  const [format, setFormat] = useState<BookFormat>('physical');
  const [totalPages, setTotalPages] = useState('320');
  const [currentPage, setCurrentPage] = useState('0');
  const [audioDurationMinutes, setAudioDurationMinutes] = useState('420');
  const [currentAudioMinutes, setCurrentAudioMinutes] = useState('0');
  const [rating, setRating] = useState('5');
  const [coverUrl, setCoverUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [quoteInput, setQuoteInput] = useState('');

  // ISBN Auto-Fill lookup state
  const [isbnInput, setIsbnInput] = useState('');
  const [isSearchingIsbn, setIsSearchingIsbn] = useState(false);
  const [isbnError, setIsbnError] = useState<string | null>(null);
  const [isbnSuccessMessage, setIsbnSuccessMessage] = useState<string | null>(null);

  // Audio player playback simulation state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Inspection modal quote addition state
  const [newQuoteText, setNewQuoteText] = useState('');

  // Daily Reading Streak
  const todayDate = new Date().toISOString().split('T')[0];
  const dailyReadingStreak = calculateDailyReadingStreak(state, todayDate);

  const physicalBooks = state.books.filter((b) => (b.format || 'physical') === 'physical');
  const ebookBooks = state.books.filter((b) => b.format === 'ebook');
  const audiobookBooks = state.books.filter((b) => b.format === 'audiobook');

  // Filter books based on active tab
  const filteredBooks = state.books.filter((b) => {
    const bookFormat = b.format || 'physical';
    if (activeTab === 'bookshelf_physical') return bookFormat === 'physical';
    if (activeTab === 'bookshelf_ebook') return bookFormat === 'ebook';
    if (activeTab === 'bookshelf_audiobook') return bookFormat === 'audiobook';
    if (activeTab === 'all') return true;
    return b.status === activeTab;
  });

  // Reorder Physical Books Handler
  const handleReorderPhysicalBooks = (newPhysicalList: Book[]) => {
    const nonPhysicalBooks = state.books.filter((b) => (b.format || 'physical') !== 'physical');
    reorderBooks([...newPhysicalList, ...nonPhysicalBooks]);
  };

  const moveBook = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    const fromIndex = physicalBooks.findIndex((b) => b.id === sourceId);
    const toIndex = physicalBooks.findIndex((b) => b.id === targetId);
    if (fromIndex < 0 || toIndex < 0) return;

    const updated = [...physicalBooks];
    const [movedBook] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedBook);
    handleReorderPhysicalBooks(updated);
  };

  const nudgeBook = (bookId: string, direction: -1 | 1, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const fromIndex = physicalBooks.findIndex((b) => b.id === bookId);
    if (fromIndex < 0) return;
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= physicalBooks.length) return;

    const updated = [...physicalBooks];
    const [movedBook] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedBook);
    handleReorderPhysicalBooks(updated);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    const quotes = quoteInput
      .split('\n')
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    const isAudio = format === 'audiobook';

    addBook({
      title: title.trim(),
      author: author.trim(),
      status,
      format,
      totalPages: Math.max(1, parseInt(totalPages, 10) || 100),
      currentPage: Math.max(0, parseInt(currentPage, 10) || 0),
      audioDurationMinutes: isAudio ? Math.max(1, parseInt(audioDurationMinutes, 10) || 300) : undefined,
      currentAudioMinutes: isAudio ? Math.max(0, parseInt(currentAudioMinutes, 10) || 0) : undefined,
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
    setIsbnInput('');
    setIsbnError(null);
    setIsbnSuccessMessage(null);
    setShowAddModal(false);
  };

  const handleIsbnLookup = async () => {
    if (!isbnInput.trim()) {
      setIsbnError('Please enter a 10 or 13-digit ISBN number.');
      return;
    }

    setIsSearchingIsbn(true);
    setIsbnError(null);
    setIsbnSuccessMessage(null);

    try {
      const data = await lookupBookByIsbn(isbnInput);
      setTitle(data.title);
      setAuthor(data.author);
      if (data.totalPages > 0) {
        setTotalPages(data.totalPages.toString());
      }
      if (data.coverUrl) {
        setCoverUrl(data.coverUrl);
      }
      if (data.quote) {
        setQuoteInput(data.quote);
      } else if (data.description) {
        setNotes(data.description.slice(0, 300));
      }
      setIsbnSuccessMessage(`Found "${data.title}" by ${data.author || 'Author'}! Book details & cover art populated.`);
    } catch (err: any) {
      setIsbnError(err.message || 'Book not found for this ISBN.');
    } finally {
      setIsSearchingIsbn(false);
    }
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

  const handleUpdateAudioTime = (book: Book, newMinutes: number) => {
    const total = book.audioDurationMinutes || 300;
    const validMinutes = Math.min(total, Math.max(0, newMinutes));
    const newStatus = validMinutes >= total ? 'completed' : book.status;
    const updated = {
      ...book,
      currentAudioMinutes: validMinutes,
      status: newStatus,
    };
    updateBook(updated);
    if (selectedBook && selectedBook.id === book.id) {
      setSelectedBook(updated);
    }
  };

  const handleUpdateStatus = (book: Book, newStatus: BookStatus) => {
    let newCurrentPage = book.currentPage;
    let newAudioMinutes = book.currentAudioMinutes;
    if (newStatus === 'completed') {
      newCurrentPage = book.totalPages;
      if (book.audioDurationMinutes) {
        newAudioMinutes = book.audioDurationMinutes;
      }
    }
    const updated = {
      ...book,
      status: newStatus,
      currentPage: newCurrentPage,
      currentAudioMinutes: newAudioMinutes,
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
      shelves.push([]);
    }
    return shelves;
  };

  const physicalShelves = chunkShelves(physicalBooks, 6);

  const getBookPalette = (book: Book) => {
    // Deterministic hash based purely on the book itself so spine colour NEVER changes upon rearrangement
    const hash = (book.id + (book.title || '')).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return SPINE_PALETTES[Math.abs(hash) % SPINE_PALETTES.length];
  };

  const getBookHeight = (book: Book) => {
    const hash = (book.id + book.title).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 210 + (hash % 38);
  };

  const getBookWidth = (book: Book) => {
    return Math.min(54, Math.max(38, Math.round(book.totalPages / 7)));
  };

  const formatMinutes = (mins: number = 0) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
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
              Warm hearth fire crackling, rain pouring against the arched glass, and floor-to-ceiling shelves of timeless physical, digital, and audio stories.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto flex-wrap sm:flex-nowrap">
            {/* Daily Reading Streak Badge */}
            <div
              className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/20 to-amber-500/15 border border-amber-400/40 shadow-[0_0_18px_rgba(245,158,11,0.25)] select-none"
              title={`${dailyReadingStreak} day consecutive reading streak!`}
            >
              <div className="p-1 sm:p-1.5 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-400">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-300">
                  Daily Reading Streak
                </span>
                <span className="font-mono font-black text-xs sm:text-sm text-amber-100 leading-tight">
                  {dailyReadingStreak} {dailyReadingStreak === 1 ? 'Day' : 'Days'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-700/85 hover:bg-emerald-600 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/50 transition-all border border-emerald-400/25 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Book</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: THE 3 LIBRARY COLLECTION TAB BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Button 1: Total Physical Library */}
        <button
          onClick={() => setActiveTab('bookshelf_physical')}
          className={`p-4 rounded-2xl text-left transition-all shadow-xl group relative overflow-hidden border cursor-pointer ${
            activeTab === 'bookshelf_physical'
              ? 'bg-gradient-to-br from-[#0c2618]/95 via-[#071a10]/95 to-[#040e09] border-emerald-400 ring-2 ring-emerald-400/40 shadow-emerald-950/60'
              : 'bg-[#06140b]/50 backdrop-blur-md border-emerald-500/30 hover:border-emerald-400/70 hover:bg-[#0a2214]/60 hover:shadow-emerald-950/40'
          }`}
          title="Click to view all physical books sitting on the Victorian wooden bookshelves with raven bookends"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 flex items-center gap-1.5 font-serif">
              <Library className="w-4 h-4 text-emerald-400" />
              <span>Total Physical Library</span>
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-semibold group-hover:bg-emerald-500/30 transition-colors">
              Raven Shelves 🪵
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-black text-emerald-300 font-mono">
              {physicalBooks.length}
            </p>
            <span className="text-[11px] text-emerald-200/80 group-hover:text-emerald-100 flex items-center gap-1 font-medium">
              View Shelves →
            </span>
          </div>
        </button>

        {/* Button 2: Total Ebook Library */}
        <button
          onClick={() => setActiveTab('bookshelf_ebook')}
          className={`p-4 rounded-2xl text-left transition-all shadow-xl group relative overflow-hidden border cursor-pointer ${
            activeTab === 'bookshelf_ebook'
              ? 'bg-gradient-to-br from-[#0c2b20]/90 via-[#071d15]/95 to-[#04120d] border-emerald-400 ring-2 ring-emerald-400/40 shadow-emerald-950/60'
              : 'bg-[#06140b]/50 backdrop-blur-md border-emerald-500/30 hover:border-emerald-400 hover:bg-[#0a2013]/60 hover:shadow-emerald-900/30'
          }`}
          title="Click to view all digital e-books displayed on shelves in the Giant Kindle"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5 font-serif">
              <Tablet className="w-4 h-4 text-emerald-400" />
              <span>Total Ebook Library</span>
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-semibold group-hover:bg-emerald-500/30 transition-colors">
              Giant Kindle 📖
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-black text-emerald-300 font-mono">
              {ebookBooks.length}
            </p>
            <span className="text-[11px] text-emerald-200/80 group-hover:text-emerald-100 flex items-center gap-1 font-medium">
              Open Kindle →
            </span>
          </div>
        </button>

        {/* Button 3: Total Audio book library */}
        <button
          onClick={() => setActiveTab('bookshelf_audiobook')}
          className={`p-4 rounded-2xl text-left transition-all shadow-xl group relative overflow-hidden border cursor-pointer ${
            activeTab === 'bookshelf_audiobook'
              ? 'bg-gradient-to-br from-[#0c2618]/95 via-[#071a10]/95 to-[#040e09] border-emerald-400 ring-2 ring-emerald-400/40 shadow-emerald-950/60'
              : 'bg-[#06140b]/50 backdrop-blur-md border-emerald-500/30 hover:border-emerald-400/70 hover:bg-[#0a2214]/60 hover:shadow-emerald-950/40'
          }`}
          title="Click to view all audiobooks displayed on phone shelves with studio headphones"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 flex items-center gap-1.5 font-serif">
              <Headphones className="w-4 h-4 text-emerald-400" />
              <span>Total Audio Book Library</span>
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-semibold group-hover:bg-emerald-500/30 transition-colors">
              Phone Shelves 🎧
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-black text-emerald-300 font-mono">
              {audiobookBooks.length}
            </p>
            <span className="text-[11px] text-emerald-200/80 group-hover:text-emerald-100 flex items-center gap-1 font-medium">
              Listen & Browse →
            </span>
          </div>
        </button>
      </div>

      {/* SECTION 2: READING STATUS COUNTERS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Currently Reading */}
        <button
          onClick={() => setActiveTab('reading')}
          className={`p-3 rounded-xl text-left bg-[#06140b]/35 backdrop-blur-sm border transition-all shadow-md hover:border-emerald-500/40 cursor-pointer ${
            activeTab === 'reading'
              ? 'border-emerald-400/60 ring-1 ring-emerald-400/30 bg-[#092212]/50'
              : 'border-emerald-500/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
              Currently Reading
            </span>
            <Bookmark className="w-3 h-3 text-emerald-400" />
          </div>
          <p className="text-lg font-black text-white font-mono mt-0.5">
            {state.books.filter((b) => b.status === 'reading').length}
          </p>
        </button>

        {/* Next Reads */}
        <button
          onClick={() => setActiveTab('want_to_read')}
          className={`p-3 rounded-xl text-left bg-[#06140b]/35 backdrop-blur-sm border transition-all shadow-md hover:border-amber-400/40 cursor-pointer ${
            activeTab === 'want_to_read'
              ? 'border-amber-400/60 ring-1 ring-amber-400/30 bg-[#221808]/50'
              : 'border-emerald-500/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
              Next Reads
            </span>
            <BookMarked className="w-3 h-3 text-amber-400" />
          </div>
          <p className="text-lg font-black text-amber-300 font-mono mt-0.5">
            {state.books.filter((b) => b.status === 'want_to_read').length}
          </p>
        </button>

        {/* Completed */}
        <button
          onClick={() => setActiveTab('completed')}
          className={`p-3 rounded-xl text-left bg-[#06140b]/35 backdrop-blur-sm border transition-all shadow-md hover:border-emerald-500/40 cursor-pointer ${
            activeTab === 'completed'
              ? 'border-emerald-400/60 ring-1 ring-emerald-400/30 bg-[#092212]/50'
              : 'border-emerald-500/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
              Completed
            </span>
            <CheckCircle className="w-3 h-3 text-emerald-400" />
          </div>
          <p className="text-lg font-black text-emerald-400 font-mono mt-0.5">
            {state.books.filter((b) => b.status === 'completed').length}
          </p>
        </button>

        {/* DNF */}
        <button
          onClick={() => setActiveTab('dnf')}
          className={`p-3 rounded-xl text-left bg-[#06140b]/35 backdrop-blur-sm border transition-all shadow-md hover:border-rose-500/40 cursor-pointer ${
            activeTab === 'dnf'
              ? 'border-rose-400/60 ring-1 ring-rose-400/30 bg-[#240a10]/50'
              : 'border-emerald-500/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
              DNF
            </span>
            <XCircle className="w-3 h-3 text-rose-400" />
          </div>
          <p className="text-lg font-black text-rose-400 font-mono mt-0.5">
            {state.books.filter((b) => b.status === 'dnf').length}
          </p>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setActiveTab('bookshelf_physical')}
          className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'bookshelf_physical'
              ? 'bg-gradient-to-r from-[#0e3b24] via-[#1b5536] to-[#0e3b24] text-emerald-100 border border-emerald-400/50 shadow-lg shadow-emerald-950/60'
              : 'text-emerald-200/80 hover:text-white bg-[#06140b]/40 border border-emerald-500/20 hover:border-emerald-500/40'
          }`}
        >
          <Library className="w-3.5 h-3.5 text-emerald-300" />
          <span>Total Physical Library</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px] font-mono text-emerald-300">
            {physicalBooks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('bookshelf_ebook')}
          className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'bookshelf_ebook'
              ? 'bg-gradient-to-r from-[#0e3b24] via-[#1b5536] to-[#0e3b24] text-emerald-100 border border-emerald-400/50 shadow-lg shadow-emerald-950/60'
              : 'text-emerald-200/80 hover:text-white bg-[#06140b]/40 border border-emerald-500/20 hover:border-emerald-500/40'
          }`}
        >
          <Tablet className="w-3.5 h-3.5 text-emerald-300" />
          <span>Total Ebook Library</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px] font-mono text-emerald-300">
            {ebookBooks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('bookshelf_audiobook')}
          className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'bookshelf_audiobook'
              ? 'bg-gradient-to-r from-[#0e3b24] via-[#1b5536] to-[#0e3b24] text-emerald-100 border border-emerald-400/50 shadow-lg shadow-emerald-950/60'
              : 'text-emerald-200/80 hover:text-white bg-[#06140b]/40 border border-emerald-500/20 hover:border-emerald-500/40'
          }`}
        >
          <Headphones className="w-3.5 h-3.5 text-emerald-300" />
          <span>Total Audio Book Library</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px] font-mono text-emerald-300">
            {audiobookBooks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'all'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white bg-[#06140b]/30 border border-emerald-500/10'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> All ({state.books.length})
        </button>

        <button
          onClick={() => setActiveTab('reading')}
          className={`px-3 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'reading'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white bg-[#06140b]/30 border border-emerald-500/10'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 text-emerald-400" /> Reading ({state.books.filter((b) => b.status === 'reading').length})
        </button>

        <button
          onClick={() => setActiveTab('want_to_read')}
          className={`px-3 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'want_to_read'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white bg-[#06140b]/30 border border-emerald-500/10'
          }`}
        >
          <BookMarked className="w-3.5 h-3.5 text-amber-400" /> Next Reads ({state.books.filter((b) => b.status === 'want_to_read').length})
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-3 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white bg-[#06140b]/30 border border-emerald-500/10'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Completed ({state.books.filter((b) => b.status === 'completed').length})
        </button>

        <button
          onClick={() => setActiveTab('dnf')}
          className={`px-3 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'dnf'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              : 'text-slate-400 hover:text-white bg-[#06140b]/30 border border-emerald-500/10'
          }`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-400" /> DNF ({state.books.filter((b) => b.status === 'dnf').length})
        </button>
      </div>

      {/* VIEW 1: VICTORIAN PHYSICAL BOOKSHELVES VIEW (WITH RAVEN BOOKENDS & DARK DARK WOOD) */}
      {activeTab === 'bookshelf_physical' && (
        <div className="relative rounded-2xl border-2 border-[#1c0d06]/80 shadow-2xl overflow-hidden bg-gradient-to-b from-[#0a0503] via-[#050302] to-[#020101]">
          {/* Top Arch Bookcase Header with Plaque */}
          <div className="relative px-4 py-3 bg-gradient-to-r from-[#07190f] via-[#0d2a1b] to-[#07190f] border-b border-[#143d27]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-3">
              {/* Dark Forest Green Engraved Plaque */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded bg-gradient-to-r from-[#0a2e1d] via-[#14472f] to-[#0a2e1d] text-emerald-200 shadow-md border border-emerald-400/40">
                <span className="text-[10px] font-serif font-black tracking-widest uppercase">
                  Victorian Library • Physical Collection
                </span>
              </div>
              <span className="text-[11px] text-emerald-200/70 font-serif italic hidden md:inline">
                Guarded by realistic ravens perched on gnarled oak branches • Click any tome to pull it from the shelf
              </span>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto text-[11px] text-amber-100/80 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                <span>Reading</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                <span>Next Read</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-300 inline-block shadow-[0_0_6px_rgba(253,224,71,0.8)]" />
                <span>Completed</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400 inline-block shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
                <span>DNF</span>
              </span>

              {/* Rearrange Shelves Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  setRearrangeMode(!rearrangeMode);
                  setPickedUpBookId(null);
                }}
                className={`ml-1 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  rearrangeMode || pickedUpBookId
                    ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(52,211,153,0.7)] ring-2 ring-emerald-300 font-bold'
                    : 'bg-[#0a2e1d] hover:bg-[#14472f] text-emerald-200 border border-emerald-400/40'
                }`}
                title="Toggle shelf rearrangement mode"
              >
                {rearrangeMode || pickedUpBookId ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Done Rearranging</span>
                  </>
                ) : (
                  <>
                    <Move className="w-3 h-3 text-emerald-300" />
                    <span>Rearrange Books</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Rearrange Mode Active Guidance Bar */}
          {(rearrangeMode || pickedUpBookId) && (
            <div className="relative z-30 px-4 py-2 bg-gradient-to-r from-[#092b1a] via-[#10472c] to-[#092b1a] border-b border-emerald-400/50 flex items-center justify-between gap-3 text-xs text-emerald-100 shadow-lg">
              <div className="flex items-center gap-2">
                <Hand className="w-4 h-4 text-emerald-300 animate-pulse shrink-0" />
                <span>
                  {pickedUpBookId ? (
                    <>
                      Moving <strong className="text-amber-200 font-serif">"{physicalBooks.find((b) => b.id === pickedUpBookId)?.title}"</strong>: Click any book to slide it into that position! Or drag it across the shelf.
                    </>
                  ) : (
                    <>
                      <strong>Click any book</strong> to pick it up, or use the <strong>◀ ▶ arrows</strong> on the book spine, or <strong>drag & drop</strong> directly!
                    </>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {pickedUpBookId && (
                  <button
                    type="button"
                    onClick={() => setPickedUpBookId(null)}
                    className="px-2 py-0.5 rounded bg-black/40 hover:bg-black/60 text-emerald-300 hover:text-white border border-emerald-400/30 text-[11px] cursor-pointer"
                  >
                    Cancel Pick Up
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setRearrangeMode(false);
                    setPickedUpBookId(null);
                  }}
                  className="px-2 py-0.5 rounded bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-[11px] cursor-pointer shadow"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Shelves Container */}
          <div className="p-3 sm:p-6 space-y-12 victorian-wood-panel relative">
            <div className="absolute top-1/4 right-8 w-72 h-72 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 left-8 w-72 h-72 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

            {physicalShelves.map((shelfBooks, shelfIdx) => (
              <div key={shelfIdx} className="relative">
                {/* Book Spines Row sitting on the shelf */}
                <div className="relative flex items-end px-2 sm:px-6 min-h-[255px] overflow-x-auto no-scrollbar gap-3 sm:gap-4.5 pb-0">
                  {/* Left Realistic Raven on Branch Bookend */}
                  <RealisticRavenBookend flip={false} />

                  {/* Books on this shelf */}
                  {shelfBooks.map((book) => {
                    const palette = getBookPalette(book);
                    const bookHeight = getBookHeight(book);
                    const bookWidth = getBookWidth(book);
                    const progressPct = Math.min(100, Math.round((book.currentPage / book.totalPages) * 100));
                    const isPickedUp = pickedUpBookId === book.id;
                    const isDragged = draggedBookId === book.id;
                    const isDragOver = dragOverBookId === book.id;

                    return (
                      <div
                        key={book.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', book.id);
                          setDraggedBookId(book.id);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = 'move';
                          if (dragOverBookId !== book.id) setDragOverBookId(book.id);
                        }}
                        onDragLeave={() => {
                          if (dragOverBookId === book.id) setDragOverBookId(null);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          const srcId = e.dataTransfer.getData('text/plain') || draggedBookId;
                          if (srcId && srcId !== book.id) {
                            moveBook(srcId, book.id);
                          }
                          setDraggedBookId(null);
                          setDragOverBookId(null);
                        }}
                        onDragEnd={() => {
                          setDraggedBookId(null);
                          setDragOverBookId(null);
                        }}
                        onClick={() => {
                          if (pickedUpBookId) {
                            if (pickedUpBookId === book.id) {
                              setPickedUpBookId(null);
                            } else {
                              moveBook(pickedUpBookId, book.id);
                              setPickedUpBookId(null);
                            }
                            return;
                          }
                          if (rearrangeMode) {
                            setPickedUpBookId(book.id);
                            return;
                          }
                          setSelectedBook(book);
                        }}
                        style={{
                          height: `${bookHeight}px`,
                          width: `${bookWidth}px`,
                        }}
                        className={`group relative shrink-0 cursor-pointer rounded-t-md transition-all duration-300 ease-out select-none flex flex-col justify-between p-1.5 border-t border-x border-[${palette.border}] bg-gradient-to-r ${palette.gradient} z-10 ${
                          isPickedUp
                            ? '-translate-y-9 scale-105 ring-2 ring-emerald-300 shadow-[0_0_30px_rgba(52,211,153,0.95),0_20px_40px_rgba(0,0,0,0.95)] z-40'
                            : isDragOver
                            ? '-translate-y-5 scale-105 ring-2 ring-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.8)] z-30'
                            : isDragged
                            ? 'opacity-40 scale-95'
                            : 'hover:-translate-y-4 hover:scale-[1.03] shadow-[2px_6px_14px_rgba(0,0,0,0.85)] hover:shadow-[0_20px_35px_rgba(0,0,0,0.95),0_0_24px_rgba(245,158,11,0.45)] hover:z-30'
                        }`}
                      >
                        {/* 3D Cylindrical Spine Shading & Leather Texture */}
                        <div className="absolute inset-0 rounded-t-md pointer-events-none shadow-[inset_3px_0_4px_rgba(255,255,255,0.22),inset_-4px_0_6px_rgba(0,0,0,0.7)] wood-grain opacity-40" />

                        {/* Picked-up Indicator */}
                        {isPickedUp && (
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-emerald-400 text-black font-extrabold text-[9px] px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap animate-bounce flex items-center gap-1 z-50">
                            <Hand className="w-2.5 h-2.5" />
                            <span>PICKED UP</span>
                          </div>
                        )}

                        {/* Floating Cover Art Hover Preview */}
                        {!pickedUpBookId && !rearrangeMode && book.coverUrl && (
                          <div className="absolute -top-40 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none transition-all duration-200">
                            <div className="w-22 h-32 rounded-lg overflow-hidden shadow-[0_16px_36px_rgba(0,0,0,0.95)] border-2 border-amber-400/90 bg-black">
                              <img
                                src={book.coverUrl}
                                alt={book.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <div className="w-2 h-2 bg-amber-400 rotate-45 -mt-1 shadow" />
                          </div>
                        )}

                        {/* Target slot indicator when another book is picked up */}
                        {pickedUpBookId && !isPickedUp && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-amber-400 text-black font-bold text-[9px] px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap transition-opacity pointer-events-none z-50">
                            Place Here ↓
                          </div>
                        )}

                        {/* Quick Nudge Buttons (Left/Right) for effortless moving */}
                        {!pickedUpBookId && (
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1 z-50 bg-black/90 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-emerald-400/40 shadow-xl">
                            <button
                              type="button"
                              title="Move left"
                              onClick={(e) => nudgeBook(book.id, -1, e)}
                              className="p-0.5 rounded hover:bg-emerald-500/40 text-emerald-300 hover:text-white transition-colors cursor-pointer"
                            >
                              <ArrowLeft className="w-2.5 h-2.5" />
                            </button>
                            <span className="text-[8px] text-emerald-200 font-mono px-0.5">Move</span>
                            <button
                              type="button"
                              title="Move right"
                              onClick={(e) => nudgeBook(book.id, 1, e)}
                              className="p-0.5 rounded hover:bg-emerald-500/40 text-emerald-300 hover:text-white transition-colors cursor-pointer"
                            >
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        )}

                        {/* Top Gilt Filigree Band & Status Emblem */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="w-full h-1 bg-gradient-to-r from-amber-600/60 via-amber-300 to-amber-600/60 rounded shadow-sm border-y border-amber-950/70 mb-1" />

                          {book.status === 'reading' && (
                            <div
                              className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-1 ring-emerald-300/60 shadow-[0_0_8px_rgba(52,211,153,0.95)] flex items-center justify-center my-0.5"
                              title={`Currently reading (${progressPct}%)`}
                            >
                              <span className="w-1 h-1 rounded-full bg-white" />
                            </div>
                          )}
                          {book.status === 'completed' && (
                            <div
                              className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-1 ring-amber-300/80 shadow-[0_0_6px_rgba(245,158,11,0.9)] flex items-center justify-center my-0.5 text-[#2b1807] font-bold text-[7px]"
                              title="Completed"
                            >
                              ★
                            </div>
                          )}
                          {book.status === 'want_to_read' && (
                            <div
                              className="w-2.5 h-2.5 rounded-full bg-amber-600/80 ring-1 ring-amber-400/50 shadow-[0_0_5px_rgba(217,119,6,0.8)] flex items-center justify-center my-0.5 text-amber-200 text-[7px]"
                              title="Next Read"
                            >
                              ✦
                            </div>
                          )}
                          {book.status === 'dnf' && (
                            <div
                              className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-1 ring-rose-300/80 shadow-[0_0_6px_rgba(244,63,94,0.9)] flex items-center justify-center my-0.5 text-white font-bold text-[7px]"
                              title="DNF (Did Not Finish)"
                            >
                              ✕
                            </div>
                          )}

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
                          <div className="w-full h-1 bg-gradient-to-r from-amber-600/60 via-amber-300 to-amber-600/60 rounded shadow-sm border-y border-amber-950/70 mb-1" />

                          <span className="writing-mode-vertical font-serif text-[9px] text-amber-300/75 tracking-wider truncate max-h-[45px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
                            {book.author}
                          </span>

                          <div className="w-full h-1 bg-gradient-to-r from-amber-600/60 via-amber-300 to-amber-600/60 rounded shadow-sm border-y border-amber-950/70 mt-1" />
                        </div>

                        {/* Silk Bookmark Ribbon dangling over the shelf plank */}
                        <div
                          style={{ backgroundColor: palette.ribbon }}
                          className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-3.5 h-5 shadow-md z-20 pointer-events-none transition-transform group-hover:translate-y-1"
                        >
                          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#120703] [clip-path:polygon(0_100%,50%_0,100%_100%)]" />
                        </div>

                        {/* Hover Tooltip / Floating Card Preview (only shown when not in pick-up mode) */}
                        {!pickedUpBookId && !rearrangeMode && (
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
                        )}
                      </div>
                    );
                  })}

                  {/* Add New Tome Button Slot (shown on the last shelf) */}
                  {shelfIdx === physicalShelves.length - 1 && (
                    <button
                      onClick={() => {
                        setFormat('physical');
                        setShowAddModal(true);
                      }}
                      className="shrink-0 h-[220px] w-12 sm:w-14 rounded-t-md border-2 border-dashed border-emerald-500/40 hover:border-emerald-400/80 bg-emerald-950/20 hover:bg-emerald-900/40 transition-all flex flex-col items-center justify-center gap-2 p-1.5 text-emerald-300/70 hover:text-emerald-100 group cursor-pointer shadow-inner"
                      title="Add a new physical book to this shelf"
                    >
                      <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform text-emerald-400" />
                      <span className="writing-mode-vertical font-serif text-[10px] tracking-wider uppercase font-semibold">
                        + New Tome
                      </span>
                    </button>
                  )}

                  {/* Right Realistic Raven on Branch Bookend */}
                  <RealisticRavenBookend flip={true} />
                </div>

                {/* The Heavy Dark Dark Obsidian Mahogany Wooden Shelf Base */}
                <div className="relative z-20">
                  <div className="h-3.5 bg-gradient-to-r from-[#0c0603] via-[#160a05] to-[#0c0603] border-t border-[#261207] shadow-inner" />
                  <div className="h-6 sm:h-7 bg-gradient-to-b from-[#0a0502] via-[#050201] to-[#010100] border-b-2 border-black flex items-center justify-between px-4 sm:px-6 shadow-md">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 shadow-sm" />
                      <span className="text-[10px] font-serif font-bold text-emerald-200/60 tracking-widest uppercase">
                        Tier {shelfIdx + 1} • Dark Obsidian Mahogany
                      </span>
                    </div>

                    <span className="text-[10px] font-serif text-emerald-300/30 hidden sm:inline">
                      Raven Guardians On Gnarled Branches • Dark Ancient Oak
                    </span>
                  </div>
                  <div className="h-5 bg-gradient-to-b from-black/95 via-black/60 to-transparent pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: TOTAL EBOOK LIBRARY (ONE GIANT DARK GREEN KINDLE WITH SHELVES) */}
      {activeTab === 'bookshelf_ebook' && (
        <GiantKindleLibrary
          books={ebookBooks}
          onSelectBook={(book) => setSelectedBook(book)}
          onAddBook={() => {
            setFormat('ebook');
            setShowAddModal(true);
          }}
        />
      )}

      {/* VIEW 3: TOTAL AUDIO BOOK LIBRARY (DARK GREEN PHONE SCREEN WITH HEADPHONES & SHELVES) */}
      {activeTab === 'bookshelf_audiobook' && (
        <PhoneAudiobookLibrary
          books={audiobookBooks}
          selectedBook={selectedBook}
          onSelectBook={(book) => setSelectedBook(book)}
          onAddBook={() => {
            setFormat('audiobook');
            setShowAddModal(true);
          }}
          playingAudioId={playingAudioId}
          onTogglePlay={(bookId) => setPlayingAudioId(playingAudioId === bookId ? null : bookId)}
          onDeleteBook={(bookId) => deleteBook(bookId)}
        />
      )}

      {/* VIEW 4: CARDS GRID VIEW (For All, Reading, Next Reads, Completed) */}
      {activeTab !== 'bookshelf_physical' &&
        activeTab !== 'bookshelf_ebook' &&
        activeTab !== 'bookshelf_audiobook' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">
                Showing {filteredBooks.length} {filteredBooks.length === 1 ? 'title' : 'titles'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('bookshelf_physical')}
                  className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/25 cursor-pointer"
                >
                  <span>🪵 Physical Shelves</span>
                </button>
              </div>
            </div>

            {/* Format Icons Gallery (Pure Book Icons, No Progress Bars, No Stars) */}
            <div className="p-4 sm:p-6 rounded-2xl bg-[#06140b]/40 backdrop-blur-sm border border-emerald-500/20 shadow-xl min-h-[220px]">
              {filteredBooks.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <p className="font-serif italic text-sm">No books found in this section.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8 justify-items-center">
                  {filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => setSelectedBook(book)}
                      className="group flex flex-col items-center text-center cursor-pointer select-none transition-transform duration-200 hover:-translate-y-1.5 focus:outline-none"
                    >
                      {/* Book Format Visual (Physical Book, Kindle Screen, or Phone with Headphones) */}
                      <div className="relative">
                        <BookFormatVisual book={book} size="sm" />
                      </div>

                      {/* Clean Book Title & Author beneath icon */}
                      <div className="mt-2.5 w-20 sm:w-24">
                        <h4
                          className="font-serif font-bold text-xs text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-tight"
                          title={book.title}
                        >
                          {book.title}
                        </h4>
                        <p className="font-serif italic text-[10px] text-slate-400 truncate mt-0.5">
                          {book.author}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      {/* MODAL 1: VICTORIAN BOOK INSPECTION PARLOR */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="relative bg-[#0d1610] border-2 border-emerald-500/30 rounded-2xl w-full max-w-2xl p-5 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/25">
                  <Library className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white font-serif tracking-wide">
                    Tome Inspection
                  </h3>
                  <p className="text-[10px] text-emerald-200/70 capitalize">
                    {selectedBook.format || 'physical'} Edition • Victorian Sanctuary
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
                <div className="w-32 h-44 rounded-xl overflow-hidden shadow-2xl border-2 border-amber-500/30 bg-slate-900 mb-3 relative">
                  <img src={selectedBook.coverUrl} alt={selectedBook.title} className="w-full h-full object-cover" />
                  <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded bg-black/85 text-[9px] font-bold text-amber-200 border border-amber-500/40">
                    {selectedBook.format === 'audiobook' ? '🎧 Audio' : selectedBook.format === 'ebook' ? '📱 Ebook' : '🪵 Physical'}
                  </div>
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
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
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
                    <button
                      onClick={() => handleUpdateStatus(selectedBook, 'dnf')}
                      className={`py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer text-center ${
                        selectedBook.status === 'dnf'
                          ? 'bg-rose-900/80 text-rose-200 border border-rose-500/50 shadow-md'
                          : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]'
                      }`}
                    >
                      🛑 DNF
                    </button>
                  </div>
                </div>

                {/* Progress Controls (Pages vs Audio Duration) */}
                {selectedBook.format === 'audiobook' ? (
                  <div className="bg-[#08120a] p-3.5 rounded-xl border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">Listening Duration</span>
                      <span className="font-mono text-emerald-300 font-bold">
                        {formatMinutes(selectedBook.currentAudioMinutes)} / {formatMinutes(selectedBook.audioDurationMinutes)} (
                        {Math.min(
                          100,
                          Math.round(
                            ((selectedBook.currentAudioMinutes || 0) / (selectedBook.audioDurationMinutes || 300)) * 100
                          )
                        )}%)
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max={selectedBook.audioDurationMinutes || 300}
                      value={selectedBook.currentAudioMinutes || 0}
                      onChange={(e) => handleUpdateAudioTime(selectedBook, parseInt(e.target.value, 10) || 0)}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleUpdateAudioTime(selectedBook, (selectedBook.currentAudioMinutes || 0) - 30)}
                          className="px-2 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.12] text-[11px] text-slate-300 cursor-pointer"
                        >
                          -30m
                        </button>
                        <button
                          onClick={() => handleUpdateAudioTime(selectedBook, (selectedBook.currentAudioMinutes || 0) - 15)}
                          className="px-2 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.12] text-[11px] text-slate-300 cursor-pointer"
                        >
                          -15m
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleUpdateAudioTime(selectedBook, (selectedBook.currentAudioMinutes || 0) + 15)}
                          className="px-2 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.12] text-[11px] text-slate-300 cursor-pointer"
                        >
                          +15m
                        </button>
                        <button
                          onClick={() => handleUpdateAudioTime(selectedBook, (selectedBook.currentAudioMinutes || 0) + 30)}
                          className="px-2 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.12] text-[11px] text-slate-300 cursor-pointer"
                        >
                          +30m
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
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
                )}

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
                Close & Return 🪵
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
                onClick={() => {
                  setIsbnInput('');
                  setIsbnError(null);
                  setIsbnSuccessMessage(null);
                  setShowAddModal(false);
                }}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              {/* Format Selector */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Collection Format</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormat('physical')}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer font-medium ${
                      format === 'physical'
                        ? 'bg-amber-900/50 border-amber-400 text-amber-200 shadow'
                        : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    🪵 Physical
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('ebook')}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer font-medium ${
                      format === 'ebook'
                        ? 'bg-emerald-900/50 border-emerald-400 text-emerald-200 shadow'
                        : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    📱 E-Book
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('audiobook')}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer font-medium ${
                      format === 'audiobook'
                        ? 'bg-emerald-900/50 border-emerald-400 text-emerald-200 shadow'
                        : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    🎧 Audiobook
                  </button>
                </div>
              </div>

              {/* ISBN Auto-Fill Section */}
              <div className="bg-gradient-to-r from-emerald-950/60 via-[#0a2014] to-emerald-950/60 border border-emerald-500/35 rounded-xl p-3 shadow-inner">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-emerald-300 font-semibold flex items-center gap-1.5 text-xs">
                    <Search className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Auto-Fill from ISBN</span>
                  </label>
                  <span className="text-[10px] text-emerald-400/70 font-mono">10 or 13 digits</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 9780141439518 or 0451524934"
                    value={isbnInput}
                    onChange={(e) => {
                      setIsbnInput(e.target.value);
                      if (isbnError) setIsbnError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleIsbnLookup();
                      }
                    }}
                    className="flex-1 glass-input px-3 py-2 rounded-xl text-xs font-mono placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={handleIsbnLookup}
                    disabled={isSearchingIsbn || !isbnInput.trim()}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer shrink-0"
                  >
                    {isSearchingIsbn ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Finding...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-3.5 h-3.5" />
                        <span>Find Book</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Success Message Banner */}
                {isbnSuccessMessage && (
                  <div className="mt-2.5 p-2 rounded-lg bg-emerald-500/15 border border-emerald-400/40 text-emerald-200 text-[11px] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{isbnSuccessMessage}</span>
                  </div>
                )}

                {/* Error Message Banner */}
                {isbnError && (
                  <div className="mt-2.5 p-2 rounded-lg bg-rose-500/15 border border-rose-400/40 text-rose-200 text-[11px] flex items-center gap-2">
                    <span className="shrink-0 text-rose-400 font-bold">✕</span>
                    <span>{isbnError}</span>
                  </div>
                )}
              </div>

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
                <label className="block text-slate-300 font-medium mb-1">Author / Narrator</label>
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
                    <option value="dnf" className="bg-[#0e1711]">DNF (Did Not Finish)</option>
                    <option value="on_hold" className="bg-[#0e1711]">On Hold</option>
                  </select>
                </div>

                {format === 'audiobook' ? (
                  <>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Total Mins</label>
                      <input
                        type="number"
                        placeholder="e.g. 480"
                        value={audioDurationMinutes}
                        onChange={(e) => setAudioDurationMinutes(e.target.value)}
                        className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Current Mins</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={currentAudioMinutes}
                        onChange={(e) => setCurrentAudioMinutes(e.target.value)}
                        className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Cover Image URL (Optional)</label>
                <div className="flex gap-2.5 items-center">
                  {coverUrl && (
                    <div className="w-12 h-16 shrink-0 rounded-md overflow-hidden border border-emerald-400/50 shadow-md bg-black">
                      <img src={coverUrl} alt="Cover preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="url"
                    placeholder="https://... (auto-filled by ISBN or custom)"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    className="flex-1 glass-input px-3 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Favorite Quote / Line (Optional)</label>
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
                  onClick={() => {
                    setIsbnInput('');
                    setIsbnError(null);
                    setIsbnSuccessMessage(null);
                    setShowAddModal(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-white/[0.05] text-slate-300 hover:bg-white/[0.1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-medium shadow-md shadow-emerald-950/40 cursor-pointer"
                >
                  Save to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
