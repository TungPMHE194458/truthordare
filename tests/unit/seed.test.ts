import { describe, expect, it } from "vitest";
import { seedCards } from "@/data/seed";
import { toPublicCard } from "@/utils/validation";

describe("seed data", () => {
  it("has at least 50 truths and 50 dares", () => {
    expect(seedCards.filter((card) => card.type === "truth").length).toBeGreaterThanOrEqual(50);
    expect(seedCards.filter((card) => card.type === "dare").length).toBeGreaterThanOrEqual(50);
  });

  it("has unique ids", () => {
    const ids = seedCards.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique content per type", () => {
    for (const type of ["truth", "dare"] as const) {
      const contents = seedCards.filter((card) => card.type === type).map((card) => card.content);
      expect(new Set(contents).size).toBe(contents.length);
    }
  });

  it("only contains valid, renderable cards", () => {
    for (const card of seedCards) expect(toPublicCard(card), card.id).not.toBeNull();
  });
});
