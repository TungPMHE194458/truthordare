import postgres from "postgres";
import type { CardFilters, CardType, Level } from "@/types/game";
import type { CardRepository } from "./CardRepository";

type CardRow = {
  id: string;
  type: CardType;
  content: string;
  category: string;
  difficulty: string;
  language: string;
  mode: string;
  level: Level | null;
  is_active: boolean;
};

const MAX_CONNECTIONS = 5;

/**
 * Builds a Postgres array literal, e.g. `{default,couple}`. Values must come from a
 * closed, already-validated set (never raw user input) — postgres.js's own `sql.array()`
 * mis-serializes a single-element array cast to a custom enum type (card_mode[]), sending
 * the bare scalar instead of `{value}` and making Postgres reject it as a malformed array.
 */
function pgEnumArrayLiteral(values: readonly string[]): string {
  return `{${values.join(",")}}`;
}

export function createPostgresCardRepository(databaseUrl: string): CardRepository {
  const sql = postgres(databaseUrl, { max: MAX_CONNECTIONS, prepare: false });

  return {
    async getRandom(type: CardType, filters: CardFilters, exclude: readonly string[]) {
      const rows = await sql<CardRow[]>`
        select id, type, content, category, difficulty, language, mode, level, is_active
        from get_random_card(
          ${type}::card_type,
          ${filters.language},
          ${pgEnumArrayLiteral(filters.modes)}::card_mode[],
          ${filters.level ?? null}::smallint,
          ${filters.category ?? null},
          ${filters.difficulty ?? null}::card_difficulty,
          ${sql.array([...exclude])}::text[]
        )
      `;
      const row = rows[0];
      if (!row) return null;
      return {
        id: row.id,
        type: row.type,
        content: row.content,
        category: row.category,
        difficulty: row.difficulty,
        language: row.language,
        mode: row.mode,
        level: row.level,
        isActive: row.is_active,
      };
    },
  };
}
