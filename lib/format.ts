const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** Formats a count like 315400 -> "315.4K". */
export function formatCompactNumber(value: number): string {
  return numberFormatter.format(value);
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat("en-US", {
  numeric: "auto",
});

const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: "seconds" },
  { amount: 60, unit: "minutes" },
  { amount: 24, unit: "hours" },
  { amount: 7, unit: "days" },
  { amount: 4.34524, unit: "weeks" },
  { amount: 12, unit: "months" },
  { amount: Number.POSITIVE_INFINITY, unit: "years" },
];

/** Formats an ISO date string as a relative time, e.g. "3 days ago". */
export function formatRelativeTime(isoDate: string): string {
  let duration = (new Date(isoDate).getTime() - Date.now()) / 1000;

  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return relativeTimeFormatter.format(
        Math.round(duration),
        division.unit
      );
    }
    duration /= division.amount;
  }

  return relativeTimeFormatter.format(Math.round(duration), "years");
}
