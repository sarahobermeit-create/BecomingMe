import React, { useRef } from 'react';
import { useLife } from '../../context/LifeContext';
import {
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Calendar as CalendarIcon,
  CheckCircle2,
  Droplets,
  Heart,
  Wifi,
  WifiOff,
  Flame,
} from 'lucide-react';
import { TabType } from '../../types';
import { calculateDailyStreak } from '../../utils/streak';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const {
    state,
    todayDate,
    isLiveConnected,
    exportBackupJson,
    importBackupJson,
    resetToDemoData,
  } = useLife();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ok = await importBackupJson(file);
      if (ok) {
        alert('Data imported successfully!');
      } else {
        alert('Failed to import backup file. Please verify file format.');
      }
    }
  };

  // Quick stats
  const todayWater = state.waterLogs[todayDate]?.amountMl || 0;
  const targetWater = state.waterDailyTargetMl || 2500;
  const waterPct = Math.min(100, Math.round((todayWater / targetWater) * 100));

  const completedRoutines = state.routines.filter((r) => r.completedDates.includes(todayDate)).length;
  const totalRoutines = state.routines.length;

  const todayMood = state.moods.find((m) => m.date === todayDate);

  // Daily Streak calculation
  const dailyStreak = calculateDailyStreak(state, todayDate);

  return (
    <header className="sticky top-0 z-30 bg-[#08140d]/90 backdrop-blur-md border-b border-emerald-500/15 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Branding & Date */}
      <div className="flex items-center gap-4">
        <div
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-700 to-green-500 p-[1px] shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0a180f] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              Becoming<span className="text-emerald-400 font-extrabold">Me</span>
            </h1>
            <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <CalendarIcon className="w-3 h-3 text-slate-500" />
              {formattedDate}
            </p>
          </div>
        </div>
      </div>

      {/* Center: Live Today Quick Glance Indicators */}
      <div className="hidden md:flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-full px-3 py-1 text-xs">
        {/* Routines Badge */}
        <button
          onClick={() => setActiveTab('routines')}
          className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
          title="Today's routines"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-300 font-medium">
            {completedRoutines}/{totalRoutines}
          </span>
          <span className="text-slate-500 text-[11px]">Routines</span>
        </button>

        <span className="text-white/10">•</span>

        {/* Water Badge */}
        <button
          onClick={() => setActiveTab('water')}
          className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
          title="Today's water"
        >
          <Droplets className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 font-medium">{waterPct}%</span>
          <span className="text-slate-500 text-[11px]">Water</span>
        </button>

        <span className="text-white/10">•</span>

        {/* Mood Badge */}
        <button
          onClick={() => setActiveTab('mood')}
          className="flex items-center gap-1.5 hover:text-rose-400 transition-colors"
          title="Today's mood"
        >
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-slate-300 font-medium">
            {todayMood ? todayMood.label : 'Log mood'}
          </span>
        </button>
      </div>

      {/* Right: Daily Streak Count, Live Connection Indicator & Data Tools */}
      <div className="flex items-center gap-2">
        {/* Daily Streak Count Badge */}
        <button
          onClick={() => setActiveTab('routines')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/20 to-amber-500/15 hover:from-amber-500/25 hover:to-orange-500/30 border border-amber-400/40 hover:border-amber-400/70 shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all cursor-pointer group"
          title={`${dailyStreak} day streak! Click to view habits and routines.`}
        >
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse group-hover:scale-110 transition-transform" />
          <span className="font-mono font-black text-xs text-amber-200">
            {dailyStreak}
          </span>
          <span className="text-[11px] font-bold text-amber-300 hidden sm:inline font-serif">
            {dailyStreak === 1 ? 'Day Streak' : 'Days Streak'}
          </span>
        </button>

        {/* Real-time Cross-Device Status Indicator */}
        <div
          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all ${
            isLiveConnected
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
              : 'bg-white/[0.04] text-slate-400 border-white/[0.06]'
          }`}
          title={
            isLiveConnected
              ? 'Real-time live sync connected! Changes update automatically between phone and PC'
              : 'Running in local mode'
          }
        >
          {isLiveConnected ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Live Synced</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Local Mode</span>
            </>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".json"
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          title="Import JSON backup"
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] px-2.5 py-1.5 rounded-lg transition-all"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Import</span>
        </button>

        <button
          onClick={exportBackupJson}
          title="Export JSON backup"
          className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] px-2.5 py-1.5 rounded-lg transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Backup</span>
        </button>

        <button
          onClick={resetToDemoData}
          title="Reset to starter sample data"
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-amber-400 p-1.5 hover:bg-white/[0.04] rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
