import React, { useState } from 'react';
import { useLife } from '../../context/LifeContext';
import {
  Lightbulb,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar,
  Sparkles,
  ArrowRight,
  Compass,
  Rocket,
  CheckCheck,
} from 'lucide-react';
import { LifeIdea, IdeaPriority, IdeaStatus } from '../../types';

export const IdeasModule: React.FC = () => {
  const { state, addIdea, updateIdea, deleteIdea, toggleIdeaAction } = useLife();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<LifeIdea['category']>('Projects');
  const [priority, setPriority] = useState<IdeaPriority>('medium');
  const [status, setStatus] = useState<IdeaStatus>('spark');
  const [targetDate, setTargetDate] = useState('');
  const [actionsInput, setActionsInput] = useState('');

  const columns: { id: IdeaStatus; label: string; icon: React.ComponentType<any>; color: string }[] = [
    { id: 'spark', label: 'Sparks & Someday', icon: Sparkles, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
    { id: 'planning', label: 'Exploring & Planning', icon: Compass, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    { id: 'in_progress', label: 'Active In Progress', icon: Rocket, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'completed', label: 'Achieved & Completed', icon: CheckCheck, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  ];

  const categories = ['Career', 'Travel', 'Projects', 'Personal Growth', 'Home', 'Bucket List'];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const actionItems = actionsInput
      .split('\n')
      .map((a) => a.trim())
      .filter((a) => a.length > 0)
      .map((text, idx) => ({
        id: `ai-${Date.now()}-${idx}`,
        text,
        done: false,
      }));

    addIdea({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status,
      targetDate: targetDate || undefined,
      actionItems,
      tags: [category],
    });

    setTitle('');
    setDescription('');
    setTargetDate('');
    setActionsInput('');
    setShowAddModal(false);
  };

  const handleMoveStatus = (idea: LifeIdea, nextStatus: IdeaStatus) => {
    updateIdea({ ...idea, status: nextStatus });
  };

  const priorityColors: Record<IdeaPriority, string> = {
    high: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    low: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            <span>Ideas, Visions & Future Plans</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Turn spontaneous creative brainstorms and bucket-list ambitions into actionable realities.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-yellow-900/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Capture Idea</span>
        </button>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
            filterCategory === 'all'
              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
              : 'text-slate-400 hover:text-white bg-white/[0.03]'
          }`}
        >
          All Categories ({state.ideas.length})
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilterCategory(c)}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              filterCategory === c
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                : 'text-slate-400 hover:text-white bg-white/[0.03]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const ColIcon = col.icon;
          const ideasInCol = state.ideas.filter((i) => {
            if (i.status !== col.id) return false;
            if (filterCategory !== 'all' && i.category !== filterCategory) return false;
            return true;
          });

          return (
            <div
              key={col.id}
              className="glass-panel rounded-2xl p-4 border border-white/[0.08] min-h-[420px] flex flex-col justify-between"
            >
              <div>
                {/* Column header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg border ${col.color}`}>
                      <ColIcon className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-bold text-white">{col.label}</h3>
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/[0.05] text-slate-300">
                    {ideasInCol.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-3">
                  {ideasInCol.map((idea) => {
                    const doneActions = idea.actionItems.filter((a) => a.done).length;
                    const totalActions = idea.actionItems.length;

                    return (
                      <div
                        key={idea.id}
                        className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] transition-all space-y-2.5 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityColors[idea.priority]}`}>
                              {idea.priority}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {idea.category}
                            </span>
                          </div>

                          <button
                            onClick={() => deleteIdea(idea.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                            title="Delete idea"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h4 className="text-xs font-bold text-white leading-snug">{idea.title}</h4>

                        {idea.description && (
                          <p className="text-[11px] text-slate-300 leading-relaxed font-sans line-clamp-3">
                            {idea.description}
                          </p>
                        )}

                        {/* Action Steps Checklist */}
                        {totalActions > 0 && (
                          <div className="pt-2 border-t border-white/[0.04] space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span>Action Steps</span>
                              <span className="font-mono">{doneActions}/{totalActions}</span>
                            </div>
                            <div className="space-y-1">
                              {idea.actionItems.map((item) => (
                                <div
                                  key={item.id}
                                  onClick={() => toggleIdeaAction(idea.id, item.id)}
                                  className={`flex items-center gap-1.5 text-[11px] cursor-pointer transition-colors ${
                                    item.done ? 'line-through text-slate-500' : 'text-slate-300 hover:text-white'
                                  }`}
                                >
                                  {item.done ? (
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                  ) : (
                                    <Circle className="w-3 h-3 text-slate-600 shrink-0" />
                                  )}
                                  <span className="truncate">{item.text}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Target Date & Status Move Shortcuts */}
                        <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px]">
                          {idea.targetDate ? (
                            <span className="text-slate-400 flex items-center gap-1 font-mono">
                              <Calendar className="w-3 h-3 text-slate-500" />
                              {idea.targetDate}
                            </span>
                          ) : <span />}

                          {/* Quick advance status dropdown/button */}
                          <div className="flex items-center gap-1">
                            {col.id !== 'completed' && (
                              <button
                                onClick={() => {
                                  const order: IdeaStatus[] = ['spark', 'planning', 'in_progress', 'completed'];
                                  const nextIdx = order.indexOf(col.id) + 1;
                                  handleMoveStatus(idea, order[nextIdx]);
                                }}
                                className="px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 flex items-center gap-1 text-[10px]"
                                title="Move to next stage"
                              >
                                <span>Advance</span>
                                <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom quick add button */}
              <button
                onClick={() => {
                  setStatus(col.id);
                  setShowAddModal(true);
                }}
                className="w-full mt-3 py-1.5 rounded-lg border border-dashed border-white/10 hover:border-white/20 text-slate-500 hover:text-slate-300 text-xs flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Card</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Idea Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141f] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <span>Capture New Idea or Plan</span>
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
                <label className="block text-slate-300 font-medium mb-1">Title / Vision</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Italian Cooking & Pasta from Scratch"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description & Inspiration</label>
                <textarea
                  rows={3}
                  placeholder="Why does this matter? What is the vision?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full glass-input px-2 py-2 rounded-xl text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} className="bg-[#12141f]">{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="w-full glass-input px-2 py-2 rounded-xl text-xs"
                  >
                    <option value="high" className="bg-[#12141f]">High</option>
                    <option value="medium" className="bg-[#12141f]">Medium</option>
                    <option value="low" className="bg-[#12141f]">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full glass-input px-2 py-2 rounded-xl text-xs"
                  >
                    <option value="spark" className="bg-[#12141f]">Spark</option>
                    <option value="planning" className="bg-[#12141f]">Planning</option>
                    <option value="in_progress" className="bg-[#12141f]">In Progress</option>
                    <option value="completed" className="bg-[#12141f]">Done</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Target Date (Optional)</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Initial Action Steps (one per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Research pasta machine&#10;Buy '00' semolina flour&#10;Make tagliatelle dinner"
                  value={actionsInput}
                  onChange={(e) => setActionsInput(e.target.value)}
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
                  className="px-4 py-2 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white font-medium shadow-md shadow-yellow-900/30"
                >
                  Save Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
