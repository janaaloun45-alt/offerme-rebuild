import { Router } from "express";
import { Card } from "../models/Card.js";

export const cardsRouter = Router();

// Public catalogue of card products available in OfferMe (demo/prototype data).
cardsRouter.get("/", async (_req, res) => {
  const cards = await Card.find({ isActive: true }).sort({ bankName: 1, cardName: 1 });
  res.json({ cards });
});
