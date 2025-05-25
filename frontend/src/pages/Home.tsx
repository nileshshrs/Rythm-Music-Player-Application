import Featured from "@/components/Featured";
import Grid from "@/components/Grid";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSongs } from "@/hooks/useSongs";

const Home = () => {
  const { songs, isLoading, isError } = useSongs();

  return (
    <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
      <ScrollArea className="h-[calc(100vh-4rem)] custom-scroll">
        <div className="p-4 sm:p-6 pb-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Good Afternoon, User
          </h2>

          <Featured />

          <div className="space-y-8 mt-8">
            <Grid title="Made for you" songs={songs} isLoading={isLoading} />
            <Grid title="Trending" songs={songs} isLoading={isLoading} />
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};

export default Home;
