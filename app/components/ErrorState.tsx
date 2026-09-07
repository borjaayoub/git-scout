import type { GitHubFetchError } from "@/lib/github/types";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

type ErrorStateProps = {
  error: GitHubFetchError;
  onRetry: () => void;
};

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { label, message } = describeError(error);

  return (
    <div className="flex flex-col items-start gap-4 rounded-card border border-line bg-paper p-6">
      <Badge variant="rust">{label}</Badge>
      <p className="text-sm text-ink">{message}</p>
      <Button variant="secondary" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

function describeError(error: GitHubFetchError): {
  label: string;
  message: string;
} {
  switch (error.type) {
    case "not_found":
      return {
        label: "Not found",
        message: `GitHub doesn't have a user called "${error.username}". Check the spelling and try again.`,
      };
    case "rate_limited": {
      const resetTime = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(error.resetAt));
      return {
        label: "Rate limited",
        message: `GitHub's request limit is used up for now. It resets at ${resetTime} — try again after that.`,
      };
    }
    case "unknown":
      return {
        label: "Error",
        message: "Something went wrong reaching GitHub. Try again.",
      };
  }
}
