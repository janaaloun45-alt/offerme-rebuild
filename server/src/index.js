import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDB } from "./db.js";
import { authRouter } from "./routes/auth.js";
import { cardsRouter } from "./routes/cards.js";
import { offersRouter } from "./routes/offers.js";
import { userCardsRouter } from "./routes/userCards.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",") : true,
  }),
);

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/cards", cardsRouter);
app.use("/api/user-cards", userCardsRouter);
app.use("/api/offers", offersRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

const port = Number(process.env.PORT ?? 5000);

connectDB()
  .then(() => {
    console.log("MongoDB connected (database: offerme)");
    app.listen(port, () => console.log(`OfferMe API listening on port ${port}`));
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
