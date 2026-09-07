import ThemeToggle from "./ThemeToggle";

// Minimal header (Server Component): mono wordmark left, theme toggle
// right, one hairline rule beneath. This is the only chrome the app has,
// added specifically to give the theme toggle a home.
export default function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-4">
        <span className="font-mono text-sm font-medium tracking-tight text-ink">
          git-scout
        </span>
        <ThemeToggle />
      </div>
    </header>
  );
}
