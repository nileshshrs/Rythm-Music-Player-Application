import { IoMusicalNote } from "react-icons/io5";

interface EmptyResultProps {
  query?: string;
  message?: string;
}

const EmptyResult = ({ query, message }: EmptyResultProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 px-4">
      <div className="flex justify-center animate-bounce">
        <IoMusicalNote className="h-24 w-24 text-[#1DB954]" />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Nothing to show</h2>
        <p className="text-neutral-400 max-w-md mx-auto">
          {message ? (
            message
          ) : query ? (
            <>
              No results found for{" "}
              <span className="text-white font-medium">"{query}"</span>. Try something else.
            </>
          ) : (
            <>There's currently nothing to display here.</>
          )}
        </p>
      </div>
    </div>
  );
};

export default EmptyResult;
