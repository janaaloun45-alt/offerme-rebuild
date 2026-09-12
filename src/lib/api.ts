const API_URL = import.meta.env['VITE_API_URL'] as string | undefined;
const TOKEN_KEY = "offerme_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_URL) {
    throw new Error(
      "Backend URL is not configured. Set VITE_API_URL to your deployed OfferMe API URL (e.g. https://your-api.onrender.com) in the frontend environment.",
    );
  }
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) throw new Error((data as { error?: string }).error ?? "Request failed");
  return data as T;
}

export type ApiCard = { _id: string; bankName: string; cardName: string; cardType?: string };
export type ApiOffer = {
  _id: string;
  merchantName: string;
  category?: string;
  offerType?: string;
  offerValue?: string;
  description?: string;
  imageUrl?: string;
  eligibleCards?: ApiCard[];
};
export type ApiUser = { id: string; name: string; email: string };
