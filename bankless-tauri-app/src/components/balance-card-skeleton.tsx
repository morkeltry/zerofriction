import { Skeleton } from '@/components/ui/skeleton'

// Skeleton version of the BalanceCard component
export const BalanceCardSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-card p-6 backdrop-blur-xl">
      {/* Decorative elements */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />

      {/* Balance section */}
      <div className="mb-6 space-y-4">
        <div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-1 h-10 w-48" />
        </div>
        <div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-1 h-10 w-48" />
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 flex-1 rounded-md" />
      </div>
    </div>
  )
}
