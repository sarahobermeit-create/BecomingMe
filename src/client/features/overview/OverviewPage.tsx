import { BookOpen, CheckSquare, Droplets, Heart, Sparkles, Wallet } from "lucide-react";
import { Link } from "react-router";
import { useBooks } from "#client/features/books/books.api.ts";
import { useBudget } from "#client/features/budget/budget.api.ts";
import { useMood } from "#client/features/mood/mood.api.ts";
import { useRoutines } from "#client/features/routines/routines.api.ts";
import { useWaterLogs } from "#client/features/water/water.api.ts";

export function OverviewPage() {
  const todayStr = new Date().toISOString().split("T")[0] ?? "";
  const { data: books = [] } = useBooks();
  const { data: routines = [] } = useRoutines();
  const { data: waterLogs = [] } = useWaterLogs();
  const { data: moodEntries = [] } = useMood();
  const { data: budget = [] } = useBudget();

  const readingBooks = books.filter((b) => b.status === "reading");
  const completedRoutines = routines.filter((r) => r.completedDates.includes(todayStr)).length;
  const todayWater = waterLogs.find((w) => w.date === todayStr)?.amountMl ?? 0;
  const todayMood = moodEntries.find((m) => m.date === todayStr);

  const totalIncome = budget.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = budget.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Hero */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-emerald-500/25 relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-emerald-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Becoming Me • Life Operating System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
            Cultivate your days with intention, beauty, and quiet focus.
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
          </p>
        </div>
      </div>

      {/* Grid of Main Domain Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Books Widget */}
        <Link
          to="/books"
          className="p-5 rounded-2xl glass-panel border border-emerald-500/20 hover:border-emerald-400/50 transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" /> Grand Library
            </span>
            <span className="text-xs font-mono text-slate-400">{books.length} tomes</span>
          </div>
          <p className="text-2xl font-bold font-serif text-white mt-3">{readingBooks.length} Reading</p>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
            {readingBooks[0]?.title ?? "Visit the Victorian bookshelf & Kindle"}
          </p>
        </Link>

        {/* Routines Widget */}
        <Link
          to="/routines"
          className="p-5 rounded-2xl glass-panel border border-green-500/20 hover:border-green-400/50 transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-green-400 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckSquare className="w-4 h-4" /> Habits
            </span>
            <span className="text-xs font-mono text-slate-400">
              {completedRoutines}/{routines.length}
            </span>
          </div>
          <p className="text-2xl font-bold font-serif text-white mt-3">
            {routines.length > 0 ? `${Math.round((completedRoutines / routines.length) * 100)}%` : "0%"} Done
          </p>
          <p className="text-xs text-slate-400 mt-1">Keep daily momentum active</p>
        </Link>

        {/* Water Widget */}
        <Link
          to="/water"
          className="p-5 rounded-2xl glass-panel border border-cyan-500/20 hover:border-cyan-400/50 transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Droplets className="w-4 h-4" /> Hydration
            </span>
            <span className="text-xs font-mono text-slate-400">{todayWater} ml</span>
          </div>
          <p className="text-2xl font-bold font-serif text-white mt-3">{Math.round((todayWater / 2500) * 100)}%</p>
          <p className="text-xs text-slate-400 mt-1">Daily water goal: 2,500 ml</p>
        </Link>

        {/* Budget Widget */}
        <Link
          to="/budget"
          className="p-5 rounded-2xl glass-panel border border-emerald-500/20 hover:border-emerald-400/50 transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Wallet className="w-4 h-4" /> Finances
            </span>
            <span className="text-xs font-mono text-slate-400">{budget.length} txs</span>
          </div>
          <p className="text-2xl font-bold font-mono text-white mt-3">${netBalance.toFixed(2)}</p>
          <p className="text-xs text-slate-400 mt-1">Net financial balance</p>
        </Link>

        {/* Mood Widget */}
        <Link
          to="/mood"
          className="p-5 rounded-2xl glass-panel border border-rose-500/20 hover:border-rose-400/50 transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Heart className="w-4 h-4" /> Mood Check
            </span>
            <span className="text-xs text-slate-400 font-mono">{todayMood ? "Logged" : "Pending"}</span>
          </div>
          <p className="text-2xl font-bold font-serif text-white mt-3">{todayMood?.label ?? "Log Today"}</p>
          <p className="text-xs text-slate-400 mt-1">Reflect on daily energy & feelings</p>
        </Link>

        {/* Junk Journal Widget */}
        <Link
          to="/journal"
          className="p-5 rounded-2xl glass-panel border border-purple-500/20 hover:border-purple-400/50 transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Scrapbook
            </span>
            <span className="text-xs text-slate-400 font-mono">Pinboard</span>
          </div>
          <p className="text-2xl font-bold font-serif text-white mt-3">Journal</p>
          <p className="text-xs text-slate-400 mt-1">Candid quotes, stickers & thoughts</p>
        </Link>
      </div>
    </div>
  );
}
