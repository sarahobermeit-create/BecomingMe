import { Calendar as CalendarIcon, Clock, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { QueryBoundary } from "#client/components/QueryBoundary.tsx";
import { useCalendar, useSaveCalendarEvent } from "#client/features/calendar/calendar.api.ts";
import type { CalendarEvent } from "#shared/calendar.ts";

export function CalendarPage() {
  const calendarQuery = useCalendar();
  const saveEvent = useSaveCalendarEvent();
  const todayStr = new Date().toISOString().split("T")[0] ?? "";

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState("10:00");
  const [category, setCategory] = useState<CalendarEvent["category"]>("personal");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    saveEvent.mutate({
      id: crypto.randomUUID(),
      title: title.trim(),
      date,
      time: time || undefined,
      category,
      color: "#10b981",
      deleted: false,
      changedAt: Date.now(),
    });

    setTitle("");
    setIsAddOpen(false);
  };

  const handleDelete = (event: CalendarEvent) => {
    if (window.confirm(`Delete "${event.title}"?`)) {
      saveEvent.mutate({
        ...event,
        deleted: true,
        changedAt: Date.now(),
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <QueryBoundary query={calendarQuery}>
        {(events) => (
          <>
            <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="w-6 h-6 text-emerald-400" />
                  <span>Personal Calendar</span>
                </h1>
                <p className="text-xs text-slate-300 mt-1">Organize priorities, deadlines, and personal milestones.</p>
              </div>
              <button
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Event</span>
              </button>
            </div>

            <div className="space-y-2">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 rounded-xl glass-panel border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-serif text-sm font-bold text-white">{ev.title}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span className="font-mono text-emerald-400">{ev.date}</span>
                      {ev.time && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {ev.time}
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span className="capitalize">{ev.category}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(ev)} className="p-1 text-slate-600 hover:text-rose-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {events.length === 0 && (
                <p className="text-xs text-slate-400 py-12 text-center">No upcoming events scheduled.</p>
              )}
            </div>

            {isAddOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="relative w-full max-w-md p-6 rounded-2xl glass-panel text-slate-100 shadow-2xl border border-emerald-500/30">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h2 className="text-lg font-bold">Add Event</h2>
                    <button onClick={() => setIsAddOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleAddSubmit} className="space-y-3 mt-4 text-sm">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Event Title</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Victorian Book Club Meeting"
                        className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Date</label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Time</label>
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                      >
                        <option value="personal">Personal</option>
                        <option value="work">Work</option>
                        <option value="health">Health</option>
                        <option value="social">Social</option>
                        <option value="deadline">Deadline</option>
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
                        Save Event
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </QueryBoundary>
    </div>
  );
}
