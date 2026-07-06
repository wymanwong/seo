import { NextRequest, NextResponse } from "next/server";
import {
  exchangeCodeForTokens,
  setTokenCookies,
  verifyOAuthState,
} from "@/lib/gsc";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (error) {
    return NextResponse.redirect(`${base}/?gsc=error&reason=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${base}/?gsc=error&reason=missing_code`);
  }

  const valid = await verifyOAuthState(state);
  if (!valid) {
    return NextResponse.redirect(`${base}/?gsc=error&reason=invalid_state`);
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    await setTokenCookies(tokens);
    return NextResponse.redirect(`${base}/?gsc=connected`);
  } catch (err) {
    const reason = err instanceof Error ? err.message : "token_exchange_failed";
    return NextResponse.redirect(`${base}/?gsc=error&reason=${encodeURIComponent(reason)}`);
  }
}
