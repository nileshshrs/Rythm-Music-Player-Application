import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";

type ActivityMap = { [userId: string]: { songTitle: string | null; songId: string | null } };

type SocketContextType = {
  socket: Socket | null;
  onlineUserIds: string[];
  userActivityMap: ActivityMap;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const [userActivityMap, setUserActivityMap] = useState<ActivityMap>({});

  useEffect(() => {
    if (!user?._id) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      setOnlineUserIds([]);
      setUserActivityMap({});
      return;
    }

    const newSocket = io("http://localhost:6278", {
      withCredentials: true,
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.emit("user-connected", { userId: user._id });

    // Listen for online users
    const handleOnlineUsers = (ids: string[]) => setOnlineUserIds(ids);
    newSocket.on("online-users", handleOnlineUsers);

    // Listen for user activity
    const handleUserActivityUpdate = (data: { userId: string; songTitle: string | null; songId: string | null }) => {
      setUserActivityMap(prev => ({
        ...prev,
        [data.userId]: { songTitle: data.songTitle, songId: data.songId }
      }));
    };
    newSocket.on("user-activity-update", handleUserActivityUpdate);

    // Request initial list/activity
    newSocket.emit("get-online-users");

    return () => {
      newSocket.off("online-users", handleOnlineUsers);
      newSocket.off("user-activity-update", handleUserActivityUpdate);
      newSocket.disconnect();
      setSocket(null);
      setOnlineUserIds([]);
      setUserActivityMap({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUserIds, userActivityMap }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error("useSocket must be used within a SocketProvider and after socket connection is established");
  return context.socket;
};

export const useOnlineUserIds = () => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error("useOnlineUserIds must be used within a SocketProvider");
  return context.onlineUserIds;
};

export const useUserActivityMap = () => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error("useUserActivityMap must be used within a SocketProvider");
  return context.userActivityMap;
};
