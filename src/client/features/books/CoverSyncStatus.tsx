import { CheckCircle2, HardDriveDownload, Loader2 } from "lucide-react";
import { useState } from "react";
import { CoverSyncModal } from "#client/features/books/CoverSyncModal.tsx";
import { useCoversStatus } from "#client/features/books/books.api.ts";

export function CoverSyncStatus() {
  const { data: status } = useCoversStatus();
  const [modalOpen, setModalOpen] = useState(false);

  if (!status || status.total === 0) return null;

  return (
    <>
      {status.isProcessing || status.queueRemaining > 0 ? (
        <button
          onClick={() => setModalOpen(true)}
          title="Click to view details or stop sync"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 rounded-xl transition-all animate-pulse"
        >
          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
          <span>Caching covers: {Math.max(1, status.queueRemaining)} left</span>
        </button>
      ) : status.pendingRemote > 0 ? (
        <button
          onClick={() => setModalOpen(true)}
          title="Click to view details or store remaining covers offline"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 rounded-xl transition-all shadow-sm"
        >
          <HardDriveDownload className="w-3.5 h-3.5 text-emerald-400" />
          <span>Store {status.pendingRemote} covers offline</span>
        </button>
      ) : (
        <button
          onClick={() => setModalOpen(true)}
          title="All covers stored locally in /data/covers"
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-emerald-400/80 bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-500/20 rounded-xl transition-colors"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{status.localCached} covers offline</span>
        </button>
      )}

      <CoverSyncModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
