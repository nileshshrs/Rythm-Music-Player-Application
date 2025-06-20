import Activity from "@/components/Activity";
import LeftSidebar from "@/components/LeftSidebar";
import Topbar from "@/components/Topbar";
import Player from "@/components/Player";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Layout = () => {
  const { user } = useAuth();
  return (
    <div className="h-screen bg-black text-white flex flex-col pt-2 "> {/* <-- set your min-w here */}
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 flex h-full overflow-hidden !min-w-[350px] sm:p-0"   // <--- ADD min-w
      >
        {/* Left Sidebar */}
        <ResizablePanel
          defaultSize={20}
          minSize={6}
          maxSize={20}
          className="w-full md:w-1/5 lg:w-1/4"
        >
          <LeftSidebar />
        </ResizablePanel>

        {/* Handle */}
        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

        {/* Main content */}
        <ResizablePanel defaultSize={60} className="w-full md:w-3/5 lg:w-3/4 flex flex-col">
          <Topbar />
          <div className="flex-1 overflow-hidden">
            <Outlet />
          </div>
        </ResizablePanel>

        {/* Handle */}
        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

        {/* Right Sidebar */}
        {user && (
          <ResizablePanel
            defaultSize={20}
            minSize={0}
            maxSize={20}
            collapsedSize={0}
            className="hidden md:block w-0 md:w-1/5 lg:w-1/4"
          >
            <Activity />
          </ResizablePanel>
        )}
      </ResizablePanelGroup>

      {/* Fixed bottom Player */}
      <Player />
    </div>
  );
};

export default Layout;
