import Button from "./ui/Button";

type RepoType = "all" | "original" | "forks";

type RepoFiltersProps = {
  languages: string[];
  languageFilter: string;
  onLanguageChange: (value: string) => void;
  typeFilter: RepoType;
  onTypeChange: (value: RepoType) => void;
};

const TYPE_OPTIONS: { value: RepoType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "original", label: "Original" },
  { value: "forks", label: "Forks" },
];

export default function RepoFilters({
  languages,
  languageFilter,
  onLanguageChange,
  typeFilter,
  onTypeChange,
}: RepoFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div role="group" aria-label="Filter by type" className="flex gap-2">
        {TYPE_OPTIONS.map((option) => (
          <Button
            key={option.value}
            type="button"
            size="sm"
            variant={typeFilter === option.value ? "primary" : "secondary"}
            onClick={() => onTypeChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <select
        aria-label="Filter by language"
        value={languageFilter}
        onChange={(event) => onLanguageChange(event.target.value)}
        className="rounded-control border border-line bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-signal/40 focus:border-signal"
      >
        <option value="all">All languages</option>
        {languages.map((language) => (
          <option key={language} value={language}>
            {language}
          </option>
        ))}
      </select>
    </div>
  );
}
