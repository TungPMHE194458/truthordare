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

/** A card as stored in the data layer. */
export type CardRecord = {
  id: string;
  type: CardType;
  content: string;
  category: Category;
  difficulty: Difficulty;
  language: Language;
  isActive: boolean;
};

/** The public shape of a card sent to the client. */
export type Card = {
  id: string;
  type: CardType;
  content: string;
  category: Category;
  difficulty: Difficulty;
};

export type CardFilters = {
  language: Language;
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
  currentTruth: Card | null;
  currentDare: Card | null;
  truthRevealed: boolean;
  dareRevealed: boolean;
  /** Recently drawn card IDs per type, oldest first. */
  history: Record<CardType, string[]>;
  round: number;
};
