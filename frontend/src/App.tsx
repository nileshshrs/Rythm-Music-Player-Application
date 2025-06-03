import { Route, Routes } from "react-router-dom"
import Layout from "./layout/Layout"
import Chat from "./pages/Chat"
import Home from "./pages/Home"
import Album from "./pages/Album"
import Search from "./pages/Search"
import Songs from "./pages/Songs"
import Playlist from "./pages/Playlist"


function App() {

  return (
    <>
      <Routes>

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/messages" element={<Chat />} />
          <Route path="/album/:id" element={<Album />} />
          <Route path="/songs/:id" element={<Songs />} />
          <Route path="/playlist/:id" element={<Playlist />} />
          <Route path="/search" element={<Search />} /> {/* ✅ now using Search */}

        </Route>
      </Routes>
    </>
  )
}

export default App