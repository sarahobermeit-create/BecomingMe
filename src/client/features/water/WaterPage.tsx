import confetti from "canvas-confetti";
import { Droplets, Minus, RotateCcw } from "lucide-react";
import { QueryBoundary } from "#client/components/QueryBoundary.tsx";
import { useSaveWaterLog, useWaterLogs } from "#client/features/water/water.api.ts";
import type { WaterLog } from "#shared/water.ts";

export function WaterPage() {
  const waterQuery = useWaterLogs();
  const saveWater = useSaveWaterLog();
  const todayStr = new Date().toISOString().split("T")[0] ?? "";

  return (
    <div className="space-y-6 pb-12">
      <QueryBoundary query={waterQuery}>
        {(logs) => {
          const found = logs.find((l) => l.date === todayStr);
          const todayLog: WaterLog = found ?? {
            id: crypto.randomUUID(),
            date: todayStr,
            amountMl: 0,
            targetMl: 2500,
            updatedAt: new Date().toISOString(),
          };

          const amount = todayLog.amountMl;
          const target = todayLog.targetMl || 2500;
          const pct = Math.min(100, Math.round((amount / target) * 100));

          const handleAdd = (delta: number) => {
            const nextAmt = Math.max(0, amount + delta);
            if (nextAmt >= target && amount < target) {
              void confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
            }
            saveWater.mutate({
              id: todayLog.id,
              date: todayStr,
              amountMl: nextAmt,
              targetMl: target,
              deleted: false,
              changedAt: Date.now(),
            });
          };

          // Last 7 days history
          const pastDays = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const dStr = d.toISOString().split("T")[0] ?? "";
            const log = logs.find((l) => l.date === dStr);
            const met = (log?.amountMl ?? 0) >= (log?.targetMl ?? target);
            return {
              date: dStr,
              dayLabel: d.toLocaleDateString("en-US", { weekday: "short" }),
              amount: log?.amountMl ?? 0,
              met,
            };
          });

          return (
            <>
              {/* Header */}
              <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <Droplets className="w-6 h-6 text-cyan-400" />
                    <span>Hydration Tracker</span>
                  </h1>
                  <p className="text-xs text-slate-300 mt-1">
                    Drink enough water to maintain high mental clarity and physical vitality.
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-cyan-300">
                  <span>Target: {target} ml</span>
                </div>
              </div>

              {/* Main Gauge & Quick Add */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 flex flex-col items-center justify-center text-center">
                  <div className="relative w-44 h-44 rounded-full flex flex-col items-center justify-center p-3 border-4 border-cyan-500/30 bg-cyan-950/20 shadow-inner">
                    <Droplets className="w-8 h-8 text-cyan-400 mb-1 animate-pulse" />
                    <span className="text-3xl font-extrabold text-white font-mono">{amount}</span>
                    <span className="text-xs text-cyan-300 font-mono">/ {target} ml</span>
                    <span className="text-[11px] font-semibold text-slate-400 mt-1">{pct}% Met</span>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <button
                      onClick={() => handleAdd(-250)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleAdd(-amount)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400"
                      title="Reset today"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quick Buttons */}
                <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 flex flex-col justify-between space-y-4">
                  <h3 className="text-sm font-semibold text-slate-200">Quick Log</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleAdd(250)}
                      className="p-3.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-center transition-all"
                    >
                      <span className="block text-xs font-bold text-white">+250 ml</span>
                      <span className="text-[10px] text-cyan-300">Glass</span>
                    </button>
                    <button
                      onClick={() => handleAdd(500)}
                      className="p-3.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-center transition-all"
                    >
                      <span className="block text-xs font-bold text-white">+500 ml</span>
                      <span className="text-[10px] text-cyan-300">Bottle</span>
                    </button>
                    <button
                      onClick={() => handleAdd(750)}
                      className="p-3.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-center transition-all"
                    >
                      <span className="block text-xs font-bold text-white">+750 ml</span>
                      <span className="text-[10px] text-cyan-300">Flask</span>
                    </button>
                  </div>

                  {/* 7 Days History */}
                  <div className="pt-3 border-t border-white/10">
                    <span className="text-xs font-semibold text-slate-300 block mb-2">Past 7 Days</span>
                    <div className="grid grid-cols-7 gap-1.5 text-center">
                      {pastDays.map((d) => (
                        <div
                          key={d.date}
                          className={`p-2 rounded-lg border text-[10px] ${
                            d.met
                              ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-200 font-bold"
                              : "bg-white/[0.02] border-white/5 text-slate-400"
                          }`}
                        >
                          <span className="block text-[9px] uppercase">{d.dayLabel}</span>
                          <span>{d.amount > 0 ? `${Math.round(d.amount / 1000)}L` : "-"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        }}
      </QueryBoundary>
    </div>
  );
}
