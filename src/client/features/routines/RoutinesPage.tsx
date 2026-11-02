import { CheckSquare, Plus, X } from "lucide-react";
import { useState } from "react";
import { QueryBoundary } from "#client/components/QueryBoundary.tsx";
import { RoutineItemRow } from "#client/features/routines/RoutineItemRow.tsx";
import { useRoutines, useSaveRoutine } from "#client/features/routines/routines.api.ts";
import type { RoutineCategory } from "#shared/routines.ts";

export function RoutinesPage() {
  const routinesQuery = useRoutines();
  const saveRoutine = useSaveRoutine();
  const todayStr = new Date().toISOString().split("T")[0] ?? "";

  const [filterCat, setFilterCat] = useState<string>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<RoutineCategory>("morning");
  const [time, setTime] = useState("08:00");
  const [tagsStr, setTagsStr] = useState("");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    saveRoutine.mutate({
      id: crypto.randomUUID(),
      title: title.trim(),
      category,
      time: time || undefined,
      completedDates: [],
      tags: tags.length > 0 ? tags : ["Habit"],
      deleted: false,
      changedAt: Date.now(),
    });

    setTitle("");
    setTagsStr("");
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <QueryBoundary query={routinesQuery}>
        {(routines) => {
          const completedCount = routines.filter((r) => r.completedDates.includes(todayStr)).length;
          const progressPct = routines.length > 0 ? Math.round((completedCount / routines.length) * 100) : 0;
          const filtered = routines.filter((r) => filterCat === "all" || r.category === filterCat);

          return (
            <>
              {/* Header Card */}
              <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <CheckSquare className="w-6 h-6 text-emerald-400" />
                    <span>Daily Habits & Routines</span>
                  </h1>
                  <p className="text-xs text-slate-300 mt-1">
                    Completed {completedCount} of {routines.length} today ({progressPct}%)
                  </p>
                  <div className="w-48 bg-white/10 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-emerald-400 h-full rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>

                <button
                  onClick={() => setIsAddOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-900/40 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Habit</span>
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2 text-xs">
                {(["all", "morning", "evening", "daily", "weekly"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCat(cat)}
                    className={`px-3 py-1.5 rounded-xl border capitalize transition-all ${
                      filterCat === cat
                        ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/50"
                        : "bg-white/[0.03] text-slate-400 border-white/10 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Routine Items List */}
              <div className="space-y-2">
                {filtered.map((routine) => (
                  <RoutineItemRow key={routine.id} routine={routine} todayStr={todayStr} />
                ))}
                {filtered.length === 0 && (
                  <p className="text-xs text-slate-400 py-8 text-center">No routines found in this category.</p>
                )}
              </div>

              {/* Add Routine Modal */}
              {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <div className="relative w-full max-w-md p-6 rounded-2xl glass-panel text-slate-100 shadow-2xl border border-emerald-500/30">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <h2 className="text-lg font-bold">Add Habit Routine</h2>
                      <button onClick={() => setIsAddOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleAddSubmit} className="space-y-3 mt-4 text-sm">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Routine Title</label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Morning Sunlight Walk"
                          className="w-full px-3 py-2 rounded-lg glass-input text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as RoutineCategory)}
                            className="w-full px-3 py-2 rounded-lg glass-input text-sm"
                          >
                            <option value="morning">Morning</option>
                            <option value="evening">Evening</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">Time</label>
                          <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg glass-input text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Tags (comma separated)</label>
                        <input
                          type="text"
                          value={tagsStr}
                          onChange={(e) => setTagsStr(e.target.value)}
                          placeholder="Health, Energy"
                          className="w-full px-3 py-2 rounded-lg glass-input text-sm"
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setIsAddOpen(false)}
                          className="px-4 py-2 text-sm text-slate-300 hover:text-white rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-lg"
                        >
                          Save Routine
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          );
        }}
      </QueryBoundary>
    </div>
  );
}
