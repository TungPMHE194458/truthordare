import { Settings2, Sparkles } from "lucide-react";
import { getModeInfo, getPrimaryMode, summarizeSelection } from "@/lib/modes";
import type { Level, Mode } from "@/types/game";

type StartScreenProps = {
  modes: Mode[];
  level: Level | null;
  onStart: () => void;
  onOpenModeSheet: () => void;
};

export function StartScreen({ modes, level, onStart, onOpenModeSheet }: StartScreenProps) {
  const themeInfo = getModeInfo(getPrimaryMode(modes));

  return (
    <section className="flex flex-col items-center text-center card-enter" aria-labelledby="start-title">
      <div className="start-fan card-fan relative mb-8 h-36 w-26" aria-hidden="true">
        <span className="card-back -rotate-12 -translate-x-7" />
        <span className="card-back rotate-12 translate-x-7" />
        <span className="card-back grid place-items-center">
          <span className="font-display text-5xl font-extrabold text-white drop-shadow">?</span>
        </span>
      </div>

      <h1 id="start-title" className="start-title font-display font-extrabold leading-[0.85] tracking-wide">
        <span className="block text-6xl text-truth-light sm:text-7xl">TRUTH</span>
        <span className="start-or my-1 block text-2xl text-muted">or</span>
        <span className="block text-6xl text-dare-light sm:text-7xl">DARE</span>
      </h1>

      <p className="start-tagline mt-6 text-lg text-muted">Sẵn sàng chưa? Rút một lá để bắt đầu.</p>

      <button type="button" className="mode-pill mt-5" data-accent={themeInfo.accent} onClick={onOpenModeSheet}>
        <themeInfo.Icon size={16} aria-hidden />
        <span>{summarizeSelection(modes, level)}</span>
        <Settings2 size={14} aria-hidden />
      </button>

      <button type="button" className="start-cta btn btn-primary mt-6 w-full max-w-xs" onClick={onStart}>
        <Sparkles size={20} strokeWidth={2.5} aria-hidden />
        Rút bài
      </button>
    </section>
  );
}
