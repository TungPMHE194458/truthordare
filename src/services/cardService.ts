import { seedCards } from "@/data/seed";
import { toPublicCard } from "@/utils/validation";
import type { Card, CardFilters, CardType, RandomPairResponse } from "@/types/game";
import type { CardRepository } from "./repositories/CardRepository";
import { createMemoryCardRepository } from "./repositories/memoryCardRepository";
import { createPostgresCardRepository } from "./repositories/postgresCardRepository";

export class EmptyCardsError extends Error {
  constructor(type: CardType) {
    super(`No ${type} cards match the requested filters`);
    this.name = "EmptyCardsError";
  }
}

let repository: CardRepository | undefined;

/** Picks the data source from CARD_SOURCE (postgres | memory). */
export function getCardRepository(): CardRepository {
  if (repository) return repository;

  const source = process.env.CARD_SOURCE ?? "memory";
  if (source === "postgres") {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("CARD_SOURCE=postgres requires DATABASE_URL");
    repository = createPostgresCardRepository(databaseUrl);
  } else if (source === "memory") {
    repository = createMemoryCardRepository(seedCards);
  } else {
    throw new Error(`Unknown CARD_SOURCE "${source}"`);
  }
  return repository;
}

async function getRandomCard(
  repo: CardRepository,
  type: CardType,
  filters: CardFilters,
  exclude: readonly string[],
): Promise<{ card: Card; recycled: boolean }> {
  const fresh = toPublicCard(await repo.getRandom(type, filters, exclude));
  if (fresh) return { card: fresh, recycled: false };

  // Every matching card was recently used: start over from the full pool.
  if (exclude.length > 0) {
    const recycled = toPublicCard(await repo.getRandom(type, filters, []));
    if (recycled) return { card: recycled, recycled: true };
  }
  throw new EmptyCardsError(type);
}

export async function getRandomPair(
  repo: CardRepository,
  filters: CardFilters,
  exclude: Record<CardType, readonly string[]>,
): Promise<RandomPairResponse> {
  const [truth, dare] = await Promise.all([
    getRandomCard(repo, "truth", filters, exclude.truth),
    getRandomCard(repo, "dare", filters, exclude.dare),
  ]);
  return {
    truth: truth.card,
    dare: dare.card,
    recycled: { truth: truth.recycled, dare: dare.recycled },
  };
}
