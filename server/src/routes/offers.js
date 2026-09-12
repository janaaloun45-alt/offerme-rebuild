import { Router } from "express";
import { Offer } from "../models/Offer.js";

export const offersRouter = Router();

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

offersRouter.get("/", async (req, res) => {
  const filter = { isActive: true };
  if (req.query.category) filter.category = String(req.query.category);
  const offers = await Offer.find(filter).populate("eligibleCards").sort({ createdAt: -1 }).limit(100);
  res.json({ offers });
});

offersRouter.get("/search", async (req, res) => {
  const merchant = String(req.query.merchant ?? "").trim();
  if (!merchant) return res.json({ offers: [] });
  const offers = await Offer.find({
    isActive: true,
    merchantName: { $regex: escapeRegex(merchant), $options: "i" },
  })
    .populate("eligibleCards")
    .limit(50);
  res.json({ offers });
});
