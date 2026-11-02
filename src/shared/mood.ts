export type MoodScore = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  id: string;
  date: string;
  score: MoodScore;
  energyLevel: number;
  label: string;
  factors: string[];
  journalNote?: string;
  updatedAt: string;
}

export interface MoodWrite {
  id: string;
  date: string;
  score: MoodScore;
  energyLevel: number;
  label: string;
  factors: string[];
  journalNote?: string;
  deleted: boolean;
  changedAt: number;
}
