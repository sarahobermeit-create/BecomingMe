import { AlertCircle, CheckCircle2, HardDriveDownload, Loader2, Square, X } from "lucide-react";
import {
  useCacheMissingCovers,
  useCancelCoverSync,
  useCoversStatus,
} from "#client/features/books/books.api.ts";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CoverSyncModal({ open, onClose }: Props) {
  const { data: status } = useCoversStatus();
  const cacheCovers = useCacheMissingCovers();
  const cancelSync = useCancelCoverSync();

  if (!open || !status) return null;

  const total = status.total || 1;
  const pct = Math.min(100, Math.round((status.localCached / total) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0a180f] border border-emerald-500/25 rounded-2xl shadow-2xl p-6 text-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
          <div>
            <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <HardDriveDownload className="w-5 h-5 text-emerald-400" />
              Cover Offline Storage
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cached locally in <code className="text-emerald-300">/data/covers</code> for instant offline loading.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-medium mb-1.5">
            <span className="text-slate-400">Offline Availability</span>
            <span className="text-emerald-400 font-mono">{pct}%</span>
          </div>
          <div className="w-full h-2.5 bg-black/40 border border-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Status Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 mt-4 text-xs">
          <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl">
            <span className="text-slate-400 block text-[11px]">Stored Locally</span>
            <span className="text-base font-semibold text-emerald-400 font-mono mt-0.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {status.localCached}
            </span>
          </div>
          <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl">
            <span className="text-slate-400 block text-[11px]">External / Remote</span>
            <span className="text-base font-semibold text-amber-300 font-mono mt-0.5">
              {status.pendingRemote}
            </span>
          </div>
          <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl">
            <span className="text-slate-400 block text-[11px]">In Active Queue</span>
            <span className="text-base font-semibold text-cyan-300 font-mono mt-0.5 flex items-center gap-1.5">
              {status.isProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />}
              {status.queueRemaining}
            </span>
          </div>
          <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl">
            <span className="text-slate-400 block text-[11px]">Unavailable / Missing</span>
            <span className="text-base font-semibold text-slate-400 font-mono mt-0.5">
              {status.failedCount}
            </span>
          </div>
        </div>

        {status.failedCount > 0 && (
          <p className="text-[11px] text-slate-400 mt-3 flex items-start gap-1.5 leading-relaxed bg-white/[0.02] p-2 rounded-lg border border-white/5">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              {status.failedCount} book covers returned 404 or empty images from Open Library and are ignored to prevent retry loops.
            </span>
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 mt-6 pt-3 border-t border-emerald-500/20">
          {status.isProcessing || status.queueRemaining > 0 ? (
            <button
              onClick={() => cancelSync.mutate()}
              disabled={cancelSync.isPending}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900/70 border border-rose-500/30 rounded-xl transition-all shadow-md"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>{cancelSync.isPending ? "Stopping..." : "Stop Sync"}</span>
            </button>
          ) : status.pendingRemote > 0 ? (
            <button
              onClick={() => cacheCovers.mutate()}
              disabled={cacheCovers.isPending}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-lg shadow-emerald-900/40"
            >
              {cacheCovers.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <HardDriveDownload className="w-3.5 h-3.5" />
              )}
              <span>Start Sync ({status.pendingRemote} left)</span>
            </button>
          ) : null}

          <button
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
