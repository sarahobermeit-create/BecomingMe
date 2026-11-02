import confetti from "canvas-confetti";
import { CheckSquare, Clock, Flame, Square, Tag, Trash2 } from "lucide-react";
import { useSaveRoutine } from "#client/features/routines/routines.api.ts";
import type { RoutineItem } from "#shared/routines.ts";

interface Props {
  routine: RoutineItem;
  todayStr: string;
}

export function RoutineItemRow({ routine, todayStr }: Props) {
  const saveRoutine = useSaveRoutine();
  const isCompletedToday = routine.completedDates.includes(todayStr);

  const handleToggle = () => {
    let nextDates: string[];
    if (isCompletedToday) {
      nextDates = routine.completedDates.filter((d) => d !== todayStr);
    } else {
      nextDates = [...routine.completedDates, todayStr];
      void confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }

    saveRoutine.mutate({
      ...routine,
      completedDates: nextDates,
      deleted: false,
      changedAt: Date.now(),
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Delete routine "${routine.title}"?`)) {
      saveRoutine.mutate({
        ...routine,
        deleted: true,
        changedAt: Date.now(),
      });
    }
  };

  return (
    <div
      className={`group flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all ${
        isCompletedToday
          ? "bg-emerald-950/20 border-emerald-500/30 text-slate-300"
          : "bg-white/[0.02] border-white/5 hover:border-emerald-500/20 text-white"
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          onClick={handleToggle}
          className={`shrink-0 transition-transform active:scale-90 ${
            isCompletedToday ? "text-emerald-400" : "text-slate-500 hover:text-emerald-400"
          }`}
        >
          {isCompletedToday ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
        </button>

        <div className="min-w-0">
          <p
            className={`text-sm font-semibold truncate ${
              isCompletedToday ? "line-through text-slate-400 font-normal" : "text-white"
            }`}
          >
            {routine.title}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400">
            {routine.time && (
              <span className="flex items-center gap-1 font-mono text-emerald-400">
                <Clock className="w-3 h-3" />
                {routine.time}
              </span>
            )}
            <span className="capitalize px-1.5 py-0.5 rounded bg-white/[0.04] text-[10px]">
              {routine.category}
            </span>
            {routine.tags.map((t, idx) => (
              <span key={idx} className="flex items-center gap-0.5 text-[10px] text-slate-500">
                <Tag className="w-2.5 h-2.5" /> {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 ml-3">
        {/* Streak counter */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.03] text-xs font-mono text-amber-400">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{routine.completedDates.length}</span>
        </div>

        <button
          onClick={handleDelete}
          className="p-1 rounded text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
