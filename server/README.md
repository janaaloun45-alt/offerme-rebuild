# OfferMe API (Express + Mongoose)

Architecture: React/Vite frontend → Express backend → your MongoDB Atlas cluster (database `offerme`).
The frontend never talks to MongoDB directly.

## Setup

```bash
cd server
cp .env.example .env   # fill in MONGODB_URI, JWT_SECRET, FRONTEND_URL, PORT
npm install
npm run seed           # refreshes demo card products and DEMO offers in the `offerme` database
npm run dev
```

Set `VITE_API_URL` in the frontend `.env` to the API URL (e.g. `http://localhost:5000`).

## Routes

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/cards` — available card products
- `GET /api/user-cards`, `POST /api/user-cards`, `DELETE /api/user-cards/:cardId` (JWT required)
- `GET /api/offers`, `GET /api/offers/search?merchant=Caribou`

Only bank name and card product are stored for a user. No card numbers, CVV, PIN, expiry,
account numbers, or bank credentials are collected or stored. Offer data seeded here is DEMO data.
The server refreshes only `isDemo: true` offers at startup so deployed sample matching stays current;
verified/non-demo offers are preserved.
