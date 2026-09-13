import { Card } from "./models/Card.js";
import { Offer } from "./models/Offer.js";
import { demoCards, demoOffers } from "./demoData.js";

function cardKey(bankName, cardName) {
  return `${bankName}\u0000${cardName}`;
}

export async function seedDemoData() {
  await Card.bulkWrite(
    demoCards.map((card) => ({
      updateOne: {
        filter: { bankName: card.bankName, cardName: card.cardName },
        update: { $set: { ...card, isActive: true } },
        upsert: true,
      },
    })),
  );

  const cards = await Card.find({
    $or: demoCards.map(({ bankName, cardName }) => ({ bankName, cardName })),
  }).select("_id bankName cardName");
  const cardIds = new Map(cards.map((card) => [cardKey(card.bankName, card.cardName), card._id]));

  const missingCards = demoOffers.filter(
    (offer) => !cardIds.has(cardKey(offer.bankName, offer.cardName)),
  );
  if (missingCards.length > 0) {
    throw new Error(
      `Demo offer cards were not found: ${missingCards.map((offer) => `${offer.bankName} — ${offer.cardName}`).join(", ")}`,
    );
  }

  await Offer.deleteMany({ isDemo: true });
  const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90);
  await Offer.insertMany(
    demoOffers.map((offer) => ({
      merchantName: offer.merchantName,
      category: offer.category,
      eligibleCards: [cardIds.get(cardKey(offer.bankName, offer.cardName))],
      offerType: offer.offerType,
      offerValue: offer.offerValue,
      valuePercent: offer.valuePercent,
      description: `DEMO / SAMPLE OFFER: ${offer.offerValue} at ${offer.merchantName} with ${offer.bankName} ${offer.cardName}. Not a verified current promotion.`,
      expiryDate,
      isActive: true,
      isDemo: true,
    })),
  );

  return { cards: demoCards.length, offers: demoOffers.length };
}