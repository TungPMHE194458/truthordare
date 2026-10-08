import { describe, expect, it } from "vitest";
import { pushHistory } from "@/utils/history";

describe("pushHistory", () => {
  it("appends and keeps only the newest entries", () => {
    let history: string[] = [];
    for (let i = 1; i <= 5; i++) history = pushHistory(history, `truth_00${i}`, 3);
    expect(history).toEqual(["truth_003", "truth_004", "truth_005"]);
  });

  it("moves a repeated id to the end instead of duplicating it", () => {
    expect(pushHistory(["a_1", "a_2", "a_3"], "a_1")).toEqual(["a_2", "a_3", "a_1"]);
  });

  it("does not mutate the input", () => {
    const input = ["a_1"];
    pushHistory(input, "a_2");
    expect(input).toEqual(["a_1"]);
  });
});
