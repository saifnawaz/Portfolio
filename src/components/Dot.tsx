/** Small accent marker. The thin dark ring keeps a light accent visible on paper. */
export function Dot({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block size-2 shrink-0 rounded-full bg-accent ring-1 ring-on-accent ${className}`}
      aria-hidden
    />
  );
}
