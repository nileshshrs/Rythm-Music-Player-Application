import { Route, Routes } from "react-router-dom"
import Layout from "./layout/Layout"
import Chat from "./pages/Chat"
import Home from "./pages/Home"
import Album from "./pages/Album"


function App() {

  return (
    <>
      <Routes>

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/messages" element={<Chat />} />
          <Route path="/album/:id" element={<Album />} />
        </Route>
      </Routes>
    </>
  )
}

export default App