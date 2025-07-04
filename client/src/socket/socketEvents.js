import {
  addFile,
  updateFileById,
  deleteFileById,
} from "../redux/file/fileSlice";
import {
  addNotification,
  addToAllNotifications,
} from "../redux/notifications/notificationSlice";
import {
  addUser,
  deleteUserById,
  updateUserById,
} from "../redux/user/userSlice";
import socket from "./socket";

export const initializeSocketListeners = (dispatch, user, toast) => {
  if (!socket || !user) return;

  socket.off("connect").on("connect", () => {
    socket.emit("join", {
      userId: user._id,
      role: user.role,
      department: user?.department || "",
    });
  });

  socket.off("file:created").on("file:created", (file) => {
    dispatch(addFile(file));
  });

  socket.off("file:updated").on("file:updated", (file) => {
    dispatch(updateFileById(file));
  });

  socket.off("file:deleted").on("file:deleted", ({ id }) => {
    dispatch(deleteFileById(id));
  });

  socket.off("file:forwarded").on("file:forwarded", (file) => {
    if (file.forwardedTo == user?.department) {
      dispatch(addFile(file));
    } else {
      dispatch(updateFileById(file));
    }
  });

  socket.off("file:reviewed").on("file:reviewed", (file) => {
    if (['Fin', "Exam", 'Hostel'].includes(user?.department)) {
      dispatch(deleteFileById(file._id));
    } else {
      dispatch(updateFileById(file));
    }
  });

  socket.off("user:created").on("user:created", (user) => {
    dispatch(addUser(user));
  });

  socket.off("user:updated").on("user:updated", (user) => {
    dispatch(updateUserById(user));
  });

  socket.off("user:deleted").on("user:deleted", ({ id }) => {
    dispatch(deleteUserById(id));
  });

  socket.off("notification:new").on("notification:new", (notification) => {
    dispatch(addNotification(notification));
    dispatch(addToAllNotifications(notification));
  });

  socket.off("reminder").on("reminder", (reminder) => {
    toast.info(
      `⏰ Reminder: "${reminder.fileName}" is due at ${new Date(
        reminder.dueDate
      ).toLocaleString()}`,
      {
        position: "top-right",
        autoClose: 5000,
      }
    );
  });

  socket.off("disconnect").on("disconnect", () => {
    console.log("Socket disconnected");
  });
};
