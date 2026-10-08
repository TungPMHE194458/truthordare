import { Sparkles } from "lucide-react";

type StartScreenProps = { onStart: () => void };

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <section className="flex flex-col items-center text-center card-enter" aria-labelledby="start-title">
      <div className="card-fan relative mb-8 h-36 w-26" aria-hidden="true">
        <span className="card-back -rotate-12 -translate-x-7" />
        <span className="card-back rotate-12 translate-x-7" />
        <span className="card-back grid place-items-center">
          <span className="font-display text-5xl font-extrabold text-white drop-shadow">?</span>
        </span>
      </div>

      <h1 id="start-title" className="font-display font-extrabold leading-[0.85] tracking-wide">
        <span className="block text-6xl text-truth-light sm:text-7xl">TRUTH</span>
        <span className="my-1 block text-2xl text-muted">or</span>
        <span className="block text-6xl text-dare-light sm:text-7xl">DARE</span>
      </h1>

      <p className="mt-6 text-lg text-muted">Sẵn sàng chưa? Rút một lá để bắt đầu.</p>

      <button type="button" className="btn btn-primary mt-8 w-full max-w-xs" onClick={onStart}>
        <Sparkles size={20} strokeWidth={2.5} aria-hidden />
        Rút bài
      </button>
    </section>
  );
}
