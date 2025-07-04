let ioInstance = null;
const userSocketMap = new Map();

export function initSocket(io) {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("join", (user) => {
      socket.join(`user:${user.userId}`);
      socket.join(`role:${user.role}`);
      if (user.department) {
        socket.join(`department:${user.department}`);
        socket.join(`role:${user.role}:department:${user.department}`);
      }
      userSocketMap.set(user.userId, socket.id);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      for (let [userId, id] of userSocketMap.entries()) {
        if (id === socket.id) {
          userSocketMap.delete(userId);
          break;
        }
      }
    });
  });
}

export function getIO() {
  if (!ioInstance) throw new Error("Socket.IO not initialized");
  return ioInstance;
}

export function getUserSocketId(userId) {
  return userSocketMap.get(userId);
}
