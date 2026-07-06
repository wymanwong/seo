import { NextRequest, NextResponse } from "next/server";
import { fetchGscData } from "@/lib/gsc";
import { getDomain } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const site = req.nextUrl.searchParams.get("site");
  if (!site) {
    return NextResponse.json({ error: "Missing site parameter" }, { status: 400 });
  }

  try {
    const data = await fetchGscData(getDomain(site));
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch GSC data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
