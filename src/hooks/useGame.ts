"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { CARD_EXIT_MS, HISTORY_SIZE, HISTORY_STORAGE_KEY } from "@/lib/constants";
import { EMPTY_HISTORY, createInitialGameState, gameReducer } from "@/lib/gameReducer";
import { fetchRandomPair } from "@/services/cardClient";
import type { CardType, GameState } from "@/types/game";

function isIdList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((id) => typeof id === "string");
}

function loadHistory(): GameState["history"] {
  try {
    const raw = window.sessionStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return EMPTY_HISTORY;
    const parsed: unknown = JSON.parse(raw);
    const { truth, dare } = (parsed ?? {}) as Record<string, unknown>;
    if (!isIdList(truth) || !isIdList(dare)) return EMPTY_HISTORY;
    return { truth: truth.slice(-HISTORY_SIZE), dare: dare.slice(-HISTORY_SIZE) };
  } catch {
    return EMPTY_HISTORY;
  }
}

function saveHistory(history: GameState["history"]) {
  try {
    window.sessionStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Storage may be unavailable (private mode, blocked site data); history then lasts for this page only.
  }
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function initState(): GameState {
  // History never affects rendered markup, so reading storage here cannot cause a hydration mismatch.
  return createInitialGameState(typeof window === "undefined" ? EMPTY_HISTORY : loadHistory());
}

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, initState);
  const historyRef = useRef(state.history);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    historyRef.current = state.history;
    saveHistory(state.history);
  }, [state.history]);

  useEffect(() => () => requestRef.current?.abort(), []);

  const drawCard = useCallback(async () => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    dispatch({ type: "DRAW_START" });

    try {
      // Waiting at least the exit duration lets the old card leave before the new one enters.
      const [result] = await Promise.all([
        fetchRandomPair(historyRef.current, controller.signal),
        wait(CARD_EXIT_MS),
      ]);
      if (controller.signal.aborted) return;
      dispatch(result.kind === "ok" ? { type: "DRAW_SUCCESS", payload: result.data } : { type: "DRAW_EMPTY" });
    } catch (error) {
      if (controller.signal.aborted) return;
      console.warn("Could not draw a card", error);
      dispatch({ type: "DRAW_FAILURE" });
    }
  }, []);

  const reveal = useCallback((target: CardType) => dispatch({ type: "REVEAL", target }), []);

  const resetGame = useCallback(() => {
    requestRef.current?.abort();
    dispatch({ type: "RESET" });
  }, []);

  return { state, drawCard, reveal, resetGame };
}
