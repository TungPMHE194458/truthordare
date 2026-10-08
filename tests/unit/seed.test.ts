import { describe, expect, it } from "vitest";
import { seedCards } from "@/data/seed";
import { LEVELS, type Mode } from "@/types/game";
import { toPublicCard } from "@/utils/validation";

describe("seed data", () => {
  it("has at least 50 default-mode truths and dares", () => {
    const defaults = seedCards.filter((card) => card.mode === "default");
    expect(defaults.filter((card) => card.type === "truth").length).toBeGreaterThanOrEqual(50);
    expect(defaults.filter((card) => card.type === "dare").length).toBeGreaterThanOrEqual(50);
  });

  it("has at least 50 couple-mode truths and dares, spread across every level", () => {
    const couples = seedCards.filter((card) => card.mode === "couple");
    expect(couples.filter((card) => card.type === "truth").length).toBeGreaterThanOrEqual(50);
    expect(couples.filter((card) => card.type === "dare").length).toBeGreaterThanOrEqual(50);
  });

  it("has unique ids", () => {
    const ids = seedCards.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique content per mode and type", () => {
    for (const mode of ["default", "couple", "dark"] as Mode[]) {
      for (const type of ["truth", "dare"] as const) {
        const contents = seedCards
          .filter((card) => card.mode === mode && card.type === type)
          .map((card) => card.content);
        expect(new Set(contents).size).toBe(contents.length);
      }
    }
  });

  it("only contains valid, renderable cards", () => {
    for (const card of seedCards) expect(toPublicCard(card), card.id).not.toBeNull();
  });

  it.each(["couple", "dark"] as const)("%s mode has every level, non-empty, for both types", (mode) => {
    for (const type of ["truth", "dare"] as const) {
      for (const level of LEVELS) {
        const matching = seedCards.filter((card) => card.mode === mode && card.type === type && card.level === level);
        expect(matching.length, `${mode}/${type}/level ${level}`).toBeGreaterThan(0);
      }
    }
  });

  it("default-mode cards never carry a level; couple/dark cards always do", () => {
    for (const card of seedCards) {
      if (card.mode === "default") expect(card.level, card.id).toBeNull();
      else expect(card.level, card.id).not.toBeNull();
    }
  });
});
