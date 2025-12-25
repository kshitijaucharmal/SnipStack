export function ShimmerList({ count = 6 }: { count?: number }) {
  return (
    <ul className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-20 glass-card rounded-xl shimmer animate-pulse" />
      ))}
    </ul>
  );
}
