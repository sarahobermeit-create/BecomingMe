import React, { useState } from 'react';
import { useLife } from '../../context/LifeContext';
import {
  Palette,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  Circle,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Hobby } from '../../types';

export const HobbiesModule: React.FC = () => {
  const { state, addHobby, updateHobby, deleteHobby, toggleHobbyMilestone } = useLife();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Creative');
  const [icon, setIcon] = useState('🎨');
  const [targetWeeklyHours, setTargetWeeklyHours] = useState('3');
  const [currentProject, setCurrentProject] = useState('');
  const [milestonesInput, setMilestonesInput] = useState('');
  const [level, setLevel] = useState<Hobby['level']>('Beginner');

  const icons = ['🎨', '📸', '🎸', '🍞', '💻', '🪴', '🧶', '✍️', '🎮', '🥋'];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const milestones = milestonesInput
      .split('\n')
      .map((m) => m.trim())
      .filter((m) => m.length > 0)
      .map((title, idx) => ({
        id: `m-${Date.now()}-${idx}`,
        title,
        completed: false,
      }));

    addHobby({
      name: name.trim(),
      category,
      icon,
      level,
      hoursSpent: 0,
      targetWeeklyHours: parseFloat(targetWeeklyHours) || 3,
      currentProject: currentProject.trim() || undefined,
      milestones,
    });

    setName('');
    setCurrentProject('');
    setMilestonesInput('');
    setShowAddModal(false);
  };

  const handleLogHours = (hobby: Hobby, addedHours: number) => {
    updateHobby({
      ...hobby,
      hoursSpent: Math.max(0, hobby.hoursSpent + addedHours),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
            <Palette className="w-6 h-6 text-purple-400" />
            <span>Hobbies & Craft Mastery</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Cultivate your creative passions, log dedicated practice hours, and achieve milestones.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Track New Hobby</span>
        </button>
      </div>

      {/* Grid of Hobbies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {state.hobbies.map((hobby) => {
          const completedMilestones = hobby.milestones.filter((m) => m.completed).length;
          const totalMilestones = hobby.milestones.length;
          const milestonePct = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

          return (
            <div
              key={hobby.id}
              className="glass-panel p-5 rounded-2xl border border-white/[0.08] hover:border-white/[0.14] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                      {hobby.icon || '🎨'}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white">{hobby.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-purple-300 font-medium px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                          {hobby.level}
                        </span>
                        <span className="text-[10px] text-slate-400">{hobby.category}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteHobby(hobby.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                    title="Delete hobby"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Hours Spent & Practice Logger */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] mb-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-400" /> Total Hours
                    </span>
                    <span className="text-white font-mono font-bold text-sm">
                      {hobby.hoursSpent} hrs
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/[0.04]">
                    <span>Weekly Target: {hobby.targetWeeklyHours}h</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleLogHours(hobby, 0.5)}
                        className="px-2 py-0.5 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 text-[10px]"
                      >
                        +30m
                      </button>
                      <button
                        onClick={() => handleLogHours(hobby, 1)}
                        className="px-2 py-0.5 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 text-[10px]"
                      >
                        +1h
                      </button>
                    </div>
                  </div>
                </div>

                {/* Current Project */}
                {hobby.currentProject && (
                  <div className="mb-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Current Focus Project
                    </span>
                    <p className="text-xs text-purple-200 font-medium mt-1 p-2 rounded-lg bg-purple-950/20 border border-purple-500/15">
                      {hobby.currentProject}
                    </p>
                  </div>
                )}

                {/* Milestones Checklist */}
                {totalMilestones > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Milestones ({completedMilestones}/{totalMilestones})</span>
                      <span className="font-mono text-purple-300">{milestonePct}%</span>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-2">
                      <div
                        className="bg-purple-500 h-full rounded-full transition-all"
                        style={{ width: `${milestonePct}%` }}
                      />
                    </div>

                    <div className="space-y-1.5">
                      {hobby.milestones.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => toggleHobbyMilestone(hobby.id, m.id)}
                          className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                            m.completed
                              ? 'text-slate-500 line-through'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {m.completed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                          )}
                          <span className="truncate">{m.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {hobby.notes && (
                <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-slate-400 italic">
                  "{hobby.notes}"
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Hobby Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141f] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-400" />
                <span>Track a New Hobby</span>
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
                <label className="block text-slate-300 font-medium mb-1.5">Choose Icon</label>
                <div className="flex flex-wrap gap-2">
                  {icons.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIcon(ic)}
                      className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all ${
                        icon === ic
                          ? 'bg-purple-500/20 border border-purple-400 scale-110'
                          : 'bg-white/[0.03] border border-white/[0.06]'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Hobby Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Classical Guitar, 3D Modeling, Bonsai"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Skill Level</label>
                  <select
                    value={level}
                    onChange={(e: any) => setLevel(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  >
                    <option value="Beginner" className="bg-[#12141f]">Beginner</option>
                    <option value="Intermediate" className="bg-[#12141f]">Intermediate</option>
                    <option value="Advanced" className="bg-[#12141f]">Advanced</option>
                    <option value="Master" className="bg-[#12141f]">Master</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Weekly Goal (Hours)</label>
                  <input
                    type="number"
                    value={targetWeeklyHours}
                    onChange={(e) => setTargetWeeklyHours(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Current Active Project</label>
                <input
                  type="text"
                  placeholder="e.g. Fingerpicking Spanish Romance"
                  value={currentProject}
                  onChange={(e) => setCurrentProject(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Key Milestones (one per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Learn first 3 songs&#10;Play with metronome at 100bpm&#10;Record full piece"
                  value={milestonesInput}
                  onChange={(e) => setMilestonesInput(e.target.value)}
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
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium shadow-md shadow-purple-900/30"
                >
                  Create Hobby Tracker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
