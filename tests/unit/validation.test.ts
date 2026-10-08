import { describe, expect, it } from "vitest";
import { MAX_EXCLUDE } from "@/lib/constants";
import { parseRandomCardQuery, toPublicCard } from "@/utils/validation";

const query = (params: Record<string, string>) => parseRandomCardQuery(new URLSearchParams(params));

describe("parseRandomCardQuery", () => {
  it("applies defaults", () => {
    expect(query({})).toEqual({
      filters: { language: "vi", modes: ["default"], level: undefined, category: undefined, difficulty: undefined },
      exclude: { truth: [], dare: [] },
    });
  });

  it("parses filters and exclude lists", () => {
    const parsed = query({
      language: "en",
      modes: "couple",
      level: "3",
      category: "party",
      difficulty: "hard",
      excludeTruth: "truth_001, truth_002",
      excludeDare: "dare_003",
    });
    expect(parsed?.filters).toEqual({ language: "en", modes: ["couple"], level: 3, category: "party", difficulty: "hard" });
    expect(parsed?.exclude).toEqual({ truth: ["truth_001", "truth_002"], dare: ["dare_003"] });
  });

  it("parses several comma-separated modes and dedupes them", () => {
    const parsed = query({ modes: "default,couple,default" });
    expect(parsed?.filters.modes).toEqual(["default", "couple"]);
  });

  it("drops a stray level when mode is default", () => {
    expect(query({ modes: "default", level: "2" })?.filters.level).toBeUndefined();
  });

  it("drops level when several modes are selected, even a leveled one", () => {
    expect(query({ modes: "couple,dark", level: "2" })?.filters.level).toBeUndefined();
  });

  it("ignores empty values", () => {
    expect(query({ category: "", excludeTruth: "" })?.exclude.truth).toEqual([]);
  });

  it.each<Record<string, string>>([
    { language: "fr" },
    { modes: "spicy" },
    { modes: "default,spicy" },
    { level: "5" },
    { level: "0" },
    { category: "nope" },
    { difficulty: "extreme" },
    { excludeTruth: "'; drop table cards; --" },
    { excludeDare: Array.from({ length: MAX_EXCLUDE + 1 }, (_, i) => `dare_${i}`).join(",") },
  ])("rejects invalid params %o", (params) => {
    expect(query(params)).toBeNull();
  });
});

describe("toPublicCard", () => {
  const record = {
    id: "truth_001",
    type: "truth",
    content: "  Câu hỏi?  ",
    category: "fun",
    difficulty: "easy",
    language: "vi",
    mode: "default",
    level: null,
    isActive: true,
  };

  it("strips storage-only fields and trims content", () => {
    expect(toPublicCard(record)).toEqual({
      id: "truth_001",
      type: "truth",
      content: "Câu hỏi?",
      category: "fun",
      difficulty: "easy",
      mode: "default",
      level: null,
    });
  });

  it("carries the mode and level for leveled content", () => {
    const leveled = { ...record, id: "truth_dark_001", mode: "dark", category: "18+", level: 3 };
    expect(toPublicCard(leveled)).toMatchObject({ mode: "dark", level: 3 });
  });

  it.each<[string, unknown]>([
    ["null", null],
    ["empty content", { ...record, content: "   " }],
    ["missing content", { ...record, content: undefined }],
    ["bad type", { ...record, type: "joke" }],
    ["inactive", { ...record, isActive: false }],
    ["bad mode", { ...record, mode: "spicy" }],
    ["out-of-range level", { ...record, level: 5 }],
  ])("rejects %s", (_, value) => {
    expect(toPublicCard(value)).toBeNull();
  });
});
