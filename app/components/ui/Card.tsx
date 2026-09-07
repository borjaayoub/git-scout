import { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export default function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-card border border-line bg-paper transition-colors hover:border-ink hover:bg-surface-raised ${className}`}
      {...props}
    />
  );
}
