import confetti from "canvas-confetti";
import { Heart } from "lucide-react";
import { useState } from "react";
import { QueryBoundary } from "#client/components/QueryBoundary.tsx";
import { useMood, useSaveMood } from "#client/features/mood/mood.api.ts";
import type { MoodEntry, MoodScore } from "#shared/mood.ts";

export function MoodPage() {
  const moodQuery = useMood();
  const saveMood = useSaveMood();
  const todayStr = new Date().toISOString().split("T")[0] ?? "";

  const moodOptions: { score: MoodScore; emoji: string; label: string; color: string }[] = [
    { score: 5, emoji: "✨", label: "Fantastic", color: "text-emerald-400 border-emerald-500/40 bg-emerald-950/30" },
    { score: 4, emoji: "🌿", label: "Good", color: "text-teal-400 border-teal-500/40 bg-teal-950/30" },
    { score: 3, emoji: "☕", label: "Neutral", color: "text-amber-400 border-amber-500/40 bg-amber-950/30" },
    { score: 2, emoji: "🌧️", label: "Low", color: "text-indigo-400 border-indigo-500/40 bg-indigo-950/30" },
    { score: 1, emoji: "🥀", label: "Rough", color: "text-rose-400 border-rose-500/40 bg-rose-950/30" },
  ];

  const factorTags = ["Good Sleep", "Productive", "Social", "Workout", "Nature", "Reading", "Mindfulness", "Deep Rest"];

  return (
    <div className="space-y-6 pb-12">
      <QueryBoundary query={moodQuery}>
        {(entries) => {
          const todayEntry: MoodEntry | undefined = entries.find((e) => e.date === todayStr);
          const [score, setScore] = useState<MoodScore>(todayEntry?.score ?? 4);
          const [energy, setEnergy] = useState<number>(todayEntry?.energyLevel ?? 4);
          const [selectedFactors, setSelectedFactors] = useState<string[]>(todayEntry?.factors ?? ["Reading"]);
          const [note, setNote] = useState(todayEntry?.journalNote ?? "");

          const handleSave = () => {
            const chosen = moodOptions.find((m) => m.score === score);
            saveMood.mutate({
              id: todayEntry?.id ?? crypto.randomUUID(),
              date: todayStr,
              score,
              energyLevel: energy,
              label: chosen?.label ?? "Good",
              factors: selectedFactors,
              journalNote: note.trim() || undefined,
              deleted: false,
              changedAt: Date.now(),
            });
            void confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
          };

          const toggleFactor = (f: string) => {
            setSelectedFactors((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
          };

          return (
            <>
              {/* Header */}
              <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-rose-500/20">
                <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Heart className="w-6 h-6 text-rose-400" />
                  <span>Emotional Well-being & Mood</span>
                </h1>
                <p className="text-xs text-slate-300 mt-1">Check in daily to build emotional clarity and peace of mind.</p>
              </div>

              {/* Today's Log Card */}
              <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-3">How are you feeling today?</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {moodOptions.map((opt) => (
                      <button
                        key={opt.score}
                        type="button"
                        onClick={() => setScore(opt.score)}
                        className={`p-3.5 rounded-xl border text-center transition-all ${
                          score === opt.score
                            ? `${opt.color} shadow-lg scale-105 font-bold`
                            : "bg-white/[0.02] border-white/5 text-slate-400 hover:text-white"
                        }`}
                      >
                        <span className="text-2xl block mb-1">{opt.emoji}</span>
                        <span className="text-xs">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Energy Level: <span className="font-mono text-amber-400">{energy} / 5</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={energy}
                    onChange={(e) => setEnergy(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">What influenced your day?</label>
                  <div className="flex flex-wrap gap-2">
                    {factorTags.map((f) => {
                      const active = selectedFactors.includes(f);
                      return (
                        <button
                          key={f}
                          type="button"
                          onClick={() => toggleFactor(f)}
                          className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                            active
                              ? "bg-rose-950/40 border-rose-500/40 text-rose-200 font-semibold"
                              : "bg-white/[0.02] border-white/5 text-slate-400 hover:text-white"
                          }`}
                        >
                          {f}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Daily Reflection Note</label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="A thought, gratitude, or observation from today..."
                    className="w-full px-3 py-2 text-xs rounded-xl glass-input"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-900/40"
                  >
                    Save Reflection
                  </button>
                </div>
              </div>

              {/* History */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Past Reflections</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {entries.slice(0, 6).map((e) => (
                    <div key={e.id} className="p-4 rounded-xl glass-panel border border-white/5 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[11px] text-slate-400">{e.date}</span>
                        <span className="font-semibold text-rose-300">{e.label}</span>
                      </div>
                      {e.journalNote && <p className="text-slate-300 italic line-clamp-2">"{e.journalNote}"</p>}
                    </div>
                  ))}
                </div>
              </div>
            </>
          );
        }}
      </QueryBoundary>
    </div>
  );
}
