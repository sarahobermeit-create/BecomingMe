export interface WaterLog {
  id: string;
  date: string;
  amountMl: number;
  targetMl: number;
  updatedAt: string;
}

export interface WaterWrite {
  id: string;
  date: string;
  amountMl: number;
  targetMl: number;
  deleted: boolean;
  changedAt: number;
}
