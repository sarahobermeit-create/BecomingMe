import React, { useState } from 'react';
import { useLife } from '../../context/LifeContext';
import {
  UtensilsCrossed,
  Plus,
  Trash2,
  Calendar,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Flame,
  Tag,
} from 'lucide-react';
import { MealType } from '../../types';

export const MealLogsModule: React.FC = () => {
  const { state, todayDate, addMeal, deleteMeal } = useLife();
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Meal Form State
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState<number | ''>('');
  const [tagsInput, setTagsInput] = useState('');

  const mealsForDate = state.meals.filter((m) => m.date === selectedDate);
  const totalCalories = mealsForDate.reduce((sum, m) => sum + (m.calories || 0), 0);

  const mealSections: { type: MealType; label: string; icon: React.ComponentType<any>; color: string }[] = [
    { type: 'breakfast', label: 'Breakfast & Morning Fuel', icon: Coffee, color: 'text-amber-400 bg-amber-500/10' },
    { type: 'lunch', label: 'Lunch & Nourishment', icon: Sun, color: 'text-orange-400 bg-orange-500/10' },
    { type: 'dinner', label: 'Dinner & Evening Meal', icon: Moon, color: 'text-indigo-400 bg-indigo-500/10' },
    { type: 'snack', label: 'Snacks & Drinks', icon: Cookie, color: 'text-pink-400 bg-pink-500/10' },
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    addMeal({
      date: selectedDate,
      mealType,
      title: title.trim(),
      description: description.trim() || undefined,
      calories: calories === '' ? undefined : Number(calories),
      tags: tags.length > 0 ? tags : undefined,
    });

    setTitle('');
    setDescription('');
    setCalories('');
    setTagsInput('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-amber-400" />
            <span>Daily Meal Logs & Nutrition</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track mindful meals, healthy ingredients, energy levels, and daily calories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Picker */}
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-xl">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs text-slate-200 outline-none font-mono cursor-pointer"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Log Meal</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/[0.06] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Total Logged Energy
            </span>
            <p className="text-2xl font-bold text-white font-mono mt-1">{totalCalories} <span className="text-xs text-slate-400 font-sans font-normal">kcal</span></p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/[0.06] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Meals Logged Today
            </span>
            <p className="text-2xl font-bold text-white font-mono mt-1">{mealsForDate.length} <span className="text-xs text-slate-400 font-sans font-normal">items</span></p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/[0.06] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Selected Log Date
            </span>
            <p className="text-sm font-semibold text-slate-200 mt-2 font-mono">
              {selectedDate === todayDate ? 'Today' : selectedDate}
            </p>
          </div>
          <button
            onClick={() => setSelectedDate(todayDate)}
            className="text-xs text-amber-400 hover:underline font-medium"
          >
            Jump to Today
          </button>
        </div>
      </div>

      {/* Meal Categories Sections */}
      <div className="space-y-6">
        {mealSections.map(({ type, label, icon: Icon, color }) => {
          const mealsOfType = mealsForDate.filter((m) => m.mealType === type);

          return (
            <div key={type} className="glass-panel rounded-2xl p-5 border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">{label}</h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ({mealsOfType.length})
                  </span>
                </div>

                <button
                  onClick={() => {
                    setMealType(type);
                    setShowAddModal(true);
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add {type}</span>
                </button>
              </div>

              {mealsOfType.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {mealsOfType.map((meal) => (
                    <div
                      key={meal.id}
                      className="group p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-white">{meal.title}</h4>
                          <div className="flex items-center gap-2">
                            {meal.calories && (
                              <span className="text-[11px] font-mono font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 shrink-0">
                                {meal.calories} kcal
                              </span>
                            )}
                            <button
                              onClick={() => deleteMeal(meal.id)}
                              className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                              title="Delete meal"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {meal.description && (
                          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-sans">
                            {meal.description}
                          </p>
                        )}
                      </div>

                      {meal.tags && meal.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-white/[0.04]">
                          {meal.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] text-slate-400 bg-white/[0.04] px-1.5 py-0.5 rounded flex items-center gap-1"
                            >
                              <Tag className="w-2.5 h-2.5 text-slate-500" />
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic py-2">
                  Nothing logged for {type} on this date.
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Meal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141f] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                <span>Log a Meal or Snack</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Meal Time</label>
                  <select
                    value={mealType}
                    onChange={(e: any) => setMealType(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  >
                    <option value="breakfast" className="bg-[#12141f]">Breakfast</option>
                    <option value="lunch" className="bg-[#12141f]">Lunch</option>
                    <option value="dinner" className="bg-[#12141f]">Dinner</option>
                    <option value="snack" className="bg-[#12141f]">Snack / Drink</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Calories (Optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 450"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value ? Number(e.target.value) : '')}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Meal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Avocado Toast with Poached Eggs"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Ingredients or Notes</label>
                <textarea
                  rows={2}
                  placeholder="Add details, ingredients, or notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="High Protein, Homemade, Vegan, Quick"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
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
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium shadow-md shadow-amber-900/30"
                >
                  Log Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
