import "server-only";

// Adapter boundary: ALL Instagram Graph API calls live here. Uses the
// "Instagram API with Instagram Login" flow (graph.instagram.com /me/media)
// with a long-lived Instagram User access token. Errors never echo the token.

const GRAPH = "https://graph.instagram.com";

export interface IgMedia {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp?: string;
}

function safeError(prefix: string, status: number, body: string): Error {
  // Meta returns a JSON error in the body; strip anything token-shaped just in case.
  const cleaned = body.replace(/IG[A-Za-z0-9_-]{20,}/g, "[token]").slice(0, 300);
  return new Error(`${prefix} (HTTP ${status}): ${cleaned}`);
}

// Recent media for the authenticated Instagram account.
export async function igFetchMedia(token: string, limit = 12): Promise<IgMedia[]> {
  const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
  const url = `${GRAPH}/me/media?fields=${fields}&limit=${limit}&access_token=${encodeURIComponent(token)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw safeError("Instagram media fetch failed", res.status, await res.text());
  const json = (await res.json()) as { data?: IgMedia[] };
  return json.data ?? [];
}

// Basic identity check (used to validate a token without pulling media).
export async function igFetchMe(token: string): Promise<{ id: string; username: string }> {
  const url = `${GRAPH}/me?fields=id,username&access_token=${encodeURIComponent(token)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw safeError("Instagram token check failed", res.status, await res.text());
  return (await res.json()) as { id: string; username: string };
}

// Extend a long-lived token (valid ≥24h old) for another ~60 days.
export async function igRefreshToken(token: string): Promise<{ token: string; expiresInSec: number }> {
  const url = `${GRAPH}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw safeError("Instagram token refresh failed", res.status, await res.text());
  const json = (await res.json()) as { access_token: string; expires_in: number };
  return { token: json.access_token, expiresInSec: json.expires_in };
}
