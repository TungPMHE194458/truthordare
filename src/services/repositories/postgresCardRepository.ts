import postgres from "postgres";
import type { CardFilters, CardType } from "@/types/game";
import type { CardRepository } from "./CardRepository";

type CardRow = {
  id: string;
  type: CardType;
  content: string;
  category: string;
  difficulty: string;
  language: string;
  is_active: boolean;
};

const MAX_CONNECTIONS = 5;

export function createPostgresCardRepository(databaseUrl: string): CardRepository {
  const sql = postgres(databaseUrl, { max: MAX_CONNECTIONS, prepare: false });

  return {
    async getRandom(type: CardType, filters: CardFilters, exclude: readonly string[]) {
      const rows = await sql<CardRow[]>`
        select id, type, content, category, difficulty, language, is_active
        from get_random_card(
          ${type}::card_type,
          ${filters.language},
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
        isActive: row.is_active,
      };
    },
  };
}
