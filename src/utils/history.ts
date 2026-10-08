import { HISTORY_SIZE } from "@/lib/constants";

/** Appends an ID to a bounded, de-duplicated history list (oldest first). */
export function pushHistory(history: readonly string[], id: string, size = HISTORY_SIZE): string[] {
  const next = history.filter((existing) => existing !== id);
  next.push(id);
  return next.slice(-size);
}
