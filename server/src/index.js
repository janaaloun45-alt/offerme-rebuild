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
const allowedOrigins = (process.env.FRONTEND_URL ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin/curl (no Origin header), explicit FRONTEND_URL list,
      // Lovable preview/published domains, Vercel deployments, and localhost.
      if (!origin) return callback(null, true);
      let hostname = "";
      try {
        hostname = new URL(origin).hostname;
      } catch {
        return callback(null, false);
      }
      const allowed =
        allowedOrigins.includes(origin) ||
        origin === "https://offerme-pixel-perfect.lovable.app" ||
        origin === "https://offerme-rebuild-hqvw.vercel.app" ||
        /(^|\.)lovable\.app$/.test(hostname) ||
        /(^|\.)lovableproject\.com$/.test(hostname) ||
        /(^|\.)vercel\.app$/.test(hostname) ||
        hostname === "localhost" ||
        hostname === "127.0.0.1";
      return callback(null, allowed);
    },
    credentials: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
