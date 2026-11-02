import { BookOpen, CheckCircle, FileSpreadsheet, Plus } from "lucide-react";
import { CoverSyncStatus } from "#client/features/books/CoverSyncStatus.tsx";
import type { Book } from "#shared/books.ts";

interface Props {
  books: Book[];
  onOpenAdd: () => void;
  onOpenImport: () => void;
}

export function BooksStatsHeader({ books, onOpenAdd, onOpenImport }: Props) {
  const reading = books.filter((b) => b.status === "reading");
  const completed = books.filter((b) => b.status === "completed");
  const physicalCount = books.filter((b) => b.format === "physical" || !b.format).length;
  const ebookCount = books.filter((b) => b.format === "ebook").length;
  const audioCount = books.filter((b) => b.format === "audiobook").length;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl glass-panel border border-emerald-500/20">
      <div>
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2">
          <span>The Grand Library</span>
          <span className="text-xs font-sans font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {books.length} tomes
          </span>
        </h1>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-300">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <strong className="text-white">{reading.length}</strong> reading
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
            <strong className="text-white">{completed.length}</strong> completed
          </span>
          <span className="text-white/20">•</span>
          <span className="hidden sm:inline-flex items-center gap-2 text-slate-400">
            <span>{physicalCount} physical</span>
            <span>{ebookCount} e-books</span>
            <span>{audioCount} audio</span>
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <CoverSyncStatus />
        <button
          onClick={onOpenImport}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-xl transition-all shadow-md"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Import CSV</span>
        </button>
        <button
          onClick={onOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-900/40 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Book</span>
        </button>
      </div>
    </div>
  );
}
