import { ChevronLeft, ChevronRight, Search } from "lucide-react";

export type BookSortOption = "recent" | "author" | "title" | "rating";

interface Props {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: BookSortOption;
  onSortChange: (sort: BookSortOption) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalFiltered: number;
}

export function BookshelfControls({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  currentPage,
  totalPages,
  onPageChange,
  totalFiltered,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl glass-panel border border-emerald-500/20 text-xs">
      {/* Search Input */}
      <div className="relative w-full sm:w-64">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title or author..."
          className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400/50"
        />
      </div>

      {/* Sort & Pagination */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 hidden md:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as BookSortOption)}
            className="px-2.5 py-1.5 rounded-xl bg-[#08150d] border border-white/10 text-slate-200 focus:outline-none focus:border-emerald-400/50"
          >
            <option value="recent">Recently Added</option>
            <option value="author">Author (A–Z)</option>
            <option value="title">Title (A–Z)</option>
            <option value="rating">Rating (Highest)</option>
          </select>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
              title="Previous Shelf Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
              title="Next Shelf Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <span className="text-slate-400 font-mono text-[11px] hidden lg:inline">
          ({totalFiltered} tomes)
        </span>
      </div>
    </div>
  );
}
