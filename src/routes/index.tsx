import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardsPanel, DemoNotice, PageShell, PrivacyBanner, SectionHeading } from "@/components/offerme";
import { Categories, FilterPills, OfferCard, SearchBar, offers } from "@/components/offer-content";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "OfferMe Kuwait — Find Your Best Card Perk" },
    { name: "description", content: "Search demo Kuwait merchant perks and see which saved card product offers the best value." },
    { property: "og:title", content: "OfferMe Kuwait — Find Your Best Card Perk" },
    { property: "og:description", content: "Find the best demo offer from your saved card products before you pay." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  return (
    <PageShell>
      <DemoNotice />
      <section className="mx-auto grid max-w-[1420px] gap-10 px-4 pb-16 pt-14 lg:grid-cols-[1.35fr_.85fr] lg:items-center lg:pt-20">
        <div><p className="mb-4 inline-flex rounded-full bg-secondary px-3 py-2 text-[10px] font-bold text-rose">KUWAIT CARD PERKS ENGINE · DEMO MERCHANTS</p><h1 className="max-w-4xl text-4xl font-extrabold leading-[1.05] sm:text-6xl">Find the best offer <em className="font-medium text-rose">before</em> you pay.</h1><p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground">Your cards have perks. Find which saved card product gives you the strongest eligible demo offer across Kuwait.</p><div className="mt-7"><SearchBar /></div><div className="mt-4 flex flex-wrap gap-2 text-[10px] font-semibold"><span>Instant perks near you:</span>{["Caribou Shuwaikh", "Pick Yo Bneid Al Qar", "VOX Avenues", "% Arabica KIPCO"].map((item) => <span key={item} className="rounded-full bg-secondary px-2 py-1">{item}</span>)}</div></div>
        <CardsPanel compact />
      </section>
      <section className="mx-auto max-w-[1420px] px-4 py-10"><SectionHeading eyebrow="Browse by passion" title="Curated Lifestyle Categories" action={<span className="hidden text-xs font-bold text-rose sm:block">View all 12 categories →</span>} /><Categories /></section>
      <section className="mx-auto max-w-[1420px] px-4 py-14"><SectionHeading eyebrow="Matched with your cards" title="Trending Perks in Kuwait Today" action={<FilterPills />} /><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{offers.map((offer) => <OfferCard key={offer.name} offer={offer} />)}</div></section>
      <section className="mx-auto max-w-[1420px] px-4 py-8"><SectionHeading eyebrow="Kuwait destination hubs" title="Perks by Prime Hotspots" action={<span className="hidden rounded-full bg-secondary px-3 py-2 text-xs sm:block">● Shuwaikh Industrial District</span>} /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["84", "Grand Avenue, Prestige & Phase 4"], ["42", "Zahra, Sixth Ring Road"], ["31", "Fahaheel Waterfront Seaside"], ["27", "Salmiya Arabian Gulf St"]].map(([count, place]) => <div key={place} className="flex aspect-[1.1/1] flex-col justify-end rounded-xl bg-surface p-5 soft-shadow"><b className="w-fit rounded bg-rose-soft px-2 py-1 text-[9px] text-rose">{count} ACTIVE PERKS</b><p className="mt-8 text-xs text-muted-foreground">{place}</p></div>)}</div></section>
      <PrivacyBanner />
    </PageShell>
  );
}
