import { describe, expect, it } from "vitest";
import { MAX_EXCLUDE } from "@/lib/constants";
import { parseRandomCardQuery, toPublicCard } from "@/utils/validation";

const query = (params: Record<string, string>) => parseRandomCardQuery(new URLSearchParams(params));

describe("parseRandomCardQuery", () => {
  it("applies defaults", () => {
    expect(query({})).toEqual({
      filters: { language: "vi", category: undefined, difficulty: undefined },
      exclude: { truth: [], dare: [] },
    });
  });

  it("parses filters and exclude lists", () => {
    const parsed = query({
      language: "en",
      category: "party",
      difficulty: "hard",
      excludeTruth: "truth_001, truth_002",
      excludeDare: "dare_003",
    });
    expect(parsed?.filters).toEqual({ language: "en", category: "party", difficulty: "hard" });
    expect(parsed?.exclude).toEqual({ truth: ["truth_001", "truth_002"], dare: ["dare_003"] });
  });

  it("ignores empty values", () => {
    expect(query({ category: "", excludeTruth: "" })?.exclude.truth).toEqual([]);
  });

  it.each<Record<string, string>>([
    { language: "fr" },
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
    isActive: true,
  };

  it("strips storage-only fields and trims content", () => {
    expect(toPublicCard(record)).toEqual({
      id: "truth_001",
      type: "truth",
      content: "Câu hỏi?",
      category: "fun",
      difficulty: "easy",
    });
  });

  it.each<[string, unknown]>([
    ["null", null],
    ["empty content", { ...record, content: "   " }],
    ["missing content", { ...record, content: undefined }],
    ["bad type", { ...record, type: "joke" }],
    ["inactive", { ...record, isActive: false }],
  ])("rejects %s", (_, value) => {
    expect(toPublicCard(value)).toBeNull();
  });
});
