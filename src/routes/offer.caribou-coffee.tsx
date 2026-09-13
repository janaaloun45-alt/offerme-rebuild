import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { BadgeCheck, Bookmark, CheckCircle2, CreditCard, MapPin, Share2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/offerme";
import { merchantImage } from "@/components/offer-content";
import { explainOffer } from "@/lib/ai.functions";
import { buildOfferExplanation } from "@/lib/offer-explanation";
import { api, type ApiCard, type ApiOffer } from "@/lib/api";
import coffee from "@/assets/merchants/caribou.jpg";

export const Route = createFileRoute("/offer/caribou-coffee")({
  validateSearch: (search: Record<string, unknown>) => ({
    merchant: typeof search['merchant'] === "string" ? search['merchant'] : "Caribou Coffee",
  }),
  head: () => ({ meta: [
    { title: "Caribou Coffee Demo Offer — OfferMe" }, { name: "description", content: "Preview a demo Caribou Coffee card offer and estimated savings calculator." },
    { property: "og:title", content: "Caribou Coffee Demo Offer — OfferMe" }, { property: "og:description", content: "Preview a demo card offer and savings calculator." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: OfferDetailPage,
});

function OfferDetailPage() {
  const { merchant } = Route.useSearch();
  const [amount, setAmount] = useState(5);
  const [match, setMatch] = useState<{ bestOffer: ApiOffer | null; bestOfferCard: ApiCard | null; otherOffers: ApiOffer[] } | null>(null);
  const bestOffer = match?.bestOffer;
  const bestCard = match?.bestOfferCard;
  const percent = bestOffer && typeof bestOffer.valuePercent === "number" ? bestOffer.valuePercent : Number(bestOffer?.offerValue?.match(/(\d+(?:\.\d+)?)\s*%/)?.[1] ?? 0);
  const saving = amount * percent / 100;
  const finalAmount = amount - saving;
  const [ai, setAi] = useState<{ text: string | null; loading: boolean }>({ text: null, loading: true });
  const explain = useServerFn(explainOffer);

  useEffect(() => {
    api<{ bestOffer: ApiOffer | null; bestOfferCard: ApiCard | null; otherOffers: ApiOffer[] }>(`/api/offers/search?merchant=${encodeURIComponent(merchant)}`)
      .then(setMatch)
      .catch(() => setMatch(null));
  }, [merchant]);

  // AI only explains the deterministic result above; it never calculates it.
  useEffect(() => {
    let active = true;
    setAi((prev) => ({ text: prev.text, loading: true }));
    const facts = {
      merchantName: bestOffer?.merchantName ?? merchant,
      bankName: bestCard?.bankName ?? "",
      cardName: bestCard?.cardName ?? "",
      offerType: bestOffer?.offerType ?? "",
      offerValue: bestOffer?.offerValue ?? "",
      billAmount: Number(amount.toFixed(3)),
      savings: Number(saving.toFixed(3)),
      finalAmount: Number(finalAmount.toFixed(3)),
    };
    const timer = window.setTimeout(() => {
      if (!bestOffer) {
        if (active) setAi({ text: null, loading: false });
        return;
      }
      explain({ data: facts })
        .then((data) => { if (active) setAi({ text: data.explanation || buildOfferExplanation(facts), loading: false }); })
        // Fall back to the deterministic explanation when the AI call fails.
        .catch(() => { if (active) setAi({ text: buildOfferExplanation(facts), loading: false }); });
    }, 400);
    return () => { active = false; window.clearTimeout(timer); };
  }, [amount, saving, finalAmount, bestOffer, bestCard, merchant]);
  const image = merchantImage(bestOffer?.merchantName ?? merchant) ?? coffee;
  return <PageShell><section className="mx-auto max-w-[1420px] px-4 py-8"><p className="mb-5 text-xs text-muted-foreground">Home / Offers / <b className="text-foreground">{merchant} Demo Offer</b></p><div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-start"><div className="space-y-5"><article className="overflow-hidden rounded-xl bg-card soft-shadow"><div className="relative aspect-[1.75/1] overflow-hidden"><img src={image} alt={`${merchant} storefront`} width={1200} height={760} className="h-full w-full object-cover" /><span className="absolute left-4 top-4 rounded-full bg-rose-soft px-4 py-2 text-xs font-bold text-rose">BEST DEMO OFFER FOR YOU</span><span className="absolute bottom-5 left-5 rounded-xl bg-rose px-4 py-2 text-3xl font-extrabold text-rose-foreground">{bestOffer?.offerValue?.toUpperCase() ?? "NO ELIGIBLE OFFER"}</span></div><div className="p-6"><p className="text-[10px] font-bold uppercase text-rose">{bestOffer?.category ?? "Offer"} · Demo merchant</p><h1 className="mt-2 text-3xl font-extrabold">{merchant}</h1><div className="mt-5 flex items-center justify-between rounded-xl bg-rose-soft/60 p-4"><div><small className="font-bold text-rose">PRIMARY ELIGIBLE CARD</small><b className="mt-1 block">{bestCard ? `${bestCard.bankName} ${bestCard.cardName}` : "No eligible saved card"}</b></div><span className="rounded-full bg-card px-3 py-2 text-[10px] font-bold">{bestOffer?.offerType ?? "Demo Perk"}</span></div><p className="mt-5 text-sm leading-6 text-muted-foreground">Demonstration terms only. Confirm all eligibility, dates, branches, and redemption instructions directly with the issuing bank before purchase.</p><div className="mt-5 flex flex-wrap gap-5 text-xs font-semibold"><span><MapPin className="mr-1 inline h-4 w-4 text-rose" />Kuwait branches</span><span><CreditCard className="mr-1 inline h-4 w-4 text-rose" />POS demo</span><span><CheckCircle2 className="mr-1 inline h-4 w-4 text-rose" />No minimum shown</span></div></div></article>
        <section className="rounded-xl bg-secondary p-5"><div className="mb-4 flex justify-between"><h2 className="text-xl font-bold">Other Eligible Cards In Your Wallet</h2><small>Compared automatically</small></div><div className="grid gap-4 sm:grid-cols-2">{(match?.otherOffers ?? []).map((offer) => { const card = offer.eligibleCards?.[0]; return <div key={offer._id} className="rounded-xl bg-card p-5"><b>{card ? `${card.bankName} ${card.cardName}` : "Eligible card"}</b><p className="mt-3 text-2xl font-extrabold text-rose">{offer.offerValue} <small className="text-xs font-normal text-foreground">demo offer</small></p></div>; })}</div></section>
        <section className="rounded-xl bg-card p-6 soft-shadow"><h2 className="font-bold">ⓘ Terms & Redemption Checklist</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground"><li>Available only to eligible cardholders, subject to issuer confirmation.</li><li>Demo discount applies to standard menu pricing.</li><li>Cannot be assumed combinable with other promotions.</li><li>Confirm participating locations before purchase.</li></ul></section></div>
      <aside className="sticky top-24 rounded-xl bg-card p-6 offer-shadow"><div className="flex justify-between"><div><h2 className="text-2xl font-extrabold">Savings Calculator</h2><p className="text-xs text-muted-foreground">See a demo estimate before you order</p></div><span className="h-fit rounded-full bg-rose-soft px-3 py-1 text-[9px] font-bold text-rose">DEMO RATE</span></div><label className="mt-6 block text-xs font-bold">Estimated Order Total</label><div className="mt-2 flex items-center rounded-xl bg-secondary px-4"><input type="number" min="1" max="50" step=".5" value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="h-14 min-w-0 flex-1 bg-transparent text-2xl font-bold outline-none" /><b className="text-rose">KD</b></div><div className="mt-3 grid grid-cols-5 gap-2">{[2.5,5,10,15,25].map((value) => <Button key={value} variant={amount === value ? "default" : "secondary"} size="sm" className="px-1 text-[10px]" onClick={() => setAmount(value)}>{value.toFixed(3)}</Button>)}</div><input aria-label="Order total" type="range" min="1" max="50" step=".5" value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="mt-5 w-full accent-current" /><div className="mt-6 rounded-xl bg-secondary p-5"><div className="flex justify-between text-sm"><span>Original Menu Price</span><b>{amount.toFixed(3)} KD</b></div><div className="mt-3 flex justify-between border-b border-border pb-4 text-sm text-rose"><span>{bestCard?.bankName ?? "Best card"} {bestOffer?.offerValue ?? "0%"} Instant Savings</span><b>−{saving.toFixed(3)} KD</b></div><div className="mt-4 flex items-end justify-between"><small className="font-bold">YOU PAY AT POS</small><b className="text-4xl">{finalAmount.toFixed(3)} <small className="text-base text-rose">KD</small></b></div></div><Button className="mt-5 h-12 w-full rounded-full"><BadgeCheck /> Show Demo Offer Code</Button><div className="mt-3 grid grid-cols-2 gap-2"><Button variant="secondary" className="rounded-full"><Bookmark /> Save</Button><Button variant="secondary" className="rounded-full"><Share2 /> Share</Button></div><p className="mt-5 text-center text-[10px] text-muted-foreground">Demo calculation only · Confirm with the issuing bank</p><section className="mt-5 rounded-xl bg-rose-soft/60 p-5"><h3 className="flex items-center gap-2 text-sm font-extrabold text-rose"><Sparkles className="h-4 w-4" /> Smart Recommendation</h3>{ai.loading ? <p className="mt-2 text-xs text-muted-foreground">Generating recommendation…</p> : ai.text ? <p className="mt-2 text-xs leading-5 text-foreground">{ai.text}</p> : <p className="mt-2 text-xs text-muted-foreground">Recommendation unavailable right now. The demo savings above are still accurate.</p>}</section></aside></div></section></PageShell>;
}