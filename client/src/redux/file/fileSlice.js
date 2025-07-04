import { createSlice } from "@reduxjs/toolkit";

const fileSlice = createSlice({
  name: "file",
  initialState: {
    files: [],
  },
  reducers: {
    setFiles: (state, action) => {
      state.files = action.payload;
    },
    addFile: (state, action) => {
      state.files.unshift(action.payload);
    },
    updateFileById: (state, action) => {
      const updatedFile = action.payload;
      state.files = state.files.map((f) =>
        f._id === updatedFile._id ? updatedFile : f
      );
    },
    deleteFileById: (state, action) => {
      const fileId = action.payload;
      state.files = state.files.filter((f) => f._id !== fileId);
    },
  },
});

export const { setFiles, addFile, updateFileById, deleteFileById } =
  fileSlice.actions;

export default fileSlice.reducer;
