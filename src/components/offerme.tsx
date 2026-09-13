import offerMeLogo from "@/assets/offerme-logo.png";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  CircleDollarSign,
  CreditCard,
  LockKeyhole,
  MapPin,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, type ApiCard } from "@/lib/api";
import { AuthProvider, useAuth } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SavedCard = { bank: string; product: string; code: string; id?: string };

const fallbackProducts: Record<string, string[]> = {
  "National Bank of Kuwait (NBK)": ["Visa Platinum", "Visa Signature", "Mastercard"],
  "Boubyan Bank": ["Prime Visa", "Visa Signature", "Youth Card"],
  "Kuwait Finance House (KFH)": ["Hesabi Visa", "Visa Platinum", "Mastercard World"],
  "Gulf Bank": ["red Mastercard", "Visa Signature", "Platinum Card"],
  "American Express Middle East": ["Gold Card", "Platinum Card", "Green Card"],
};

function codeFor(bank: string) {
  return bank.startsWith("National") ? "NBK" : bank.startsWith("American") ? "AMEX" : (bank.split(" ")[0] ?? "CARD");
}

function toSaved(card: ApiCard): SavedCard {
  return { bank: card.bankName, product: card.cardName, code: codeFor(card.bankName), id: card._id };
}

type CardsContextValue = {
  cards: SavedCard[];
  removeCard: (card: SavedCard) => void;
  openAddCard: () => void;
};

const CardsContext = createContext<CardsContextValue | undefined>(undefined);

export function OfferMeProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CardsProvider>{children}</CardsProvider>
    </AuthProvider>
  );
}

function CardsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [catalogue, setCatalogue] = useState<ApiCard[]>([]);
  const [open, setOpen] = useState(false);
  const [bank, setBank] = useState("");
  const [product, setProduct] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api<{ cards: ApiCard[] }>("/api/cards")
      .then((data) => setCatalogue(data.cards))
      .catch(() => setCatalogue([]));
  }, []);

  useEffect(() => {
    if (!user) {
      setCards([]);
      return;
    }
    api<{ cards: ApiCard[] }>("/api/user-cards")
      .then((data) => setCards(data.cards.map(toSaved)))
      .catch(() => setCards([]));
  }, [user]);

  const products = useMemo(() => {
    if (catalogue.length === 0) return fallbackProducts;
    const grouped: Record<string, string[]> = {};
    for (const card of catalogue) {
      (grouped[card.bankName] ??= []).push(card.cardName);
    }
    return grouped;
  }, [catalogue]);

  const available = useMemo(() => (bank ? products[bank] ?? [] : []), [bank, products]);

  async function addCard() {
    if (!bank || !product) return;
    if (!user) {
      setMessage("Please log in or sign up to save cards to your account.");
      return;
    }
    if (cards.some((card) => card.bank === bank && card.product === product)) {
      setMessage("This card is already in My Cards.");
      return;
    }
    try {
      const data = await api<{ cards: ApiCard[] }>("/api/user-cards", {
        method: "POST",
        body: JSON.stringify({ bankName: bank, cardName: product }),
      });
      setCards(data.cards.map(toSaved));
      setMessage("Card added successfully");
      window.setTimeout(() => {
        setOpen(false);
        setBank("");
        setProduct("");
        setMessage("");
      }, 700);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not add this card.");
    }
  }

  async function removeCard(card: SavedCard) {
    if (!card.id) return;
    try {
      const data = await api<{ cards: ApiCard[] }>(`/api/user-cards/${card.id}`, { method: "DELETE" });
      setCards(data.cards.map(toSaved));
    } catch {
      /* keep current list on failure */
    }
  }

  return (
    <CardsContext.Provider
      value={{
        cards,
        removeCard: (card) => void removeCard(card),
        openAddCard: () => setOpen(true),
      }}
    >
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl rounded-2xl border-border bg-card p-7 sm:rounded-2xl">
          <DialogHeader>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-rose-soft text-rose"><CreditCard /></div>
            <DialogTitle className="text-2xl">Add a Card</DialogTitle>
            <DialogDescription>Choose the card you own so OfferMe can find perks available to you.</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-muted-foreground">Step 1 · Choose Bank</label>
              <Select value={bank} onValueChange={(value) => { setBank(value); setProduct(""); setMessage(""); }}>
                <SelectTrigger className="h-12 rounded-xl bg-background"><SelectValue placeholder="Select your bank" /></SelectTrigger>
                <SelectContent>{Object.keys(products).map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-muted-foreground">Step 2 · Choose Card Product</label>
              <Select value={product} onValueChange={(value) => { setProduct(value); setMessage(""); }} disabled={!bank}>
                <SelectTrigger className="h-12 rounded-xl bg-background"><SelectValue placeholder="Select your card product" /></SelectTrigger>
                <SelectContent>{available.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {!user && <p className="rounded-lg bg-secondary px-4 py-3 text-sm font-semibold">You need an account to save cards. <Link to="/login" className="text-rose" onClick={() => setOpen(false)}>Log In</Link> or <Link to="/signup" className="text-rose" onClick={() => setOpen(false)}>Sign Up</Link>.</p>}
            {message && <p role="status" className="rounded-lg bg-rose-soft px-4 py-3 text-sm font-semibold text-accent-foreground">{message}</p>}
            <Button onClick={() => void addCard()} disabled={!bank || !product} className="h-12 w-full rounded-full">Add to My Cards</Button>
            <p className="text-center text-xs text-muted-foreground">Only your bank and card product are saved. Never card numbers or banking credentials.</p>
          </div>
        </DialogContent>
      </Dialog>
    </CardsContext.Provider>
  );
}

export function useCards() {
  const value = useContext(CardsContext);
  if (!value) throw new Error("useCards must be used inside OfferMeProvider");
  return value;
}


const nav = [
  { to: "/", label: "Home" },
  { to: "/offers", label: "Find Offers" },
  { to: "/my-cards", label: "My Cards" },
  { to: "/savings", label: "Savings & Perks" },
] as const;

function HeaderAccount() {
  const { user, logout } = useAuth();
  if (!user) {
    return (
      <div className="hidden items-center gap-2 text-xs font-semibold lg:flex">
        <Link to="/login" className="rounded-full bg-secondary px-4 py-2">Log In</Link>
        <Link to="/signup" className="rounded-full bg-primary px-4 py-2 text-primary-foreground">Sign Up</Link>
      </div>
    );
  }
  return (
    <div className="hidden items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs lg:flex">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-card font-bold">{user.name.slice(0, 2).toUpperCase()}</span>
      <span className="min-w-0 text-left"><b className="block max-w-[9rem] truncate">{user.name}</b><Link to="/my-cards" className="text-rose">My Cards</Link></span>
      <button type="button" onClick={logout} className="rounded-full bg-card px-3 py-1 font-semibold">Log Out</button>
    </div>
  );
}

function MobileAccount({ onNavigate }: { onNavigate: () => void }) {
  const { user, logout } = useAuth();
  if (!user) {
    return (
      <div className="mt-2 flex gap-2 lg:hidden">
        <Link to="/login" onClick={onNavigate} className="flex-1 rounded-full bg-secondary px-4 py-2 text-center text-sm font-semibold">Log In</Link>
        <Link to="/signup" onClick={onNavigate} className="flex-1 rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground">Sign Up</Link>
      </div>
    );
  }
  return (
    <div className="mt-2 flex items-center justify-between gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold lg:hidden">
      <span className="min-w-0 truncate">{user.name}</span>
      <button type="button" onClick={() => { logout(); onNavigate(); }} className="rounded-full bg-card px-3 py-1 text-xs">Log Out</button>
    </div>
  );
}


export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-[1480px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 lg:flex lg:px-6">
        <Link to="/" className="flex min-w-0 shrink-0 items-center gap-2" aria-label="OfferMe home">
          <img src={offerMeLogo} alt="OfferMe" className="h-9 w-auto shrink-0" />
          <span className="min-w-0 leading-none"><strong className="block truncate text-lg">OfferMe <em className="rounded bg-rose-soft px-1 text-[9px] not-italic text-rose">KUWAIT</em></strong><small className="hidden text-[9px] text-muted-foreground xl:block">Your cards have perks. Find them.</small></span>
        </Link>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</Button>
        <nav className={`${menuOpen ? "flex" : "hidden"} absolute left-0 right-0 top-16 flex-col gap-1 border-b border-border bg-background p-4 lg:static lg:flex lg:flex-row lg:border-0 lg:p-0`}>
          {nav.map((item) => <Link key={item.to} to={item.to} activeOptions={{ exact: item.to === "/" }} onClick={() => setMenuOpen(false)} className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground" activeProps={{ className: "bg-primary text-primary-foreground" }}>{item.label}</Link>)}
          <MobileAccount onNavigate={() => setMenuOpen(false)} />
        </nav>
        <div className="ml-auto hidden min-w-0 flex-1 items-center justify-end gap-2 lg:flex">
          <label className="flex h-10 max-w-xs flex-1 items-center gap-2 rounded-full bg-secondary px-4 text-xs text-muted-foreground"><Search className="h-4 w-4" /><input className="min-w-0 flex-1 bg-transparent outline-none" placeholder="Search cafes, retail, dining..." /><kbd className="rounded bg-card px-1.5 py-0.5">⌘K</kbd></label>
          <div className="hidden items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs xl:flex"><MapPin className="h-4 w-4 text-rose" /> Kuwait City · The Avenues</div>
          <Button variant="ghost" size="icon" aria-label="Notifications"><Bell /></Button>
          <HeaderAccount />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-surface px-4 py-12">
      <div className="mx-auto grid max-w-[1420px] gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div><div className="mb-4 flex items-center gap-2 text-xl font-bold"><img src={offerMeLogo} alt="OfferMe" className="h-8 w-auto" />OfferMe Kuwait</div><p className="max-w-lg text-sm leading-6 text-muted-foreground">The lifestyle card-perk engine built for Kuwait. Match every bill in KD with demo benefits before you pay.</p><div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold"><span className="rounded-full bg-card px-3 py-2"><LockKeyhole className="mr-1 inline h-3 w-3 text-rose" /> Zero banking credentials stored</span><span className="rounded-full bg-rose-soft px-3 py-2 text-accent-foreground">Kuwait Campus Perks</span></div></div>
        <div><h3 className="mb-3 font-bold">Kuwait Partner Cards</h3><ul className="space-y-2 text-sm text-muted-foreground"><li>National Bank of Kuwait (NBK)</li><li>Boubyan Bank Prime & Youth</li><li>Gulf Bank red™ Program</li><li>Kuwait Finance House (KFH) Hesabi</li><li>Burgan Bank Youth Solutions</li></ul></div>
        <div><h3 className="mb-3 font-bold">Campus & City Hubs</h3><ul className="space-y-2 text-sm text-muted-foreground"><li>Kuwait University (KU)</li><li>Gulf University for Science & Tech</li><li>American University of Kuwait</li><li>The Avenues & Shuwaikh Cafes</li><li>Salmiya Retail & Dining</li></ul></div>
      </div>
      <div className="mx-auto mt-10 flex max-w-[1420px] flex-col justify-between gap-3 rounded-xl bg-background px-5 py-4 text-xs text-muted-foreground sm:flex-row"><span>© 2026 OfferMe Tech Co. W.L.L. Kuwait City, State of Kuwait.</span><span className="flex gap-5 font-semibold"><span>Privacy Policy</span><span>Terms of Service</span><span>Bank Partner Inquiries</span></span></div>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) { return <><SiteHeader /><main>{children}</main><SiteFooter /></>; }

export function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"><div className="min-w-0"><p className="mb-1 text-[10px] font-extrabold uppercase text-rose">{eyebrow}</p><h2 className="text-2xl font-extrabold sm:text-3xl">{title}</h2></div>{action}</div>;
}

export function CardsPanel({ compact = false, removable = false }: { compact?: boolean; removable?: boolean }) {
  const { cards, openAddCard, removeCard } = useCards();
  return <section className="rounded-2xl bg-card p-5 soft-shadow"><div className="mb-4 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase text-rose">My Cards</p><h2 className={compact ? "text-lg font-bold" : "text-xl font-bold"}>{cards.length} Active Card Products</h2></div><Button variant="outline" size="sm" className="rounded-full" onClick={openAddCard}><Plus /> Add Card</Button></div><div className="space-y-2">{cards.map((card, index) => <div key={`${card.bank}-${card.product}`} className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl p-3 ${index === 0 ? "bg-chocolate text-chocolate-foreground" : index === 1 ? "bg-rose text-rose-foreground" : "bg-secondary"}`}><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-card/20 text-xs font-extrabold">{card.code.slice(0, 2)}</span><span className="min-w-0"><b className="block truncate text-sm">{card.product}</b><small className="block truncate opacity-75">{card.bank}</small></span>{removable ? <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeCard(card)} aria-label={`Remove ${card.product}`}><Trash2 /></Button> : <BadgeCheck className="h-5 w-5 shrink-0" />}</div>)}</div></section>;
}

export function DemoNotice() { return <div className="mx-auto mt-5 max-w-[1420px] px-4"><p className="rounded-lg border border-border bg-card px-4 py-3 text-xs text-muted-foreground"><Sparkles className="mr-2 inline h-4 w-4 text-rose" />Offers and savings shown are demo data for design preview only, not verified current offers.</p></div>; }

export function PrivacyBanner() {
  const { openAddCard } = useCards();
  return <section className="mx-auto mt-16 max-w-[1420px] px-4"><div className="grid gap-8 rounded-xl bg-chocolate p-7 text-chocolate-foreground md:grid-cols-[1fr_auto] md:items-center"><div><span className="rounded-full bg-rose-soft px-3 py-1 text-[10px] font-bold text-accent-foreground">ZERO BANKING CREDENTIALS STORED</span><h2 className="mt-4 text-2xl font-extrabold">Safe, Private, and 100% Non-Intrusive.</h2><p className="mt-2 max-w-3xl text-sm opacity-70">OfferMe only needs your bank and card product. We never ask for card numbers, CVVs, PINs, account details, or bank logins.</p><div className="mt-5 flex flex-wrap gap-6 text-xs font-semibold"><span><CreditCard className="mr-2 inline" />No Card Numbers</span><span><ShieldCheck className="mr-2 inline" />No Bank Credentials</span><span><CircleDollarSign className="mr-2 inline" />Perks Before You Pay</span></div></div><div className="rounded-xl bg-card/10 p-5 text-center"><b className="block">Have another card?</b><Button variant="secondary" className="mt-3 w-full rounded-full" onClick={openAddCard}>Add More Cards <ArrowRight /></Button></div></div></section>;
}