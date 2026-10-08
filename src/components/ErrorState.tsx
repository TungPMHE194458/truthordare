import { CloudOff, RotateCcw } from "lucide-react";
import { StatusPanel } from "./StatusPanel";

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <StatusPanel
      Icon={CloudOff}
      role="alert"
      title="Úi! Không rút được bài."
      message="Có trục trặc nhỏ khi lấy lá bài. Thử lại nhé!"
      action={
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          <RotateCcw size={20} strokeWidth={2.5} aria-hidden />
          Thử lại
        </button>
      }
    />
  );
}
