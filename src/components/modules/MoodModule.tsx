import React, { useState } from 'react';
import { useLife } from '../../context/LifeContext';
import {
  Smile,
  Heart,
  Zap,
  BatteryMedium,
  BatteryCharging,
  Sparkles,
  Calendar,
  Tag,
} from 'lucide-react';
import { MoodScore } from '../../types';

export const MoodModule: React.FC = () => {
  const { state, todayDate, logMood } = useLife();
  const [selectedDate, setSelectedDate] = useState(todayDate);

  const existingEntry = state.moods.find((m) => m.date === selectedDate);

  const [score, setScore] = useState<MoodScore>(existingEntry?.score || 4);
  const [energyLevel, setEnergyLevel] = useState<number>(existingEntry?.energyLevel || 4);
  const [label, setLabel] = useState(existingEntry?.label || 'Peaceful & Content');
  const [selectedFactors, setSelectedFactors] = useState<string[]>(
    existingEntry?.factors || ['Good Sleep', 'Movement', 'Productive']
  );
  const [note, setNote] = useState(existingEntry?.journalNote || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const moodOptions: { score: MoodScore; emoji: string; label: string; color: string; desc: string }[] = [
    { score: 5, emoji: '😄', label: 'Ecstatic & Inspired', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-300', desc: 'High enthusiasm, creative flow' },
    { score: 4, emoji: '🙂', label: 'Good & Peaceful', color: 'border-cyan-500 bg-cyan-500/10 text-cyan-300', desc: 'Content, balanced, calm momentum' },
    { score: 3, emoji: '😐', label: 'Neutral & Grounded', color: 'border-indigo-500 bg-indigo-500/10 text-indigo-300', desc: 'Okay, regular day, cruising' },
    { score: 2, emoji: '😔', label: 'Low & Melancholy', color: 'border-amber-500 bg-amber-500/10 text-amber-300', desc: 'Need gentle care, slower pace' },
    { score: 1, emoji: '😫', label: 'Exhausted & Overwhelmed', color: 'border-rose-500 bg-rose-500/10 text-rose-300', desc: 'Stress, high burnout, rest required' },
  ];

  const factorOptions = [
    'Good Sleep',
    'Poor Sleep',
    'Morning Walk',
    'Workout / Yoga',
    'Healthy Food',
    'Coffee / Matcha',
    'Social & Friends',
    'Family Time',
    'Creative Flow',
    'Deep Work Focus',
    'Screen Fatigue',
    'Sunny Weather',
    'Rainy Day',
    'Nature & Outdoors',
    'Meditation',
  ];

  const toggleFactor = (f: string) => {
    if (selectedFactors.includes(f)) {
      setSelectedFactors(selectedFactors.filter((x) => x !== f));
    } else {
      setSelectedFactors([...selectedFactors, f]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    logMood({
      date: selectedDate,
      score,
      energyLevel,
      label,
      factors: selectedFactors,
      journalNote: note.trim() || undefined,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Calculate mood stats
  const averageScore = state.moods.length > 0
    ? (state.moods.reduce((acc, m) => acc + m.score, 0) / state.moods.length).toFixed(1)
    : '5.0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-400" />
            <span>Daily Mood & Emotional Check-in</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Build mindful self-awareness by tracking daily feelings, energy reserves, and influencing factors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-xl">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                const found = state.moods.find((m) => m.date === e.target.value);
                if (found) {
                  setScore(found.score);
                  setEnergyLevel(found.energyLevel);
                  setLabel(found.label);
                  setSelectedFactors(found.factors);
                  setNote(found.journalNote || '');
                }
              }}
              className="bg-transparent text-xs text-slate-200 outline-none font-mono cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main Check-in Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form onSubmit={handleSave} className="lg:col-span-8 glass-panel rounded-2xl p-6 border border-white/[0.08] space-y-6">
          {/* 1. Mood Level Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              How are you feeling today?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {moodOptions.map((opt) => {
                const isSelected = score === opt.score;
                return (
                  <button
                    key={opt.score}
                    type="button"
                    onClick={() => {
                      setScore(opt.score);
                      setLabel(opt.label);
                    }}
                    className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? `${opt.color} ring-2 ring-violet-500/30 scale-[1.02] shadow-lg`
                        : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] text-slate-300'
                    }`}
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <span className="text-xs font-bold">{opt.label.split(' ')[0]}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Energy Level Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <BatteryCharging className="w-4 h-4 text-amber-400" />
                <span>Physical & Mental Energy</span>
              </label>
              <span className="text-xs font-mono font-bold text-amber-300">
                Level {energyLevel} of 5
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(parseInt(e.target.value, 10))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>1 - Drained</span>
              <span>2 - Low</span>
              <span>3 - Steady</span>
              <span>4 - Energized</span>
              <span>5 - Boundless Fire</span>
            </div>
          </div>

          {/* 3. Influencing Factors Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              What influenced your state today?
            </label>
            <div className="flex flex-wrap gap-2">
              {factorOptions.map((f) => {
                const active = selectedFactors.includes(f);
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleFactor(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm'
                        : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.05]'
                    }`}
                  >
                    #{f}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Journal Reflection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Daily Mindfulness & Reflection (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="What made you smile, what felt heavy, or what are you grateful for today?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full glass-input p-3 rounded-xl text-xs leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-bounce">
                <Sparkles className="w-4 h-4" />
                Mood logged successfully!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-lg shadow-rose-900/30 transition-all"
            >
              Save Check-in
            </button>
          </div>
        </form>

        {/* Right: History & Insights */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Mood Insights
            </h3>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
              <span className="text-4xl font-extrabold text-white font-mono">{averageScore}</span>
              <p className="text-xs text-rose-300 font-medium mt-1">Average Daily Rating</p>
              <p className="text-[11px] text-slate-400 mt-2">
                Based on {state.moods.length} logged entries
              </p>
            </div>
          </div>

          {/* Recent Mood Entries list */}
          <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Recent Check-ins
            </h3>
            <div className="space-y-2.5">
              {state.moods.slice(0, 4).map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedDate(m.date);
                    setScore(m.score);
                    setEnergyLevel(m.energyLevel);
                    setLabel(m.label);
                    setSelectedFactors(m.factors);
                    setNote(m.journalNote || '');
                  }}
                  className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] cursor-pointer transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{m.label}</span>
                    <span className="font-mono text-slate-400 text-[10px]">{m.date}</span>
                  </div>
                  {m.journalNote && (
                    <p className="text-[11px] text-slate-300 line-clamp-2 italic font-sans">
                      "{m.journalNote}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
