# GitScout

Search any GitHub username and get a clean dashboard of that person's profile and their most-starred repositories.

Type a username, and GitScout fetches the profile and repositories live from GitHub, sorts the repositories by star count, and renders the top 30. No accounts, no login, no tracking.

## Features

- **Username search** — submit with the button or the Enter key
- **Profile summary** — avatar, name, bio, location, join date, follower and repository counts
- **Top repositories** — the 30 most-starred, each with description, star count, fork count, language, and last-updated time
- **Original vs. fork** — every repository is labelled
- **Light and dark themes** — follows your OS preference on first visit; the toggle then remembers an explicit choice
- **Real error states** — distinct handling for "user not found" and GitHub rate limiting, the latter telling you when the limit resets

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) |
| Validation | Zod |
| Data source | GitHub REST API, unauthenticated |
| Fonts | Fraunces, IBM Plex Sans, IBM Plex Mono |

## Getting started

Requires **Node.js 20.9 or newer** (Next.js 16's minimum).

```bash
npm install
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and search for a username — `torvalds` is a good first try.

There is **no configuration and there are no environment variables.** GitScout calls the GitHub API unauthenticated, so there is no token to set up.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run type-check` | `tsc --noEmit` |

## Architecture

The layers are kept deliberately separate:

```
app/
  page.tsx                     Dashboard (client component — owns search state)
  components/                  Presentational components
    ui/                        Primitives: Button, Input, Card, Badge, StatBar
  api/github/profile/route.ts  Route handler — thin, validates input only
  style-guide/                 Visual QA route, both themes side by side
lib/
  github/client.ts             The only code that talks to api.github.com
  github/types.ts              Shared types + Zod schemas
  format.ts                    Number and relative-time formatting
```

The browser never calls `api.github.com` directly — it only calls this app's own API route, which delegates to the GitHub client layer. That layer owns response shaping and rate-limit handling.

### API

| Route | Method | Purpose |
|---|---|---|
| `/api/github/profile?username=` | `GET` | Profile plus the top 30 repositories by stars |

```bash
curl "http://localhost:3000/api/github/profile?username=torvalds"
```

Returns `200` with the payload, `404` for an unknown user, `429` when GitHub's rate limit is exhausted, or `500` otherwise.

## Known limitations

- **60 requests per hour, per IP.** GitScout is unauthenticated by design, and each search costs two requests (profile + repositories) — so roughly 30 searches per hour.
- **Repositories are sorted client-side, out of necessity.** GitHub's `/users/{username}/repos` endpoint does not support sorting by stars; it accepts only `created`, `updated`, `pushed`, and `full_name`. GitScout therefore fetches up to 100 repositories and sorts them itself. For anyone with more than 100 public repositories, the result is the top 30 of the first 100 GitHub returns, not a true global top 30.
- **Users only.** Organization profiles are not supported.
- **Nothing is cached or stored.** Every search hits GitHub live.

## Not built yet

- Filtering the repository list by language and by fork/original
- Recent-search history

## Deployment

Deploys to [Vercel](https://vercel.com/new) with no configuration — there are no environment variables to set. Any host that runs a Next.js app works equally well.
