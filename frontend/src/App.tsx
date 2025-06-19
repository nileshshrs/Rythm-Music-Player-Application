import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import Album from "./pages/Album";
import Search from "./pages/Search";
import Songs from "./pages/Songs";
import Playlist from "./pages/Playlist";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { setNavigate } from "./utils/navigate";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import Messages from "./components/chat/Messages";
import Account from "./pages/Account";

const SignInRouteGuard = () => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return <Login />;
};

const DashboardRouteGuard = () => {
  const { user } = useAuth();
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return <Dashboard />;
};

const SignUpRouteGuard = () => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return <Register />;
};

const ChatRouteGuard = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }
  return <Chat />;
};

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return (
    <Routes>
      <Route element={<DashboardRouteGuard />} path="/dashboard" />
      <Route element={<SignInRouteGuard />} path="/sign-in" />
      <Route element={<SignUpRouteGuard />} path="/sign-up" />

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/messages" element={<ChatRouteGuard />}>
          <Route path=":id" element={<Messages />} />
        </Route>
        <Route path="/album/:id" element={<Album />} />
        <Route path="/songs/:id" element={<Songs />} />
        <Route path="/playlist/:id" element={<Playlist />} />
        <Route path="/search" element={<Search />} />
        <Route path="/account" element={<Account />} />
      </Route>
    </Routes>
  );
}

export default App;
