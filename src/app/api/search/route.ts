import { NextResponse } from "next/server";
import { searchSymbols } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? "";
  if (!q.trim()) return NextResponse.json({ results: [] });
  try {
    const results = await searchSymbols(q);
    return NextResponse.json({ results });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ error: msg, results: [] }, { status: 502 });
  }
}
