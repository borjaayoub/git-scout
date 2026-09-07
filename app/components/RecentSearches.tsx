import type { RecentSearch } from "@/lib/search-history/types";
import Card from "./ui/Card";

type RecentSearchesProps = {
  searches: RecentSearch[];
  onSelect: (username: string) => void;
};

export default function RecentSearches({
  searches,
  onSelect,
}: RecentSearchesProps) {
  if (searches.length === 0) return null;

  return (
    <Card className="p-4">
      <p className="mb-2 text-xs text-muted">Recent searches</p>
      <div className="flex flex-wrap gap-2">
        {searches.map((search) => (
          <button
            key={search.username}
            type="button"
            onClick={() => onSelect(search.username)}
            className="font-mono text-sm text-muted hover:text-signal"
          >
            {search.username}
          </button>
        ))}
      </div>
    </Card>
  );
}
