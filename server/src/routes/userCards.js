import { Router } from "express";
import mongoose from "mongoose";
import { Card } from "../models/Card.js";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

export const userCardsRouter = Router();

userCardsRouter.use(requireAuth);

async function selected(userId) {
  const user = await User.findById(userId).populate("selectedCards");
  return user?.selectedCards ?? [];
}

userCardsRouter.get("/", async (req, res) => {
  res.json({ cards: await selected(req.userId) });
});

userCardsRouter.post("/", async (req, res) => {
  const { cardId, bankName, cardName } = req.body ?? {};
  let card = null;
  if (cardId && mongoose.isValidObjectId(cardId)) card = await Card.findById(cardId);
  else if (bankName && cardName) card = await Card.findOne({ bankName, cardName });
  if (!card) return res.status(404).json({ error: "Card product not found." });

  const user = await User.findById(req.userId);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  if (user.selectedCards.some((id) => String(id) === String(card._id))) {
    return res.status(409).json({ error: "This card is already in My Cards." });
  }
  user.selectedCards.push(card._id);
  await user.save();
  res.status(201).json({ cards: await selected(req.userId) });
});

userCardsRouter.delete("/:cardId", async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  user.selectedCards = user.selectedCards.filter((id) => String(id) !== String(req.params.cardId));
  await user.save();
  res.json({ cards: await selected(req.userId) });
});
