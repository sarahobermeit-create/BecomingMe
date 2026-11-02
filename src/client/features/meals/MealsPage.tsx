import { Coffee, Cookie, Flame, Moon, Plus, Sun, Trash2, UtensilsCrossed, X } from "lucide-react";
import { useState } from "react";
import { QueryBoundary } from "#client/components/QueryBoundary.tsx";
import { useMeals, useSaveMeal } from "#client/features/meals/meals.api.ts";
import type { MealLogItem, MealType } from "#shared/meals.ts";

export function MealsPage() {
  const mealsQuery = useMeals();
  const saveMeal = useSaveMeal();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0] ?? "");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [mealType, setMealType] = useState<MealType>("breakfast");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState<number | "">("");

  const sections: { type: MealType; label: string; icon: any; color: string }[] = [
    { type: "breakfast", label: "Breakfast & Morning Fuel", icon: Coffee, color: "text-amber-400" },
    { type: "lunch", label: "Lunch & Nourishment", icon: Sun, color: "text-orange-400" },
    { type: "dinner", label: "Dinner & Evening Meal", icon: Moon, color: "text-emerald-400" },
    { type: "snack", label: "Snacks & Drinks", icon: Cookie, color: "text-cyan-400" },
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    saveMeal.mutate({
      id: crypto.randomUUID(),
      date: selectedDate,
      mealType,
      title: title.trim(),
      description: description.trim() || undefined,
      calories: calories === "" ? undefined : Number(calories),
      deleted: false,
      changedAt: Date.now(),
    });

    setTitle("");
    setDescription("");
    setCalories("");
    setIsAddOpen(false);
  };

  const handleDelete = (meal: MealLogItem) => {
    if (window.confirm(`Delete "${meal.title}"?`)) {
      saveMeal.mutate({
        ...meal,
        deleted: true,
        changedAt: Date.now(),
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <QueryBoundary query={mealsQuery}>
        {(allMeals) => {
          const mealsForDate = allMeals.filter((m) => m.date === selectedDate);
          const totalCalories = mealsForDate.reduce((sum, m) => sum + (m.calories || 0), 0);

          return (
            <>
              {/* Header */}
              <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <UtensilsCrossed className="w-6 h-6 text-amber-400" />
                    <span>Daily Meal Logs</span>
                  </h1>
                  <p className="text-xs text-slate-300 mt-1">
                    {totalCalories > 0 ? (
                      <span className="flex items-center gap-1 font-semibold text-amber-300">
                        <Flame className="w-3.5 h-3.5 text-amber-400" /> {totalCalories} kcal logged today
                      </span>
                    ) : (
                      "Track daily nourishment and recipes."
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-xl glass-input"
                  />
                  <button
                    onClick={() => setIsAddOpen(true)}
                    className="flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Log Meal</span>
                  </button>
                </div>
              </div>

              {/* Meal Sections */}
              <div className="space-y-4">
                {sections.map(({ type, label, icon: Icon, color }) => {
                  const sectionMeals = mealsForDate.filter((m) => m.mealType === type);
                  return (
                    <div key={type} className="p-4 rounded-xl glass-panel border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${color}`}>
                          <Icon className="w-4 h-4" />
                          {label}
                        </span>
                        <button
                          onClick={() => {
                            setMealType(type);
                            setIsAddOpen(true);
                          }}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {sectionMeals.map((m) => (
                          <div
                            key={m.id}
                            className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between"
                          >
                            <div>
                              <p className="text-xs font-semibold text-white">{m.title}</p>
                              {m.description && <p className="text-[11px] text-slate-400 mt-0.5">{m.description}</p>}
                            </div>
                            <div className="flex items-center gap-2">
                              {m.calories && (
                                <span className="text-xs font-mono text-amber-400">{m.calories} kcal</span>
                              )}
                              <button
                                onClick={() => handleDelete(m)}
                                className="p-1 rounded text-slate-600 hover:text-rose-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                        {sectionMeals.length === 0 && (
                          <p className="text-[11px] text-slate-500 italic py-1">Nothing logged yet.</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Modal */}
              {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <div className="relative w-full max-w-md p-6 rounded-2xl glass-panel text-slate-100 shadow-2xl border border-amber-500/30">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <h2 className="text-lg font-bold">Log Meal</h2>
                      <button onClick={() => setIsAddOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleAddSubmit} className="space-y-3 mt-4 text-sm">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">Meal Type</label>
                          <select
                            value={mealType}
                            onChange={(e) => setMealType(e.target.value as MealType)}
                            className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                          >
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="snack">Snack / Drink</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">Calories (optional)</label>
                          <input
                            type="number"
                            min="0"
                            value={calories}
                            onChange={(e) => setCalories(e.target.value === "" ? "" : Number(e.target.value))}
                            placeholder="450"
                            className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Dish / Meal Title</label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Sourdough Avocado Toast & Poached Egg"
                          className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Ingredients / Notes</label>
                        <textarea
                          rows={2}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Olive oil, spinach, black pepper..."
                          className="w-full px-3 py-2 text-sm rounded-lg glass-input"
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
                          className="px-4 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg shadow-lg"
                        >
                          Log Meal
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
