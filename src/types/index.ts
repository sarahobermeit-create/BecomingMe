// Core TypeScript types for Life OS

export type TabType = 
  | 'overview'
  | 'routines'
  | 'meals'
  | 'water'
  | 'budget'
  | 'books'
  | 'mood'
  | 'journal'
  | 'hobbies'
  | 'exercise'
  | 'ideas'
  | 'calendar';

// 1. Routines
export interface RoutineItem {
  id: string;
  title: string;
  category: 'morning' | 'evening' | 'daily' | 'weekly';
  time?: string; // e.g. "07:30"
  streak: number;
  completedDates: string[]; // ISO date strings "YYYY-MM-DD"
  tags: string[];
}

// 2. Meal Logs
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealLogItem {
  id: string;
  date: string; // "YYYY-MM-DD"
  mealType: MealType;
  title: string;
  description?: string;
  calories?: number;
  tags?: string[]; // e.g. ["High Protein", "Home Cooked"]
  imageUrl?: string;
}

// 3. Water Consumption
export interface WaterLog {
  date: string; // "YYYY-MM-DD"
  amountMl: number;
  targetMl: number;
}

// 4. Budget & Spendings
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string; // "YYYY-MM-DD"
  type: TransactionType;
  category: string; // "Food", "Rent", "Entertainment", "Investments", etc.
  amount: number;
  title: string;
  notes?: string;
}

// 5. Books Tracker
export type BookStatus = 'want_to_read' | 'reading' | 'completed' | 'on_hold';

export interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  totalPages: number;
  currentPage: number;
  rating?: number; // 1-5
  coverUrl?: string;
  startDate?: string;
  finishDate?: string;
  favoriteQuotes?: string[];
  notes?: string;
}

// 6. Mood Tracker
export type MoodScore = 1 | 2 | 3 | 4 | 5; // 1: Terribly Down, 2: Down, 3: Neutral, 4: Good, 5: Fantastic

export interface MoodEntry {
  id: string;
  date: string; // "YYYY-MM-DD"
  score: MoodScore;
  energyLevel: number; // 1-5
  label: string; // "Ecstatic", "Peaceful", "Neutral", "Exhausted", "Stressed"
  factors: string[]; // ["Good Sleep", "Productive", "Social", "Workout", "Nature"]
  journalNote?: string;
}

// 7. Junk Journal
export interface JunkJournalCard {
  id: string;
  date: string; // "YYYY-MM-DD"
  title: string;
  content: string;
  colorScheme: 'lavender' | 'rose' | 'amber' | 'emerald' | 'slate' | 'cyan';
  tags: string[];
  imageUrl?: string;
  isPinned?: boolean;
  sticker?: string; // emoji or sticker icon like "✨", "☕", "🌿", "🌙"
  song?: {
    title: string;
    artist: string;
  };
}

// 8. Hobbies Tracker
export interface Hobby {
  id: string;
  name: string;
  category: string; // "Creative", "Tech", "Outdoor", "Music", "Craft"
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  hoursSpent: number;
  targetWeeklyHours: number;
  currentProject?: string;
  milestones: { id: string; title: string; completed: boolean }[];
  notes?: string;
  icon?: string;
}

// 9. Exercise Plans & Routines
export interface ExerciseSet {
  reps?: number;
  weightKg?: number;
  durationMin?: number;
  distanceKm?: number;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'hiit' | 'pilates';
  dayOfWeek?: string; // "Monday", "Tuesday", etc.
  durationMin: number;
  exercises: WorkoutExercise[];
  completedHistory: { date: string; notes?: string }[];
}

// 10. Ideas and Future Plans
export type IdeaStatus = 'spark' | 'planning' | 'in_progress' | 'completed';
export type IdeaPriority = 'low' | 'medium' | 'high';

export interface LifeIdea {
  id: string;
  title: string;
  description: string;
  category: 'Career' | 'Travel' | 'Projects' | 'Personal Growth' | 'Home' | 'Bucket List';
  status: IdeaStatus;
  priority: IdeaPriority;
  targetDate?: string;
  actionItems: { id: string; text: string; done: boolean }[];
  tags: string[];
}

// 11. Personal Calendar
export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // "YYYY-MM-DD"
  time?: string; // "14:00"
  endTime?: string;
  category: 'work' | 'personal' | 'health' | 'social' | 'deadline';
  color: string;
  notes?: string;
  reminder?: boolean;
}

// Full application state
export interface LifeState {
  routines: RoutineItem[];
  meals: MealLogItem[];
  waterLogs: Record<string, WaterLog>; // key: "YYYY-MM-DD"
  waterDailyTargetMl: number;
  transactions: Transaction[];
  books: Book[];
  moods: MoodEntry[];
  journalEntries: JunkJournalCard[];
  hobbies: Hobby[];
  workouts: WorkoutPlan[];
  ideas: LifeIdea[];
  events: CalendarEvent[];
}
