"use client";

import { useCallback } from "react";
import { useGame } from "@/hooks/useGame";
import { useSound } from "@/hooks/useSound";
import type { CardType } from "@/types/game";
import { CardSkeleton } from "./CardSkeleton";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { GameCard } from "./GameCard";
import { Header } from "./Header";
import { NewCardButton } from "./NewCardButton";
import { StartScreen } from "./StartScreen";

export function Game() {
  const { state, drawCard, reveal, resetGame } = useGame();
  const sound = useSound();
  const { status, currentTruth, currentDare, truthRevealed, dareRevealed, round } = state;

  const handleDraw = useCallback(() => {
    sound.play("draw");
    void drawCard();
  }, [sound, drawCard]);

  const handleReveal = useCallback(
    (type: CardType) => {
      const alreadyRevealed = type === "truth" ? truthRevealed : dareRevealed;
      if (!alreadyRevealed) sound.play("reveal");
      reveal(type);
    },
    [sound, reveal, truthRevealed, dareRevealed],
  );

  const hasCard = currentTruth !== null && currentDare !== null;
  const showCard = hasCard && (status === "ready" || status === "loading");
  const loading = status === "loading";

  return (
    <div className="app-shell">
      <div className="backdrop-deco" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <Header soundOn={sound.enabled} onToggleSound={sound.toggle} onHome={status === "idle" ? undefined : resetGame} />

      <main className="app-main relative z-10 flex flex-1 flex-col items-center justify-center gap-3 px-4 pb-4 sm:gap-4 sm:pb-8">
        {status === "idle" && <StartScreen onStart={handleDraw} />}

        {status !== "idle" && (
          <>
            <h1 className="sr-only">Truth or Dare</h1>
            <p className="round-label h-6 flex-none text-sm font-semibold uppercase tracking-[0.2em] text-muted" aria-live="polite">
              {round > 0 && status === "ready" ? `Lá #${round}` : " "}
            </p>

            {loading && !hasCard && (
              <div className="card-slot">
                <CardSkeleton />
              </div>
            )}

            {showCard && (
              <div className="card-slot">
                <GameCard
                  key={round}
                  truth={currentTruth}
                  dare={currentDare}
                  truthRevealed={truthRevealed}
                  dareRevealed={dareRevealed}
                  leaving={loading}
                  onReveal={handleReveal}
                />
                {loading && (
                  <p
                    className="delayed-fade-in absolute inset-0 grid place-items-center font-display text-lg font-bold text-muted"
                    role="status"
                  >
                    Đang rút bài…
                  </p>
                )}
              </div>
            )}

            {status === "error" && (
              <div className="card-slot">
                <ErrorState onRetry={handleDraw} />
              </div>
            )}
            {status === "empty" && (
              <div className="card-slot">
                <EmptyState onReset={resetGame} />
              </div>
            )}

            {showCard && <NewCardButton loading={loading} onClick={handleDraw} />}
          </>
        )}
      </main>
    </div>
  );
}
