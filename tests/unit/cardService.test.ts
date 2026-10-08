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
  mode: "default",
  level: null,
  isActive: true,
  ...extra,
});

const FILTERS = { language: "vi", modes: ["default"] } as const;
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
      const pair = await getRandomPair(repo, { language: "vi", modes: ["default"], category: "fun" }, NO_EXCLUDE);
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
    expect(Object.keys(pair.truth).sort()).toEqual(["category", "content", "difficulty", "id", "level", "mode", "type"]);
  });

  it("only draws from the requested mode", async () => {
    const repo = createMemoryCardRepository([
      record("truth_default", "truth", { mode: "default" }),
      record("truth_couple", "truth", { mode: "couple", level: 1 }),
      record("dare_default", "dare", { mode: "default" }),
      record("dare_couple", "dare", { mode: "couple", level: 1 }),
    ]);
    for (let i = 0; i < 10; i++) {
      const pair = await getRandomPair(repo, { language: "vi", modes: ["couple"], level: 1 }, NO_EXCLUDE);
      expect(pair.truth.id).toBe("truth_couple");
      expect(pair.dare.id).toBe("dare_couple");
    }
  });

  it("only draws from the requested level within a mode", async () => {
    const repo = createMemoryCardRepository([
      record("truth_l1", "truth", { mode: "dark", level: 1 }),
      record("truth_l2", "truth", { mode: "dark", level: 2 }),
      record("dare_l1", "dare", { mode: "dark", level: 1 }),
      record("dare_l2", "dare", { mode: "dark", level: 2 }),
    ]);
    for (let i = 0; i < 10; i++) {
      const pair = await getRandomPair(repo, { language: "vi", modes: ["dark"], level: 2 }, NO_EXCLUDE);
      expect(pair.truth.id).toBe("truth_l2");
      expect(pair.dare.id).toBe("dare_l2");
    }
  });

  it("ignores level entirely in default mode", async () => {
    // Default-mode cards always have level=null, so a stray level filter must not exclude them.
    const repo = createMemoryCardRepository([record("truth_default", "truth"), record("dare_default", "dare")]);
    const pair = await getRandomPair(repo, { language: "vi", modes: ["default"] }, NO_EXCLUDE);
    expect(pair.truth.id).toBe("truth_default");
    expect(pair.dare.id).toBe("dare_default");
  });

  it("recycle in one mode never bleeds into another mode's pool", async () => {
    const repo = createMemoryCardRepository([
      record("truth_default", "truth", { mode: "default" }),
      record("truth_couple", "truth", { mode: "couple", level: 1 }),
      record("dare_default", "dare", { mode: "default" }),
      record("dare_couple", "dare", { mode: "couple", level: 1 }),
    ]);
    // Exhaust the couple pool (a single card) so it must recycle...
    const pair = await getRandomPair(repo, { language: "vi", modes: ["couple"], level: 1 }, {
      truth: ["truth_couple"],
      dare: [],
    });
    // ...and the recycled pick still only comes from the couple pool, never the default one.
    expect(pair.truth.id).toBe("truth_couple");
    expect(pair.recycled.truth).toBe(true);
  });

  it("draws from the union of several selected modes", async () => {
    const repo = createMemoryCardRepository([
      record("truth_default", "truth", { mode: "default" }),
      record("truth_dark", "truth", { mode: "dark", level: 3 }),
      record("truth_couple", "truth", { mode: "couple", level: 1 }),
      record("dare_default", "dare", { mode: "default" }),
    ]);
    const seen = new Set<string>();
    for (let i = 0; i < 40; i++) {
      const pair = await getRandomPair(repo, { language: "vi", modes: ["default", "dark"] }, NO_EXCLUDE);
      seen.add(pair.truth.id);
      expect(pair.truth.id).not.toBe("truth_couple");
    }
    expect(seen).toEqual(new Set(["truth_default", "truth_dark"]));
  });

  it("mixes every level of a mode together when no level is given", async () => {
    const repo = createMemoryCardRepository([
      record("truth_l1", "truth", { mode: "couple", level: 1 }),
      record("truth_l4", "truth", { mode: "couple", level: 4 }),
      record("dare_l1", "dare", { mode: "couple", level: 1 }),
    ]);
    const seen = new Set<string>();
    for (let i = 0; i < 30; i++) {
      const pair = await getRandomPair(repo, { language: "vi", modes: ["couple"] }, NO_EXCLUDE);
      seen.add(pair.truth.id);
    }
    expect(seen).toEqual(new Set(["truth_l1", "truth_l4"]));
  });
});
