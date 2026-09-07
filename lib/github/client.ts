import {
  githubReposSchema,
  githubUserSchema,
  type GitHubFetchResult,
  type GitHubRepo,
  type GitHubUserData,
} from "./types";

const GITHUB_API_BASE = "https://api.github.com";

// Centralized limit per AGENTS.md §12 — don't inline this number elsewhere.
const TOP_REPOS_LIMIT = 30;

const REQUEST_HEADERS = {
  "User-Agent": "GitScout",
  Accept: "application/vnd.github+json",
} as const;

export async function fetchGitHubUser(
  username: string
): Promise<GitHubFetchResult> {
  try {
    const encodedUsername = encodeURIComponent(username);

    const userResponse = await fetch(
      `${GITHUB_API_BASE}/users/${encodedUsername}`,
      { headers: REQUEST_HEADERS, cache: "no-store" }
    );

    if (userResponse.status === 404) {
      return { ok: false, error: { type: "not_found", username } };
    }

    if (!userResponse.ok) {
      const rateLimited = isRateLimitExhausted(userResponse);
      if (rateLimited) {
        return {
          ok: false,
          error: { type: "rate_limited", resetAt: rateLimited },
        };
      }
      return { ok: false, error: { type: "unknown" } };
    }

    const rawUser = githubUserSchema.parse(await userResponse.json());

    // GitHub's `/users/{u}/repos` only accepts sort={created,updated,pushed,
    // full_name} — `sort=stars` is silently ignored, so we don't pass it.
    // We sort by stargazers_count ourselves below, before slicing.
    const reposResponse = await fetch(
      `${GITHUB_API_BASE}/users/${encodedUsername}/repos?per_page=100`,
      { headers: REQUEST_HEADERS, cache: "no-store" }
    );

    if (!reposResponse.ok) {
      const rateLimited = isRateLimitExhausted(reposResponse);
      if (rateLimited) {
        return {
          ok: false,
          error: { type: "rate_limited", resetAt: rateLimited },
        };
      }
      return { ok: false, error: { type: "unknown" } };
    }

    const rawRepos = githubReposSchema.parse(await reposResponse.json());

    // Sort by stars descending in this layer (shaping belongs to the GitHub
    // client per AGENTS.md §5) before taking the top N. Known limitation:
    // with no pagination (out of scope, AGENTS.md §1) we only ever see the
    // first 100 repos GitHub returns, so for a user with >100 public repos
    // this is "top 30 by stars of the first 100", not a true global top 30.
    const repos: GitHubRepo[] = rawRepos
      .slice()
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, TOP_REPOS_LIMIT)
      .map((repo) => ({
        name: repo.name,
        stars: repo.stargazers_count,
        forksCount: repo.forks_count,
        language: repo.language,
        fork: repo.fork,
        htmlUrl: repo.html_url,
        description: repo.description,
        updatedAt: repo.updated_at,
      }));

    const data: GitHubUserData = {
      profile: {
        login: rawUser.login,
        name: rawUser.name,
        avatarUrl: rawUser.avatar_url,
        bio: rawUser.bio,
        followers: rawUser.followers,
        publicRepos: rawUser.public_repos,
        location: rawUser.location,
        createdAt: rawUser.created_at,
      },
      repos,
    };

    return { ok: true, data };
  } catch {
    // Covers Zod parse failures and network errors alike — no bare throw
    // reaches the caller (AGENTS.md §12).
    return { ok: false, error: { type: "unknown" } };
  }
}

/**
 * Returns the ISO reset time if `response` is an exhausted-rate-limit
 * response (403 or 429), otherwise null.
 */
function isRateLimitExhausted(response: Response): string | null {
  if (response.status !== 403 && response.status !== 429) return null;
  if (response.headers.get("x-ratelimit-remaining") !== "0") return null;

  const resetHeader = response.headers.get("x-ratelimit-reset");
  if (!resetHeader) return null;

  const resetSeconds = Number(resetHeader);
  if (!Number.isFinite(resetSeconds)) return null;

  return new Date(resetSeconds * 1000).toISOString();
}
