import type { Ref } from "react";
import { MessageCircleQuestion } from "lucide-react";
import type { Card, CardType } from "@/types/game";
import { CardSection } from "./CardSection";

type Props = {
  card: Card;
  revealed: boolean;
  onReveal: (type: CardType) => void;
  ref?: Ref<HTMLButtonElement>;
};

export function TruthSection(props: Props) {
  return <CardSection type="truth" title="TRUTH" subtitle="Sự thật" Icon={MessageCircleQuestion} {...props} />;
}
