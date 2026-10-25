import React, { useState } from 'react';
import { useLife } from '../../context/LifeContext';
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { CalendarEvent } from '../../types';

export const CalendarModule: React.FC = () => {
  const { state, todayDate, addEvent, deleteEvent } = useLife();
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date());
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(selectedDate);
  const [time, setTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [category, setCategory] = useState<CalendarEvent['category']>('personal');
  const [color, setColor] = useState('#2d7a58');
  const [notes, setNotes] = useState('');

  const colors = [
    { label: 'Forest Green', hex: '#2d7a58' },
    { label: 'Emerald', hex: '#10b981' },
    { label: 'Cyan', hex: '#06b6d4' },
    { label: 'Amber', hex: '#f59e0b' },
    { label: 'Rose', hex: '#f43f5e' },
  ];

  // Month navigation helpers
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  // Month name
  const monthName = currentMonthDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Calculate calendar grid days
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = [];
  // Fill blanks before start of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push(null);
  }
  // Fill days
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    daysArray.push({ dayNum: d, dateStr: dStr });
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addEvent({
      title: title.trim(),
      date,
      time: time || undefined,
      endTime: endTime || undefined,
      category,
      color,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setNotes('');
    setShowAddModal(false);
  };

  const eventsForSelectedDate = state.events.filter((e) => e.date === selectedDate);
  const sortedUpcomingEvents = [...state.events].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-teal-400" />
            <span>Personal Agenda & Calendar</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Keep track of life appointments, milestones, social plans, and deadlines.
          </p>
        </div>

        <button
          onClick={() => {
            setDate(selectedDate);
            setShowAddModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-900/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Month View Grid */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 border border-white/[0.08] space-y-4">
          {/* Navigation Bar */}
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">{monthName}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const now = new Date();
                  setCurrentMonthDate(now);
                  setSelectedDate(todayDate);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs text-slate-300 font-medium transition-colors"
              >
                Today
              </button>
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 py-1">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {daysArray.map((d, idx) => {
              if (!d) {
                return <div key={`blank-${idx}`} className="h-20 rounded-xl bg-white/[0.01]" />;
              }

              const isSelected = selectedDate === d.dateStr;
              const isToday = todayDate === d.dateStr;
              const dayEvents = state.events.filter((e) => e.date === d.dateStr);

              return (
                <div
                  key={d.dateStr}
                  onClick={() => setSelectedDate(d.dateStr)}
                  className={`h-20 p-2 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between overflow-hidden ${
                    isSelected
                      ? 'border-teal-400/80 bg-teal-500/15 shadow-md shadow-teal-950/40 ring-1 ring-teal-400/30'
                      : isToday
                      ? 'border-emerald-500/50 bg-emerald-500/15'
                      : 'border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isToday
                          ? 'w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center'
                          : isSelected
                          ? 'text-teal-300'
                          : 'text-slate-300'
                      }`}
                    >
                      {d.dayNum}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    )}
                  </div>

                  {/* Day Events miniature badges */}
                  <div className="space-y-0.5 overflow-hidden">
                    {dayEvents.slice(0, 2).map((evt) => (
                      <div
                        key={evt.id}
                        className="text-[9px] truncate px-1 py-0.5 rounded font-medium text-white"
                        style={{ backgroundColor: `${evt.color}40`, borderLeft: `2px solid ${evt.color}` }}
                      >
                        {evt.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[8px] text-slate-400 font-mono">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda & Upcoming */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Day Events */}
          <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-300">
                  Day Agenda
                </h3>
                <p className="text-xs text-slate-300 font-mono mt-0.5 font-bold">
                  {selectedDate === todayDate ? `Today (${selectedDate})` : selectedDate}
                </p>
              </div>

              <button
                onClick={() => {
                  setDate(selectedDate);
                  setShowAddModal(true);
                }}
                className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-2">
              {eventsForSelectedDate.length > 0 ? (
                eventsForSelectedDate.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-start justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: evt.color }}
                        />
                        <h4 className="text-xs font-bold text-white">{evt.title}</h4>
                      </div>

                      {evt.time && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{evt.time} {evt.endTime ? `- ${evt.endTime}` : ''}</span>
                        </div>
                      )}

                      {evt.notes && (
                        <p className="text-[11px] text-slate-400 font-sans italic">
                          "{evt.notes}"
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => deleteEvent(evt.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="Delete event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic py-3 text-center">
                  No events scheduled for this day.
                </p>
              )}
            </div>
          </div>

          {/* All Upcoming Events Schedule */}
          <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Upcoming Overview
            </h3>

            <div className="space-y-2">
              {sortedUpcomingEvents.slice(0, 5).map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedDate(evt.date)}
                  className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] cursor-pointer transition-colors flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: evt.color }}
                    />
                    <span className="font-semibold text-slate-200 truncate">{evt.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {evt.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141f] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-teal-400" />
                <span>Create Calendar Event</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Health Checkup or Birthday Dinner"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full glass-input px-2 py-2 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Start Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full glass-input px-2 py-2 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full glass-input px-2 py-2 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  >
                    <option value="personal" className="bg-[#12141f]">Personal</option>
                    <option value="work" className="bg-[#12141f]">Work & Career</option>
                    <option value="health" className="bg-[#12141f]">Health & Doctor</option>
                    <option value="social" className="bg-[#12141f]">Social & Friends</option>
                    <option value="deadline" className="bg-[#12141f]">Deadline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Color Tag</label>
                  <div className="flex items-center gap-2 mt-1">
                    {colors.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setColor(c.hex)}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          color === c.hex ? 'scale-125 ring-2 ring-white/50' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Notes / Location</label>
                <input
                  type="text"
                  placeholder="Location or additional reminder notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-xl bg-white/[0.05] text-slate-300 hover:bg-white/[0.1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium shadow-md shadow-teal-900/30"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
