import { NextResponse } from "next/server";
import { isGscConfigured, isGscConnected } from "@/lib/gsc";

export async function GET() {
  return NextResponse.json({
    configured: isGscConfigured(),
    connected: await isGscConnected(),
  });
}
