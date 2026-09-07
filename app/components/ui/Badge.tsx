import { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "neutral" | "signal" | "moss" | "rust";
  flag?: boolean;
};

// The tint alpha steps up in dark mode: a 10% tint that reads clearly on
// the light paper is close to invisible on the near-black dark paper, so
// dark uses 20% instead (verified: text-on-chip contrast stays 4.27:1+).
const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  neutral: "bg-paper text-muted border border-line",
  signal: "bg-signal/10 text-signal dark:bg-signal/20",
  moss: "bg-moss/10 text-moss dark:bg-moss/20",
  rust: "bg-rust/10 text-rust dark:bg-rust/20",
};

export default function Badge({
  variant = "neutral",
  flag = false,
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-control px-2 py-0.5 text-xs font-medium ${
        flag ? "font-mono" : ""
      } ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
