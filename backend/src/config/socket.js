const socketHandler = (io) => {
  const socketUserMap = new Map();     // socket.id -> userId
  const onlineUsers = new Set();       // Set of userId
  const userActivityMap = new Map();   // userId -> { songTitle, songId }

  io.on('connection', (socket) => {
    socket.on("user-connected", ({ userId }) => {
      socketUserMap.set(socket.id, userId);
      onlineUsers.add(userId);
      io.emit("user-connected", { userId, socketId: socket.id });
      io.emit("online-users", Array.from(onlineUsers));

      // On connect, also broadcast current activity for this user if exists
      const activity = userActivityMap.get(userId) || { songTitle: null, songId: null };
      io.emit("user-activity-update", { userId, ...activity });
    });

    // Track and broadcast music activity
    socket.on("user-activity", ({ userId, songTitle, songId }) => {
      if (!userId) return;
      userActivityMap.set(userId, { songTitle, songId });
      io.emit("user-activity-update", { userId, songTitle, songId });
    });

    socket.on("disconnect", () => {
      const userId = socketUserMap.get(socket.id);
      socketUserMap.delete(socket.id);
      if (userId) {
        onlineUsers.delete(userId);
        userActivityMap.delete(userId);
        io.emit("user-disconnected", { userId, socketId: socket.id });
        io.emit("online-users", Array.from(onlineUsers));
        // Broadcast user is now idle
        io.emit("user-activity-update", { userId, songTitle: null, songId: null });
      }
    });

    socket.on("get-online-users", () => {
      socket.emit("online-users", Array.from(onlineUsers));
      // On request, you could also emit all current user activities
      for (const [userId, activity] of userActivityMap.entries()) {
        socket.emit("user-activity-update", { userId, ...activity });
      }
    });
  });
};

export default socketHandler;
