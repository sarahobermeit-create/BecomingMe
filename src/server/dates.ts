export function parseChangedAt(changedAt?: unknown): Date {
  if (changedAt === null || changedAt === undefined) return new Date();
  const ms = typeof changedAt === "string" ? new Date(changedAt).getTime() : Number(changedAt);
  const safeMs = !Number.isNaN(ms) ? ms : Date.now();
  return new Date(Math.min(safeMs, Date.now()));
}
