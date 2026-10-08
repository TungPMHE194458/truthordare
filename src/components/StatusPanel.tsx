import type { ComponentType, ReactNode } from "react";

type StatusPanelProps = {
  Icon: ComponentType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean }>;
  title: string;
  message: string;
  role: "alert" | "status";
  action: ReactNode;
};

/** Card-sized panel shared by the error and empty states. */
export function StatusPanel({ Icon, title, message, role, action }: StatusPanelProps) {
  return (
    <div className="card-shell card-enter">
      <div className="game-card items-center justify-center gap-4 px-8 text-center" role={role}>
        <span className="grid size-16 place-items-center rounded-full bg-card-sunken text-card-fg">
          <Icon size={30} strokeWidth={2.25} aria-hidden />
        </span>
        <h2 className="font-display text-2xl font-extrabold">{title}</h2>
        <p className="max-w-[26ch] text-base text-card-muted">{message}</p>
        <div className="mt-2">{action}</div>
      </div>
    </div>
  );
}
