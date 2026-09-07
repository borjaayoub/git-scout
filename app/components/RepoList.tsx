import { useMemo } from "react";

import type { GitHubRepo } from "@/lib/github/types";
import Card from "./ui/Card";
import RepoRow from "./RepoRow";
import RepoFilters from "./RepoFilters";

type RepoType = "all" | "original" | "forks";

type RepoListProps = {
  repos: GitHubRepo[];
  username: string;
  languageFilter: string;
  onLanguageChange: (value: string) => void;
  typeFilter: RepoType;
  onTypeChange: (value: RepoType) => void;
};

export default function RepoList({
  repos,
  username,
  languageFilter,
  onLanguageChange,
  typeFilter,
  onTypeChange,
}: RepoListProps) {
  const languages = useMemo(
    () =>
      Array.from(
        new Set(
          repos
            .map((repo) => repo.language)
            .filter((language): language is string => language !== null)
        )
      ).sort(),
    [repos]
  );

  const filteredRepos = useMemo(
    () =>
      repos.filter((repo) => {
        const matchesType =
          typeFilter === "all" ||
          (typeFilter === "original" ? !repo.fork : repo.fork);
        const matchesLanguage =
          languageFilter === "all" || repo.language === languageFilter;
        return matchesType && matchesLanguage;
      }),
    [repos, typeFilter, languageFilter]
  );

  if (repos.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted">
          {username} hasn&apos;t published any public repositories yet.
        </p>
      </Card>
    );
  }

  const maxStars = Math.max(...filteredRepos.map((repo) => repo.stars), 0);

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        <RepoFilters
          languages={languages}
          languageFilter={languageFilter}
          onLanguageChange={onLanguageChange}
          typeFilter={typeFilter}
          onTypeChange={onTypeChange}
        />

        {filteredRepos.length === 0 ? (
          <p className="text-sm text-muted">
            No repositories match this filter. Try a different language or
            type.
          </p>
        ) : (
          <div className="flex flex-col">
            {filteredRepos.map((repo) => (
              <RepoRow key={repo.name} repo={repo} maxStars={maxStars} />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
