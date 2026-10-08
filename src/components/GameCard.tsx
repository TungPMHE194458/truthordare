"use client";

import { useEffect, useRef } from "react";
import type { Card, CardType } from "@/types/game";
import { DareSection } from "./DareSection";
import { TruthSection } from "./TruthSection";

type GameCardProps = {
  truth: Card;
  dare: Card;
  truthRevealed: boolean;
  dareRevealed: boolean;
  leaving: boolean;
  onReveal: (type: CardType) => void;
};

export function GameCard({ truth, dare, truthRevealed, dareRevealed, leaving, onReveal }: GameCardProps) {
  const truthRef = useRef<HTMLButtonElement>(null);

  // When the control that drew this card disappeared (e.g. the start button),
  // move keyboard focus onto the card instead of leaving it on <body>.
  useEffect(() => {
    if (!document.activeElement || document.activeElement === document.body) {
      truthRef.current?.focus({ preventScroll: true });
    }
  }, []);

  return (
    <div className={`card-shell ${leaving ? "card-leave" : "card-enter"}`}>
      <article className="game-card" aria-label="Lá bài Truth or Dare" aria-busy={leaving}>
        <TruthSection ref={truthRef} card={truth} revealed={truthRevealed} onReveal={onReveal} />
        <div className="card-divider" aria-hidden="true" />
        <DareSection card={dare} revealed={dareRevealed} onReveal={onReveal} />
      </article>

      <div className="sr-only" aria-live="polite">
        {truthRevealed && <p>Sự thật: {truth.content}</p>}
        {dareRevealed && <p>Thử thách: {dare.content}</p>}
      </div>
    </div>
  );
}
