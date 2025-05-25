import { Skeleton } from "@/components/ui/skeleton";

const UsersListSkeleton = () => {
    return (
        <>
            {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg animate-pulse"
                >
                    <Skeleton className="h-12 w-12 rounded-full bg-zinc-800" />

                    <div className="flex-1 hidden lg:block">
                        <Skeleton className="h-4 w-24 mb-2 bg-zinc-800 rounded" />
                        <Skeleton className="h-3 w-32 bg-zinc-800 rounded" />
                    </div>
                </div>
            ))}
        </>
    );
};

export default UsersListSkeleton;
