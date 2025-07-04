import Users from "../Models/Users.js";
import AlreadyExist from "../Error/AlreadyExist.js";
import Forbidden from "../Error/Forbidden.js";
import NotFound from "../Error/NotFound.js";
import BadRequest from "../Error/BadRequest.js";
import Notifications from "../Models/Notification.js";

export const getNotifications = async (req, res) => {
  const { id, role } = res.locals.userInfo;

  if (role === "program_officer") {
    const user = await Users.findById(id).select("department");
    if (!user) {
      throw new Forbidden("User not found", "E4003");
    }
  }

  if (!["admin", "program_officer", "student"].includes(role)) {
    throw new Forbidden("Access denied", "E4003");
  }

  let filter = {
    readBy: { $ne: id },
    recipients: id,
    createdBy: { $ne: id },
  };

  const notifications = await Notifications.find(filter)
    .sort({ createdAt: -1 })
    .populate("createdBy", "fullName role")
    .populate("recipients", "fullName role")
    .lean();

  return notifications;
};

export const viewAllNotifications = async (req, res) => {
  const { id, role } = res.locals.userInfo;

  if (role === "program_officer") {
    const user = await Users.findById(id).select("department");
    if (!user) {
      throw new Forbidden("User not found", "E4003");
    }
  }

  if (!["admin", "program_officer", "student"].includes(role)) {
    throw new Forbidden("Access denied", "E4003");
  }

  const filter = {
    recipients: id,
    createdBy: { $ne: id },
  };

  const notifications = await Notifications.find(filter)
    .sort({ createdAt: -1 })
    .populate("createdBy", "fullName role")
    .populate("recipients", "fullName role")
    .lean();

  return notifications;
};

export const updateNotificationById = async (req, res) => {
  const { id: notificationId } = req.params;
  const { id: userId } = res.locals.userInfo;

  const notification = await Notifications.findById(notificationId);
  if (!notification) {
    throw new NotFound("Notification not found", "E4040");
  }

  if (!notification.readBy.includes(userId)) {
    notification.readBy.push(userId);
    await notification.save();
  }

  return {
    success: true,
    message: "Notification marked as read.",
  };
};

export const updateAllNotifications = async (req, res) => {
  const { id: userId, role } = res.locals.userInfo;

  let filter = {};

  if (role === "admin") {
    filter = { createdBy: { $ne: userId }, readBy: { $ne: userId } };
  } else if (role === "program_officer") {
    filter = {
      createdBy: { $ne: userId },
      recipients: userId,
      readBy: { $ne: userId },
    };
  } else if (role === "student") {
    filter = {
      recipients: userId,
      readBy: { $ne: userId },
    };
  }

  const result = await Notifications.updateMany(filter, {
    $addToSet: { readBy: userId },
  });

  return {
    success: true,
    message: `Marked ${result.modifiedCount} notifications as read.`,
  };
};
