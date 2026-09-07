"use client";

const STORAGE_KEY = "gitscout-theme";

function toggleTheme() {
  const root = document.documentElement;
  const explicit = root.getAttribute("data-theme");
  // Resolution order per the spec: explicit attribute, then the OS
  // preference. With nothing stored the attribute is absent, so the
  // effective theme has to come from the media query — otherwise the
  // first click in system-dark would re-select dark and appear dead.
  const isDark = explicit
    ? explicit === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
  const next = isDark ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Private browsing / storage disabled — the theme still applies for
    // this page load, it just won't persist across a reload.
  }
}

const buttonClasses =
  "items-center rounded-control border border-line px-3 py-1.5 font-mono text-xs text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/40";

// Two-state toggle only (light <-> dark, no "system" option in the cycle).
// Both buttons are static, identical markup on server and client, so which
// one is visible is decided purely by CSS via the `dark:` variant reading
// the data-theme attribute the no-flash script already set before
// hydration — no client-only state, no flash, no hydration mismatch.
export default function ThemeToggle() {
  return (
    <>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Switch to dark theme"
        className={`inline-flex ${buttonClasses} dark:hidden`}
      >
        dark
      </button>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Switch to light theme"
        className={`hidden dark:inline-flex ${buttonClasses}`}
      >
        light
      </button>
    </>
  );
}
