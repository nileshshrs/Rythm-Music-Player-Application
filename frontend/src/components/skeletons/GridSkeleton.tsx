import { Skeleton } from "@/components/ui/skeleton";

const GridSkeleton = () => {
    return (
        <div className="mb-8">
            {/* Section Title Placeholder */}
            <Skeleton className="h-8 w-48 bg-zinc-800 rounded mb-4" />

            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-zinc-800/40 rounded-md p-4 animate-pulse space-y-3"
                    >
                        {/* Square image box */}
                        <Skeleton className="aspect-square rounded-md bg-zinc-700" />

                        {/* Title line */}
                        <Skeleton className="h-4 w-3/4 bg-zinc-700 rounded mb-2" />

                        {/* Subtitle line */}
                        <Skeleton className="h-4 w-1/2 bg-zinc-700 rounded" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GridSkeleton