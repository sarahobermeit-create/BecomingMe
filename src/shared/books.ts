export type BookStatus = "want_to_read" | "reading" | "completed" | "on_hold" | "dnf";
export type BookFormat = "physical" | "ebook" | "audiobook";

export interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  format?: BookFormat;
  totalPages: number;
  currentPage: number;
  audioDurationMinutes?: number;
  currentAudioMinutes?: number;
  rating?: number;
  coverUrl?: string;
  startDate?: string;
  finishDate?: string;
  favoriteQuotes?: string[];
  notes?: string;
  sortOrder?: number;
  updatedAt: string;
}

export interface BookWrite {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  format?: BookFormat;
  totalPages: number;
  currentPage: number;
  audioDurationMinutes?: number;
  currentAudioMinutes?: number;
  rating?: number;
  coverUrl?: string;
  startDate?: string;
  finishDate?: string;
  favoriteQuotes?: string[];
  notes?: string;
  sortOrder?: number;
  deleted: boolean;
  changedAt: number;
}

export interface ExternalBookInfo {
  title: string;
  author: string;
  totalPages: number;
  coverUrl: string;
  publishYear?: string;
  isbn?: string;
  description?: string;
  quote?: string;
}
