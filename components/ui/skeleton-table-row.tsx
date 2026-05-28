import { cn } from "@/lib/utils"

/**
 * Skeleton for table rows
 */
export function SkeletonTableRow({
  columns = 4,
  className,
}: {
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-x-4 py-3", className)}>
      {Array.from({ length: columns }).map((_, i) => (
        <div
          key={i}
          className={cn("bg-accent animate-pulse rounded-md h-4 flex-1")}
          style={{ maxWidth: i === 0 ? "200px" : undefined }}
        />
      ))}
    </div>
  )
}
