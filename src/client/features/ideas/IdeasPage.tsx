import { Lightbulb, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { QueryBoundary } from "#client/components/QueryBoundary.tsx";
import { useIdeas, useSaveIdea } from "#client/features/ideas/ideas.api.ts";
import type { IdeaPriority, IdeaStatus, LifeIdea } from "#shared/ideas.ts";

export function IdeasPage() {
  const ideasQuery = useIdeas();
  const saveIdea = useSaveIdea();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<LifeIdea["category"]>("Projects");
  const [priority, setPriority] = useState<IdeaPriority>("medium");
  const [status, setStatus] = useState<IdeaStatus>("spark");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    saveIdea.mutate({
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      category,
      status,
      priority,
      actionItems: [],
      tags: [],
      deleted: false,
      changedAt: Date.now(),
    });

    setTitle("");
    setDescription("");
    setIsAddOpen(false);
  };

  const handleDelete = (idea: LifeIdea) => {
    if (window.confirm(`Delete "${idea.title}"?`)) {
      saveIdea.mutate({
        ...idea,
        deleted: true,
        changedAt: Date.now(),
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <QueryBoundary query={ideasQuery}>
        {(ideas) => (
          <>
            <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-yellow-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-yellow-400" />
                  <span>Ideas & Future Aspirations</span>
                </h1>
                <p className="text-xs text-slate-300 mt-1">Brainstorm visions, creative plans, and bucket list goals.</p>
              </div>
              <button
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-yellow-600 hover:bg-yellow-500 rounded-xl shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>New Spark</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ideas.map((idea) => (
                <div key={idea.id} className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-base font-bold text-white">{idea.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span className="text-yellow-400 capitalize">{idea.category}</span>
                        <span>•</span>
                        <span className="capitalize">{idea.status}</span>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(idea)} className="p-1 text-slate-600 hover:text-rose-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{idea.description}</p>
                </div>
              ))}
              {ideas.length === 0 && (
                <div className="col-span-2 py-16 text-center text-xs text-slate-400">
                  No ideas captured yet. Add a new spark!
                </div>
              )}
            </div>

            {isAddOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="relative w-full max-w-md p-6 rounded-2xl glass-panel text-slate-100 shadow-2xl border border-yellow-500/30">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h2 className="text-lg font-bold">Capture Idea</h2>
                    <button onClick={() => setIsAddOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleAddSubmit} className="space-y-3 mt-4 text-sm">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Build an Antique Oak Writing Desk"
                        className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as any)}
                          className="w-full px-2 py-2 text-xs rounded-lg glass-input"
                        >
                          <option value="Projects">Projects</option>
                          <option value="Career">Career</option>
                          <option value="Travel">Travel</option>
                          <option value="Personal Growth">Growth</option>
                          <option value="Home">Home</option>
                          <option value="Bucket List">Bucket</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value as any)}
                          className="w-full px-2 py-2 text-xs rounded-lg glass-input"
                        >
                          <option value="spark">Spark</option>
                          <option value="planning">Planning</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Priority</label>
                        <select
                          value={priority}
                          onChange={(e) => setPriority(e.target.value as any)}
                          className="w-full px-2 py-2 text-xs rounded-lg glass-input"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                      <textarea
                        rows={3}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Elaborate on the vision or steps..."
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
                        className="px-4 py-2 text-sm font-semibold text-white bg-yellow-600 hover:bg-yellow-500 rounded-lg shadow-lg"
                      >
                        Save Spark
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
