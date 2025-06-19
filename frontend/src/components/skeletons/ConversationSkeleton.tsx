// ConversationSkeleton.tsx
const ConversationSkeleton = () => {
  // Show 6 skeleton rows (adjust count as needed)
  return (
    <div className="space-y-2 p-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 animate-pulse"
        >
          <div className="size-8 md:size-12 rounded-full bg-zinc-700" />
          <div className="flex-1 min-w-0 lg:block hidden">
            <div className="h-3 w-3/5 bg-zinc-700 rounded mb-2" />
            <div className="h-2 w-2/4 bg-zinc-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationSkeleton;
