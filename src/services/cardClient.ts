import { DEFAULT_LANGUAGE, RANDOM_CARD_ENDPOINT } from "@/lib/constants";
import type { Card, CardFilters, CardType, RandomPairResponse } from "@/types/game";

export type DrawResult = { kind: "ok"; data: RandomPairResponse } | { kind: "empty" };

export class DrawError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DrawError";
  }
}

function isCard(value: unknown, type: CardType): value is Card {
  if (typeof value !== "object" || value === null) return false;
  const card = value as Record<string, unknown>;
  return (
    typeof card.id === "string" &&
    card.type === type &&
    typeof card.content === "string" &&
    card.content.trim().length > 0
  );
}

function isRandomPairResponse(value: unknown): value is RandomPairResponse {
  if (typeof value !== "object" || value === null) return false;
  const body = value as Record<string, unknown>;
  const recycled = body.recycled as Record<string, unknown> | undefined;
  return (
    isCard(body.truth, "truth") &&
    isCard(body.dare, "dare") &&
    typeof recycled?.truth === "boolean" &&
    typeof recycled?.dare === "boolean"
  );
}

/** Asks the server for one random Truth + Dare, excluding recently seen IDs. */
export async function fetchRandomPair(
  history: Record<CardType, readonly string[]>,
  signal: AbortSignal,
  filters: CardFilters = { language: DEFAULT_LANGUAGE, modes: ["default"] },
): Promise<DrawResult> {
  const params = new URLSearchParams({ language: filters.language, modes: filters.modes.join(",") });
  if (filters.level) params.set("level", String(filters.level));
  if (filters.category) params.set("category", filters.category);
  if (filters.difficulty) params.set("difficulty", filters.difficulty);
  if (history.truth.length) params.set("excludeTruth", history.truth.join(","));
  if (history.dare.length) params.set("excludeDare", history.dare.join(","));

  const response = await fetch(`${RANDOM_CARD_ENDPOINT}?${params}`, {
    signal,
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (response.status === 404) return { kind: "empty" };
  if (!response.ok) throw new DrawError(`Unexpected status ${response.status}`);

  const body: unknown = await response.json();
  if (!isRandomPairResponse(body)) throw new DrawError("Malformed card response");
  return { kind: "ok", data: body };
}
