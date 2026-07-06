import { cookies } from "next/headers";
import type { GscSummary } from "./gsc-types";

export type { GscQueryRow, GscSummary } from "./gsc-types";

const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

const COOKIE_ACCESS = "gsc_access_token";
const COOKIE_REFRESH = "gsc_refresh_token";
const COOKIE_EXPIRY = "gsc_token_expiry";
const COOKIE_STATE = "gsc_oauth_state";

function getConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/gsc/callback`;

  return { clientId, clientSecret, redirectUri };
}

export function isGscConfigured(): boolean {
  const { clientId, clientSecret } = getConfig();
  return Boolean(clientId && clientSecret);
}

export function buildAuthUrl(state: string): string | null {
  const { clientId, redirectUri } = getConfig();
  if (!clientId) return null;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GSC_SCOPE,
    access_type: "offline",
    prompt: "consent",
    state,
  });

  return `${AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string) {
  const { clientId, clientSecret, redirectUri } = getConfig();
  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth is not configured");
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error_description || data.error || "Token exchange failed");
  }

  return data as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };
}

async function refreshAccessToken(refreshToken: string) {
  const { clientId, clientSecret } = getConfig();
  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth is not configured");
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error_description || data.error || "Token refresh failed");
  }

  return data as { access_token: string; expires_in: number };
}

export async function setTokenCookies(tokens: {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}) {
  const jar = await cookies();
  const secure = process.env.NODE_ENV === "production";
  const expiry = Date.now() + tokens.expires_in * 1000;

  jar.set(COOKIE_ACCESS, tokens.access_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: tokens.expires_in,
  });

  jar.set(COOKIE_EXPIRY, String(expiry), {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });

  if (tokens.refresh_token) {
    jar.set(COOKIE_REFRESH, tokens.refresh_token, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 90,
    });
  }
}

export async function clearTokenCookies() {
  const jar = await cookies();
  for (const name of [COOKIE_ACCESS, COOKIE_REFRESH, COOKIE_EXPIRY, COOKIE_STATE]) {
    jar.delete(name);
  }
}

export async function setOAuthState(state: string) {
  const jar = await cookies();
  jar.set(COOKIE_STATE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
}

export async function verifyOAuthState(state: string): Promise<boolean> {
  const jar = await cookies();
  const saved = jar.get(COOKIE_STATE)?.value;
  jar.delete(COOKIE_STATE);
  return Boolean(saved && saved === state);
}

async function getValidAccessToken(): Promise<string | null> {
  const jar = await cookies();
  const access = jar.get(COOKIE_ACCESS)?.value;
  const refresh = jar.get(COOKIE_REFRESH)?.value;
  const expiry = Number(jar.get(COOKIE_EXPIRY)?.value || 0);

  if (access && expiry > Date.now() + 60_000) {
    return access;
  }

  if (!refresh) return null;

  const refreshed = await refreshAccessToken(refresh);
  await setTokenCookies({
    access_token: refreshed.access_token,
    expires_in: refreshed.expires_in,
  });

  return refreshed.access_token;
}

export async function isGscConnected(): Promise<boolean> {
  const token = await getValidAccessToken();
  return Boolean(token);
}

async function gscFetch(path: string, accessToken: string, init?: RequestInit) {
  const res = await fetch(`https://www.googleapis.com/webmasters/v3${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `GSC API error ${res.status}`);
  }

  return res.json();
}

function matchGscSite(sites: { siteUrl: string }[], domain: string): string | null {
  const normalized = domain.replace(/^www\./, "").toLowerCase();

  for (const site of sites) {
    const url = site.siteUrl.toLowerCase();
    if (url === `sc-domain:${normalized}`) return site.siteUrl;
    if (url.includes(normalized)) return site.siteUrl;
  }

  return sites[0]?.siteUrl ?? null;
}

function last28Days(): { startDate: string; endDate: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 28);

  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { startDate: fmt(start), endDate: fmt(end) };
}

export async function fetchGscData(domain: string): Promise<GscSummary> {
  const { startDate, endDate } = last28Days();
  const empty: GscSummary = {
    connected: false,
    siteUrl: null,
    startDate,
    endDate,
    totals: { clicks: 0, impressions: 0, ctr: 0, position: 0 },
    queries: [],
  };

  const accessToken = await getValidAccessToken();
  if (!accessToken) return empty;

  const sitesRes = await gscFetch("/sites", accessToken);
  const siteUrl = matchGscSite(sitesRes.siteEntry ?? [], domain);
  if (!siteUrl) {
    return { ...empty, connected: true, siteUrl: null };
  }

  const encodedSite = encodeURIComponent(siteUrl);
  const queryRes = await gscFetch(`/sites/${encodedSite}/searchAnalytics/query`, accessToken, {
    method: "POST",
    body: JSON.stringify({
      startDate,
      endDate,
      dimensions: ["query"],
      rowLimit: 25,
    }),
  });

  const totalsRes = await gscFetch(`/sites/${encodedSite}/searchAnalytics/query`, accessToken, {
    method: "POST",
    body: JSON.stringify({ startDate, endDate }),
  });

  const rows = (queryRes.rows ?? []) as Array<{
    keys: string[];
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;

  const totalRow = totalsRes.rows?.[0] as
    | { clicks: number; impressions: number; ctr: number; position: number }
    | undefined;

  return {
    connected: true,
    siteUrl,
    startDate,
    endDate,
    totals: {
      clicks: totalRow?.clicks ?? 0,
      impressions: totalRow?.impressions ?? 0,
      ctr: totalRow?.ctr ?? 0,
      position: totalRow?.position ?? 0,
    },
    queries: rows.map((r) => ({
      query: r.keys[0] ?? "",
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    })),
  };
}
