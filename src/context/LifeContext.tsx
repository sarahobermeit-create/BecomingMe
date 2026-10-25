import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LifeState,
  RoutineItem,
  MealLogItem,
  Transaction,
  Book,
  MoodEntry,
  JunkJournalCard,
  Hobby,
  WorkoutPlan,
  LifeIdea,
  CalendarEvent,
} from '../types';
import { initialLifeState, getTodayDateString } from '../data/initialData';
import confetti from 'canvas-confetti';

interface LifeContextType {
  state: LifeState;
  todayDate: string;
  // Water
  addWater: (amountMl: number, date?: string) => void;
  setWaterTarget: (targetMl: number) => void;
  resetTodayWater: () => void;
  // Routines
  toggleRoutine: (id: string, date?: string) => void;
  addRoutine: (item: Omit<RoutineItem, 'id' | 'streak' | 'completedDates'>) => void;
  deleteRoutine: (id: string) => void;
  // Meals
  addMeal: (meal: Omit<MealLogItem, 'id'>) => void;
  deleteMeal: (id: string) => void;
  // Budget
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  // Books
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (book: Book) => void;
  deleteBook: (id: string) => void;
  // Mood
  logMood: (mood: Omit<MoodEntry, 'id'>) => void;
  // Junk Journal
  addJournalCard: (card: Omit<JunkJournalCard, 'id'>) => void;
  updateJournalCard: (card: JunkJournalCard) => void;
  deleteJournalCard: (id: string) => void;
  togglePinCard: (id: string) => void;
  // Hobbies
  addHobby: (hobby: Omit<Hobby, 'id'>) => void;
  updateHobby: (hobby: Hobby) => void;
  deleteHobby: (id: string) => void;
  toggleHobbyMilestone: (hobbyId: string, milestoneId: string) => void;
  // Workouts
  addWorkout: (workout: Omit<WorkoutPlan, 'id' | 'completedHistory'>) => void;
  deleteWorkout: (id: string) => void;
  logWorkoutCompletion: (workoutId: string, notes?: string) => void;
  // Ideas
  addIdea: (idea: Omit<LifeIdea, 'id'>) => void;
  updateIdea: (idea: LifeIdea) => void;
  deleteIdea: (id: string) => void;
  toggleIdeaAction: (ideaId: string, actionId: string) => void;
  // Events
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteEvent: (id: string) => void;
  // Backup / Data
  exportBackupJson: () => void;
  importBackupJson: (file: File) => Promise<boolean>;
  resetToDemoData: () => void;
}

const STORAGE_KEY = 'life_os_state_v1';

const LifeContext = createContext<LifeContextType | undefined>(undefined);

