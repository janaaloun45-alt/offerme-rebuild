import { createServerFn } from "@tanstack/react-start";
import { buildOfferExplanation } from "@/lib/offer-explanation";

export type ExplainOfferInput = {
  merchantName: string;
  bankName: string;
  cardName: string;
  offerType: string;
  offerValue: string;
  billAmount: number;
  savings: number;
  finalAmount: number;
};

// AI only explains an already-computed result. Eligibility, best-offer
// selection, and savings are calculated deterministically before this runs.
export const explainOffer = createServerFn({ method: "POST" })
  .inputValidator((input: ExplainOfferInput) => ({
    merchantName: String(input.merchantName ?? ""),
    bankName: String(input.bankName ?? ""),
    cardName: String(input.cardName ?? ""),
    offerType: String(input.offerType ?? ""),
    offerValue: String(input.offerValue ?? ""),
    billAmount: Number(input.billAmount ?? 0),
    savings: Number(input.savings ?? 0),
    finalAmount: Number(input.finalAmount ?? 0),
  }))
  .handler(async ({ data }): Promise<{ explanation: string }> => {
    const fallback = buildOfferExplanation(data);
    const apiKey = process.env['OPENROUTER_API_KEY'];
    if (!apiKey) return { explanation: fallback };
    if (!data.merchantName || !data.cardName) return { explanation: fallback };

    const prompt = [
      "You are OfferMe's assistant. Explain this card offer in at most 2-3 short sentences.",
      "Use ONLY the facts below. Do not invent offers, numbers, dates, or advice. No financial advice.",
      `Merchant: ${data.merchantName}`,
      `Card: ${data.bankName} ${data.cardName}`.trim(),
      `Offer: ${data.offerType} ${data.offerValue}`.trim(),
      `Bill: ${data.billAmount} KWD`,
      `Savings: ${data.savings} KWD`,
      `Final amount: ${data.finalAmount} KWD`,
    ].join("\n");

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env['OPENROUTER_MODEL'] ?? "openai/gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 120,
          temperature: 0.3,
        }),
      });
      const payload = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
        error?: { message?: string };
      };
      if (!response.ok) {
        console.error("OpenRouter error:", payload?.error?.message ?? response.status);
        return { explanation: fallback };
      }
      return { explanation: payload?.choices?.[0]?.message?.content?.trim() || fallback };
    } catch (error) {
      console.error("OpenRouter request failed:", error);
      return { explanation: fallback };
    }
  });
