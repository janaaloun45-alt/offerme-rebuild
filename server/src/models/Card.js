import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  bankName: { type: String, required: true, trim: true },
  cardName: { type: String, required: true, trim: true },
  cardType: { type: String, default: "" },
  logoUrl: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

cardSchema.index({ bankName: 1, cardName: 1 }, { unique: true });

export const Card = mongoose.models.Card || mongoose.model("Card", cardSchema);
