interface LoadingSpinnerProps {
  /** Tailwind size class for width/height, e.g. "h-8 w-8" */
  size?: string;
  className?: string;
}

export default function LoadingSpinner({
  size = "h-8 w-8",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-4 border-border border-t-[var(--pc-primary)] ${size} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
