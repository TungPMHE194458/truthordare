import { Shuffle } from "lucide-react";

type NewCardButtonProps = { loading: boolean; onClick: () => void };

export function NewCardButton({ loading, onClick }: NewCardButtonProps) {
  return (
    <button
      type="button"
      className="btn btn-primary w-full max-w-[420px]"
      // aria-disabled (not disabled) keeps keyboard focus on the button while drawing.
      aria-disabled={loading}
      onClick={() => {
        if (!loading) onClick();
      }}
    >
      <Shuffle size={20} strokeWidth={2.5} aria-hidden />
      {loading ? "Đang rút bài…" : "Lá mới"}
    </button>
  );
}
