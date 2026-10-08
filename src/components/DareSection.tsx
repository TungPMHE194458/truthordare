import { Flame } from "lucide-react";
import type { Card, CardType } from "@/types/game";
import { CardSection } from "./CardSection";

type Props = { card: Card; revealed: boolean; onReveal: (type: CardType) => void };

export function DareSection(props: Props) {
  return <CardSection type="dare" title="DARE" subtitle="Thử thách" Icon={Flame} {...props} />;
}
