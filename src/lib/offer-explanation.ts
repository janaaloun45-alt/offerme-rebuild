// Deterministic Smart Recommendation text built ONLY from already-calculated
// offer data. Used when the AI provider is unavailable so the user always sees
// a personalised explanation instead of an error message.
export type OfferFacts = {
  merchantName: string;
  bankName: string;
  cardName: string;
  offerType: string;
  offerValue: string;
  billAmount: number;
  savings: number;
  finalAmount: number;
};

const kd = (value: number) => `${Number(value || 0).toFixed(3)} KD`;

export function buildOfferExplanation(facts: OfferFacts): string {
  const card = [facts.bankName, facts.cardName].filter(Boolean).join(" ").trim() || "your saved card";
  const offer = [facts.offerType, facts.offerValue].filter(Boolean).join(" ").trim();
  const merchant = facts.merchantName || "this merchant";

  const first = `Pay at ${merchant} with your ${card}${offer ? ` to use the ${offer} demo offer` : ""}.`;
  const second =
    facts.savings > 0
      ? `On a ${kd(facts.billAmount)} bill that saves you ${kd(facts.savings)}, so you pay ${kd(facts.finalAmount)}.`
      : `On a ${kd(facts.billAmount)} bill this is the best eligible option among your saved cards.`;
  const third = "It is the highest-value offer matched to the cards you saved in My Cards. Demo data — confirm with your bank.";

  return `${first} ${second} ${third}`;
}
