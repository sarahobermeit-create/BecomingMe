export type IdeaStatus = "spark" | "planning" | "in_progress" | "completed";
export type IdeaPriority = "low" | "medium" | "high";

export interface LifeIdea {
  id: string;
  title: string;
  description: string;
  category: "Career" | "Travel" | "Projects" | "Personal Growth" | "Home" | "Bucket List";
  status: IdeaStatus;
  priority: IdeaPriority;
  targetDate?: string;
  actionItems: { id: string; text: string; done: boolean }[];
  tags: string[];
  updatedAt: string;
}

export interface IdeaWrite {
  id: string;
  title: string;
  description: string;
  category: "Career" | "Travel" | "Projects" | "Personal Growth" | "Home" | "Bucket List";
  status: IdeaStatus;
  priority: IdeaPriority;
  targetDate?: string;
  actionItems: { id: string; text: string; done: boolean }[];
  tags: string[];
  deleted: boolean;
  changedAt: number;
}
