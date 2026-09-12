import mongoose from "mongoose";

// selectedCards only references Card products (bank + product name).
// No card numbers, CVV, PIN, expiry, or bank credentials are ever stored.
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  selectedCards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
