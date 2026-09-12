import { Router } from "express";
import jwt from "jsonwebtoken";
import { Offer } from "../models/Offer.js";
import { User } from "../models/User.js";

export const offersRouter = Router();

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Optional auth: matching is personalised when a valid token is present.
function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (token) {
    try {
      req.userId = jwt.verify(token, process.env.JWT_SECRET).sub;
    } catch {
      req.userId = null;
    }
  }
  next();
}

// Deterministic, code-only ranking. No AI involved.
export function offerScore(offer) {
  if (typeof offer.valuePercent === "number" && offer.valuePercent > 0) return offer.valuePercent;
  const match = String(offer.offerValue ?? "").match(/(\d+(?:\.\d+)?)\s*%/);
  if (match) return Number(match[1]);
  if (/buy\s*1|bogo/i.test(`${offer.offerType} ${offer.offerValue}`)) return 50;
  return 0;
}

offersRouter.get("/", async (req, res) => {
  const filter = { isActive: true };
  if (req.query.category) filter.category = String(req.query.category);
  const offers = await Offer.find(filter).populate("eligibleCards").sort({ createdAt: -1 }).limit(100);
  res.json({ offers });
});

offersRouter.get("/search", optionalAuth, async (req, res) => {
  const merchant = String(req.query.merchant ?? "").trim();
  if (!merchant) {
    return res.json({ merchant: "", offers: [], eligibleOffers: [], bestOffer: null, otherOffers: [], savedCardCount: 0, authenticated: Boolean(req.userId) });
  }

  const offers = await Offer.find({
    isActive: true,
    merchantName: { $regex: escapeRegex(merchant), $options: "i" },
  })
    .populate("eligibleCards")
    .limit(50);

  let savedCardIds = [];
  if (req.userId) {
    const user = await User.findById(req.userId).select("selectedCards");
    savedCardIds = (user?.selectedCards ?? []).map((id) => String(id));
  }

  const owned = new Set(savedCardIds);
  const eligibleOffers = req.userId
    ? offers.filter((offer) => (offer.eligibleCards ?? []).some((card) => owned.has(String(card._id))))
    : [];

  const ranked = [...eligibleOffers].sort((a, b) => offerScore(b) - offerScore(a));
  const [bestOffer = null, ...otherOffers] = ranked;

  res.json({
    merchant,
    authenticated: Boolean(req.userId),
    savedCardCount: savedCardIds.length,
    offers,
    eligibleOffers: ranked,
    bestOffer,
    bestOfferPercent: bestOffer ? offerScore(bestOffer) : 0,
    // The matching card the user actually owns for the best offer.
    bestOfferCard: bestOffer
      ? (bestOffer.eligibleCards ?? []).find((card) => owned.has(String(card._id))) ?? null
      : null,
    otherOffers,
  });
});
