export interface JunkJournalCard {
  id: string;
  date: string;
  title: string;
  content: string;
  colorScheme: "lavender" | "rose" | "amber" | "emerald" | "slate" | "cyan";
  tags: string[];
  imageUrl?: string;
  isPinned?: boolean;
  sticker?: string;
  song?: {
    title: string;
    artist: string;
  };
  updatedAt: string;
}

export interface JunkJournalWrite {
  id: string;
  date: string;
  title: string;
  content: string;
  colorScheme: "lavender" | "rose" | "amber" | "emerald" | "slate" | "cyan";
  tags: string[];
  imageUrl?: string;
  isPinned?: boolean;
  sticker?: string;
  song?: {
    title: string;
    artist: string;
  };
  deleted: boolean;
  changedAt: number;
}
