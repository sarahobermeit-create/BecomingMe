import { BookHeart, Pin, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { QueryBoundary } from "#client/components/QueryBoundary.tsx";
import { useJournal, useSaveJournal } from "#client/features/journal/journal.api.ts";
import type { JunkJournalCard } from "#shared/journal.ts";

export function JournalPage() {
  const journalQuery = useJournal();
  const saveJournal = useSaveJournal();
  const todayStr = new Date().toISOString().split("T")[0] ?? "";

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sticker, setSticker] = useState("✨");
  const [colorScheme, setColorScheme] = useState<JunkJournalCard["colorScheme"]>("emerald");

  const stickers = ["✨", "☕", "🌿", "🌙", "🍂", "🕯️", "📖", "🕊️"];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    saveJournal.mutate({
      id: crypto.randomUUID(),
      date: todayStr,
      title: title.trim(),
      content: content.trim(),
      colorScheme,
      tags: ["Scrapbook"],
      isPinned: false,
      sticker,
      deleted: false,
      changedAt: Date.now(),
    });

    setTitle("");
    setContent("");
    setIsAddOpen(false);
  };

  const handleDelete = (card: JunkJournalCard) => {
    if (window.confirm(`Delete scrap "${card.title}"?`)) {
      saveJournal.mutate({
        ...card,
        deleted: true,
        changedAt: Date.now(),
      });
    }
  };

  const handleTogglePin = (card: JunkJournalCard) => {
    saveJournal.mutate({
      ...card,
      isPinned: !card.isPinned,
      deleted: false,
      changedAt: Date.now(),
    });
  };

  return (
    <div className="space-y-6 pb-12">
      <QueryBoundary query={journalQuery}>
        {(cards) => {
          const sorted = [...cards].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

          return (
            <>
              {/* Header */}
              <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <BookHeart className="w-6 h-6 text-emerald-400" />
                    <span>Junk Journal & Scrapbook</span>
                  </h1>
                  <p className="text-xs text-slate-300 mt-1">
                    Collect candid memories, quotes, aesthetic stickers, and mood snippets.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Scrap</span>
                </button>
              </div>

              {/* Pinboard Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {sorted.map((card) => (
                  <div
                    key={card.id}
                    className={`relative p-5 rounded-2xl border transition-all shadow-lg flex flex-col justify-between ${
                      card.colorScheme === "amber"
                        ? "bg-[#1f160a]/80 border-amber-500/30"
                        : card.colorScheme === "rose"
                          ? "bg-[#210c14]/80 border-rose-500/30"
                          : card.colorScheme === "lavender"
                            ? "bg-[#170e24]/80 border-purple-500/30"
                            : "bg-[#0b2116]/80 border-emerald-500/30"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xl">{card.sticker || "✨"}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleTogglePin(card)}
                            className={`p-1 rounded text-xs transition-colors ${
                              card.isPinned ? "text-amber-400" : "text-slate-500 hover:text-white"
                            }`}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(card)}
                            className="p-1 rounded text-slate-600 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-serif text-sm font-bold text-white">{card.title}</h3>
                      <p className="font-serif text-xs text-slate-300 italic mt-2 whitespace-pre-wrap leading-relaxed">
                        "{card.content}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 mt-4 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{card.date}</span>
                      {card.isPinned && <span className="text-amber-400 font-sans font-semibold">Pinned</span>}
                    </div>
                  </div>
                ))}
                {sorted.length === 0 && (
                  <div className="col-span-3 py-16 text-center text-xs text-slate-400">
                    Your scrapbook is empty. Pin your first scrap!
                  </div>
                )}
              </div>

              {/* Add Modal */}
              {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <div className="relative w-full max-w-md p-6 rounded-2xl glass-panel text-slate-100 shadow-2xl border border-emerald-500/30">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <h2 className="text-lg font-bold">Add Scrapbook Entry</h2>
                      <button onClick={() => setIsAddOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleAddSubmit} className="space-y-3 mt-4 text-sm">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Sticker</label>
                        <div className="flex gap-2">
                          {stickers.map((stk) => (
                            <button
                              key={stk}
                              type="button"
                              onClick={() => setSticker(stk)}
                              className={`p-2 rounded-lg border text-lg ${
                                sticker === stk ? "border-emerald-400 bg-emerald-950/40" : "border-white/5"
                              }`}
                            >
                              {stk}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Rainy Afternoon Tea in the Attic"
                          className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Journal Note</label>
                        <textarea
                          rows={3}
                          required
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="Write thoughts, poems, snippets..."
                          className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Tone Color</label>
                        <select
                          value={colorScheme}
                          onChange={(e) => setColorScheme(e.target.value as any)}
                          className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                        >
                          <option value="emerald">Emerald Forest</option>
                          <option value="amber">Warm Amber Parchment</option>
                          <option value="rose">Velvet Rose</option>
                          <option value="lavender">Gothic Lavender</option>
                        </select>
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setIsAddOpen(false)}
                          className="px-4 py-2 text-sm text-slate-300 hover:text-white rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-lg"
                        >
                          Pin to Board
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          );
        }}
      </QueryBoundary>
    </div>
  );
}
