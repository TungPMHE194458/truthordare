import type { NextRequest } from "next/server";
import { EmptyCardsError, getCardRepository, getRandomPair } from "@/services/cardService";
import type { ApiErrorCode, ApiErrorResponse, RandomPairResponse } from "@/types/game";
import { parseRandomCardQuery } from "@/utils/validation";

const NO_STORE = { "Cache-Control": "no-store" };

function errorResponse(error: ApiErrorCode, status: number) {
  return Response.json({ error } satisfies ApiErrorResponse, { status, headers: NO_STORE });
}

export async function GET(request: NextRequest) {
  const query = parseRandomCardQuery(request.nextUrl.searchParams);
  if (!query) return errorResponse("INVALID_PARAMS", 400);

  try {
    const pair = await getRandomPair(getCardRepository(), query.filters, query.exclude);
    return Response.json(pair satisfies RandomPairResponse, { headers: NO_STORE });
  } catch (error) {
    if (error instanceof EmptyCardsError) return errorResponse("EMPTY", 404);
    console.error("[api/cards/random] failed to draw a card", error);
    return errorResponse("INTERNAL", 500);
  }
}
