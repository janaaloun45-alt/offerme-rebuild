import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDB } from "./db.js";
import { authRouter } from "./routes/auth.js";
import { cardsRouter } from "./routes/cards.js";
import { offersRouter } from "./routes/offers.js";
import { userCardsRouter } from "./routes/userCards.js";
import { aiRouter } from "./routes/ai.js";

const app = express();
app.use(express.json());
const allowedOrigins = (process.env.FRONTEND_URL ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin/curl (no Origin header), explicit FRONTEND_URL list,
      // and any Lovable preview/published domain.
      if (!origin || allowedOrigins.includes(origin) || /\.lovable\.app$/.test(new URL(origin).hostname)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
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
