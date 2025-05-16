import LeftSidebar from "@/components/LeftSidebar"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <ResizablePanelGroup direction={"horizontal"} className="flex-1 flex h-full overflow-hidden">
        {/* Left Sidebar */}
        <ResizablePanel
          defaultSize={20}
          minSize={10}
          maxSize={30}
          className="w-full md:w-1/5 lg:w-1/4"
        >
          <LeftSidebar />
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

        {/* Main Outlet */}
        <ResizablePanel
          defaultSize={60}
          className="w-full md:w-3/5 lg:w-3/4"
        >
          <Outlet />
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

        {/* Right Sidebar */}
        <ResizablePanel
          defaultSize={20}
          minSize={0}
          maxSize={25}
          collapsedSize={0}
          className="hidden md:block w-0 md:w-1/5 lg:w-1/4"
        >
          Right Sidebar
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default Layout
