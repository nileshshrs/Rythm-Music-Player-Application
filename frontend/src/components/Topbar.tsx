import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Search as SearchIcon, LayoutDashboardIcon, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import UserDropdown from "./UserDropdown";
import { useAuth } from "@/context/AuthContext";

const Topbar = () => {
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Focus input when opening mobile search
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Update input value from URL on location change
  useEffect(() => {
    const urlQuery = new URLSearchParams(location.search).get("q") || "";
    setQuery(urlQuery);
  }, [location.search]);

  // Only navigate to /search if not already there (on focus)
  const handleFocus = () => {
    if (location.pathname !== "/search") {
      navigate("/search");
    }
  };

  // Update query param only if on /search, and never navigate away from current page if not searching
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (location.pathname === "/search") {
      navigate(`/search?q=${encodeURIComponent(val)}`);
    }
  };

  // Close mobile search and reset query if on search page
  const handleCloseMobileSearch = () => {
    setShowSearch(false);
    setQuery("");
    if (location.pathname === "/search") {
      navigate("/");
    }
  };

  // Hide search bar if navigating away from search
  useEffect(() => {
    if (!location.pathname.startsWith("/search") && showSearch) {
      setShowSearch(false);
    }
  }, [location.pathname]);

  return (
    <div className="
      rounded-md mb-2 h-16 w-full flex items-center justify-between px-2 md:px-6 sticky top-0 z-10 bg-zinc-900/80 backdrop-blur-md
      relative
    ">
      {/* Desktop: Search Input */}
      <div className="hidden md:flex items-center bg-zinc-800 px-4 py-2 h-10 rounded-full max-w-[364px] w-full text-sm text-zinc-100">
        <SearchIcon className="w-4 h-4 text-zinc-400 mr-2" />
        <input
          type="text"
          value={query}
          onFocus={handleFocus}
          onChange={handleChange}
          placeholder="Search for songs, artists, or albums"
          className="bg-transparent outline-none w-full placeholder:text-zinc-400"
        />
      </div>

      {/* Mobile/Tablet: Search Bar with Animation */}
      <div className="flex md:hidden items-center w-full relative h-10">
        <button
          type="button"
          className={cn(
            "flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-full w-10 h-10 transition-colors absolute left-0 z-20",
            showSearch ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
          onClick={() => setShowSearch(true)}
          aria-label="Search"
        >
          <SearchIcon className="w-5 h-5 text-zinc-400" />
        </button>
        <div
          className={cn(
            "absolute left-0 top-0 w-0 overflow-hidden transition-all duration-300",
            showSearch ? "w-full" : "w-0"
          )}
          style={{
            zIndex: 30,
            pointerEvents: showSearch ? "auto" : "none"
          }}
        >
          <div className="flex items-center bg-zinc-800 px-2 h-10 rounded-full w-full text-sm text-zinc-100 relative">
            <SearchIcon className="w-5 h-5 text-zinc-400 mr-2" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onFocus={handleFocus}
              onChange={handleChange}
              placeholder="Search"
              className="bg-transparent outline-none w-full placeholder:text-zinc-400 text-xs"
              style={{ minWidth: 0 }}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-transparent hover:bg-zinc-700 rounded-full transition-colors"
              onClick={handleCloseMobileSearch}
              tabIndex={0}
              aria-label="Close Search"
            >
              <XIcon className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className={cn(
        "flex flex-row items-center gap-1 transition-all duration-300",
        showSearch ? "md:flex opacity-0 pointer-events-none absolute right-2" : "opacity-100 relative"
      )}>
        {user ? (
          <>
            {user?.role === "admin" && (
              <Link
                to="/dashboard"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "h-9 px-4 rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700 transition-colors duration-150 hover:bg-zinc-700 hover:text-white mr-5"
                )}
              >
                <LayoutDashboardIcon className="size-4 mr-2" />
                Dashboard
              </Link>
            )}
            <UserDropdown />
          </>
        ) : (
          <>
            <Link to="/sign-up">
              <Button
                onClick={() => navigate("/sign-up")}
                variant="ghost"
                className="
                h-9 px-4 text-sm font-bold text-zinc-400 bg-transparent border-none
                whitespace-nowrap shadow-none hover:text-white hover:bg-white/10
                focus:outline-none focus:ring-0 rounded-sm
              "
              >
                Sign up
              </Button>
            </Link>
            <Link to="/sign-in">
              <Button
                onClick={() => navigate("/login")}
                variant="default"
                className="
                h-9 px-6 text-sm font-bold text-black bg-white border-none
                whitespace-nowrap shadow-none hover:bg-zinc-200
                focus:outline-none focus:ring-0 ml-1 rounded-sm
              "
              >
                Sign in
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Topbar;
