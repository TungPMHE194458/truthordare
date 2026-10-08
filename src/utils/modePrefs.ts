import { DARK_CONSENT_STORAGE_KEY, MODE_STORAGE_KEY } from "@/lib/constants";
import { getModeInfo } from "@/lib/modes";
import { LEVELS, MODES, type Level, type Mode } from "@/types/game";

export type ModePref = { modes: Mode[]; level: Level | null };

const DEFAULT_PREF: ModePref = { modes: ["default"], level: null };

function isMode(value: unknown): value is Mode {
  return typeof value === "string" && (MODES as readonly string[]).includes(value);
}

function isLevel(value: unknown): value is Level {
  return typeof value === "number" && (LEVELS as readonly number[]).includes(value);
}

/** Reads the saved mode selection + level, falling back to default mode on anything unexpected. */
export function loadModePref(): ModePref {
  try {
    const raw = window.localStorage.getItem(MODE_STORAGE_KEY);
    if (!raw) return DEFAULT_PREF;
    const parsed: unknown = JSON.parse(raw);
    const { modes: rawModes, level } = (parsed ?? {}) as Record<string, unknown>;
    if (!Array.isArray(rawModes) || rawModes.length === 0) return DEFAULT_PREF;
    const modes = [...new Set(rawModes.filter(isMode))];
    if (modes.length === 0) return DEFAULT_PREF;

    // A level only means something with exactly one leveled mode selected.
    const singleLeveled = modes.length === 1 ? getModeInfo(modes[0]).levels : undefined;
    return { modes, level: singleLeveled && isLevel(level) ? level : null };
  } catch {
    return DEFAULT_PREF;
  }
}

export function saveModePref(pref: ModePref) {
  try {
    window.localStorage.setItem(MODE_STORAGE_KEY, JSON.stringify(pref));
  } catch {
    // Preference then lasts for this page only.
  }
}

export function hasDarkConsent(): boolean {
  try {
    return window.localStorage.getItem(DARK_CONSENT_STORAGE_KEY) === "yes";
  } catch {
    return false;
  }
}

export function setDarkConsent() {
  try {
    window.localStorage.setItem(DARK_CONSENT_STORAGE_KEY, "yes");
  } catch {
    // Consent then has to be re-confirmed next visit; the gate will show again, which is safe.
  }
}
