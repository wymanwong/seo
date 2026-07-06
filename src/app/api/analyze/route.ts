import { NextRequest, NextResponse } from "next/server";
import { analyzeWebsite } from "@/lib/analyze-website";
import { isValidUrl, normalizeUrl } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body as { url?: string };

    if (!url?.trim()) {
      return NextResponse.json(
        { error: "Please enter a website URL" },
        { status: 400 },
      );
    }

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: "Please enter a valid website URL (e.g., yoursite.com)" },
        { status: 400 },
      );
    }

    const analysis = await analyzeWebsite(normalizeUrl(url));
    return NextResponse.json(analysis);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";

    if (message.includes("abort") || message.includes("timeout")) {
      return NextResponse.json(
        { error: "The request timed out. Please try again." },
        { status: 408 },
      );
    }

    if (message.includes("Unable to access") || message.includes("403")) {
      return NextResponse.json(
        { error: "Unable to access website. The site may be blocking automated requests." },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { error: message || "Failed to analyze your website." },
      { status: 500 },
    );
  }
}
