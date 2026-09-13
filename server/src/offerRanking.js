// Deterministic, code-only ranking. AI never decides eligibility or value.
export function offerScore(offer) {
  if (typeof offer.valuePercent === "number" && offer.valuePercent > 0) return offer.valuePercent;
  const match = String(offer.offerValue ?? "").match(/(\d+(?:\.\d+)?)\s*%/);
  if (match) return Number(match[1]);
  if (/buy\s*1|bogo/i.test(`${offer.offerType} ${offer.offerValue}`)) return 50;
  return 0;
}