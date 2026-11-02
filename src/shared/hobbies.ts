export interface HobbyMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Hobby {
  id: string;
  name: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Master";
  hoursSpent: number;
  targetWeeklyHours: number;
  currentProject?: string;
  milestones: HobbyMilestone[];
  notes?: string;
  icon?: string;
  updatedAt: string;
}

export interface HobbyWrite {
  id: string;
  name: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Master";
  hoursSpent: number;
  targetWeeklyHours: number;
  currentProject?: string;
  milestones: HobbyMilestone[];
  notes?: string;
  icon?: string;
  deleted: boolean;
  changedAt: number;
}
