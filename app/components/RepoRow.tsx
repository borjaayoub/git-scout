import type { GitHubRepo } from "@/lib/github/types";
import { formatRelativeTime } from "@/lib/format";
import Badge from "./ui/Badge";
import StatBar from "./ui/StatBar";

// GitHub Linguist canonical colors (github/linguist `languages.yml`) for the
// ~44 most common languages; unknown/absent languages fall back to the muted
// token. These are brand hexes, not theme tokens — the documented exception
// to "no hardcoded color literals" (AGENTS.md-adjacent prompt decision).
// Verified against linguist's `languages.yml` directly; two entries differed
// from the initial transcription and were corrected: C# is `#7355dd` (not
// `#178600`) and OpenSCAD is `#e5cd45` (not `#e69f56`).
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#7355dd",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Scala: "#c22d40",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#663399",
  SCSS: "#c6538c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Dart: "#00B4AB",
  Elixir: "#6e4a7e",
  Erlang: "#B83998",
  Haskell: "#5e5086",
  Clojure: "#db5855",
  Lua: "#000080",
  Perl: "#0298c3",
  R: "#198CE7",
  Julia: "#a270ba",
  MATLAB: "#e16737",
  "Objective-C": "#438eff",
  Assembly: "#6E4C13",
  Dockerfile: "#384d54",
  Makefile: "#427819",
  CMake: "#DA3434",
  PowerShell: "#012456",
  "Jupyter Notebook": "#DA5B0B",
  TeX: "#3D6117",
  // Linguist's canonical name is lowercase-s "Vim script", and GitHub's API
  // returns that string verbatim — "Vim Script" would never match.
  "Vim script": "#199f4b",
  Zig: "#ec915c",
  OCaml: "#ef7a08",
  Nix: "#7e7eff",
  Solidity: "#AA6746",
  OpenSCAD: "#e5cd45",
};

type RepoRowProps = {
  repo: GitHubRepo;
  maxStars: number;
};

export default function RepoRow({ repo, maxStars }: RepoRowProps) {
  const languageColor = repo.language
    ? LANGUAGE_COLORS[repo.language] ?? "var(--color-muted)"
    : "var(--color-muted)";

  return (
    <div className="flex flex-col gap-2 border-b border-line py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <a
          href={repo.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-lg font-medium text-ink hover:text-signal"
        >
          {repo.name}
        </a>
      </div>

      {repo.description ? (
        <p className="text-sm text-muted">{repo.description}</p>
      ) : null}

      <StatBar value={repo.stars} max={maxStars} />

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
        {repo.language ? (
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full dark:ring-1 dark:ring-line"
              style={{ backgroundColor: languageColor }}
            />
            {repo.language}
          </span>
        ) : null}

        <Badge variant={repo.fork ? "rust" : "moss"} flag>
          {repo.fork ? "fork" : "original"}
        </Badge>

        <span className="font-mono">{repo.forksCount} forks</span>

        <span>Updated {formatRelativeTime(repo.updatedAt)}</span>
      </div>
    </div>
  );
}
