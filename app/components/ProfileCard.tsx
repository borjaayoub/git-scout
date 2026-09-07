import Image from "next/image";
import type { GitHubProfile } from "@/lib/github/types";
import { formatCompactNumber } from "@/lib/format";
import Card from "./ui/Card";

type ProfileCardProps = {
  profile: GitHubProfile;
};

const joinedDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

export default function ProfileCard({ profile }: ProfileCardProps) {
  const joined = joinedDateFormatter.format(new Date(profile.createdAt));

  return (
    <Card className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start">
      <Image
        src={profile.avatarUrl}
        alt={`${profile.login}'s avatar`}
        width={96}
        height={96}
        className="h-24 w-24 shrink-0 rounded-full border border-line"
      />
      <div className="flex flex-1 flex-col gap-3">
        <div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-ink md:text-5xl">
            {profile.name ?? profile.login}
          </h1>
          <p className="font-mono text-sm text-muted">@{profile.login}</p>
        </div>

        {profile.bio ? <p className="text-sm text-ink">{profile.bio}</p> : null}

        <p className="text-xs text-muted">
          {profile.location ? `${profile.location} · ` : ""}Joined {joined}
        </p>

        <p className="text-xs text-muted">
          {formatCompactNumber(profile.followers)}{" "}
          {profile.followers === 1 ? "follower" : "followers"} ·{" "}
          {formatCompactNumber(profile.publicRepos)}{" "}
          {profile.publicRepos === 1 ? "repository" : "repositories"}
        </p>
      </div>
    </Card>
  );
}
