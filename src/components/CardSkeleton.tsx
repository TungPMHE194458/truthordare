export function CardSkeleton() {
  return (
    <div className="card-shell card-enter" role="status">
      <div className="game-card">
        <div className="skeleton-half" />
        <div className="card-divider" />
        <div className="skeleton-half" />
      </div>
      <p className="absolute inset-0 grid place-items-center font-display text-lg font-bold text-card-fg/70">
        Đang rút bài…
      </p>
    </div>
  );
}