export const LifeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<LifeState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved state:', e);
    }
    return initialLifeState;
  });

  const todayDate = getTodayDateString();

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [state]);

  const triggerCelebration = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#8b5cf6', '#10b981', '#06b6d4', '#f59e0b', '#f43f5e'],
    });
  };

  // Water Actions
  const addWater = (amountMl: number, date: string = todayDate) => {
    setState((prev) => {
      const currentLog = prev.waterLogs[date] || {
        date,
        amountMl: 0,
        targetMl: prev.waterDailyTargetMl,
      };
      const newAmount = Math.max(0, currentLog.amountMl + amountMl);
      const updatedLog = { ...currentLog, amountMl: newAmount };

      if (newAmount >= currentLog.targetMl && currentLog.amountMl < currentLog.targetMl) {
        triggerCelebration();
      }

      return {
        ...prev,
        waterLogs: {
          ...prev.waterLogs,
          [date]: updatedLog,
        },
      };
    });
  };

  const setWaterTarget = (targetMl: number) => {
    setState((prev) => ({
      ...prev,
      waterDailyTargetMl: targetMl,
    }));
  };

  const resetTodayWater = () => {
    setState((prev) => ({
      ...prev,
      waterLogs: {
        ...prev.waterLogs,
        [todayDate]: {
          date: todayDate,
          amountMl: 0,
          targetMl: prev.waterDailyTargetMl,
        },
      },
    }));
  };

  // Routines Actions
  const toggleRoutine = (id: string, date: string = todayDate) => {
    setState((prev) => {
      const updatedRoutines = prev.routines.map((r) => {
        if (r.id !== id) return r;
        const isCompleted = r.completedDates.includes(date);
        let newCompletedDates: string[];
        let newStreak = r.streak;

        if (isCompleted) {
          newCompletedDates = r.completedDates.filter((d) => d !== date);
          newStreak = Math.max(0, r.streak - 1);
        } else {
          newCompletedDates = [...r.completedDates, date];
          newStreak = r.streak + 1;
        }

        return {
          ...r,
          completedDates: newCompletedDates,
          streak: newStreak,
        };
      });

      // Check if all today routines are done!
      const allTodayDone = updatedRoutines.every((r) => r.completedDates.includes(date));
      if (allTodayDone && updatedRoutines.length > 0) {
        triggerCelebration();
      }

      return { ...prev, routines: updatedRoutines };
    });
  };

  const addRoutine = (item: Omit<RoutineItem, 'id' | 'streak' | 'completedDates'>) => {
    const newRoutine: RoutineItem = {
      ...item,
      id: 'routine-' + Date.now(),
      streak: 0,
      completedDates: [],
    };
    setState((prev) => ({ ...prev, routines: [newRoutine, ...prev.routines] }));
  };

  const deleteRoutine = (id: string) => {
    setState((prev) => ({
      ...prev,
      routines: prev.routines.filter((r) => r.id !== id),
    }));
  };

  // Meals Actions
  const addMeal = (meal: Omit<MealLogItem, 'id'>) => {
    const newMeal: MealLogItem = {
      ...meal,
      id: 'meal-' + Date.now(),
    };
    setState((prev) => ({ ...prev, meals: [newMeal, ...prev.meals] }));
  };

  const deleteMeal = (id: string) => {
    setState((prev) => ({
      ...prev,
      meals: prev.meals.filter((m) => m.id !== id),
    }));
  };

  // Budget Actions
  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: 'tx-' + Date.now(),
    };
    setState((prev) => ({ ...prev, transactions: [newTx, ...prev.transactions] }));
  };

  const deleteTransaction = (id: string) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  };

  // Books Actions
  const addBook = (book: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...book,
      id: 'book-' + Date.now(),
    };
    setState((prev) => ({ ...prev, books: [newBook, ...prev.books] }));
  };

  const updateBook = (book: Book) => {
    setState((prev) => ({
      ...prev,
      books: prev.books.map((b) => (b.id === book.id ? book : b)),
    }));
  };

  const deleteBook = (id: string) => {
    setState((prev) => ({
      ...prev,
      books: prev.books.filter((b) => b.id !== id),
    }));
  };

  // Mood Actions
  const logMood = (mood: Omit<MoodEntry, 'id'>) => {
    setState((prev) => {
      // replace if date exists, otherwise add
      const existingIndex = prev.moods.findIndex((m) => m.date === mood.date);
      let updatedMoods: MoodEntry[];
      if (existingIndex >= 0) {
        updatedMoods = [...prev.moods];
        updatedMoods[existingIndex] = { ...mood, id: prev.moods[existingIndex].id };
      } else {
        updatedMoods = [{ ...mood, id: 'mood-' + Date.now() }, ...prev.moods];
      }
      return { ...prev, moods: updatedMoods };
    });
  };

  // Junk Journal Actions
  const addJournalCard = (card: Omit<JunkJournalCard, 'id'>) => {
    const newCard: JunkJournalCard = {
      ...card,
      id: 'junk-' + Date.now(),
    };
    setState((prev) => ({ ...prev, journalEntries: [newCard, ...prev.journalEntries] }));
  };

  const updateJournalCard = (card: JunkJournalCard) => {
    setState((prev) => ({
      ...prev,
      journalEntries: prev.journalEntries.map((c) => (c.id === card.id ? card : c)),
    }));
  };

  const deleteJournalCard = (id: string) => {
    setState((prev) => ({
      ...prev,
      journalEntries: prev.journalEntries.filter((c) => c.id !== id),
    }));
  };

  const togglePinCard = (id: string) => {
    setState((prev) => ({
      ...prev,
      journalEntries: prev.journalEntries.map((c) =>
        c.id === id ? { ...c, isPinned: !c.isPinned } : c
      ),
    }));
  };

  // Hobbies Actions
  const addHobby = (hobby: Omit<Hobby, 'id'>) => {
    const newHobby: Hobby = {
      ...hobby,
      id: 'hobby-' + Date.now(),
    };
    setState((prev) => ({ ...prev, hobbies: [newHobby, ...prev.hobbies] }));
  };

  const updateHobby = (hobby: Hobby) => {
    setState((prev) => ({
      ...prev,
      hobbies: prev.hobbies.map((h) => (h.id === hobby.id ? hobby : h)),
    }));
  };

  const deleteHobby = (id: string) => {
    setState((prev) => ({
      ...prev,
      hobbies: prev.hobbies.filter((h) => h.id !== id),
    }));
  };

  const toggleHobbyMilestone = (hobbyId: string, milestoneId: string) => {
    setState((prev) => ({
      ...prev,
      hobbies: prev.hobbies.map((h) => {
        if (h.id !== hobbyId) return h;
        return {
          ...h,
          milestones: h.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          ),
        };
      }),
    }));
  };

  // Workouts Actions
  const addWorkout = (workout: Omit<WorkoutPlan, 'id' | 'completedHistory'>) => {
    const newWorkout: WorkoutPlan = {
      ...workout,
      id: 'workout-' + Date.now(),
      completedHistory: [],
    };
    setState((prev) => ({ ...prev, workouts: [newWorkout, ...prev.workouts] }));
  };

  const deleteWorkout = (id: string) => {
    setState((prev) => ({
      ...prev,
      workouts: prev.workouts.filter((w) => w.id !== id),
    }));
  };

  const logWorkoutCompletion = (workoutId: string, notes?: string) => {
    setState((prev) => ({
      ...prev,
      workouts: prev.workouts.map((w) => {
        if (w.id !== workoutId) return w;
        return {
          ...w,
          completedHistory: [{ date: todayDate, notes }, ...w.completedHistory],
        };
      }),
    }));
    triggerCelebration();
  };

  // Ideas Actions
  const addIdea = (idea: Omit<LifeIdea, 'id'>) => {
    const newIdea: LifeIdea = {
      ...idea,
      id: 'idea-' + Date.now(),
    };
    setState((prev) => ({ ...prev, ideas: [newIdea, ...prev.ideas] }));
  };

  const updateIdea = (idea: LifeIdea) => {
    setState((prev) => ({
      ...prev,
      ideas: prev.ideas.map((i) => (i.id === idea.id ? idea : i)),
    }));
  };

  const deleteIdea = (id: string) => {
    setState((prev) => ({
      ...prev,
      ideas: prev.ideas.filter((i) => i.id !== id),
    }));
  };

  const toggleIdeaAction = (ideaId: string, actionId: string) => {
    setState((prev) => ({
      ...prev,
      ideas: prev.ideas.map((i) => {
        if (i.id !== ideaId) return i;
        return {
          ...i,
          actionItems: i.actionItems.map((ai) =>
            ai.id === actionId ? { ...ai, done: !ai.done } : ai
          ),
        };
      }),
    }));
  };

  // Calendar Events Actions
  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: 'event-' + Date.now(),
    };
    setState((prev) => ({ ...prev, events: [newEvent, ...prev.events] }));
  };

  const deleteEvent = (id: string) => {
    setState((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== id),
    }));
  };

  // Backup & Restore
  const exportBackupJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `life_os_backup_${todayDate}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importBackupJson = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          if (parsed && typeof parsed === 'object') {
            setState(parsed);
            resolve(true);
            return;
          }
        } catch (err) {
          console.error('Import error:', err);
        }
        resolve(false);
      };
      reader.readAsText(file);
    });
  };

  const resetToDemoData = () => {
    if (window.confirm('Reset all data back to the clean sample starter state?')) {
      setState(initialLifeState);
    }
  };

  return (
    <LifeContext.Provider
      value={{
        state,
        todayDate,
        addWater,
        setWaterTarget,
        resetTodayWater,
        toggleRoutine,
        addRoutine,
        deleteRoutine,
        addMeal,
        deleteMeal,
        addTransaction,
        deleteTransaction,
        addBook,
        updateBook,
        deleteBook,
        logMood,
        addJournalCard,
        updateJournalCard,
        deleteJournalCard,
        togglePinCard,
        addHobby,
        updateHobby,
        deleteHobby,
        toggleHobbyMilestone,
        addWorkout,
        deleteWorkout,
        logWorkoutCompletion,
        addIdea,
        updateIdea,
        deleteIdea,
        toggleIdeaAction,
        addEvent,
        deleteEvent,
        exportBackupJson,
        importBackupJson,
        resetToDemoData,
      }}
    >
      {children}
    </LifeContext.Provider>
  );
};

export const useLife = (): LifeContextType => {
  const context = useContext(LifeContext);
  if (!context) {
    throw new Error('useLife must be used within a LifeProvider');
  }
  return context;
};
