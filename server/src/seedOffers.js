import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./db.js";
import { Card } from "./models/Card.js";
import { Offer } from "./models/Offer.js";

// DEMO / SAMPLE DATA ONLY — not verified current bank promotions.
const demoOffers = [
  { merchantName: "Caribou Coffee", category: "Dining", offerType: "Discount", offerValue: "20% off", valuePercent: 20, cards: [["National Bank of Kuwait (NBK)", "Visa Platinum"]] },
  { merchantName: "Caribou Coffee", category: "Dining", offerType: "Discount", offerValue: "10% off", valuePercent: 10, cards: [["Boubyan Bank", "Prime Visa"], ["Gulf Bank", "red Mastercard"]] },
  { merchantName: "Caribou Coffee", category: "Dining", offerType: "Discount", offerValue: "25% off", valuePercent: 25, cards: [["American Express Middle East", "Platinum Card"]] },
  { merchantName: "Caribou Coffee", category: "Dining", offerType: "Cashback", offerValue: "15% cashback", valuePercent: 15, cards: [["Kuwait Finance House (KFH)", "Hesabi Visa"]] },

  { merchantName: "Zara", category: "Fashion", offerType: "Discount", offerValue: "15% off", valuePercent: 15, cards: [["National Bank of Kuwait (NBK)", "Visa Signature"], ["Gulf Bank", "Visa Signature"]] },
  { merchantName: "Zara", category: "Fashion", offerType: "Discount", offerValue: "8% off", valuePercent: 8, cards: [["National Bank of Kuwait (NBK)", "Visa Platinum"]] },
  { merchantName: "Zara", category: "Fashion", offerType: "Cashback", offerValue: "20% cashback", valuePercent: 20, cards: [["American Express Middle East", "Gold Card"]] },

  { merchantName: "Nike", category: "Fashion", offerType: "Discount", offerValue: "12% off", valuePercent: 12, cards: [["Boubyan Bank", "Visa Signature"]] },
  { merchantName: "Nike", category: "Fashion", offerType: "Discount", offerValue: "18% off", valuePercent: 18, cards: [["National Bank of Kuwait (NBK)", "Mastercard"]] },
  { merchantName: "Nike", category: "Fashion", offerType: "Discount", offerValue: "22% off", valuePercent: 22, cards: [["Kuwait Finance House (KFH)", "Mastercard World"]] },

  { merchantName: "Pick", category: "Dining", offerType: "Discount", offerValue: "10% off", valuePercent: 10, cards: [["Gulf Bank", "Platinum Card"]] },
  { merchantName: "Pick", category: "Dining", offerType: "Cashback", offerValue: "15% cashback", valuePercent: 15, cards: [["National Bank of Kuwait (NBK)", "Visa Platinum"], ["Boubyan Bank", "Youth Card"]] },

  { merchantName: "VOX Cinemas", category: "Entertainment", offerType: "Discount", offerValue: "30% off", valuePercent: 30, cards: [["Gulf Bank", "red Mastercard"]] },
  { merchantName: "VOX Cinemas", category: "Entertainment", offerType: "Discount", offerValue: "20% off", valuePercent: 20, cards: [["Boubyan Bank", "Prime Visa"], ["National Bank of Kuwait (NBK)", "Visa Signature"]] },
  { merchantName: "VOX Cinemas", category: "Entertainment", offerType: "Discount", offerValue: "35% off", valuePercent: 35, cards: [["American Express Middle East", "Platinum Card"]] },

  { merchantName: "Shake Shack", category: "Dining", offerType: "Discount", offerValue: "25% off", valuePercent: 25, cards: [["Kuwait Finance House (KFH)", "Visa Platinum"]] },
  { merchantName: "Shake Shack", category: "Dining", offerType: "Discount", offerValue: "15% off", valuePercent: 15, cards: [["National Bank of Kuwait (NBK)", "Visa Platinum"], ["Gulf Bank", "Visa Signature"]] },
  { merchantName: "Shake Shack", category: "Dining", offerType: "Cashback", offerValue: "10% cashback", valuePercent: 10, cards: [["American Express Middle East", "Green Card"]] },
];

await connectDB();

let written = 0;
for (const offer of demoOffers) {
  const ids = [];
  for (const [bankName, cardName] of offer.cards) {
    const card = await Card.findOne({ bankName, cardName });
    if (card) ids.push(card._id);
  }
  await Offer.updateOne(
    { merchantName: offer.merchantName, offerValue: offer.offerValue },
    {
      $set: {
        merchantName: offer.merchantName,
        category: offer.category,
        eligibleCards: ids,
        offerType: offer.offerType,
        offerValue: offer.offerValue,
        valuePercent: offer.valuePercent,
        description: `DEMO DATA: ${offer.offerValue} at ${offer.merchantName} with an eligible card product. Sample data for prototype testing only.`,
        expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
        isActive: true,
        isDemo: true,
      },
    },
    { upsert: true },
  );
  written += 1;
}

console.log(`Upserted ${written} demo offers. Total offers: ${await Offer.countDocuments()}`);
await mongoose.disconnect();
