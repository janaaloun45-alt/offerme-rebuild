import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteFooter, SiteHeader } from "@/components/offerme";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up for OfferMe Kuwait" },
      { name: "description", content: "Create an OfferMe account to save your card products and see which of your cards gives the best offer." },
      { property: "og:title", content: "Sign up for OfferMe Kuwait" },
      { property: "og:description", content: "Create an account to keep your card products saved across devices." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password || !confirm) {
      setError("Please fill in all the fields.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      await register(name.trim(), email.trim(), password);
      void navigate({ to: "/" });
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
          <h1 className="mt-1 text-2xl font-extrabold">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">We only save your bank and card product names. Never card numbers or bank logins.</p>
          <form className="mt-6 space-y-4" onSubmit={(event) => void submit(event)} noValidate>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-muted-foreground" htmlFor="name">Full Name</label>
              <Input id="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className="h-12 rounded-xl bg-background" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-muted-foreground" htmlFor="email">Email</label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 rounded-xl bg-background" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-muted-foreground" htmlFor="password">Password</label>
              <Input id="password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 rounded-xl bg-background" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-muted-foreground" htmlFor="confirm">Confirm Password</label>
              <Input id="confirm" type="password" autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} className="h-12 rounded-xl bg-background" />
            </div>
            {error && <p role="alert" className="rounded-lg bg-rose-soft px-4 py-3 text-sm font-semibold text-accent-foreground">{error}</p>}
            <Button type="submit" disabled={busy} className="h-12 w-full rounded-full">{busy ? "Creating account…" : "Create Account"}</Button>
            <p className="text-center text-xs font-semibold text-muted-foreground">
              Already have an account? <Link to="/login" className="text-rose">Log In</Link>
            </p>
          </form>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
