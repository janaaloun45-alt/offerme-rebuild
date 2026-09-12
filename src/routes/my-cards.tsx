import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, CreditCard, LockKeyhole, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell, PrivacyBanner, useCards } from "@/components/offerme";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/my-cards")({
  head: () => ({ meta: [
    { title: "My Cards — OfferMe Kuwait" }, { name: "description", content: "Manage the bank and card products OfferMe uses for demo perk matching." },
    { property: "og:title", content: "My Cards — OfferMe Kuwait" }, { property: "og:description", content: "Manage card products for perk matching without banking credentials." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: MyCardsPage,
});

function MyCardsPage() {
  const { cards, openAddCard, removeCard } = useCards();
  const { user, loading } = useAuth();
  if (!loading && !user) {
    return <PageShell><section className="mx-auto max-w-md px-4 py-20 text-center"><p className="text-[10px] font-extrabold uppercase text-rose">Card product matching</p><h1 className="mt-2 text-4xl font-extrabold">My Cards</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Log in or create an account to save your card products and see them again on any device.</p><div className="mt-6 flex justify-center gap-3"><Link to="/login" className="rounded-full bg-secondary px-6 py-3 text-sm font-semibold">Log In</Link><Link to="/signup" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Sign Up</Link></div></section><PrivacyBanner /></PageShell>;
  }
  return <PageShell><section className="mx-auto max-w-[1180px] px-4 pb-8 pt-14"><div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"><div><p className="text-[10px] font-extrabold uppercase text-rose">Card product matching</p><h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">My Cards</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Save only the card products you own. OfferMe uses these names to match relevant demo perks—never card numbers or account access.</p></div><Button className="rounded-full" onClick={openAddCard}><Plus /> Add Card</Button></div>
    <div className="mt-10 grid gap-5 md:grid-cols-2">{cards.map((card,index) => <article key={`${card.bank}-${card.product}`} className="rounded-2xl bg-card p-5 soft-shadow"><div className={`mb-6 flex aspect-[1.7/1] flex-col justify-between rounded-xl p-5 ${index % 3 === 0 ? "bg-chocolate text-chocolate-foreground" : index % 3 === 1 ? "bg-rose text-rose-foreground" : "bg-secondary"}`}><div className="flex justify-between"><CreditCard /><span className="rounded-full bg-card/20 px-3 py-1 text-[9px] font-bold">CARD PRODUCT</span></div><div><p className="text-xs opacity-70">{card.bank}</p><h2 className="mt-1 text-2xl font-bold">{card.product}</h2></div></div><div className="flex items-center justify-between"><span className="text-xs font-semibold"><CheckCircle2 className="mr-2 inline h-4 w-4 text-rose" />Active for perk matching</span><Button variant="ghost" size="sm" className="text-rose" onClick={() => removeCard(card)}>Remove</Button></div></article>)}</div>
    <div className="mt-8 grid gap-4 rounded-2xl bg-secondary p-6 sm:grid-cols-3"><div><LockKeyhole className="mb-3 text-rose" /><b className="block">No card numbers</b><small className="text-muted-foreground">Only bank and product names.</small></div><div><ShieldCheck className="mb-3 text-rose" /><b className="block">No bank login</b><small className="text-muted-foreground">OfferMe does not connect to banks.</small></div><div><CreditCard className="mb-3 text-rose" /><b className="block">Easy to change</b><small className="text-muted-foreground">Add or remove card products anytime.</small></div></div></section><PrivacyBanner /></PageShell>;
}