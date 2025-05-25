import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Laptop2,
  ListMusic,
  Mic2,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
} from "lucide-react";

const Player = () => {
  return (
    <footer className="h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4 text-white">
      <div className="flex justify-between items-center h-full max-w-[1800px] mx-auto">
        {/* Song Info */}
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]">
          <img
            src="https://via.placeholder.com/56"
            alt="Song"
            className="w-14 h-14 object-cover rounded-md"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate hover:underline cursor-pointer text-white">
              Song Title
            </p>
            <p className="text-xs text-zinc-400 truncate hover:underline cursor-pointer text-white">
              Artist Name
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%] text-white">
          <div className="flex items-center gap-4 sm:gap-6">
            <Button size="icon" className="text-zinc-400 hover:text-white bg-transparent hidden sm:inline-flex">
              <Shuffle className="h-4 w-4" />
            </Button>

            <Button size="icon" className="text-zinc-400 hover:text-white bg-transparent">
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button className="bg-white hover:bg-white/80 text-black rounded-full h-8 w-8">
              <Play className="h-5 w-5" />
            </Button>

            <Button size="icon" className="text-zinc-400 hover:text-white bg-transparent">
              <SkipForward className="h-4 w-4" />
            </Button>

            <Button size="icon" className="text-zinc-400 hover:text-white bg-transparent hidden sm:inline-flex">
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          <div className="hidden sm:flex items-center gap-2 w-full text-white">
            <span className="text-xs text-white/70">0:00</span>
            <Slider
              value={[0]}
              max={100}
              step={1}
              className="w-full hover:cursor-grab active:cursor-grabbing"
            />
            <span className="text-xs text-white/70">3:45</span>
          </div>
        </div>

        {/* Volume / Extra Controls */}
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end text-white">
          <Button size="icon" className="text-zinc-400 hover:text-white bg-transparent">
            <Mic2 className="h-4 w-4" />
          </Button>
          <Button size="icon" className="text-zinc-400 hover:text-white bg-transparent">
            <ListMusic className="h-4 w-4" />
          </Button>
          <Button size="icon" className="text-zinc-400 hover:text-white bg-transparent">
            <Laptop2 className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Button size="icon" className="text-zinc-400 hover:text-white bg-transparent">
              <Volume1 className="h-4 w-4" />
            </Button>

            <Slider
              value={[100]}
              max={100}
              step={1}
              className="w-24 hover:cursor-grab active:cursor-grabbing"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Player;
