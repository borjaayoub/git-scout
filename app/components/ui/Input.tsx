import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  variant?: "default" | "prompt";
  promptPrefix?: string;
};

const baseClasses =
  "rounded-control border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-signal/40 focus:border-signal";

export default function Input({
  variant = "default",
  promptPrefix,
  className = "",
  ...props
}: InputProps) {
  if (variant === "prompt") {
    return (
      <div
        className={`group flex items-center gap-2 ${baseClasses} font-mono focus-within:ring-2 focus-within:ring-signal/40 focus-within:border-signal ${className}`}
      >
        {promptPrefix ? (
          <span className="shrink-0 select-none text-muted">
            {promptPrefix}
          </span>
        ) : null}
        <input
          className="flex-1 bg-transparent font-mono text-sm text-ink placeholder:text-muted outline-none"
          {...props}
        />
        <span
          aria-hidden="true"
          className="h-4 w-2 shrink-0 bg-signal motion-safe:animate-[blink_1s_step-end_infinite]"
        />
      </div>
    );
  }

  return (
    <input
      className={`${baseClasses} ${className}`}
      {...props}
    />
  );
}
