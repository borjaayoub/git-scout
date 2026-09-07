import { formatCompactNumber } from "@/lib/format";

type StatBarProps = {
  value: number;
  max: number;
  label?: string;
  className?: string;
};

export default function StatBar({
  value,
  max,
  label,
  className = "",
}: StatBarProps) {
  const ratio = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0;
  const percent = `${ratio * 100}%`;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label ? (
        <span className="shrink-0 whitespace-nowrap font-mono text-xs text-muted">
          {label}
        </span>
      ) : null}
      <div
        aria-hidden="true"
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-line"
      >
        <div
          className="h-full rounded-full bg-moss motion-safe:animate-[grow_400ms_ease-out] motion-reduce:animate-none"
          style={
            {
              width: percent,
              "--statbar-fill": percent,
            } as React.CSSProperties
          }
        />
      </div>
      <span
        className="shrink-0 font-mono text-xs text-muted"
        title={value.toLocaleString("en-US")}
      >
        {formatCompactNumber(value)}
      </span>
    </div>
  );
}
