import React from 'react';
import { useLife } from '../../context/LifeContext';
import { TabType } from '../../types';
import {
  CheckCircle2,
  Circle,
  Droplets,
  Plus,
  Flame,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Calendar,
  Utensils,
  Lightbulb,
  Heart,
  Pin,
  Sparkles,
} from 'lucide-react';

interface OverviewDashboardProps {
  setActiveTab: (tab: TabType) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ setActiveTab }) => {
  const { state, todayDate, toggleRoutine, addWater } = useLife();

  // Water calculations
  const todayWater = state.waterLogs[todayDate]?.amountMl || 0;
  const targetWater = state.waterDailyTargetMl || 2500;
  const waterPct = Math.min(100, Math.round((todayWater / targetWater) * 100));

  // Routines calculations
  const totalRoutines = state.routines.length;
  const completedRoutines = state.routines.filter((r) => r.completedDates.includes(todayDate)).length;
  const routinePct = totalRoutines > 0 ? Math.round((completedRoutines / totalRoutines) * 100) : 0;

  // Today meals
  const todayMeals = state.meals.filter((m) => m.date === todayDate);

  // Today events
  const todayEvents = state.events.filter((e) => e.date === todayDate);

  // Today mood
  const todayMood = state.moods.find((m) => m.date === todayDate);

  // Currently reading book
  const currentBook = state.books.find((b) => b.status === 'reading');

  // Budget calculations
  const totalIncome = state.transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = state.transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  // Pinned or latest journal entry
  const featuredJournal = state.journalEntries.find((j) => j.isPinned) || state.journalEntries[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-900/40 via-indigo-900/30 to-purple-900/20 border border-violet-500/20 p-6 lg:p-8 backdrop-blur-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-400/20 text-xs font-medium text-violet-300 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Personal Life HQ</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Welcome back to your intentional day
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Here is your daily snapshot across routines, nutrition, hydration, books, mindfulness, and plans.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('routines')}
              className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Routines</span>
            </button>
            <button
              onClick={() => setActiveTab('journal')}
              className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.1] font-medium text-xs transition-all flex items-center gap-2"
            >
              <Pin className="w-4 h-4 text-pink-400" />
              <span>Junk Journal</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Grid: Key Today Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* 1. Hydration Quick Widget */}
        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Water Consumption</h2>
                <p className="text-xs text-slate-400">
                  {todayWater} / {targetWater} ml
                </p>
              </div>
            </div>
            <span className="text-lg font-bold font-mono text-cyan-400">{waterPct}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden p-0.5 border border-white/[0.05] mb-4">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${waterPct}%` }}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => addWater(250)}
              className="flex-1 py-1.5 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> +250 ml (Glass)
            </button>
            <button
              onClick={() => addWater(500)}
              className="flex-1 py-1.5 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> +500 ml (Bottle)
            </button>
          </div>
        </div>

        {/* 2. Today's Routines Progress */}
        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Today's Routines</h2>
                <p className="text-xs text-slate-400">
                  {completedRoutines} of {totalRoutines} completed
                </p>
              </div>
            </div>
            <span className="text-lg font-bold font-mono text-emerald-400">{routinePct}%</span>
          </div>

          {/* Quick list of today's routines */}
          <div className="space-y-2 mb-3">
            {state.routines.slice(0, 3).map((r) => {
              const isDone = r.completedDates.includes(todayDate);
              return (
                <div
                  key={r.id}
                  onClick={() => toggleRoutine(r.id)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs transition-colors ${
                    isDone
                      ? 'bg-emerald-500/10 text-slate-400 line-through border border-emerald-500/20'
                      : 'bg-white/[0.03] text-slate-200 hover:bg-white/[0.06] border border-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span className="truncate">{r.title}</span>
                  </div>
                  {r.streak > 0 && (
                    <span className="flex items-center gap-0.5 text-[10px] text-amber-400 font-mono shrink-0">
                      <Flame className="w-3 h-3 fill-amber-400" />
                      {r.streak}d
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setActiveTab('routines')}
            className="w-full text-center text-xs text-slate-400 hover:text-emerald-300 font-medium flex items-center justify-center gap-1 transition-colors"
          >
            <span>View all routines</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3. Mood & Energy */}
        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Daily Mood</h2>
                <p className="text-xs text-slate-400">Mindfulness check-in</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('mood')}
              className="text-xs text-rose-400 hover:underline"
            >
              Update
            </button>
          </div>

          {todayMood ? (
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">{todayMood.label}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Score: {todayMood.score}/5
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 italic">
                "{todayMood.journalNote || 'Feeling aligned and focused today.'}"
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {todayMood.factors.slice(0, 3).map((f) => (
                  <span
                    key={f}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-300"
                  >
                    #{f}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div
              onClick={() => setActiveTab('mood')}
              className="p-4 rounded-xl border border-dashed border-white/10 hover:border-rose-500/40 text-center cursor-pointer transition-colors"
            >
              <p className="text-xs text-slate-400">No mood logged yet for today.</p>
              <span className="inline-block mt-2 text-xs font-semibold text-rose-400 hover:text-rose-300">
                + Check in your mood
              </span>
            </div>
          )}

          <div className="mt-3 text-[11px] text-slate-500 flex justify-between">
            <span>Energy Tracker</span>
            <span className="text-slate-400 font-medium">Level {todayMood?.energyLevel || 3}/5</span>
          </div>
        </div>

        {/* 4. Reading Tracker */}
        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Current Read</h2>
                <p className="text-xs text-slate-400">Active Book</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('books')}
              className="text-xs text-indigo-400 hover:underline"
            >
              Library
            </button>
          </div>

          {currentBook ? (
            <div className="flex items-center gap-3 bg-white/[0.03] p-3 rounded-xl border border-white/[0.05]">
              <img
                src={currentBook.coverUrl}
                alt={currentBook.title}
                className="w-12 h-16 object-cover rounded-md shadow-md border border-white/10 shrink-0"
              />
              <div className="overflow-hidden flex-1">
                <h3 className="text-xs font-bold text-white truncate">{currentBook.title}</h3>
                <p className="text-[11px] text-slate-400 truncate">{currentBook.author}</p>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>
                      Page {currentBook.currentPage} of {currentBook.totalPages}
                    </span>
                    <span className="font-mono text-indigo-300">
                      {Math.round((currentBook.currentPage / currentBook.totalPages) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full"
                      style={{
                        width: `${Math.round(
                          (currentBook.currentPage / currentBook.totalPages) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No book currently active.</p>
          )}

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Finished this year: 1</span>
            <span className="text-indigo-400">Goal: 12 books</span>
          </div>
        </div>

        {/* 5. Budget & Finance Snapshot */}
        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Monthly Cashflow</h2>
                <p className="text-xs text-slate-400">Income vs Expenses</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('budget')}
              className="text-xs text-emerald-400 hover:underline"
            >
              Details
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10px] text-emerald-300 uppercase tracking-wider font-semibold">
                Income
              </span>
              <p className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                ${totalIncome.toFixed(2)}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <span className="text-[10px] text-rose-300 uppercase tracking-wider font-semibold">
                Expenses
              </span>
              <p className="text-base font-bold font-mono text-rose-400 mt-0.5">
                ${totalExpense.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-white/[0.05]">
            <span className="text-slate-400">Net Savings:</span>
            <span
              className={`font-mono font-bold ${
                netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {netBalance >= 0 ? '+' : ''}${netBalance.toFixed(2)}
            </span>
          </div>
        </div>

        {/* 6. Today's Events & Schedule */}
        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Today's Schedule</h2>
                <p className="text-xs text-slate-400">{todayEvents.length} events planned</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('calendar')}
              className="text-xs text-teal-400 hover:underline"
            >
              Calendar
            </button>
          </div>

          <div className="space-y-2 mb-2">
            {todayEvents.length > 0 ? (
              todayEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/[0.05] text-xs"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: evt.color || '#10b981' }}
                    />
                    <span className="font-medium text-slate-200 truncate">{evt.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {evt.time || 'All day'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-2">No scheduled events for today.</p>
            )}
          </div>

          <button
            onClick={() => setActiveTab('calendar')}
            className="w-full text-center text-xs text-slate-400 hover:text-teal-300 font-medium flex items-center justify-center gap-1 transition-colors"
          >
            <span>Open monthly agenda</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Secondary Row: Meals & Junk Journal highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Meals Summary */}
        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Today's Meals</h2>
                <p className="text-xs text-slate-400">{todayMeals.length} logged today</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('meals')}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Meal Log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {todayMeals.slice(0, 4).map((meal) => (
              <div
                key={meal.id}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    {meal.mealType}
                  </span>
                  {meal.calories && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {meal.calories} kcal
                    </span>
                  )}
                </div>
                <h3 className="text-xs font-medium text-slate-200 line-clamp-1">{meal.title}</h3>
                {meal.description && (
                  <p className="text-[11px] text-slate-400 line-clamp-2">{meal.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Junk Journal Note Highlight */}
        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <Pin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Junk Journal & Scrapbook</h2>
                <p className="text-xs text-slate-400">Memories & creative fragments</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('journal')}
              className="text-xs text-pink-400 hover:underline flex items-center gap-1"
            >
              <span>Open Scrapbook</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {featuredJournal && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-pink-950/20 via-purple-950/20 to-transparent border border-pink-500/20 relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{featuredJournal.sticker || '✨'}</span>
                  <h3 className="text-sm font-bold text-pink-200">{featuredJournal.title}</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {featuredJournal.date}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
                "{featuredJournal.content}"
              </p>
              {featuredJournal.song && (
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-pink-300 font-medium">
                  <span>🎵 {featuredJournal.song.title} — {featuredJournal.song.artist}</span>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Ideas Spark footer quick access */}
      <div className="glass-panel rounded-2xl p-4 border border-white/[0.08] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Have a spontaneous idea or future plan?</p>
            <p className="text-[11px] text-slate-400">Capture it in your ideas board before it slips away.</p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('ideas')}
          className="px-3 py-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 border border-yellow-500/20 text-xs font-medium transition-colors shrink-0"
        >
          Capture Idea
        </button>
      </div>
    </div>
  );
};
