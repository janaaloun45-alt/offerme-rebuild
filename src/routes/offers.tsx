import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Grid2X2, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardsPanel, DemoNotice, PageShell } from "@/components/offerme";
import { OfferCard, mapApiOffer, offers } from "@/components/offer-content";
import { api, type ApiOffer } from "@/lib/api";

export const Route = createFileRoute("/offers")({
  head: () => ({ meta: [
    { title: "Find Offers — OfferMe Kuwait" },
    { name: "description", content: "Search merchants and compare demo perks across your saved card products." },
    { property: "og:title", content: "Find Offers — OfferMe Kuwait" },
    { property: "og:description", content: "Search merchants and compare demo perks across saved cards." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: OffersPage,
});

function OffersPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof offers | null>(null);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults(null);
      return;
    }
    const timer = window.setTimeout(() => {
      api<{ offers: ApiOffer[] }>(`/api/offers/search?merchant=${encodeURIComponent(term)}`)
        .then((data) => setResults(data.offers.map(mapApiOffer)))
        .catch(() => setResults([]));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  const visible = results ?? offers;

  return <PageShell><DemoNotice />
    <section className="mx-auto mt-5 max-w-[1420px] px-4"><div className="rounded-3xl bg-rose-soft/50 px-6 py-10 md:px-10"><p className="mb-3 inline-flex rounded-full bg-card px-3 py-1 text-[10px] font-bold text-rose">⚡ INSTANT KUWAIT PERK ENGINE</p><h1 className="text-4xl font-extrabold sm:text-5xl">Where are you spending?</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Search any merchant or mall in Kuwait to instantly compare perks from your saved card products.</p><div className="mt-6 flex max-w-5xl items-center gap-3 rounded-full bg-card px-5 py-2 soft-shadow"><Search className="text-rose" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Search cafe, brand, or location (e.g. Caribou, Zara, The Avenues)..." /><span className="hidden text-[9px] font-bold sm:block">KUWAIT DINARS</span><span className="rounded-full bg-secondary px-3 py-1 text-[9px]">KWD</span></div><div className="mt-4 flex flex-wrap gap-2 text-[10px]"><b>TRENDING:</b>{["Caribou Coffee", "% Arabica Shuwaikh", "Zara Grand Avenues", "VOX Cinemas", "Shake Shack"].map((item) => <span key={item} className="rounded-full bg-card/60 px-2 py-1">{item}</span>)}</div></div></section>

    <section className="mx-auto max-w-[1420px] px-4 py-8"><div className="mb-5 flex items-center justify-between"><h2 className="flex items-center gap-2 text-xl font-bold"><SlidersHorizontal className="text-rose" /> Filter Perks</h2><span className="rounded-full bg-rose-soft px-3 py-1 text-xs font-bold text-rose">8 Active Deals Found</span></div><div className="flex gap-2 overflow-x-auto pb-4">{["All Banks", "NBK Visa", "Boubyan Prime", "Gulf Bank red™", "KFH Hesabi", "All Areas", "The Avenues", "Shuwaikh", "Salmiya", "All Perks"].map((label, index) => <Button key={label} variant={index === 0 ? "outline" : "ghost"} size="sm" className="shrink-0 rounded-full bg-secondary">{label}</Button>)}</div>
      <div className="mt-4 grid gap-6 lg:grid-cols-[310px_minmax(0,1fr)]"><aside className="space-y-4"><section className="rounded-2xl bg-card p-5 soft-shadow"><div className="mb-3 flex items-center justify-between"><h3 className="font-bold">Malls & Hubs</h3><small>Live in Kuwait</small></div><div className="grid grid-cols-2 gap-2">{[["The Avenues","42 Deals"],["360 Mall","28 Deals"],["Assima Mall","19 Deals"],["Al Kout Mall","16 Deals"]].map(([mall,deals]) => <div key={mall} className="rounded-xl bg-secondary p-3"><b className="block text-xs">{mall}</b><small className="text-[9px] text-muted-foreground"><MapPin className="inline h-3 w-3" /> Kuwait · {deals}</small></div>)}</div></section><CardsPanel compact /><section className="rounded-2xl bg-card p-5 soft-shadow"><h3 className="mb-3 font-bold">Redemption Channel</h3>{["Instant Tap (POS / Apple Pay)","In-App Kuwait Promo Code","Cashier Barcode Scan"].map((item) => <p key={item} className="mb-3 text-xs"><span className="mr-2 inline-grid h-4 w-4 place-items-center bg-rose text-rose-foreground"><Check className="h-3 w-3" /></span>{item}</p>)}</section><section className="rounded-2xl bg-chocolate p-5 text-chocolate-foreground"><small className="font-bold uppercase opacity-70">Savings simulator</small><h3 className="mt-4 font-bold">Enter your bill amount</h3><p className="text-xs opacity-65">Compare estimated demo savings.</p><div className="mt-3 rounded-xl bg-card/15 p-3"><span className="text-xs">KD</span> <b className="text-xl">18.500</b></div><div className="mt-2 flex justify-between rounded-xl bg-card/15 p-3 text-xs"><span>Estimated Best Saving:</span><b className="text-lg">KD 3.700</b></div></section></aside>
        <div><div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center rounded-xl bg-card p-4 soft-shadow"><div><h2 className="text-xl font-bold">Offers Near You</h2><p className="text-xs text-muted-foreground">Sorted by highest savings and proximity in Kuwait</p></div><Button variant="ghost" size="icon" aria-label="Grid view"><Grid2X2 /></Button></div><div className="grid gap-5 md:grid-cols-2">{visible.map((offer) => <OfferCard key={offer.name} offer={offer} detailed />)}</div><div className="mt-6 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-secondary p-5"><span className="grid h-12 w-12 place-items-center rounded-full bg-rose-soft">✓</span><div><h3 className="font-bold">Card Perk Assurance</h3><p className="text-xs text-muted-foreground">Every offer displayed is demo data and should be confirmed with the issuing bank.</p></div><Button variant="outline" className="hidden rounded-full sm:flex">Suggest a Merchant</Button></div></div></div>
    </section>
  </PageShell>;
}