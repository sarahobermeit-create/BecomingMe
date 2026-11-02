export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface MealLogItem {
  id: string;
  date: string;
  mealType: MealType;
  title: string;
  description?: string;
  calories?: number;
  tags?: string[];
  imageUrl?: string;
  updatedAt: string;
}

export interface MealWrite {
  id: string;
  date: string;
  mealType: MealType;
  title: string;
  description?: string;
  calories?: number;
  tags?: string[];
  imageUrl?: string;
  deleted: boolean;
  changedAt: number;
}
