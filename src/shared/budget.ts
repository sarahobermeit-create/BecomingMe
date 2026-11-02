export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: string;
  amount: number;
  title: string;
  notes?: string;
  updatedAt: string;
}

export interface TransactionWrite {
  id: string;
  date: string;
  type: TransactionType;
  category: string;
  amount: number;
  title: string;
  notes?: string;
  deleted: boolean;
  changedAt: number;
}
