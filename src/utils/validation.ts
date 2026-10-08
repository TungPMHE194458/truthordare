import { z } from "zod";
import { DEFAULT_LANGUAGE, ID_PATTERN, MAX_EXCLUDE } from "@/lib/constants";
import {
  CARD_TYPES,
  CATEGORIES,
  DIFFICULTIES,
  LANGUAGES,
  type Card,
  type CardFilters,
} from "@/types/game";

const idList = z
  .string()
  .optional()
  .transform((raw) => (raw ? raw.split(",").map((id) => id.trim()).filter(Boolean) : []))
  .pipe(z.array(z.string().regex(ID_PATTERN)).max(MAX_EXCLUDE));

export const randomCardQuerySchema = z.object({
  language: z.enum(LANGUAGES).default(DEFAULT_LANGUAGE),
  category: z.enum(CATEGORIES).optional(),
  difficulty: z.enum(DIFFICULTIES).optional(),
  excludeTruth: idList,
  excludeDare: idList,
});

export type RandomCardQuery = {
  filters: CardFilters;
  exclude: { truth: string[]; dare: string[] };
};

export function parseRandomCardQuery(params: URLSearchParams): RandomCardQuery | null {
  const raw = Object.fromEntries(
    [...params.entries()].filter(([, value]) => value !== ""),
  );
  const result = randomCardQuerySchema.safeParse(raw);
  if (!result.success) return null;

  const { language, category, difficulty, excludeTruth, excludeDare } = result.data;
  return {
    filters: { language, category, difficulty },
    exclude: { truth: excludeTruth, dare: excludeDare },
  };
}

export const cardRecordSchema = z.object({
  id: z.string().regex(ID_PATTERN),
  type: z.enum(CARD_TYPES),
  content: z.string().trim().min(1),
  category: z.enum(CATEGORIES),
  difficulty: z.enum(DIFFICULTIES),
  language: z.enum(LANGUAGES),
  isActive: z.literal(true),
});

/** Returns a safe public card, or null when the record is not renderable. */
export function toPublicCard(record: unknown): Card | null {
  const result = cardRecordSchema.safeParse(record);
  if (!result.success) return null;
  const { id, type, content, category, difficulty } = result.data;
  return { id, type, content: content.trim(), category, difficulty };
}
