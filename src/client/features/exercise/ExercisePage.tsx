import confetti from "canvas-confetti";
import { Check, Clock, Dumbbell, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { QueryBoundary } from "#client/components/QueryBoundary.tsx";
import { useExercise, useSaveWorkout } from "#client/features/exercise/exercise.api.ts";
import type { WorkoutPlan } from "#shared/exercise.ts";

export function ExercisePage() {
  const exerciseQuery = useExercise();
  const saveWorkout = useSaveWorkout();
  const todayStr = new Date().toISOString().split("T")[0] ?? "";

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<WorkoutPlan["category"]>("strength");
  const [durationMin, setDurationMin] = useState(30);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    saveWorkout.mutate({
      id: crypto.randomUUID(),
      title: title.trim(),
      category,
      durationMin: Number(durationMin) || 30,
      exercises: [],
      completedHistory: [],
      deleted: false,
      changedAt: Date.now(),
    });

    setTitle("");
    setIsAddOpen(false);
  };

  const handleComplete = (workout: WorkoutPlan) => {
    const isCompletedToday = workout.completedHistory.some((h) => h.date === todayStr);
    let nextHistory: { date: string; notes?: string }[];
    if (isCompletedToday) {
      nextHistory = workout.completedHistory.filter((h) => h.date !== todayStr);
    } else {
      nextHistory = [...workout.completedHistory, { date: todayStr }];
      void confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }

    saveWorkout.mutate({
      ...workout,
      completedHistory: nextHistory,
      deleted: false,
      changedAt: Date.now(),
    });
  };

  const handleDelete = (workout: WorkoutPlan) => {
    if (window.confirm(`Delete "${workout.title}"?`)) {
      saveWorkout.mutate({
        ...workout,
        deleted: true,
        changedAt: Date.now(),
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <QueryBoundary query={exerciseQuery}>
        {(workouts) => (
          <>
            <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-orange-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Dumbbell className="w-6 h-6 text-orange-400" />
                  <span>Exercise & Workouts</span>
                </h1>
                <p className="text-xs text-slate-300 mt-1">Cultivate strength, endurance, and physical health.</p>
              </div>
              <button
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-xl shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>New Routine</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workouts.map((w) => {
                const doneToday = w.completedHistory.some((h) => h.date === todayStr);
                return (
                  <div key={w.id} className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-serif text-base font-bold text-white">{w.title}</h3>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                          <span className="capitalize text-orange-400">{w.category}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" /> {w.durationMin} mins
                          </span>
                        </div>
                      </div>
                      <button onClick={() => handleDelete(w)} className="p-1 text-slate-600 hover:text-rose-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-white/10">
                      <span className="text-[11px] font-mono text-slate-400">
                        Completed: {w.completedHistory.length} times
                      </span>
                      <button
                        onClick={() => handleComplete(w)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          doneToday
                            ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/40"
                            : "bg-white/10 hover:bg-orange-600 text-white"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{doneToday ? "Done Today" : "Log Done"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
              {workouts.length === 0 && (
                <div className="col-span-2 py-16 text-center text-xs text-slate-400">
                  No workout routines added yet.
                </div>
              )}
            </div>

            {isAddOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="relative w-full max-w-md p-6 rounded-2xl glass-panel text-slate-100 shadow-2xl border border-orange-500/30">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h2 className="text-lg font-bold">Add Workout Plan</h2>
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
                        placeholder="e.g. Upper Body Strength, Evening Yoga"
                        className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as any)}
                          className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                        >
                          <option value="strength">Strength</option>
                          <option value="cardio">Cardio</option>
                          <option value="flexibility">Flexibility</option>
                          <option value="hiit">HIIT</option>
                          <option value="pilates">Pilates</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Duration (mins)</label>
                        <input
                          type="number"
                          min="5"
                          value={durationMin}
                          onChange={(e) => setDurationMin(Number(e.target.value))}
                          className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                        />
                      </div>
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
                        className="px-4 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-lg shadow-lg"
                      >
                        Save Routine
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </QueryBoundary>
    </div>
  );
}
