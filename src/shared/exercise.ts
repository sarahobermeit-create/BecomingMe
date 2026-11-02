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
  category: "strength" | "cardio" | "flexibility" | "hiit" | "pilates";
  dayOfWeek?: string;
  durationMin: number;
  exercises: WorkoutExercise[];
  completedHistory: { date: string; notes?: string }[];
  updatedAt: string;
}

export interface WorkoutWrite {
  id: string;
  title: string;
  category: "strength" | "cardio" | "flexibility" | "hiit" | "pilates";
  dayOfWeek?: string;
  durationMin: number;
  exercises: WorkoutExercise[];
  completedHistory: { date: string; notes?: string }[];
  deleted: boolean;
  changedAt: number;
}
