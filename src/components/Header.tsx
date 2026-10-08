import { Volume2, VolumeX } from "lucide-react";

type HeaderProps = {
  soundOn: boolean;
  onToggleSound: () => void;
  /** When provided, the wordmark becomes a button back to the start screen. */
  onHome?: () => void;
};

function Wordmark() {
  return (
    <span className="font-display text-xl font-extrabold leading-none tracking-wide">
      <span className="text-truth-light">TRUTH</span>
      <span className="mx-1.5 text-sm font-bold text-muted">or</span>
      <span className="text-dare-light">DARE</span>
    </span>
  );
}

export function Header({ soundOn, onToggleSound, onHome }: HeaderProps) {
  return (
    <header className="app-header relative z-10 mx-auto flex h-14 w-full flex-none max-w-5xl items-center justify-between px-4 sm:h-16">
      {onHome ? (
        <button
          type="button"
          onClick={onHome}
          className="-mx-2 flex min-h-11 items-center rounded-full px-2"
          aria-label="Truth or Dare — về màn hình chính"
        >
          <Wordmark />
        </button>
      ) : (
        <Wordmark />
      )}

      <button
        type="button"
        className="icon-btn"
        onClick={onToggleSound}
        aria-pressed={soundOn}
        aria-label={soundOn ? "Âm thanh: bật" : "Âm thanh: tắt"}
        title={soundOn ? "Tắt âm thanh" : "Bật âm thanh"}
      >
        {soundOn ? <Volume2 size={20} aria-hidden /> : <VolumeX size={20} aria-hidden />}
      </button>
    </header>
  );
}
