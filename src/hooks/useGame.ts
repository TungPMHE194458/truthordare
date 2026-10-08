"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { CARD_EXIT_MS, DEFAULT_LANGUAGE, HISTORY_SIZE, HISTORY_STORAGE_KEY } from "@/lib/constants";
import { EMPTY_HISTORY, createInitialGameState, gameReducer } from "@/lib/gameReducer";
import { fetchRandomPair } from "@/services/cardClient";
import type { CardFilters, CardType, GameState, Level, Mode } from "@/types/game";
import { loadModePref, saveModePref } from "@/utils/modePrefs";

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

function isDefaultOnly(modes: readonly Mode[]): boolean {
  return modes.length === 1 && modes[0] === "default";
}

function initState(): GameState {
  // History and mode never affect first render's markup (both read only after mount
  // via this lazy initializer), so reading storage here cannot cause a hydration mismatch.
  if (typeof window === "undefined") return createInitialGameState();
  const { modes, level } = loadModePref();
  // A saved mode selection pairs with its own history; starting a different selection fresh
  // avoids stale "recently seen" IDs from an entirely different card pool.
  return createInitialGameState({ modes, level, history: isDefaultOnly(modes) ? loadHistory() : EMPTY_HISTORY });
}

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, initState);
  const historyRef = useRef(state.history);
  const selectionRef = useRef<{ modes: Mode[]; level: Level | null }>({ modes: state.modes, level: state.level });
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    historyRef.current = state.history;
    if (isDefaultOnly(state.modes)) saveHistory(state.history);
  }, [state.history, state.modes]);

  useEffect(() => {
    selectionRef.current = { modes: state.modes, level: state.level };
    saveModePref({ modes: state.modes, level: state.level });
  }, [state.modes, state.level]);

  useEffect(() => () => requestRef.current?.abort(), []);

  const drawCard = useCallback(async () => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    dispatch({ type: "DRAW_START" });

    const { modes, level } = selectionRef.current;
    const filters: CardFilters = { language: DEFAULT_LANGUAGE, modes, level: level ?? undefined };

    try {
      // Waiting at least the exit duration lets the old card leave before the new one enters.
      const [result] = await Promise.all([
        fetchRandomPair(historyRef.current, controller.signal, filters),
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

  const setModes = useCallback((modes: Mode[], level: Level | null) => {
    requestRef.current?.abort();
    dispatch({ type: "SET_MODES", modes, level });
  }, []);

  const resetGame = useCallback(() => {
    requestRef.current?.abort();
    dispatch({ type: "RESET" });
  }, []);

  return { state, drawCard, reveal, setModes, resetGame };
}
