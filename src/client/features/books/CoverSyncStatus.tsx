import { CheckCircle2, HardDriveDownload, Loader2 } from "lucide-react";
import { useCacheMissingCovers, useCoversStatus } from "#client/features/books/books.api.ts";

export function CoverSyncStatus() {
  const { data: status } = useCoversStatus();
  const cacheCovers = useCacheMissingCovers();

  if (!status || status.total === 0) return null;

  if (status.isProcessing || status.queueRemaining > 0) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-amber-300 bg-amber-950/40 border border-amber-500/30 rounded-xl animate-pulse">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
        <span>Caching covers: {status.queueRemaining} left ({status.localCached} stored)</span>
      </div>
    );
  }

  if (status.pendingRemote > 0) {
    return (
      <button
        onClick={() => cacheCovers.mutate()}
        disabled={cacheCovers.isPending}
        title="Download external covers to local server volume for fast offline access"
        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 rounded-xl transition-all shadow-sm"
      >
        {cacheCovers.isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
        ) : (
          <HardDriveDownload className="w-3.5 h-3.5 text-emerald-400" />
        )}
        <span>Store {status.pendingRemote} covers offline</span>
        {status.failedCount > 0 && (
          <span className="text-[10px] text-slate-400">({status.failedCount} unavailable)</span>
        )}
      </button>
    );
  }

  return (
    <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-emerald-400/80 bg-emerald-950/20 border border-emerald-500/20 rounded-xl">
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
      <span>{status.localCached} covers offline</span>
      {status.failedCount > 0 && (
        <span className="text-[10px] text-slate-400">({status.failedCount} unlisted)</span>
      )}
    </div>
  );
}
