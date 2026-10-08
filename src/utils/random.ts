import { randomInt } from "node:crypto";

/** Picks a uniformly random element using a cryptographically strong RNG. */
export function pickRandom<T>(items: readonly T[]): T | undefined {
  if (items.length === 0) return undefined;
  return items[randomInt(items.length)];
}
