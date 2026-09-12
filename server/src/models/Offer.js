import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  merchantName: { type: String, required: true, trim: true, index: true },
  category: { type: String, default: "" },
  eligibleCards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
  offerType: { type: String, default: "" },
  offerValue: { type: String, default: "" },
  valuePercent: { type: Number, default: 0 },
  description: { type: String, default: "" },
  expiryDate: { type: Date },
  isActive: { type: Boolean, default: true },
  imageUrl: { type: String, default: "" },
  isDemo: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const Offer = mongoose.models.Offer || mongoose.model("Offer", offerSchema);
