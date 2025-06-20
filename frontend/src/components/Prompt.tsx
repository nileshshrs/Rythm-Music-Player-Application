import { HeadphonesIcon } from "lucide-react";

const Prompt = () => (
  <div className="h-[420px] w-full max-w-xs flex flex-col items-center justify-center p-0 sm:p-6 text-center space-y-4 mx-auto mt-10">
    <div className="relative w-[48px] h-[48px] sm:w-[64px] sm:h-[64px] mx-auto">
      <div
        className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full blur-lg
        opacity-75 animate-pulse"
        aria-hidden="true"
      />
      <div className="relative bg-zinc-900 rounded-full w-[48px] h-[48px] sm:w-[64px] sm:h-[64px] flex items-center justify-center">
        <HeadphonesIcon className="w-5 h-5 sm:w-8 sm:h-8 text-emerald-400" />
      </div>
    </div>

    <div className="space-y-2 max-w-[150px] sm:max-w-[250px]">
      <h3 className="text-base sm:text-lg font-semibold text-white">
        Create Your First Playlist
      </h3>
      <p className="text-xs sm:text-sm text-zinc-400">
        Organize your favorite songs by making your own playlist.
      </p>
    </div>
  </div>
);

export default Prompt;
