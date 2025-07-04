import API from "../../services/api";

export const getFiles = async () => {
  try {
    const res = await API.get("/files/get-all-files");
    return res.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch files";
  }
};

export const uploadFile = async (formData) => {
  try {
    const res = await API.post("/files/upload-file", formData);
    return res.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to upload file";
  }
};

export const deleteFile = async (id) => {
  try {
    const res = await API.delete(`/files/delete-file/${id}`);
    return res.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete file";
  }
};

export const updateFileStatus = async (id, data) => {
  try {
    const res = await API.patch(`/files/update-file-status/${id}`, data);
    return res.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update file status";
  }
};

export const viewFile = async (id) => {
  try {
    const res = await API.get(`/files/view/${id}`, { responseType: 'blob' });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to load file";
  }
};

export const getSuggestedReminder = async (payload) => {
  try {
    const res = await API.post(`/ai/suggest-reminder`, payload);
    return res.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to get suggested reminder";
  }
};

export const forwardFile = async (payload) => {
  try {
    const res = await API.post(`/files/forward-file/${payload.id}`, payload);
    return res.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to forward file";
  }
};

export const reviewFile = async (payload) => {
  try {
    const res = await API.post(`/files/review-file/${payload.id}`, payload);
    return res.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to review file";
  }
};

