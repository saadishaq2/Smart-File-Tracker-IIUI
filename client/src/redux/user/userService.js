import API from "../../services/api";

export const getUsers = async () => {
  try {
    const res = await API.get("/admin/get-users");
    return res.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch users";
  }
};

export const createUser = async (data) => {
  try {
    const res = await API.post("/admin/create-user", data);
    return res.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to create user";
  }
};

export const updateUser = async (id, data) => {
  try {
    const res = await API.put(`/admin/update-user/${id}`, data);
    return res.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update user";
  }
};

export const deleteUser = async (id) => {
  try {
    const res = await API.delete(`/admin/delete-user/${id}`);
    return res.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete user";
  }
};

export const changePassword = async (payload) => {
  try {
    const res = await API.patch(`/admin/change-password`, payload);
    return res.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to change password";
  }
};

export const getNotifications = async () => {
  try {
    const res = await API.get(`/get-notifications`);
    return res.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to change password";
  }
};
