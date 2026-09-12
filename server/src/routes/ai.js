import { Router } from "express";

export const aiRouter = Router();

const schema = (data) => ({
  merchantName: String(data.merchantName ?? ""),
  bankName: String(data.bankName ?? ""),
  cardName: String(data.cardName ?? ""),
  offerType: String(data.offerType ?? ""),
  offerValue: String(data.offerValue ?? ""),
  billAmount: Number(data.billAmount ?? 0),
  savings: Number(data.savings ?? 0),
  finalAmount: Number(data.finalAmount ?? 0),
});

// AI explains the result only. Eligibility, best-offer selection, and savings
// are computed by deterministic code before this route is ever called.
aiRouter.post("/explain-offer", async (req, res) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "AI explanations are not configured." });
  }

  const d = schema(req.body ?? {});
  if (!d.merchantName || !d.cardName) {
    return res.status(400).json({ error: "Missing offer details." });
  }

  const prompt = [
    "You are OfferMe's assistant. Explain this card offer in at most 2-3 short sentences.",
    "Use ONLY the facts below. Do not invent offers, numbers, dates, or advice. No financial advice.",
    `Merchant: ${d.merchantName}`,
    `Card: ${d.bankName} ${d.cardName}`.trim(),
    `Offer: ${d.offerType} ${d.offerValue}`.trim(),
    `Bill: ${d.billAmount} KWD`,
    `Savings: ${d.savings} KWD`,
    `Final amount: ${d.finalAmount} KWD`,
  ].join("\n");

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 120,
        temperature: 0.3,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("OpenRouter error:", data?.error?.message ?? response.status);
      return res.status(502).json({ error: "AI explanation unavailable." });
    }
    const explanation = data?.choices?.[0]?.message?.content?.trim() ?? "";
    res.json({ explanation });
  } catch (error) {
    console.error("OpenRouter request failed:", error.message);
    res.status(502).json({ error: "AI explanation unavailable." });
  }
});
