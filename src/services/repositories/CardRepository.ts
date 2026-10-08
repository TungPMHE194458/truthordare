import type { CardFilters, CardType } from "@/types/game";

export interface CardRepository {
  /**
   * Returns one random active card matching the filters, skipping the excluded IDs,
   * or null when nothing matches. The raw record is validated by the service.
   */
  getRandom(type: CardType, filters: CardFilters, exclude: readonly string[]): Promise<unknown>;
}
