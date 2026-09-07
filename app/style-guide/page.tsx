// Temporary visual-QA route for the design system (prompts/design-refresh.md,
// prompts/dark-mode-theme.md). Delete once feature work (search bar, profile
// card, repo list) starts consuming these primitives.
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import StatBar from "../components/ui/StatBar";

const swatches: { name: string; className: string }[] = [
  { name: "paper", className: "bg-paper border border-line" },
  { name: "surface-raised", className: "bg-surface-raised border border-line" },
  { name: "ink", className: "bg-ink" },
  { name: "line", className: "bg-line" },
  { name: "muted", className: "bg-muted" },
  { name: "moss", className: "bg-moss" },
  { name: "rust", className: "bg-rust" },
  { name: "signal", className: "bg-signal" },
];

const badgeVariants = ["neutral", "signal", "moss", "rust"] as const;

// Renders every token/primitive/variant once. Reused twice below — once per
// theme, via a local data-theme override — so both themes can be compared
// side by side without touching the page's own (global) theme.
function ThemeShowcase({ label }: { label: string }) {
  return (
    <div className="space-y-8">
      <p className="font-mono text-xs uppercase tracking-wide text-muted">
        {label}
      </p>

      <section className="space-y-3">
        <h1 className="font-mono text-xl font-medium tracking-tight">
          Colors
        </h1>
        <div className="grid grid-cols-2 gap-4">
          {swatches.map((s) => (
            <div key={s.name} className="space-y-1">
              <div className={`h-16 rounded-card ${s.className}`} />
              <p className="font-mono text-xs text-muted">{s.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h1 className="font-mono text-xl font-medium tracking-tight">
          Typography
        </h1>
        <p className="font-display text-4xl md:text-5xl font-medium tracking-tight">
          Display — torvalds
        </p>
        <h2 className="font-mono text-xl font-medium tracking-tight">
          H1 — Top repositories
        </h2>
        <h3 className="font-mono text-base font-semibold">H2 — linux</h3>
        <p className="font-sans text-sm text-ink">
          Body — The Linux kernel source tree.
        </p>
        <p className="font-sans text-sm text-muted">
          Muted — Linux kernel, git tree, mirror of git.kernel.org.
        </p>
        <p className="font-mono text-xs text-muted">Data — C · 187k stars</p>
      </section>

      <section className="space-y-3">
        <h1 className="font-mono text-xl font-medium tracking-tight">
          Buttons
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="md">
            Primary md
          </Button>
          <Button variant="primary" size="sm">
            Primary sm
          </Button>
          <Button variant="secondary" size="md">
            Secondary md
          </Button>
          <Button variant="secondary" size="sm">
            Secondary sm
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <h1 className="font-mono text-xl font-medium tracking-tight">
          Input
        </h1>
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="font-mono text-xs text-muted">default</p>
            <Input
              placeholder="Search a GitHub username..."
              className="max-w-sm"
            />
          </div>
          <div className="space-y-1">
            <p className="font-mono text-xs text-muted">prompt</p>
            <Input
              variant="prompt"
              promptPrefix="torvalds@github ~ $"
              placeholder=""
              className="max-w-sm"
            />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h1 className="font-mono text-xl font-medium tracking-tight">
          Card
        </h1>
        <Card className="p-6 max-w-sm">
          <h3 className="font-mono text-base font-semibold">torvalds</h3>
          <p className="font-sans text-sm text-muted">
            Creator of Linux and Git. Hover this card to see the border/
            background elevation shift.
          </p>
        </Card>
      </section>

      <section className="space-y-3">
        <h1 className="font-mono text-xl font-medium tracking-tight">
          Badges
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          {badgeVariants.map((variant) => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          ))}
          <Badge variant="neutral" flag>
            --lang=C
          </Badge>
          <Badge variant="moss" flag>
            original
          </Badge>
          <Badge variant="rust" flag>
            fork
          </Badge>
        </div>
      </section>

      <section className="space-y-3">
        <h1 className="font-mono text-xl font-medium tracking-tight">
          StatBar
        </h1>
        <div className="max-w-sm space-y-2">
          <p className="font-mono text-xs text-muted">labeled</p>
          <StatBar label="linux" value={187000} max={200000} />
          <StatBar label="git" value={54000} max={200000} />
          <StatBar label="subsurface" value={2300} max={200000} />
          <p className="pt-2 font-mono text-xs text-muted">unlabeled</p>
          <StatBar value={92300} max={200000} />
        </div>
      </section>
    </div>
  );
}

export default function StyleGuidePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <h1 className="font-mono text-2xl font-medium tracking-tight mb-6">
        Style guide — light vs dark
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-line">
        <div data-theme="light" className="bg-paper p-6">
          <ThemeShowcase label="light" />
        </div>
        <div data-theme="dark" className="bg-paper p-6">
          <ThemeShowcase label="dark" />
        </div>
      </div>
    </main>
  );
}
