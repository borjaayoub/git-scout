"use client";

import { FormEvent, useEffect, useState } from "react";

import type { GitHubFetchError, GitHubUserData } from "@/lib/github/types";
import type { RecentSearch } from "@/lib/search-history/types";
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import ProfileCard from "./components/ProfileCard";
import RepoList from "./components/RepoList";
import ErrorState from "./components/ErrorState";
import RecentSearches from "./components/RecentSearches";

type Status = "idle" | "loading" | "success" | "error";
type RepoType = "all" | "original" | "forks";

export default function Home() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<GitHubUserData | null>(null);
  const [error, setError] = useState<GitHubFetchError | null>(null);
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<RepoType>("all");
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  async function loadRecentSearches() {
    try {
      const response = await fetch("/api/search-history");
      if (!response.ok) return;
      const payload: { searches: RecentSearch[] } = await response.json();
      setRecentSearches(payload.searches);
    } catch {
      // Recent searches are a convenience list; failing to load them
      // must never block or error the page.
    }
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch("/api/search-history");
        if (!response.ok || cancelled) return;
        const payload: { searches: RecentSearch[] } = await response.json();
        if (!cancelled) setRecentSearches(payload.searches);
      } catch {
        // Recent searches are a convenience list; failing to load them
        // must never block or error the page.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

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
        setLanguageFilter("all");
        setTypeFilter("all");
        fetch("/api/search-history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: trimmed }),
        }).catch(() => {});
        void loadRecentSearches();
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

      <RecentSearches
        searches={recentSearches}
        onSelect={(username) => {
          setQuery(username);
          void runSearch(username);
        }}
      />

      {status === "success" && data ? (
        <div className="flex flex-col gap-6">
          <ProfileCard profile={data.profile} />
          <RepoList
            repos={data.repos}
            username={data.profile.login}
            languageFilter={languageFilter}
            onLanguageChange={setLanguageFilter}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
          />
        </div>
      ) : null}

      {status === "error" && error ? (
        <ErrorState error={error} onRetry={() => runSearch(query)} />
      ) : null}
    </main>
  );
}
