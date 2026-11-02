export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  endTime?: string;
  category: "work" | "personal" | "health" | "social" | "deadline";
  color: string;
  notes?: string;
  reminder?: boolean;
  updatedAt: string;
}

export interface CalendarWrite {
  id: string;
  title: string;
  date: string;
  time?: string;
  endTime?: string;
  category: "work" | "personal" | "health" | "social" | "deadline";
  color: string;
  notes?: string;
  reminder?: boolean;
  deleted: boolean;
  changedAt: number;
}
