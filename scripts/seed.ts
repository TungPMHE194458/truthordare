import { config } from "dotenv";
import postgres from "postgres";
import { seedCards } from "../src/data/seed";

config({ path: [".env.local", ".env"], quiet: true });

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");

  const sql = postgres(databaseUrl, { max: 1 });
  try {
    const rows = seedCards.map((card) => ({
      id: card.id,
      type: card.type,
      content: card.content,
      category: card.category,
      difficulty: card.difficulty,
      language: card.language,
      is_active: card.isActive,
    }));

    await sql`
      insert into cards ${sql(rows, "id", "type", "content", "category", "difficulty", "language", "is_active")}
      on conflict (id) do update set
        type       = excluded.type,
        content    = excluded.content,
        category   = excluded.category,
        difficulty = excluded.difficulty,
        language   = excluded.language,
        is_active  = excluded.is_active
    `;
    console.log(`seeded ${rows.length} cards`);
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
