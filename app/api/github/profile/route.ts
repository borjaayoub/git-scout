import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { fetchGitHubUser } from "@/lib/github/client";
import type { GitHubFetchError } from "@/lib/github/types";

const usernameSchema = z.string().trim().min(1);

export async function GET(request: NextRequest) {
  const usernameParam = request.nextUrl.searchParams.get("username");
  const parsedUsername = usernameSchema.safeParse(usernameParam);

  if (!parsedUsername.success) {
    return NextResponse.json({ error: "invalid_username" }, { status: 400 });
  }

  const result = await fetchGitHubUser(parsedUsername.data);

  if (result.ok) {
    return NextResponse.json(result.data, { status: 200 });
  }

  return NextResponse.json(
    { error: result.error },
    { status: statusForError(result.error) }
  );
}

function statusForError(error: GitHubFetchError): number {
  switch (error.type) {
    case "not_found":
      return 404;
    case "rate_limited":
      return 429;
    case "unknown":
      return 500;
  }
}
