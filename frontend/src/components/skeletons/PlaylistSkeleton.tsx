import { Skeleton } from "@/components/ui/skeleton"

const PlaylistSkeleton = () => {
  return Array.from({ length: 7 }).map((_, i) => (
    <div key={i} className="p-2 rounded-md flex items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-md flex-shrink-0 bg-zinc-800" />
      <div className="flex-1 min-w-0 hidden md:block space-y-2">
        <Skeleton className="h-4 w-3/4 rounded bg-zinc-800" />
        <Skeleton className="h-3 w-1/2 rounded bg-zinc-800" />
      </div>
    </div>
  ))
}

export default PlaylistSkeleton
