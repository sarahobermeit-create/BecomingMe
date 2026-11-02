import { Headphones, Pause, Play, RotateCcw, RotateCw } from "lucide-react";
import type { Book } from "#shared/books.ts";

interface Props {
  book: Book;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onForward: (mins: number) => void;
}

export function AudiobookPlayerDock({ book, isPlaying, onTogglePlay, onForward }: Props) {
  const total = book.audioDurationMinutes || 600;
  const current = book.currentAudioMinutes || 0;
  const pct = Math.min(100, Math.round((current / total) * 100));

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-[#092415]/90 border border-emerald-500/30 backdrop-blur-md shadow-xl flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{book.title}</p>
            <p className="text-[11px] text-slate-400 truncate">{book.author}</p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onForward(-5)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            title="Back 5 mins"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onTogglePlay}
            className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#070e0a] flex items-center justify-center shadow-lg shadow-emerald-900/50"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <button
            onClick={() => onForward(5)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            title="Forward 5 mins"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Track */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>{current} mins</span>
          <span>{total} mins</span>
        </div>
        <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
          <div className="bg-emerald-400 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
