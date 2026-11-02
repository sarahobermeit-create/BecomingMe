import confetti from "canvas-confetti";
import { Check, CheckCircle2, FileSpreadsheet, Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useBatchSaveBooks } from "#client/features/books/books.api.ts";
import { parseBookshelfCsv } from "#client/features/books/bookCsvParser.ts";
import type { Book, BookWrite } from "#shared/books.ts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function BookCsvImporterModal({ isOpen, onClose }: Props) {
  const [parsedBooks, setParsedBooks] = useState<Omit<Book, "updatedAt">[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const batchSave = useBatchSaveBooks();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg(null);
    setIsParsing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const books = parseBookshelfCsv(text);
        if (books.length === 0) {
          setErrorMsg("No valid book records could be extracted from this CSV file.");
        } else {
          setParsedBooks(books);
        }
      } catch (err) {
        setErrorMsg("Failed to parse CSV file. Please make sure it is a valid CSV export.");
      } finally {
        setIsParsing(false);
      }
    };
    reader.onerror = () => {
      setErrorMsg("Error reading the selected file.");
      setIsParsing(false);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = async () => {
    if (parsedBooks.length === 0) return;
    setErrorMsg(null);
    try {
      const now = Date.now();
      const writes: BookWrite[] = parsedBooks.map((b, idx) => ({
        ...b,
        sortOrder: idx,
        deleted: false,
        changedAt: now,
      }));

      await batchSave.mutateAsync(writes);
      void confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to import books");
    }
  };

  const countReading = parsedBooks.filter((b) => b.status === "reading").length;
  const countWant = parsedBooks.filter((b) => b.status === "want_to_read").length;
  const countCompleted = parsedBooks.filter((b) => b.status === "completed").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl p-6 rounded-2xl glass-panel text-slate-100 shadow-2xl border border-emerald-500/30">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold">Import Bookshelf / Goodreads CSV</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-5 space-y-4">
          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />

          {parsedBooks.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer border-emerald-500/30 hover:border-emerald-400 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
            >
              {isParsing ? (
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              ) : (
                <>
                  <Upload className="w-10 h-10 mb-2 text-emerald-400/80" />
                  <p className="font-semibold text-slate-200">Click to upload your CSV file</p>
                  <p className="text-xs text-slate-400 mt-1">Supports Bookshelf App and Goodreads export files</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-sm">
                <div className="flex items-center gap-2 font-semibold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Found {parsedBooks.length} books ready to import</span>
                </div>
                <div className="flex gap-4 mt-2 text-xs text-slate-300">
                  <span>Reading: {countReading}</span>
                  <span>Want to read: {countWant}</span>
                  <span>Completed: {countCompleted}</span>
                </div>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {parsedBooks.slice(0, 15).map((b) => (
                  <div key={b.id} className="p-2 text-xs rounded bg-white/[0.03] border border-white/5 flex justify-between">
                    <span className="font-medium text-slate-200 truncate max-w-[70%]">{b.title}</span>
                    <span className="text-slate-400 truncate max-w-[25%]">{b.author}</span>
                  </div>
                ))}
                {parsedBooks.length > 15 && (
                  <p className="text-center text-xs text-slate-500 pt-1">...and {parsedBooks.length - 15} more books</p>
                )}
              </div>
            </div>
          )}

          {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-white/5"
          >
            Cancel
          </button>
          {parsedBooks.length > 0 && (
            <button
              onClick={() => void handleConfirmImport()}
              disabled={batchSave.isPending}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-lg shadow-emerald-900/40 disabled:opacity-50"
            >
              {batchSave.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Import {parsedBooks.length} Books
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
