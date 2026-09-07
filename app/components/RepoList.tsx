import type { GitHubRepo } from "@/lib/github/types";
import Card from "./ui/Card";
import RepoRow from "./RepoRow";

type RepoListProps = {
  repos: GitHubRepo[];
  username: string;
};

export default function RepoList({ repos, username }: RepoListProps) {
  if (repos.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted">
          {username} hasn&apos;t published any public repositories yet.
        </p>
      </Card>
    );
  }

  const maxStars = Math.max(...repos.map((repo) => repo.stars));

  return (
    <Card className="p-6">
      <div className="flex flex-col">
        {repos.map((repo) => (
          <RepoRow key={repo.name} repo={repo} maxStars={maxStars} />
        ))}
      </div>
    </Card>
  );
}
