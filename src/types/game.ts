export const CARD_TYPES = ["truth", "dare"] as const;
export type CardType = (typeof CARD_TYPES)[number];

export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const LANGUAGES = ["vi", "en"] as const;
export type Language = (typeof LANGUAGES)[number];

export const CATEGORIES = [
  "fun",
  "friends",
  "couples",
  "party",
  "embarrassing",
  "deep",
  "wild",
  "18+",
] as const;
export type Category = (typeof CATEGORIES)[number];

/** Which content pool a round is drawn from. */
export const MODES = ["default", "couple", "dark"] as const;
export type Mode = (typeof MODES)[number];

/** Progression stage within couple/dark mode (1 = gentlest). Unused in default mode. */
export const LEVELS = [1, 2, 3, 4] as const;
export type Level = (typeof LEVELS)[number];

/** A card as stored in the data layer. */
export type CardRecord = {
  id: string;
  type: CardType;
  content: string;
  category: Category;
  difficulty: Difficulty;
  language: Language;
  mode: Mode;
  /** Required for couple/dark cards, null for default-mode cards. */
  level: Level | null;
  isActive: boolean;
};

/** The public shape of a card sent to the client. */
export type Card = {
  id: string;
  type: CardType;
  content: string;
  category: Category;
  difficulty: Difficulty;
  mode: Mode;
  level: Level | null;
};

export type CardFilters = {
  language: Language;
  /** Non-empty; a card matches if its mode is any of these. */
  modes: readonly Mode[];
  /** Only applied when exactly one mode is selected and that mode has levels. */
  level?: Level;
  category?: Category;
  difficulty?: Difficulty;
};

export type RandomPairResponse = {
  truth: Card;
  dare: Card;
  /** True when the exclusion list exhausted the pool and the server picked from the full pool again. */
  recycled: Record<CardType, boolean>;
};

export const API_ERROR_CODES = ["INVALID_PARAMS", "EMPTY", "INTERNAL"] as const;
export type ApiErrorCode = (typeof API_ERROR_CODES)[number];
export type ApiErrorResponse = { error: ApiErrorCode };

export type GameStatus = "idle" | "loading" | "ready" | "error" | "empty";

export type GameState = {
  status: GameStatus;
  /** Non-empty; cards are drawn from the union of these modes' pools. */
  modes: Mode[];
  /** Only meaningful when modes.length === 1 and that mode has levels. */
  level: Level | null;
  currentTruth: Card | null;
  currentDare: Card | null;
  truthRevealed: boolean;
  dareRevealed: boolean;
  /** Recently drawn card IDs per type, oldest first. */
  history: Record<CardType, string[]>;
  round: number;
};
