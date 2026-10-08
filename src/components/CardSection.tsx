import type { ComponentType, Ref } from "react";
import { Check, Eye } from "lucide-react";
import type { Card, CardType } from "@/types/game";

type IconProps = { size?: number; strokeWidth?: number; "aria-hidden"?: boolean };

export type CardSectionCopy = {
  title: string;
  subtitle: string;
  Icon: ComponentType<IconProps>;
};

type CardSectionProps = CardSectionCopy & {
  type: CardType;
  card: Card;
  revealed: boolean;
  onReveal: (type: CardType) => void;
  ref?: Ref<HTMLButtonElement>;
};

/** One clickable half of the card. The whole half is the hit target. */
export function CardSection({ type, card, revealed, onReveal, title, subtitle, Icon, ref }: CardSectionProps) {
  const label = revealed
    ? `${subtitle} (${title}): ${card.content}`
    : `${subtitle} (${title}) — đang ẩn. Nhấn để lật.`;

  return (
    <button
      ref={ref}
      type="button"
      className="card-half"
      data-type={type}
      data-revealed={revealed}
      aria-label={label}
      onClick={() => onReveal(type)}
    >
      <span className="card-label" aria-hidden="true">
        <span className="card-label-icon">
          <Icon size={17} strokeWidth={2.5} aria-hidden />
        </span>
        <span className="card-label-title">{title}</span>
        <span className="card-label-sub">{subtitle}</span>
        {revealed && (
          <span className="card-check" title="Đã lật">
            <Check size={13} strokeWidth={3.5} aria-hidden />
          </span>
        )}
      </span>

      <span className="card-body" aria-hidden="true">
        <span className="card-text" data-revealed={revealed}>
          {card.content}
        </span>
      </span>

      {!revealed && (
        <span className="card-hint" aria-hidden="true">
          <Eye size={16} strokeWidth={2.5} aria-hidden /> Chạm để lật
        </span>
      )}
    </button>
  );
}
