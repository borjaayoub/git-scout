import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { recordSearchSchema, type RecentSearch } from "@/lib/search-history/types";

const RECENT_SEARCHES_LIMIT = 10;
const HISTORY_SCAN_WINDOW = 50;

export async function GET() {
  try {
    const rows = await prisma.searchHistory.findMany({
      orderBy: { searchedAt: "desc" },
      take: HISTORY_SCAN_WINDOW,
    });

    const seen = new Set<string>();
    const searches: RecentSearch[] = [];

    for (const row of rows) {
      if (seen.has(row.username)) continue;
      seen.add(row.username);
      searches.push({
        username: row.username,
        searchedAt: row.searchedAt.toISOString(),
      });
      if (searches.length >= RECENT_SEARCHES_LIMIT) break;
    }

    return NextResponse.json({ searches });
  } catch {
    return NextResponse.json({ error: "unknown" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = recordSearchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_username" }, { status: 400 });
  }

  try {
    await prisma.searchHistory.create({
      data: { username: parsed.data.username.toLowerCase() },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "unknown" }, { status: 500 });
  }
}
