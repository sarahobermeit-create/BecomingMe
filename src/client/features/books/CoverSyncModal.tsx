import { AlertCircle, CheckCircle2, HardDriveDownload, Loader2, Square, X } from "lucide-react";
import { createPortal } from "react-dom";
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

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-2xl glass-panel text-slate-100 shadow-2xl border border-emerald-500/30"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <HardDriveDownload className="w-5 h-5 text-emerald-400" />
              Cover Offline Storage
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cached locally in <code className="text-emerald-300">/data/covers</code> for instant offline loading.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="flex justify-between text-xs font-semibold mb-2">
            <span className="text-slate-300">Offline Availability</span>
            <span className="text-emerald-400 font-mono">{pct}%</span>
          </div>
          <div className="w-full h-2.5 bg-black/50 border border-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Status Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 mt-4 text-xs">
          <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl">
            <span className="text-slate-400 block text-[11px] font-medium">Stored Locally</span>
            <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {status.localCached}
            </span>
          </div>
          <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl">
            <span className="text-slate-400 block text-[11px] font-medium">External / Remote</span>
            <span className="text-base font-bold text-amber-300 font-mono mt-0.5">
              {status.pendingRemote}
            </span>
          </div>
          <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl">
            <span className="text-slate-400 block text-[11px] font-medium">In Active Queue</span>
            <span className="text-base font-bold text-cyan-300 font-mono mt-0.5 flex items-center gap-1.5">
              {status.isProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />}
              {status.isProcessing ? Math.max(1, status.queueRemaining) : status.queueRemaining}
            </span>
          </div>
          <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl">
            <span className="text-slate-400 block text-[11px] font-medium">No Cover / Unlisted</span>
            <span className="text-base font-bold text-slate-400 font-mono mt-0.5">
              {status.failedCount}
            </span>
          </div>
        </div>

        {status.failedCount > 0 && (
          <p className="text-[11px] text-slate-400 mt-3 flex items-start gap-1.5 leading-relaxed bg-white/[0.03] p-2.5 rounded-xl border border-white/10">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              {status.failedCount} books have no cover image on Open Library and render using the classic leather spine.
            </span>
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 mt-6 pt-3 border-t border-white/10">
          {status.isProcessing || status.queueRemaining > 0 ? (
            <button
              onClick={() => cancelSync.mutate()}
              disabled={cancelSync.isPending}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-200 bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 rounded-xl transition-all shadow-md"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>{cancelSync.isPending ? "Stopping..." : "Stop Sync"}</span>
            </button>
          ) : status.pendingRemote > 0 ? (
            <button
              onClick={() => cacheCovers.mutate()}
              disabled={cacheCovers.isPending}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-lg shadow-emerald-900/40"
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
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
