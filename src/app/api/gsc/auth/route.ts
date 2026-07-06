import { NextResponse } from "next/server";
import { buildAuthUrl, isGscConfigured, setOAuthState } from "@/lib/gsc";
import { randomBytes } from "crypto";

export async function GET() {
  if (!isGscConfigured()) {
    return NextResponse.json(
      {
        error:
          "Google OAuth is not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local",
      },
      { status: 503 },
    );
  }

  const state = randomBytes(16).toString("hex");
  await setOAuthState(state);

  const url = buildAuthUrl(state);
  if (!url) {
    return NextResponse.json({ error: "Failed to build auth URL" }, { status: 500 });
  }

  return NextResponse.redirect(url);
}
