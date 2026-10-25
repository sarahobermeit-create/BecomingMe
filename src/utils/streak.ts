import { LifeState } from '../types';

/**
 * Calculates the active daily streak across all life activities:
 * routines, water logging, meal tracking, moods, workouts, and journal entries.
 */
export const calculateDailyStreak = (state: LifeState, todayStr: string): number => {
  const activeDates = new Set<string>();

  // 1. Routine completions
  state.routines.forEach((r) => {
    r.completedDates.forEach((d) => activeDates.add(d));
  });

  // 2. Water consumption
  Object.entries(state.waterLogs).forEach(([d, log]) => {
    if (log.amountMl > 0) activeDates.add(d);
  });

  // 3. Mood tracking
  state.moods.forEach((m) => activeDates.add(m.date));

  // 4. Meals logged
  state.meals.forEach((m) => activeDates.add(m.date));

  // 5. Workout completions
  state.workouts.forEach((w) => {
    w.completedHistory.forEach((h) => activeDates.add(h.date));
  });

  // 6. Journal entries
  state.journalEntries.forEach((j) => activeDates.add(j.date));

  // Baseline routine streak
  const maxRoutineStreak = Math.max(0, ...state.routines.map((r) => r.streak || 0));

  // Date helpers
  const parseDate = (dStr: string) => new Date(dStr + 'T00:00:00');
  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  let streak = 0;
  const curr = parseDate(todayStr);

  // If today isn't active yet, check if yesterday was active to keep the streak alive
  if (!activeDates.has(todayStr)) {
    curr.setDate(curr.getDate() - 1);
    if (!activeDates.has(formatDate(curr))) {
      return Math.max(0, maxRoutineStreak);
    }
  }

  // Count consecutive days
  while (true) {
    const dStr = formatDate(curr);
    if (activeDates.has(dStr)) {
      streak++;
      curr.setDate(curr.getDate() - 1);
    } else {
      break;
    }
  }

  return Math.max(streak, maxRoutineStreak);
};
