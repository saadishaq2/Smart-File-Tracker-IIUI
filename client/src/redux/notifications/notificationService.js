import API from "../../services/api";

export const getNotifications = async () => {
  try {
    const res = await API.get("/notification/get-notifications");
    return res.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch notifications";
  }
};

export const viewAllNotifications = async () => {
  try {
    const res = await API.get("/notification/view-all-notifications");
    return res.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch notifications";
  }
};

export const updateNotificationById = async (id) => {
  try {
    const res = await API.patch(`/notification/update-notification/${id}`);
    return res.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update notification";
  }
};

export const updateAllNotifications = async () => {
  try {
    const res = await API.patch(`/notification/update-all-notifications`);
    return res.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update all notifications";
  }
};


