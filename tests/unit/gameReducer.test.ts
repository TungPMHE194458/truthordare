import { describe, expect, it } from "vitest";
import { createInitialGameState, gameReducer } from "@/lib/gameReducer";
import type { Card, RandomPairResponse } from "@/types/game";

const card = (id: string, type: Card["type"]): Card => ({
  id,
  type,
  content: `content ${id}`,
  category: "fun",
  difficulty: "easy",
  mode: "default",
  level: null,
});

const pair = (truthId: string, dareId: string, recycled = { truth: false, dare: false }): RandomPairResponse => ({
  truth: card(truthId, "truth"),
  dare: card(dareId, "dare"),
  recycled,
});

const ready = () =>
  gameReducer(gameReducer(createInitialGameState(), { type: "DRAW_START" }), {
    type: "DRAW_SUCCESS",
    payload: pair("truth_001", "dare_001"),
  });

describe("gameReducer", () => {
  it("starts idle with nothing revealed", () => {
    const state = createInitialGameState();
    expect(state.status).toBe("idle");
    expect(state.truthRevealed).toBe(false);
    expect(state.dareRevealed).toBe(false);
  });

  it("draws a card with both halves hidden and records history", () => {
    const state = ready();
    expect(state.status).toBe("ready");
    expect(state.currentTruth?.id).toBe("truth_001");
    expect(state.currentDare?.id).toBe("dare_001");
    expect(state.truthRevealed).toBe(false);
    expect(state.dareRevealed).toBe(false);
    expect(state.history).toEqual({ truth: ["truth_001"], dare: ["dare_001"] });
    expect(state.round).toBe(1);
  });

  it("reveals only the requested half", () => {
    const truthOnly = gameReducer(ready(), { type: "REVEAL", target: "truth" });
    expect(truthOnly.truthRevealed).toBe(true);
    expect(truthOnly.dareRevealed).toBe(false);

    const both = gameReducer(truthOnly, { type: "REVEAL", target: "dare" });
    expect(both.truthRevealed).toBe(true);
    expect(both.dareRevealed).toBe(true);
  });

  it("treats a repeat reveal as a no-op", () => {
    const revealed = gameReducer(ready(), { type: "REVEAL", target: "truth" });
    expect(gameReducer(revealed, { type: "REVEAL", target: "truth" })).toBe(revealed);
  });

  it("ignores reveals while a new card is loading", () => {
    const loading = gameReducer(ready(), { type: "DRAW_START" });
    expect(gameReducer(loading, { type: "REVEAL", target: "dare" })).toBe(loading);
  });

  it("resets reveal state when a new card is drawn", () => {
    let state = gameReducer(ready(), { type: "REVEAL", target: "truth" });
    state = gameReducer(state, { type: "REVEAL", target: "dare" });
    state = gameReducer(state, { type: "DRAW_START" });
    state = gameReducer(state, { type: "DRAW_SUCCESS", payload: pair("truth_002", "dare_002") });
    expect(state.truthRevealed).toBe(false);
    expect(state.dareRevealed).toBe(false);
    expect(state.round).toBe(2);
    expect(state.history.truth).toEqual(["truth_001", "truth_002"]);
  });

  it("restarts the history of a type the server recycled", () => {
    const state = gameReducer(ready(), {
      type: "DRAW_SUCCESS",
      payload: pair("truth_009", "dare_009", { truth: true, dare: false }),
    });
    expect(state.history.truth).toEqual(["truth_009"]);
    expect(state.history.dare).toEqual(["dare_001", "dare_009"]);
  });

  it("handles failure, empty and reset", () => {
    expect(gameReducer(ready(), { type: "DRAW_FAILURE" }).status).toBe("error");
    expect(gameReducer(ready(), { type: "DRAW_EMPTY" }).status).toBe("empty");

    const reset = gameReducer(ready(), { type: "RESET" });
    expect(reset.status).toBe("idle");
    expect(reset.currentTruth).toBeNull();
    expect(reset.history.truth).toEqual(["truth_001"]);
  });

  it("reset keeps the current mode selection and level", () => {
    const inCoupleMode = gameReducer(ready(), { type: "SET_MODES", modes: ["couple"], level: 2 });
    const drawn = gameReducer(inCoupleMode, { type: "DRAW_SUCCESS", payload: pair("truth_c1", "dare_c1") });
    const reset = gameReducer(drawn, { type: "RESET" });
    expect(reset.modes).toEqual(["couple"]);
    expect(reset.level).toBe(2);
    expect(reset.status).toBe("idle");
  });

  it("switching mode clears the card, history and round", () => {
    const state = gameReducer(ready(), { type: "SET_MODES", modes: ["dark"], level: 4 });
    expect(state.modes).toEqual(["dark"]);
    expect(state.level).toBe(4);
    expect(state.status).toBe("idle");
    expect(state.currentTruth).toBeNull();
    expect(state.currentDare).toBeNull();
    expect(state.history).toEqual({ truth: [], dare: [] });
    expect(state.round).toBe(0);
  });

  it("switching back to default mode clears the level", () => {
    const inDarkMode = gameReducer(ready(), { type: "SET_MODES", modes: ["dark"], level: 1 });
    const state = gameReducer(inDarkMode, { type: "SET_MODES", modes: ["default"], level: null });
    expect(state.modes).toEqual(["default"]);
    expect(state.level).toBeNull();
  });

  it("can select several modes at once, with no single level", () => {
    const state = gameReducer(ready(), { type: "SET_MODES", modes: ["default", "couple"], level: null });
    expect(state.modes).toEqual(["default", "couple"]);
    expect(state.level).toBeNull();
    expect(state.status).toBe("idle");
  });
});
