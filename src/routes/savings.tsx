import { createFileRoute, Navigate } from "@tanstack/react-router";
export const Route = createFileRoute("/savings")({
  head: () => ({ meta: [
    { title: "Savings & Perks — OfferMe Kuwait" }, { name: "description", content: "Explore the demonstrated OfferMe savings calculator and card perk details." },
    { property: "og:title", content: "Savings & Perks — OfferMe Kuwait" }, { property: "og:description", content: "Explore demo savings and card perk details." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: () => <Navigate to="/offer/caribou-coffee" search={{ merchant: "Caribou Coffee" }} />,
});