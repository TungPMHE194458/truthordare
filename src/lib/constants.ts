import type { Language } from "@/types/game";

/** How many recently drawn cards (per type) to avoid repeating. */
export const HISTORY_SIZE = 20;

/** Upper bound on IDs accepted in a single exclude list. */
export const MAX_EXCLUDE = 50;

export const DEFAULT_LANGUAGE: Language = "vi";

export const RANDOM_CARD_ENDPOINT = "/api/cards/random";

/** Animation timings in ms. Keep in sync with the CSS variables in globals.css. */
export const CARD_EXIT_MS = 200;
export const CARD_ENTER_MS = 350;
export const REVEAL_MS = 400;

/** Session storage key for the recent-card history. */
export const HISTORY_STORAGE_KEY = "truode:history";

/** Local storage key for the sound preference. */
export const SOUND_STORAGE_KEY = "truode:sound";

/** Local storage key for the selected mode + level. */
export const MODE_STORAGE_KEY = "truode:mode";

/** Local storage key for the Dark Mode 18+ consent confirmation. */
export const DARK_CONSENT_STORAGE_KEY = "truode:darkConsent";

export const ID_PATTERN = /^[a-z]+_[0-9a-z_-]+$/i;
