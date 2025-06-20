import { Skeleton } from "@/components/ui/skeleton";

const GridSkeleton = () => {
    return (
        <div className="mb-8">
            {/* Section Title Placeholder */}
            <Skeleton className="h-8 w-48 bg-zinc-800 rounded mb-4" />

            {/* Grid Layout */}
            <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-zinc-800 rounded-xl p-4 animate-pulse space-y-3 w-full max-w-[220px] mx-auto flex flex-col"
                        style={{ minHeight: 350 }} // Approximate total height of your real card
                    >
                        {/* Square image box */}
                        <Skeleton className="aspect-square rounded-md bg-zinc-700" />

                        {/* Title line */}
                        <Skeleton className="h-5 w-3/4 bg-zinc-700 rounded" />

                        {/* Subtitle line */}
                        <Skeleton className="h-4 w-1/2 bg-zinc-700 rounded" />
                        <Skeleton className="h-4 w-1/5 bg-zinc-700 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GridSkeleton;
