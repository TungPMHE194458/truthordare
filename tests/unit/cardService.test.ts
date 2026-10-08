import { describe, expect, it } from "vitest";
import { seedCards } from "@/data/seed";
import { EmptyCardsError, getRandomPair } from "@/services/cardService";
import { createMemoryCardRepository } from "@/services/repositories/memoryCardRepository";
import type { CardRecord } from "@/types/game";

const record = (id: string, type: CardRecord["type"], extra: Partial<CardRecord> = {}): CardRecord => ({
  id,
  type,
  content: `content ${id}`,
  category: "fun",
  difficulty: "easy",
  language: "vi",
  isActive: true,
  ...extra,
});

const FILTERS = { language: "vi" } as const;
const NO_EXCLUDE = { truth: [], dare: [] };

describe("getRandomPair", () => {
  it("returns one truth and one dare", async () => {
    const repo = createMemoryCardRepository(seedCards);
    const pair = await getRandomPair(repo, FILTERS, NO_EXCLUDE);
    expect(pair.truth.type).toBe("truth");
    expect(pair.dare.type).toBe("dare");
    expect(pair.recycled).toEqual({ truth: false, dare: false });
  });

  it("never returns excluded cards while others remain", async () => {
    const repo = createMemoryCardRepository([
      record("truth_1", "truth"),
      record("truth_2", "truth"),
      record("dare_1", "dare"),
      record("dare_2", "dare"),
    ]);
    for (let i = 0; i < 25; i++) {
      const pair = await getRandomPair(repo, FILTERS, { truth: ["truth_1"], dare: ["dare_2"] });
      expect(pair.truth.id).toBe("truth_2");
      expect(pair.dare.id).toBe("dare_1");
    }
  });

  it("recycles the pool once every card was excluded", async () => {
    const repo = createMemoryCardRepository([record("truth_1", "truth"), record("dare_1", "dare")]);
    const pair = await getRandomPair(repo, FILTERS, { truth: ["truth_1"], dare: [] });
    expect(pair.truth.id).toBe("truth_1");
    expect(pair.recycled).toEqual({ truth: true, dare: false });
  });

  it("skips inactive cards, other languages and non-matching filters", async () => {
    const repo = createMemoryCardRepository([
      record("truth_1", "truth", { isActive: false }),
      record("truth_2", "truth", { language: "en" }),
      record("truth_3", "truth", { category: "deep" }),
      record("truth_4", "truth"),
      record("dare_1", "dare"),
    ]);
    for (let i = 0; i < 20; i++) {
      const pair = await getRandomPair(repo, { language: "vi", category: "fun" }, NO_EXCLUDE);
      expect(pair.truth.id).toBe("truth_4");
    }
  });

  it("throws EmptyCardsError when nothing matches", async () => {
    const repo = createMemoryCardRepository([record("truth_1", "truth")]);
    await expect(getRandomPair(repo, FILTERS, NO_EXCLUDE)).rejects.toBeInstanceOf(EmptyCardsError);
  });

  it("does not leak storage-only fields to the client", async () => {
    const repo = createMemoryCardRepository(seedCards);
    const pair = await getRandomPair(repo, FILTERS, NO_EXCLUDE);
    expect(Object.keys(pair.truth).sort()).toEqual(["category", "content", "difficulty", "id", "type"]);
  });
});
