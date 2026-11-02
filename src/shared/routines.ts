export type RoutineCategory = "morning" | "evening" | "daily" | "weekly";

export interface RoutineItem {
  id: string;
  title: string;
  category: RoutineCategory;
  time?: string;
  completedDates: string[];
  tags: string[];
  sortOrder?: number;
  updatedAt: string;
}

export interface RoutineWrite {
  id: string;
  title: string;
  category: RoutineCategory;
  time?: string;
  completedDates: string[];
  tags: string[];
  sortOrder?: number;
  deleted: boolean;
  changedAt: number;
}
