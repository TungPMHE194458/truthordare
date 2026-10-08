import { pushHistory } from "@/utils/history";
import type { GameState, Level, Mode, CardType, RandomPairResponse } from "@/types/game";

export type GameAction =
  | { type: "DRAW_START" }
  | { type: "DRAW_SUCCESS"; payload: RandomPairResponse }
  | { type: "DRAW_FAILURE" }
  | { type: "DRAW_EMPTY" }
  | { type: "REVEAL"; target: CardType }
  | { type: "SET_MODES"; modes: Mode[]; level: Level | null }
  | { type: "RESET" };

export const EMPTY_HISTORY: GameState["history"] = { truth: [], dare: [] };

export function createInitialGameState(
  options: { modes?: Mode[]; level?: Level | null; history?: GameState["history"] } = {},
): GameState {
  const { modes = ["default"], level = null, history = EMPTY_HISTORY } = options;
  return {
    status: "idle",
    modes,
    level,
    currentTruth: null,
    currentDare: null,
    truthRevealed: false,
    dareRevealed: false,
    history,
    round: 0,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "DRAW_START":
      // Keep the current card so it can play its exit animation.
      return { ...state, status: "loading" };

    case "DRAW_SUCCESS": {
      const { truth, dare, recycled } = action.payload;
      return {
        ...state,
        status: "ready",
        currentTruth: truth,
        currentDare: dare,
        truthRevealed: false,
        dareRevealed: false,
        history: {
          truth: recycled.truth ? [truth.id] : pushHistory(state.history.truth, truth.id),
          dare: recycled.dare ? [dare.id] : pushHistory(state.history.dare, dare.id),
        },
        round: state.round + 1,
      };
    }

    case "DRAW_FAILURE":
      return { ...state, status: "error" };

    case "DRAW_EMPTY":
      return { ...state, status: "empty" };

    case "REVEAL":
      if (state.status !== "ready") return state;
      if (action.target === "truth") {
        return state.truthRevealed ? state : { ...state, truthRevealed: true };
      }
      return state.dareRevealed ? state : { ...state, dareRevealed: true };

    case "SET_MODES":
      // A new mode selection draws from a different pool, so recent-card history no longer applies.
      return createInitialGameState({ modes: action.modes, level: action.level });

    case "RESET":
      // Back to the start screen, but keep the current mode selection and dedupe history.
      return createInitialGameState({ modes: state.modes, level: state.level, history: state.history });
  }
}
