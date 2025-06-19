const socketHandler = (io) => {
  const socketUserMap = new Map();     // socket.id -> userId
  const onlineUsers = new Set();       // Set of userId
  const userActivityMap = new Map();   // userId -> { songTitle, songId }

  io.on('connection', (socket) => {
    // --- USER CONNECTION MANAGEMENT ---
    socket.on("user-connected", ({ userId }) => {
      socketUserMap.set(socket.id, userId);
      onlineUsers.add(userId);
      io.emit("user-connected", { userId, socketId: socket.id });
      io.emit("online-users", Array.from(onlineUsers));
      // Broadcast current activity for this user if exists
      const activity = userActivityMap.get(userId) || { songTitle: null, songId: null };
      io.emit("user-activity-update", { userId, ...activity });
    });

    // --- USER ACTIVITY TRACKING ---
    socket.on("user-activity", ({ userId, songTitle, songId }) => {
      if (!userId) return;
      userActivityMap.set(userId, { songTitle, songId });
      io.emit("user-activity-update", { userId, songTitle, songId });
    });

    // --- REAL-TIME CHAT MESSAGING ---
    socket.on("send-message", ({ conversationId, message }) => {
      // Broadcast to sender and recipient only
      for (const [sockId, userId] of socketUserMap.entries()) {
        if (
          userId === message.sender?._id ||
          userId === message.recipient?._id
        ) {
          io.to(sockId).emit("receive-message", { conversationId, message });
        }
      }
    });

    // --- ONLINE USERS & CLEANUP ---
    socket.on("disconnect", () => {
      const userId = socketUserMap.get(socket.id);
      socketUserMap.delete(socket.id);
      if (userId) {
        onlineUsers.delete(userId);
        userActivityMap.delete(userId);
        io.emit("user-disconnected", { userId, socketId: socket.id });
        io.emit("online-users", Array.from(onlineUsers));
        io.emit("user-activity-update", { userId, songTitle: null, songId: null });
      }
    });

    socket.on("get-online-users", () => {
      socket.emit("online-users", Array.from(onlineUsers));
      for (const [userId, activity] of userActivityMap.entries()) {
        socket.emit("user-activity-update", { userId, ...activity });
      }
    });
  });
};

export default socketHandler;
