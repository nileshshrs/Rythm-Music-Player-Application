import { Skeleton } from "@/components/ui/skeleton";

const FeaturedSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center bg-[#18181b] rounded-sm overflow-hidden px-4 py-3"
        >
          {/* Thumbnail */}
          <Skeleton className="w-16 sm:w-20 h-16 sm:h-20 rounded-sm flex-shrink-0 bg-[#2a2a2c]" />

          {/* Text lines */}
          <div className="flex-1 pl-4 space-y-2">
            <Skeleton className="h-4 w-3/4 rounded-sm bg-[#2a2a2c]" />
            <Skeleton className="h-3 w-1/2 rounded-sm bg-[#2a2a2c]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedSkeleton;
