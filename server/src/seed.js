import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./db.js";
import { Card } from "./models/Card.js";
import { Offer } from "./models/Offer.js";

const cards = [
  { bankName: "National Bank of Kuwait (NBK)", cardName: "Visa Platinum", cardType: "Visa" },
  { bankName: "National Bank of Kuwait (NBK)", cardName: "Visa Signature", cardType: "Visa" },
  { bankName: "National Bank of Kuwait (NBK)", cardName: "Mastercard", cardType: "Mastercard" },
  { bankName: "Boubyan Bank", cardName: "Prime Visa", cardType: "Visa" },
  { bankName: "Boubyan Bank", cardName: "Visa Signature", cardType: "Visa" },
  { bankName: "Boubyan Bank", cardName: "Youth Card", cardType: "Visa" },
  { bankName: "Kuwait Finance House (KFH)", cardName: "Hesabi Visa", cardType: "Visa" },
  { bankName: "Kuwait Finance House (KFH)", cardName: "Visa Platinum", cardType: "Visa" },
  { bankName: "Kuwait Finance House (KFH)", cardName: "Mastercard World", cardType: "Mastercard" },
  { bankName: "Gulf Bank", cardName: "red Mastercard", cardType: "Mastercard" },
  { bankName: "Gulf Bank", cardName: "Visa Signature", cardType: "Visa" },
  { bankName: "Gulf Bank", cardName: "Platinum Card", cardType: "Visa" },
  { bankName: "American Express Middle East", cardName: "Gold Card", cardType: "Amex" },
  { bankName: "American Express Middle East", cardName: "Platinum Card", cardType: "Amex" },
  { bankName: "American Express Middle East", cardName: "Green Card", cardType: "Amex" },
];

// DEMO offers for prototype development only — not verified current promotions.
const offers = [
  { merchantName: "Caribou Coffee", category: "Dining", offerType: "Discount", offerValue: "25% off", description: "DEMO DATA: 25% off the total bill on weekdays.", bank: "National Bank of Kuwait (NBK)", card: "Visa Platinum" },
  { merchantName: "Starbucks", category: "Dining", offerType: "Cashback", offerValue: "15% cashback", description: "DEMO DATA: 15% cashback on in-store purchases.", bank: "Boubyan Bank", card: "Prime Visa" },
  { merchantName: "Cinescape", category: "Entertainment", offerType: "Buy 1 Get 1", offerValue: "BOGO tickets", description: "DEMO DATA: Buy one ticket get one free.", bank: "Gulf Bank", card: "red Mastercard" },
  { merchantName: "Pinkberry", category: "Dining", offerType: "Discount", offerValue: "20% off", description: "DEMO DATA: 20% off frozen yogurt.", bank: "Kuwait Finance House (KFH)", card: "Hesabi Visa" },
  { merchantName: "H&M", category: "Fashion", offerType: "Discount", offerValue: "10% off", description: "DEMO DATA: 10% off full-price items.", bank: "American Express Middle East", card: "Gold Card" },
  { merchantName: "Dean & DeLuca", category: "Dining", offerType: "Discount", offerValue: "30% off", description: "DEMO DATA: 30% off brunch menu.", bank: "National Bank of Kuwait (NBK)", card: "Visa Signature" },
];

await connectDB();

for (const card of cards) {
  await Card.updateOne({ bankName: card.bankName, cardName: card.cardName }, { $setOnInsert: { ...card, isActive: true } }, { upsert: true });
}

for (const offer of offers) {
  const card = await Card.findOne({ bankName: offer.bank, cardName: offer.card });
  await Offer.updateOne(
    { merchantName: offer.merchantName, offerValue: offer.offerValue },
    {
      $setOnInsert: {
        merchantName: offer.merchantName,
        category: offer.category,
        eligibleCards: card ? [card._id] : [],
        offerType: offer.offerType,
        offerValue: offer.offerValue,
        description: offer.description,
        expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
        isActive: true,
        isDemo: true,
      },
    },
    { upsert: true },
  );
}

console.log(`Seeded ${await Card.countDocuments()} cards and ${await Offer.countDocuments()} demo offers.`);
await mongoose.disconnect();
