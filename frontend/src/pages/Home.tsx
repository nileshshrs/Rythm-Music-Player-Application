import Featured from "@/components/Featured";
import Grid from "@/components/Grid";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSongs } from "@/hooks/useSongs";

const Home = () => {
  const { songs, isLoading } = useSongs();

  return (
    <div className="h-[80vh] bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-md overflow-hidden text-white">
      <ScrollArea className="h-full custom-scroll">
        <div className="p-4 sm:p-6 pb-40">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            Good Afternoon, User
          </h2>
          <Featured />
          <div className="space-y-8 mt-8">
            <Grid title="Made for you" songs={songs} isLoading={isLoading} />
            <Grid title="Trending" songs={songs} isLoading={isLoading} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Home;
