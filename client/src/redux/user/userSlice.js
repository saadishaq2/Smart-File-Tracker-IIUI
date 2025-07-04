import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    addUser: (state, action) => {
      state.users.unshift(action.payload);
    },
    updateUserById: (state, action) => {
      const updatedUser = action.payload;
      state.users = state.users.map((u) =>
        u._id === updatedUser._id ? updatedUser : u
      );
    },
    deleteUserById: (state, action) => {
      const userId = action.payload;
      state.users = state.users.filter((u) => u._id !== userId);
    },
  },
});

export const {
  setUsers,
  addUser,
  updateUserById,
  deleteUserById,
} = userSlice.actions;

export default userSlice.reducer;
