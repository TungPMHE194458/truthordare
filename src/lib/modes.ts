import { Heart, Moon, Users } from "lucide-react";
import type { ComponentType } from "react";
import type { Level, Mode } from "@/types/game";

type IconProps = { size?: number; strokeWidth?: number; "aria-hidden"?: boolean };

export type LevelInfo = {
  value: Level;
  label: string;
  hint: string;
};

export type ModeInfo = {
  id: Mode;
  label: string;
  tagline: string;
  Icon: ComponentType<IconProps>;
  /** CSS accent token suffix; see --mode-{accent} in globals.css. */
  accent: "default" | "couple" | "dark";
  /** Present only for modes that progress through stages. */
  levels?: readonly LevelInfo[];
  requiresConsent?: boolean;
};

export const MODE_INFO: readonly ModeInfo[] = [
  {
    id: "default",
    label: "Mặc định",
    tagline: "Phù hợp chơi với bạn bè, người mới quen hoặc nhóm đông người.",
    Icon: Users,
    accent: "default",
  },
  {
    id: "couple",
    label: "Couple Mode",
    tagline: "Dành cho các cặp đôi mới quen — tạo chemistry và hiểu nhau tự nhiên hơn.",
    Icon: Heart,
    accent: "couple",
    // No level picker: content still progresses Warm-up → Chemistry internally (see the
    // couple seed files), but the picker always mixes every stage instead of asking.
  },
  {
    id: "dark",
    label: "Dark Mode",
    tagline: "18+ — không gian riêng tư để hai người khám phá sự hấp dẫn giữa nhau.",
    Icon: Moon,
    accent: "dark",
    requiresConsent: true,
    levels: [
      { value: 1, label: "Tease", hint: "Trêu chọc nhẹ nhàng" },
      { value: 2, label: "Flirty", hint: "Tán tỉnh, gợi cảm" },
      { value: 3, label: "Intimate", hint: "Thân mật, riêng tư" },
      { value: 4, label: "Wild", hint: "Táo bạo hơn, vẫn tôn trọng giới hạn" },
    ],
  },
] as const;

export function getModeInfo(mode: Mode): ModeInfo {
  const info = MODE_INFO.find((m) => m.id === mode);
  if (!info) throw new Error(`Unknown mode "${mode}"`);
  return info;
}

export function getLevelInfo(mode: Mode, level: Level | null): LevelInfo | undefined {
  if (level == null) return undefined;
  return getModeInfo(mode).levels?.find((l) => l.value === level);
}

/** Default landing level when a mode with stages is selected for the first time. */
export const DEFAULT_LEVEL: Level = 1;

/** Most "intense" mode in a selection, used to pick the card's visual theme. */
const MODE_RANK: Record<Mode, number> = { default: 0, couple: 1, dark: 2 };

export function getPrimaryMode(modes: readonly Mode[]): Mode {
  return modes.reduce((best, m) => (MODE_RANK[m] > MODE_RANK[best] ? m : best), modes[0] ?? "default");
}

/** Short label for the mode pill / badge, e.g. "Couple Mode · Deep Talk" or "Mặc định + Couple Mode". */
export function summarizeSelection(modes: readonly Mode[], level: Level | null): string {
  if (modes.length > 1) {
    return modes.map((m) => getModeInfo(m).label).join(" + ");
  }
  const mode = modes[0] ?? "default";
  const info = getModeInfo(mode);
  if (!info.levels) return info.label;
  const levelInfo = getLevelInfo(mode, level);
  return `${info.label} · ${levelInfo ? levelInfo.label : "Tất cả cấp độ"}`;
}
