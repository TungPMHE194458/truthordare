import type { CardRecord, CardType, Category, Difficulty, Language, Level, Mode } from "@/types/game";
import { coupleDaresVi } from "./coupleDares.vi";
import { coupleTruthsVi } from "./coupleTruths.vi";
import { daresVi } from "./dares.vi";
import { darkDaresVi } from "./darkDares.vi";
import { darkTruthsVi } from "./darkTruths.vi";
import { truthsVi } from "./truths.vi";

type DefaultEntry = readonly [Category, Difficulty, string];
type LeveledEntry = readonly [Level, string];

/** Roughly tracks each level's intensity so the field stays meaningful if ever filtered on. */
const DIFFICULTY_BY_LEVEL: Record<Level, Difficulty> = { 1: "easy", 2: "easy", 3: "medium", 4: "hard" };

function toDefaultRecords(
  type: CardType,
  language: Language,
  entries: ReadonlyArray<DefaultEntry>,
): CardRecord[] {
  return entries.map(([category, difficulty, content], index) => ({
    id: `${type}_${String(index + 1).padStart(3, "0")}`,
    type,
    content,
    category,
    difficulty,
    language,
    mode: "default",
    level: null,
    isActive: true,
  }));
}

function toLeveledRecords(
  type: CardType,
  mode: Exclude<Mode, "default">,
  category: Category,
  language: Language,
  entries: ReadonlyArray<LeveledEntry>,
): CardRecord[] {
  return entries.map(([level, content], index) => ({
    id: `${type}_${mode}_${String(index + 1).padStart(3, "0")}`,
    type,
    content,
    category,
    difficulty: DIFFICULTY_BY_LEVEL[level],
    language,
    mode,
    level,
    isActive: true,
  }));
}

export const seedCards: CardRecord[] = [
  ...toDefaultRecords("truth", "vi", truthsVi),
  ...toDefaultRecords("dare", "vi", daresVi),
  ...toLeveledRecords("truth", "couple", "couples", "vi", coupleTruthsVi),
  ...toLeveledRecords("dare", "couple", "couples", "vi", coupleDaresVi),
  ...toLeveledRecords("truth", "dark", "18+", "vi", darkTruthsVi),
  ...toLeveledRecords("dare", "dark", "18+", "vi", darkDaresVi),
];
