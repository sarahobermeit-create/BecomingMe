import { Calendar as CalendarIcon, CheckCircle2, Droplets, Heart, Sparkles, Wifi, WifiOff } from "lucide-react";
import { Link } from "react-router";
import { useIsOnline } from "#client/api/connectivity.ts";
import { useMood } from "#client/features/mood/mood.api.ts";
import { useRoutines } from "#client/features/routines/routines.api.ts";
import { useWaterLogs } from "#client/features/water/water.api.ts";

export function Navbar() {
  const isOnline = useIsOnline();
  const todayStr = new Date().toISOString().split("T")[0] ?? "";
  const { data: routines = [] } = useRoutines();
  const { data: waterLogs = [] } = useWaterLogs();
  const { data: moods = [] } = useMood();

  const completedRoutines = routines.filter((r) => r.completedDates.includes(todayStr)).length;
  const todayWater = waterLogs.find((w) => w.date === todayStr)?.amountMl ?? 0;
  const waterPct = Math.min(100, Math.round((todayWater / 2500) * 100));
  const todayMood = moods.find((m) => m.date === todayStr);

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 bg-[#08140d]/90 backdrop-blur-md border-b border-emerald-500/15 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Brand & Date */}
      <Link to="/" className="flex items-center gap-2.5 group">
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
      </Link>

      {/* Live Glance Badges */}
      <div className="hidden md:flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-full px-3 py-1 text-xs">
        <Link to="/routines" className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-300 font-medium font-mono">
            {completedRoutines}/{routines.length}
          </span>
          <span className="text-slate-500 text-[11px]">Routines</span>
        </Link>
        <span className="text-white/10">•</span>
        <Link to="/water" className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
          <Droplets className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 font-medium font-mono">{waterPct}%</span>
          <span className="text-slate-500 text-[11px]">Water</span>
        </Link>
        <span className="text-white/10">•</span>
        <Link to="/mood" className="flex items-center gap-1.5 hover:text-rose-400 transition-colors">
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-slate-300 font-medium">{todayMood?.label ?? "Log Mood"}</span>
        </Link>
      </div>

      {/* Connectivity Status */}
      <div
        className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all ${
          isOnline
            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
            : "bg-rose-500/10 text-rose-300 border-rose-500/20"
        }`}
      >
        {isOnline ? (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Offline (queued)</span>
          </>
        )}
      </div>
    </header>
  );
}
