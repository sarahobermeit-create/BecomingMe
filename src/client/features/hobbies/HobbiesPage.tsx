import { CheckCircle2, Circle, Palette, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { QueryBoundary } from "#client/components/QueryBoundary.tsx";
import { useHobbies, useSaveHobby } from "#client/features/hobbies/hobbies.api.ts";
import type { Hobby } from "#shared/hobbies.ts";

export function HobbiesPage() {
  const hobbiesQuery = useHobbies();
  const saveHobby = useSaveHobby();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Creative");
  const [level, setLevel] = useState<Hobby["level"]>("Beginner");
  const [currentProject, setCurrentProject] = useState("");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    saveHobby.mutate({
      id: crypto.randomUUID(),
      name: name.trim(),
      category,
      level,
      hoursSpent: 0,
      targetWeeklyHours: 4,
      currentProject: currentProject.trim() || undefined,
      milestones: [],
      deleted: false,
      changedAt: Date.now(),
    });

    setName("");
    setCurrentProject("");
    setIsAddOpen(false);
  };

  const handleToggleMilestone = (hobby: Hobby, milestoneId: string) => {
    const updated = hobby.milestones.map((m) => (m.id === milestoneId ? { ...m, completed: !m.completed } : m));
    saveHobby.mutate({
      ...hobby,
      milestones: updated,
      deleted: false,
      changedAt: Date.now(),
    });
  };

  const handleDelete = (hobby: Hobby) => {
    if (window.confirm(`Delete "${hobby.name}"?`)) {
      saveHobby.mutate({
        ...hobby,
        deleted: true,
        changedAt: Date.now(),
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <QueryBoundary query={hobbiesQuery}>
        {(hobbies) => (
          <>
            <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Palette className="w-6 h-6 text-emerald-400" />
                  <span>Hobbies & Passions</span>
                </h1>
                <p className="text-xs text-slate-300 mt-1">Nurture creativity, craftsmanship, and lifelong learning.</p>
              </div>
              <button
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>New Hobby</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hobbies.map((h) => (
                <div key={h.id} className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-base font-bold text-white">{h.name}</h3>
                      <span className="text-[11px] text-emerald-400 capitalize">{h.category} • {h.level}</span>
                    </div>
                    <button onClick={() => handleDelete(h)} className="p-1 text-slate-600 hover:text-rose-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {h.currentProject && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs">
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Active Project</span>
                      <p className="text-white font-medium mt-0.5">{h.currentProject}</p>
                    </div>
                  )}

                  {h.milestones.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Milestones</span>
                      {h.milestones.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => handleToggleMilestone(h, m.id)}
                          className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white"
                        >
                          {m.completed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-slate-500" />
                          )}
                          <span className={m.completed ? "line-through text-slate-500" : ""}>{m.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {hobbies.length === 0 && (
                <div className="col-span-2 py-16 text-center text-xs text-slate-400">
                  No hobbies added yet. What passion would you like to explore?
                </div>
              )}
            </div>

            {isAddOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="relative w-full max-w-md p-6 rounded-2xl glass-panel text-slate-100 shadow-2xl border border-emerald-500/30">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h2 className="text-lg font-bold">Add Hobby</h2>
                    <button onClick={() => setIsAddOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleAddSubmit} className="space-y-3 mt-4 text-sm">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Hobby Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Botanical Illustration, Woodworking"
                        className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                        >
                          <option value="Creative">Creative</option>
                          <option value="Craft">Craft</option>
                          <option value="Music">Music</option>
                          <option value="Outdoor">Outdoor</option>
                          <option value="Tech">Tech</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Level</label>
                        <select
                          value={level}
                          onChange={(e) => setLevel(e.target.value as any)}
                          className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Master">Master</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Current Project (optional)</label>
                      <input
                        type="text"
                        value={currentProject}
                        onChange={(e) => setCurrentProject(e.target.value)}
                        placeholder="e.g. Painting a Gothic Garden Herbarium"
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
                        className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-lg"
                      >
                        Add Hobby
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
