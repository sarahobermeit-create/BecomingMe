import React, { useState } from 'react';
import { useLife } from '../../context/LifeContext';
import {
  Dumbbell,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Flame,
  Activity,
  HeartPulse,
  Sparkles,
} from 'lucide-react';
import { WorkoutPlan } from '../../types';

export const ExerciseModule: React.FC = () => {
  const { state, todayDate, addWorkout, deleteWorkout, logWorkoutCompletion } = useLife();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | WorkoutPlan['category']>('all');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<WorkoutPlan['category']>('strength');
  const [durationMin, setDurationMin] = useState('45');
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [exercisesInput, setExercisesInput] = useState('');

  const filteredWorkouts = state.workouts.filter((w) => {
    if (filterCategory === 'all') return true;
    return w.category === filterCategory;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Parse simple exercise lines e.g. "Dumbbell Bench Press - 3x10"
    const exerciseList = exercisesInput
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line, idx) => ({
        id: `ex-${Date.now()}-${idx}`,
        name: line,
        sets: [{ reps: 10 }, { reps: 10 }, { reps: 10 }],
      }));

    addWorkout({
      title: title.trim(),
      category,
      durationMin: parseInt(durationMin, 10) || 30,
      dayOfWeek,
      exercises: exerciseList.length > 0 ? exerciseList : [
        { id: `ex-${Date.now()}`, name: 'General Warmup & Workout', sets: [{ reps: 12 }] }
      ],
    });

    setTitle('');
    setExercisesInput('');
    setShowAddModal(false);
  };

  const categoryBadges: Record<WorkoutPlan['category'], { label: string; color: string }> = {
    strength: { label: 'Strength & Hypertrophy', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
    cardio: { label: 'Endurance & Cardio', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    flexibility: { label: 'Mobility & Yoga', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    hiit: { label: 'HIIT & Conditioning', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    pilates: { label: 'Pilates & Core', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-orange-400" />
            <span>Exercise Plans & Training Routines</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Structure your workout schedule, log sets & reps, and maintain physical power and longevity.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-900/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Workout Plan</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            filterCategory === 'all'
              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
              : 'text-slate-400 hover:text-white bg-white/[0.03]'
          }`}
        >
          All Routines ({state.workouts.length})
        </button>
        <button
          onClick={() => setFilterCategory('strength')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            filterCategory === 'strength'
              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
              : 'text-slate-400 hover:text-white bg-white/[0.03]'
          }`}
        >
          Strength
        </button>
        <button
          onClick={() => setFilterCategory('cardio')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            filterCategory === 'cardio'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white bg-white/[0.03]'
          }`}
        >
          Cardio
        </button>
        <button
          onClick={() => setFilterCategory('flexibility')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            filterCategory === 'flexibility'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white bg-white/[0.03]'
          }`}
        >
          Mobility & Yoga
        </button>
      </div>

      {/* Workouts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWorkouts.map((workout) => {
          const badge = categoryBadges[workout.category] || categoryBadges.strength;
          const completedToday = workout.completedHistory.some((h) => h.date === todayDate);

          return (
            <div
              key={workout.id}
              className="glass-panel p-5 rounded-2xl border border-white/[0.08] hover:border-white/[0.14] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">{workout.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      {workout.dayOfWeek && <span>🗓️ {workout.dayOfWeek}</span>}
                      <span className="flex items-center gap-1 font-mono text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {workout.durationMin} mins
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteWorkout(workout.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                    title="Delete workout"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Exercises List */}
                <div className="space-y-2 mt-4 pt-3 border-t border-white/[0.05]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Exercise Routine ({workout.exercises.length})
                  </p>
                  <div className="space-y-1.5">
                    {workout.exercises.map((ex, idx) => (
                      <div
                        key={ex.id || idx}
                        className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs flex items-center justify-between"
                      >
                        <div className="truncate pr-2">
                          <span className="font-semibold text-slate-200 block truncate">
                            {ex.name}
                          </span>
                          {ex.notes && (
                            <span className="text-[10px] text-slate-400 block truncate">{ex.notes}</span>
                          )}
                        </div>

                        <div className="text-[11px] font-mono font-medium text-orange-300 shrink-0">
                          {ex.sets.map((s, i) => (
                            <span key={i} className="ml-1">
                              {s.weightKg ? `${s.reps}x${s.weightKg}kg` : s.durationMin ? `${s.durationMin}m` : `${s.reps}r`}
                              {i < ex.sets.length - 1 ? ',' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Complete Today Action */}
              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Logged {workout.completedHistory.length} times
                </span>

                <button
                  onClick={() => logWorkoutCompletion(workout.id, 'Completed session')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                    completedToday
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-orange-600 hover:bg-orange-500 text-white shadow-md shadow-orange-900/30'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{completedToday ? 'Done Today' : 'Log Workout'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Workout Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141f] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-orange-400" />
                <span>Create Workout Routine</span>
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
                <label className="block text-slate-300 font-medium mb-1">Workout Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Upper Body Hypertrophy & Pull"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full glass-input px-2.5 py-2 rounded-xl text-xs"
                  >
                    <option value="strength" className="bg-[#12141f]">Strength</option>
                    <option value="cardio" className="bg-[#12141f]">Cardio</option>
                    <option value="flexibility" className="bg-[#12141f]">Mobility</option>
                    <option value="hiit" className="bg-[#12141f]">HIIT</option>
                    <option value="pilates" className="bg-[#12141f]">Pilates</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Scheduled Day</label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    className="w-full glass-input px-2.5 py-2 rounded-xl text-xs"
                  >
                    <option value="Monday" className="bg-[#12141f]">Monday</option>
                    <option value="Tuesday" className="bg-[#12141f]">Tuesday</option>
                    <option value="Wednesday" className="bg-[#12141f]">Wednesday</option>
                    <option value="Thursday" className="bg-[#12141f]">Thursday</option>
                    <option value="Friday" className="bg-[#12141f]">Friday</option>
                    <option value="Saturday" className="bg-[#12141f]">Saturday</option>
                    <option value="Sunday" className="bg-[#12141f]">Sunday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Duration (Min)</label>
                  <input
                    type="number"
                    value={durationMin}
                    onChange={(e) => setDurationMin(e.target.value)}
                    className="w-full glass-input px-2.5 py-2 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Exercises (one per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="Dumbbell Overhead Press&#10;Incline Dumbbell Bench&#10;Cable Lateral Raises&#10;Pull-Ups"
                  value={exercisesInput}
                  onChange={(e) => setExercisesInput(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs leading-relaxed"
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
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium shadow-md shadow-orange-900/30"
                >
                  Save Workout Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
