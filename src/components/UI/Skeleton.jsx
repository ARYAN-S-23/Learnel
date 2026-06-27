export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-[#eef1f6] rounded-xl ${className}`} />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#eef1f6] p-5">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-7 w-16" />
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton({ rows = 3 }) {
  return (
    <div className="bg-white rounded-2xl border border-[#eef1f6] p-6">
      <Skeleton className="h-5 w-40 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-[#eef1f6] p-4 flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 6, cols = 3 }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-[#eef1f6] p-5">
          <Skeleton className="h-4 w-3/4 mb-3" />
          <Skeleton className="h-3 w-1/2 mb-4" />
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      ))}
    </div>
  );
}
