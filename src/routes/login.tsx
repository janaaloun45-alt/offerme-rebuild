import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteFooter, SiteHeader } from "@/components/offerme";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in to OfferMe Kuwait" },
      { name: "description", content: "Log in to OfferMe to see the saved card products in My Cards and which card gives you the best offer." },
      { property: "og:title", content: "Log in to OfferMe Kuwait" },
      { property: "og:description", content: "Access your saved card products in My Cards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setBusy(true);
    try {
      await login(email.trim(), password);
      void navigate({ to: "/my-cards" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-md px-4 py-16">
        <section className="rounded-2xl bg-card p-7 soft-shadow">
          <p className="text-[10px] font-bold uppercase text-rose">OfferMe Account</p>
          <h1 className="mt-1 text-2xl font-extrabold">Log In</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your saved cards stay with your account. We never ask for card numbers or bank logins.</p>
          <form className="mt-6 space-y-4" onSubmit={(event) => void submit(event)} noValidate>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-muted-foreground" htmlFor="email">Email</label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 rounded-xl bg-background" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-muted-foreground" htmlFor="password">Password</label>
              <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 rounded-xl bg-background" />
            </div>
            {error && <p role="alert" className="rounded-lg bg-rose-soft px-4 py-3 text-sm font-semibold text-accent-foreground">{error}</p>}
            <Button type="submit" disabled={busy} className="h-12 w-full rounded-full">{busy ? "Logging in…" : "Log In"}</Button>
            <p className="text-center text-xs font-semibold text-muted-foreground">
              New to OfferMe? <Link to="/signup" className="text-rose">Sign Up</Link>
            </p>
          </form>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
