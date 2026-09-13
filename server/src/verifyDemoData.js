import assert from "node:assert/strict";
import { demoCards, demoOffers } from "./demoData.js";
import { offerScore } from "./offerRanking.js";

const exactCardKey = (bankName, cardName) => `${bankName}\u0000${cardName}`;
const catalogue = new Set(demoCards.map((card) => exactCardKey(card.bankName, card.cardName)));

for (const offer of demoOffers) {
  assert(catalogue.has(exactCardKey(offer.bankName, offer.cardName)), `Unknown card on ${offer.merchantName}`);
  assert.match(offer.offerValue, new RegExp(String(offer.valuePercent)), `Value mismatch on ${offer.merchantName}`);
}

const combinations = [
  ["NBK only", [["National Bank of Kuwait (NBK)", "Visa Platinum"]]],
  ["Gulf only", [["Gulf Bank", "Visa Signature"]]],
  ["KFH only", [["Kuwait Finance House (KFH)", "Mastercard World"]]],
  ["all three", [
    ["National Bank of Kuwait (NBK)", "Visa Platinum"],
    ["Gulf Bank", "Visa Signature"],
    ["Kuwait Finance House (KFH)", "Mastercard World"],
  ]],
];

const expectedAllThreeWinners = new Map([
  ["Caribou Coffee", "National Bank of Kuwait (NBK)\u0000Visa Platinum"],
  ["VOX Cinemas", "Gulf Bank\u0000Visa Signature"],
  ["Zara", "Gulf Bank\u0000Visa Signature"],
  ["Nike", "Kuwait Finance House (KFH)\u0000Mastercard World"],
  ["Shake Shack", "Kuwait Finance House (KFH)\u0000Mastercard World"],
]);

for (const [combinationName, cards] of combinations) {
  const owned = new Set(cards.map(([bankName, cardName]) => exactCardKey(bankName, cardName)));
  for (const merchantName of new Set(demoOffers.map((offer) => offer.merchantName))) {
    const ranked = demoOffers
      .filter((offer) => offer.merchantName === merchantName && owned.has(exactCardKey(offer.bankName, offer.cardName)))
      .sort((a, b) => offerScore(b) - offerScore(a));

    if (combinationName === "all three") {
      assert(ranked.length >= 2, `${merchantName} needs multiple eligible offers for the three-card wallet`);
      const expectedWinner = expectedAllThreeWinners.get(merchantName);
      if (expectedWinner) {
        assert.equal(exactCardKey(ranked[0].bankName, ranked[0].cardName), expectedWinner, `Wrong winner for ${merchantName}`);
      }
    }
  }
}

console.log(`Verified ${demoOffers.length} demo offers against ${demoCards.length} exact card products and ${combinations.length} wallet combinations.`);