import React, { useState } from 'react';
import { useLife } from '../../context/LifeContext';
import {
  Droplets,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  Award,
  Calendar,
  Check,
} from 'lucide-react';

export const WaterTrackerModule: React.FC = () => {
  const { state, todayDate, addWater, setWaterTarget, resetTodayWater } = useLife();
  const [customMl, setCustomMl] = useState('');
  const [editingTarget, setEditingTarget] = useState(false);
  const [newTarget, setNewTarget] = useState(state.waterDailyTargetMl.toString());

  const currentLog = state.waterLogs[todayDate] || {
    date: todayDate,
    amountMl: 0,
    targetMl: state.waterDailyTargetMl,
  };

  const amount = currentLog.amountMl;
  const target = state.waterDailyTargetMl;
  const percentage = Math.min(100, Math.round((amount / target) * 100));

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customMl, 10);
    if (!isNaN(val) && val > 0) {
      addWater(val);
      setCustomMl('');
    }
  };

  const handleSaveTarget = () => {
    const val = parseInt(newTarget, 10);
    if (!isNaN(val) && val >= 500) {
      setWaterTarget(val);
      setEditingTarget(false);
    }
  };

  // Generate last 7 days history
  const pastDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const log = state.waterLogs[dateStr];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    return {
      date: dateStr,
      dayLabel,
      amount: log?.amountMl || 0,
      target: log?.targetMl || target,
      met: (log?.amountMl || 0) >= (log?.targetMl || target),
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
            <Droplets className="w-6 h-6 text-cyan-400" />
            <span>Water & Hydration Tracker</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Stay sharp, energized, and hydrated throughout the day.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {editingTarget ? (
            <div className="flex items-center gap-1.5 bg-white/[0.04] p-1 rounded-xl border border-white/10">
              <input
                type="number"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                className="w-20 glass-input px-2 py-1 text-xs rounded-lg text-center font-mono"
              />
              <span className="text-xs text-slate-400">ml</span>
              <button
                onClick={handleSaveTarget}
                className="p-1 text-emerald-400 hover:bg-emerald-500/20 rounded-md"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setNewTarget(target.toString());
                setEditingTarget(true);
              }}
              className="text-xs text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 px-3 py-1.5 rounded-xl transition-colors"
            >
              Target: {target} ml (Edit)
            </button>
          )}

          <button
            onClick={resetTodayWater}
            title="Reset today's water"
            className="p-2 text-slate-500 hover:text-amber-400 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl border border-white/[0.05] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Hydration Visualizer Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: The Bottle / Gauge visual */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-white/[0.08] flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Visual Cup / Cylinder Container */}
          <div className="relative w-44 h-64 rounded-3xl border-4 border-cyan-400/40 bg-slate-900/80 shadow-2xl overflow-hidden flex flex-col justify-end p-2 mb-4">
            {/* Liquid Fill */}
            <div
              className="w-full bg-gradient-to-t from-cyan-600 via-sky-500 to-cyan-400 rounded-2xl transition-all duration-700 relative shadow-inner"
              style={{ height: `${percentage}%` }}
            >
              {/* Subtle wave light */}
              <div className="absolute inset-x-0 top-0 h-2 bg-white/30 rounded-t-full animate-pulse" />
            </div>

            {/* Centered reading overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 drop-shadow-md">
              <span className="text-4xl font-black text-white font-mono">{percentage}%</span>
              <span className="text-xs font-semibold text-cyan-200 mt-1">
                {amount} / {target} ml
              </span>
            </div>
          </div>

          {percentage >= 100 ? (
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <Award className="w-4 h-4" />
              <span>Daily Goal Crushed! Fantastic job!</span>
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              {(target - amount) > 0 ? `${target - amount} ml remaining for today` : 'Goal reached!'}
            </p>
          )}
        </div>

        {/* Right: Quick Controls & Presets */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel rounded-2xl p-6 border border-white/[0.08] space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Quick Hydration Logs</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => addWater(150)}
                className="p-3 rounded-xl bg-white/[0.03] hover:bg-cyan-500/15 border border-white/[0.06] hover:border-cyan-500/30 transition-all flex flex-col items-center gap-1 group text-center"
              >
                <span className="text-lg">☕</span>
                <span className="text-xs font-bold text-white group-hover:text-cyan-300">
                  +150 ml
                </span>
                <span className="text-[10px] text-slate-500">Teacup</span>
              </button>

              <button
                onClick={() => addWater(250)}
                className="p-3 rounded-xl bg-white/[0.03] hover:bg-cyan-500/15 border border-white/[0.06] hover:border-cyan-500/30 transition-all flex flex-col items-center gap-1 group text-center"
              >
                <span className="text-lg">🥛</span>
                <span className="text-xs font-bold text-white group-hover:text-cyan-300">
                  +250 ml
                </span>
                <span className="text-[10px] text-slate-500">Standard Glass</span>
              </button>

              <button
                onClick={() => addWater(500)}
                className="p-3 rounded-xl bg-white/[0.03] hover:bg-cyan-500/15 border border-white/[0.06] hover:border-cyan-500/30 transition-all flex flex-col items-center gap-1 group text-center"
              >
                <span className="text-lg">🍶</span>
                <span className="text-xs font-bold text-white group-hover:text-cyan-300">
                  +500 ml
                </span>
                <span className="text-[10px] text-slate-500">Water Bottle</span>
              </button>

              <button
                onClick={() => addWater(750)}
                className="p-3 rounded-xl bg-white/[0.03] hover:bg-cyan-500/15 border border-white/[0.06] hover:border-cyan-500/30 transition-all flex flex-col items-center gap-1 group text-center"
              >
                <span className="text-lg">🫙</span>
                <span className="text-xs font-bold text-white group-hover:text-cyan-300">
                  +750 ml
                </span>
                <span className="text-[10px] text-slate-500">Large Flask</span>
              </button>
            </div>

            {/* Custom Amount Form */}
            <form onSubmit={handleCustomAdd} className="pt-2 flex items-center gap-2">
              <input
                type="number"
                placeholder="Custom ml (e.g. 330)"
                value={customMl}
                onChange={(e) => setCustomMl(e.target.value)}
                className="flex-1 glass-input px-3 py-2 rounded-xl text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-cyan-900/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
              <button
                type="button"
                onClick={() => addWater(-250)}
                title="Subtract 250ml in case of typo"
                className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-rose-400 text-xs flex items-center gap-1 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Undo 250</span>
              </button>
            </form>
          </div>

          {/* 7-Day History Chart */}
          <div className="glass-panel rounded-2xl p-5 border border-white/[0.08]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>7-Day Hydration Consistency</span>
            </h3>

            <div className="grid grid-cols-7 gap-2 pt-2">
              {pastDays.map((d) => {
                const dayPct = Math.min(100, Math.round((d.amount / d.target) * 100));
                const isToday = d.date === todayDate;

                return (
                  <div key={d.date} className="flex flex-col items-center gap-1.5">
                    <div className="w-full bg-slate-800/80 rounded-lg h-24 p-1 flex flex-col justify-end border border-white/[0.04]">
                      <div
                        className={`w-full rounded-md transition-all ${
                          d.met
                            ? 'bg-gradient-to-t from-cyan-600 to-emerald-400'
                            : 'bg-cyan-600/50'
                        }`}
                        style={{ height: `${dayPct}%` }}
                        title={`${d.amount} ml (${dayPct}%)`}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-medium ${
                        isToday ? 'text-cyan-400 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {d.dayLabel}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {d.amount > 0 ? `${(d.amount / 1000).toFixed(1)}L` : '0L'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
