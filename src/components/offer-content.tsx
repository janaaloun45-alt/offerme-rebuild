import { Link } from "@tanstack/react-router";
import { Bookmark, Coffee, Film, MapPin, Plane, Search, ShoppingBag, Smartphone, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import coffee from "@/assets/merchants/caribou.jpg";
import arabica from "@/assets/merchants/arabica.jpg";
import cinema from "@/assets/merchants/vox-cinemas.jpg";
import yogurt from "@/assets/merchants/pick.jpg";
import fashion from "@/assets/merchants/zara.jpg";
import dining from "@/assets/merchants/dean-deluca.jpg";
import nike from "@/assets/merchants/nike.jpg";
import shakeShack from "@/assets/merchants/shake-shack.jpg";
import type { ApiOffer } from "@/lib/api";


export const primaryOffer = { name: "Caribou Coffee", category: "Coffee & Bakery", perk: "20% OFF", description: "Direct 20% discount on handcrafted beverages and breakfast bakery items.", bank: "NBK Visa Platinum", tag: "AUTO-APPLIED", image: coffee, location: "0.6 km · Kuwait City Hub", savings: "KD 1.000" };

export const offers = [
  primaryOffer,
  { name: "% Arabica", category: "Specialty Coffee", perk: "15% OFF", description: "Enjoy 15% discount on Spanish lattes and single-origin bags.", bank: "Boubyan Prime Card", tag: "YOUTH DEAL", image: arabica, location: "1.2 km · Shuwaikh", savings: "KD 0.600" },
  { name: "VOX Cinemas", category: "Entertainment", perk: "BUY 1 GET 1 FREE", description: "Complimentary second standard demo ticket on selected days.", bank: "Gulf Bank red™", tag: "BOGO TAP", image: cinema, location: "3.4 km · The Avenues", savings: "KD 2.500" },
  { name: "Pick Yo Frozen Yogurt", category: "Dessert & Healthy Snacks", perk: "15% CASHBACK", description: "Demo cashback on taps above KD 3.000.", bank: "NBK Platinum Card", tag: "REWARDS TIER", image: yogurt, location: "2.1 km · Bneid Al Qar", savings: "KD 2.750" },
  { name: "Zara Kuwait", category: "Fashion & Apparel", perk: "10% BONUS PTS", description: "Demo reward points on selected seasonal collections.", bank: "Boubyan Visa Signature", tag: "LIFESTYLE 360", image: fashion, location: "All Kuwait Branches", savings: "KD 6.000" },
  { name: "Dean & Deluca", category: "Fine Bistro & Gourmet", perk: "20% DINE-IN", description: "Demo direct bill discount on food and drinks.", bank: "Gulf Bank Mastercard", tag: "DIRECT POS", image: dining, location: "The Avenues Grand Avenue", savings: "KD 2.450" },
];

const categoryImages: Record<string, string> = { Dining: dining, Entertainment: cinema, Fashion: fashion, Coffee: coffee };

const merchantImages: Record<string, string> = {
  caribou: coffee,
  arabica: arabica,
  vox: cinema,
  pick: yogurt,
  zara: fashion,
  dean: dining,
  nike: nike,
  "shake shack": shakeShack,
};

function merchantImage(name: string) {
  const key = name.toLowerCase();
  const match = Object.keys(merchantImages).find((k) => key.includes(k));
  return match ? merchantImages[match] : undefined;
}

export function mapApiOffer(offer: ApiOffer): typeof primaryOffer {
  const card = offer.eligibleCards?.[0];
  return {
    name: offer.merchantName,
    category: offer.category ?? "Demo offer",
    perk: (offer.offerValue ?? "OFFER").toUpperCase(),
    description: offer.description ?? "",
    bank: card ? `${card.bankName} · ${card.cardName}` : "Eligible card",
    tag: (offer.offerType ?? "DEMO").toUpperCase(),
    image: merchantImage(offer.merchantName) || offer.imageUrl || categoryImages[offer.category ?? ""] || dining,
    location: "Kuwait",
    savings: "Demo",
  };
}


export const categories = [
  { name: "Coffee", count: 48, icon: Coffee }, { name: "Dining & Lounges", count: 62, icon: Utensils },
  { name: "Shopping & Boutiques", count: 39, icon: ShoppingBag }, { name: "Entertainment", count: 25, icon: Film },
  { name: "Travel & Lounges", count: 18, icon: Plane }, { name: "Tech & Gadgets", count: 14, icon: Smartphone },
];

export function SearchBar({ button = true }: { button?: boolean }) {
  return <div className="flex flex-col gap-2 rounded-2xl bg-card p-2 soft-shadow sm:flex-row"><div className="flex min-w-0 flex-1 items-center gap-3 px-3"><Search className="h-5 w-5 shrink-0 text-rose" /><input className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Search Caribou, Zara, Pick, VOX, % Arabica..." /></div>{button && <Button asChild className="h-11 rounded-full px-7"><Link to="/offers">Find My Offers</Link></Button>}</div>;
}

export function OfferCard({ offer = primaryOffer, detailed = false }: { offer?: typeof primaryOffer; detailed?: boolean }) {
  const body = <article className="overflow-hidden rounded-xl bg-card soft-shadow"><div className="relative aspect-[1.72/1] overflow-hidden"><img src={offer.image} alt={`Illustrative ${offer.category.toLowerCase()} scene`} width={1200} height={760} loading="lazy" className="h-full w-full object-cover" /><span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[10px] font-extrabold text-primary-foreground">{offer.perk}</span><span className="absolute bottom-3 left-3 rounded-full bg-card px-3 py-1 text-[9px] font-semibold"><MapPin className="mr-1 inline h-3 w-3 text-rose" />{offer.location}</span><span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-card"><Bookmark className="h-4 w-4" /></span></div><div className="p-4"><div className="flex justify-between gap-3 text-[9px] font-semibold text-muted-foreground"><span>{offer.category}</span><span className="text-rose">Demo offer</span></div><h3 className="mt-1 text-lg font-bold">{offer.name}</h3><p className="mt-1 min-h-10 text-xs leading-5 text-muted-foreground">{offer.description}</p><div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-[9px] font-bold"><span className="truncate">● &nbsp;{offer.bank}</span><span className="text-rose">{offer.tag}</span></div>{detailed && <div className="mt-3 flex items-end justify-between"><div><small className="block text-[9px] text-muted-foreground">Typical demo saving</small><b className="text-lg text-rose">{offer.savings}</b></div><Button asChild size="sm" className="rounded-full"><Link to="/offer/caribou-coffee">Unlock Perk</Link></Button></div>}</div></article>;
  return body;
}

export function Categories() { return <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{categories.map(({ name, count, icon: Icon }, index) => <div key={name} className="flex min-h-40 flex-col justify-between rounded-xl bg-card p-4 soft-shadow"><span className={`grid h-10 w-10 place-items-center rounded-full ${index % 2 ? "bg-secondary" : "bg-rose-soft"}`}><Icon className="h-5 w-5" /></span><div><h3 className="font-bold leading-tight">{name}</h3><p className="text-[10px] text-muted-foreground">{count} active demo perks</p></div></div>)}</div>; }

export function FilterPills() { return <div className="flex gap-2 overflow-x-auto pb-2 text-xs font-semibold">{["All Trending", "NBK Perks", "Boubyan Prime", "Gulf Bank red"].map((label, index) => <Button key={label} variant={index ? "ghost" : "outline"} size="sm" className="shrink-0 rounded-full">{label}</Button>)}</div>; }