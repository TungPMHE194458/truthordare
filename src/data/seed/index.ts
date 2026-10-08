import type { CardRecord, CardType, Category, Difficulty, Language } from "@/types/game";
import { daresVi } from "./dares.vi";
import { truthsVi } from "./truths.vi";

type SeedEntry = readonly [Category, Difficulty, string];

function toRecords(type: CardType, language: Language, entries: ReadonlyArray<SeedEntry>): CardRecord[] {
  return entries.map(([category, difficulty, content], index) => ({
    id: `${type}_${String(index + 1).padStart(3, "0")}`,
    type,
    content,
    category,
    difficulty,
    language,
    isActive: true,
  }));
}

export const seedCards: CardRecord[] = [
  ...toRecords("truth", "vi", truthsVi),
  ...toRecords("dare", "vi", daresVi),
];
