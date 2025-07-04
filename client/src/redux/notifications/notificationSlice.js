import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    allNotifications: [],
  },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    markNotificationRead: (state, action) => {
      const id = action.payload;
      state.notifications = state.notifications.filter((n) => n._id !== id);
    },
    markAllNotificationsRead: (state) => {
      state.notifications = [];
    },

    // For All Notifications page
    setAllNotifications: (state, action) => {
      state.allNotifications = action.payload;
    },
    addToAllNotifications: (state, action) => {
      state.allNotifications.unshift(action.payload);
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  setAllNotifications,
  addToAllNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;

