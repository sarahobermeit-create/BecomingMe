import React, { useState } from 'react';
import { useLife } from '../../context/LifeContext';
import {
  CheckSquare,
  Square,
  Flame,
  Plus,
  Trash2,
  Clock,
  Tag,
  Sunrise,
  Sunset,
  CalendarDays,
  Sparkles,
} from 'lucide-react';
import { RoutineItem } from '../../types';

export const RoutinesModule: React.FC = () => {
  const { state, todayDate, toggleRoutine, addRoutine, deleteRoutine } = useLife();
  const [activeCategory, setActiveCategory] = useState<'all' | 'morning' | 'evening' | 'daily' | 'weekly'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Routine Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'morning' | 'evening' | 'daily' | 'weekly'>('morning');
  const [newTime, setNewTime] = useState('08:00');
  const [newTagInput, setNewTagInput] = useState('');

  const filteredRoutines = state.routines.filter((r) => {
    if (activeCategory === 'all') return true;
    return r.category === activeCategory;
  });

  const totalCount = state.routines.length;
  const completedToday = state.routines.filter((r) => r.completedDates.includes(todayDate)).length;
  const progressPct = totalCount > 0 ? Math.round((completedToday / totalCount) * 100) : 0;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const tags = newTagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    addRoutine({
      title: newTitle.trim(),
      category: newCategory,
      time: newTime || undefined,
      tags: tags.length > 0 ? tags : ['Habit'],
    });

    setNewTitle('');
    setNewTagInput('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-emerald-400" />
            <span>Routines & Habit Building</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Build consistent daily momentum through intentional morning, evening, and lifestyle habits.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Routine</span>
        </button>
      </div>

      {/* Progress & Stats Card */}
      <div className="glass-panel rounded-2xl p-6 border border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">{completedToday}</span>
              <span className="text-sm text-slate-400 font-medium">/ {totalCount} completed today</span>
            </div>
            <p className="text-xs text-emerald-400 font-medium mt-0.5">
              {progressPct === 100 ? '🎉 All routines crushed today!' : `${100 - progressPct}% left to finish`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-1.5 text-xs text-amber-300 font-medium">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Highest Streak: {Math.max(0, ...state.routines.map((r) => r.streak))} days</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden p-0.5 border border-white/[0.05]">
          <div
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 bg-white/[0.03]'
          }`}
        >
          All Routines ({state.routines.length})
        </button>
        <button
          onClick={() => setActiveCategory('morning')}
          className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
            activeCategory === 'morning'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 bg-white/[0.03]'
          }`}
        >
          <Sunrise className="w-3.5 h-3.5" /> Morning
        </button>
        <button
          onClick={() => setActiveCategory('evening')}
          className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
            activeCategory === 'evening'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200 bg-white/[0.03]'
          }`}
        >
          <Sunset className="w-3.5 h-3.5" /> Evening
        </button>
        <button
          onClick={() => setActiveCategory('daily')}
          className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
            activeCategory === 'daily'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 bg-white/[0.03]'
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5" /> Daily Habits
        </button>
      </div>

      {/* Routine Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredRoutines.map((routine) => {
          const isDone = routine.completedDates.includes(todayDate);
          return (
            <div
              key={routine.id}
              className={`group p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                isDone
                  ? 'bg-emerald-950/15 border-emerald-500/30 text-slate-300 shadow-sm'
                  : 'glass-panel border-white/[0.06] hover:border-white/[0.12]'
              }`}
            >
              <div
                onClick={() => toggleRoutine(routine.id)}
                className="flex items-start gap-3 cursor-pointer flex-1"
              >
                <button
                  type="button"
                  className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  {isDone ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500" />
                  )}
                </button>

                <div>
                  <h3
                    className={`text-sm font-semibold transition-all ${
                      isDone ? 'line-through text-slate-400' : 'text-white'
                    }`}
                  >
                    {routine.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-400">
                    {routine.time && (
                      <span className="flex items-center gap-1 text-slate-300 font-mono bg-white/[0.04] px-1.5 py-0.5 rounded">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {routine.time}
                      </span>
                    )}
                    <span className="capitalize px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-400">
                      {routine.category}
                    </span>
                    {routine.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-0.5 text-slate-400">
                        <Tag className="w-2.5 h-2.5 text-slate-500" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right side: Streak and Delete */}
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono font-medium ${
                    routine.streak > 0
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      : 'bg-white/[0.03] text-slate-500'
                  }`}
                  title={`${routine.streak} consecutive days completed`}
                >
                  <Flame
                    className={`w-3.5 h-3.5 ${
                      routine.streak > 0 ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                    }`}
                  />
                  <span>{routine.streak}</span>
                </div>

                <button
                  onClick={() => deleteRoutine(routine.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-white/[0.04] transition-all"
                  title="Delete routine"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141f] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Create New Routine</span>
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
                <label className="block text-slate-300 font-medium mb-1">Routine Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10 minutes journaling & cold plunge"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Time of Day</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  >
                    <option value="morning" className="bg-[#12141f]">Morning</option>
                    <option value="evening" className="bg-[#12141f]">Evening</option>
                    <option value="daily" className="bg-[#12141f]">Daily Habit</option>
                    <option value="weekly" className="bg-[#12141f]">Weekly Routine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Time (Optional)</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="Health, Productivity, Mindfulness"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
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
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md shadow-emerald-900/30"
                >
                  Create Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
