import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteFooter, SiteHeader } from "@/components/offerme";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in to OfferMe Kuwait | Save your cards" },
      { name: "description", content: "Sign in or create an OfferMe account to save your card products and see which card gives you the best offer." },
      { property: "og:title", content: "Sign in to OfferMe Kuwait" },
      { property: "og:description", content: "Create an OfferMe account to keep your card products saved across devices." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { login, register, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "login") await login(email, password);
      else await register(name, email, password);
      void navigate({ to: "/my-cards" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
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
          <h1 className="mt-1 text-2xl font-extrabold">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your saved cards stay with your account. We never ask for card numbers or bank logins.</p>
          {user ? (
            <div className="mt-6 space-y-4">
              <p className="text-sm">Signed in as <b>{user.email}</b>.</p>
              <Button variant="outline" className="h-12 w-full rounded-full" onClick={logout}>Sign out</Button>
            </div>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={(event) => void submit(event)}>
              {mode === "register" && (
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase text-muted-foreground" htmlFor="name">Name</label>
                  <Input id="name" value={name} onChange={(event) => setName(event.target.value)} required className="h-12 rounded-xl bg-background" />
                </div>
              )}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase text-muted-foreground" htmlFor="email">Email</label>
                <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="h-12 rounded-xl bg-background" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase text-muted-foreground" htmlFor="password">Password</label>
                <Input id="password" type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required className="h-12 rounded-xl bg-background" />
              </div>
              {error && <p role="alert" className="rounded-lg bg-rose-soft px-4 py-3 text-sm font-semibold text-accent-foreground">{error}</p>}
              <Button type="submit" disabled={busy} className="h-12 w-full rounded-full">{mode === "login" ? "Sign in" : "Create account"}</Button>
              <button type="button" className="w-full text-center text-xs font-semibold text-rose" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
                {mode === "login" ? "New to OfferMe? Create an account" : "Already have an account? Sign in"}
              </button>
            </form>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
