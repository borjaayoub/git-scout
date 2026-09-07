"use client";

import { FormEvent, useState } from "react";

import type { GitHubFetchError, GitHubUserData } from "@/lib/github/types";
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import ProfileCard from "./components/ProfileCard";
import RepoList from "./components/RepoList";
import ErrorState from "./components/ErrorState";

type Status = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<GitHubUserData | null>(null);
  const [error, setError] = useState<GitHubFetchError | null>(null);

  async function runSearch(username: string) {
    const trimmed = username.trim();
    if (!trimmed) return;

    setStatus("loading");
    setError(null);

    try {
      const response = await fetch(
        `/api/github/profile?username=${encodeURIComponent(trimmed)}`
      );

      if (response.ok) {
        const payload: GitHubUserData = await response.json();
        setData(payload);
        setStatus("success");
        return;
      }

      const body = await response.json().catch(() => null);
      const fetchError: GitHubFetchError = body?.error ?? { type: "unknown" };
      setError(fetchError);
      setStatus("error");
    } catch {
      setError({ type: "unknown" });
      setStatus("error");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runSearch(query);
  }

  const isLoading = status === "loading";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 px-4 py-16">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          variant="prompt"
          promptPrefix="scout ~ $"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={isLoading}
          placeholder="a github username"
          aria-label="GitHub username"
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Searching…" : "Search"}
        </Button>
      </form>

      {status === "success" && data ? (
        <div className="flex flex-col gap-6">
          <ProfileCard profile={data.profile} />
          <RepoList repos={data.repos} username={data.profile.login} />
        </div>
      ) : null}

      {status === "error" && error ? (
        <ErrorState error={error} onRetry={() => runSearch(query)} />
      ) : null}
    </main>
  );
}
