import { z } from "zod";
import { DEFAULT_LANGUAGE, ID_PATTERN, MAX_EXCLUDE } from "@/lib/constants";
import {
  CARD_TYPES,
  CATEGORIES,
  DIFFICULTIES,
  LANGUAGES,
  MODES,
  type Card,
  type CardFilters,
} from "@/types/game";

const idList = z
  .string()
  .optional()
  .transform((raw) => (raw ? raw.split(",").map((id) => id.trim()).filter(Boolean) : []))
  .pipe(z.array(z.string().regex(ID_PATTERN)).max(MAX_EXCLUDE));

const modeList = z
  .string()
  .optional()
  .transform((raw) => (raw ? raw.split(",").map((m) => m.trim()).filter(Boolean) : ["default"]))
  .pipe(z.array(z.enum(MODES)).min(1).max(MODES.length))
  .transform((modes) => [...new Set(modes)]);

export const randomCardQuerySchema = z.object({
  language: z.enum(LANGUAGES).default(DEFAULT_LANGUAGE),
  modes: modeList,
  level: z.coerce.number().int().pipe(z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])).optional(),
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

  const { language, modes, level, category, difficulty, excludeTruth, excludeDare } = result.data;
  // A level only means something when exactly one leveled mode is in play; with several modes
  // selected (or just "default"), a stray level param must not filter anything out.
  const singleMode = modes.length === 1 ? modes[0] : undefined;
  return {
    filters: { language, modes, level: singleMode && singleMode !== "default" ? level : undefined, category, difficulty },
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
  mode: z.enum(MODES),
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.null()]),
  isActive: z.literal(true),
});

/** Returns a safe public card, or null when the record is not renderable. */
export function toPublicCard(record: unknown): Card | null {
  const result = cardRecordSchema.safeParse(record);
  if (!result.success) return null;
  const { id, type, content, category, difficulty, mode, level } = result.data;
  return { id, type, content: content.trim(), category, difficulty, mode, level };
}
