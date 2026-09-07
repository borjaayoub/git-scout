import { z } from "zod";

export type GitHubProfile = {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  followers: number;
  publicRepos: number;
  location: string | null;
  createdAt: string; // ISO date string
};

export type GitHubRepo = {
  name: string;
  stars: number;
  forksCount: number;
  language: string | null;
  fork: boolean;
  htmlUrl: string;
  description: string | null;
  updatedAt: string; // ISO date string
};

export type GitHubUserData = { profile: GitHubProfile; repos: GitHubRepo[] };

export type GitHubFetchError =
  | { type: "not_found"; username: string }
  | { type: "rate_limited"; resetAt: string } // ISO date string
  | { type: "unknown" };

export type GitHubFetchResult =
  | { ok: true; data: GitHubUserData }
  | { ok: false; error: GitHubFetchError };

// Raw GitHub API response schemas — only the fields we care about are
// validated; the rest of GitHub's payload is ignored.

export const githubUserSchema = z.object({
  login: z.string(),
  name: z.string().nullable(),
  avatar_url: z.string(),
  bio: z.string().nullable(),
  followers: z.number(),
  public_repos: z.number(),
  location: z.string().nullable(),
  created_at: z.string(),
});

export type RawGitHubUser = z.infer<typeof githubUserSchema>;

export const githubRepoSchema = z.object({
  name: z.string(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  language: z.string().nullable(),
  fork: z.boolean(),
  html_url: z.string(),
  description: z.string().nullable(),
  updated_at: z.string(),
});

export type RawGitHubRepo = z.infer<typeof githubRepoSchema>;

export const githubReposSchema = z.array(githubRepoSchema);
