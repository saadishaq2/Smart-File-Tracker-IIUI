import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import userReducer from "./user/userSlice";
import fileReducer from "./file/fileSlice";
import notificationReducer from "./notifications/notificationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    file: fileReducer,
    notification: notificationReducer,
  },
});

export default store;
