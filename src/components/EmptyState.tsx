import { Home, Inbox } from "lucide-react";
import { StatusPanel } from "./StatusPanel";

export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <StatusPanel
      Icon={Inbox}
      role="status"
      title="Hết bài phù hợp rồi."
      message="Thử chủ đề khác nhé."
      action={
        <button type="button" className="btn btn-primary" onClick={onReset}>
          <Home size={20} strokeWidth={2.5} aria-hidden />
          Về màn hình chính
        </button>
      }
    />
  );
}
