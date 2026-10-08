import { pickRandom } from "@/utils/random";
import type { CardFilters, CardRecord, CardType } from "@/types/game";
import type { CardRepository } from "./CardRepository";

/** Serves cards from an in-process list. Selection still happens on the server. */
export function createMemoryCardRepository(cards: readonly CardRecord[]): CardRepository {
  return {
    async getRandom(type: CardType, filters: CardFilters, exclude: readonly string[]) {
      const excluded = new Set(exclude);
      const modes = new Set(filters.modes);
      const pool = cards.filter(
        (card) =>
          card.isActive &&
          card.type === type &&
          card.language === filters.language &&
          modes.has(card.mode) &&
          (filters.level == null || card.level === filters.level) &&
          (!filters.category || card.category === filters.category) &&
          (!filters.difficulty || card.difficulty === filters.difficulty) &&
          !excluded.has(card.id),
      );
      return pickRandom(pool) ?? null;
    },
  };
}
