import jwt from "jsonwebtoken";
import UniqueId from "../Models/UniqueId.js";
import Notification from "../Models/Notification.js";
import { getIO, getUserSocketId } from "../socket.js";
import Notifications from "../Models/Notification.js";
import cron from "node-cron";
import Files from "../Models/Files.js";
import Users from "../Models/Users.js";

export const createJwtToken = (obj) => {
  const maxAge = 1 * 24 * 60 * 60;
  return jwt.sign(obj, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

export const getNextSequence = async (name) => {
  const result = await UniqueId.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return result.seq;
};

export const sendNotification = async ({
  recipients = [],
  createdBy,
  title,
  message,
  fileId = null,
  fileUniqueId = null,
  fileName = "",
  status = null,
  remarks = "",
}) => {
  const io = getIO();
  const notification = await Notification.create({
    recipients,
    createdBy,
    title,
    message,
    fileId,
    fileUniqueId,
    fileName,
    status,
    remarks,
  });

  const populatedNotification = await Notification.findById(notification._id)
    .populate("createdBy", "fullName role")
    .populate("recipients", "fullName role")
    .lean();

  for (const userId of recipients) {
    io.to(`user:${userId}`).emit("notification:new", populatedNotification);
  }

  return populatedNotification;
};

export const startReminderScheduler = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

    const pendingReminders = await Files.find({
      reminderAt: { $gt: oneMinuteAgo, $lte: now },
      status: "submitted",
      reminderSent: { $ne: true },
    }).populate("uploadedBy");

    const io = getIO();

    for (const file of pendingReminders) {
      const { uploadedBy, department } = file;
      const uploaderId = uploadedBy?._id?.toString();
      const senderSocketId = getUserSocketId(uploaderId);
      const users = await Users.find({
        $or: [
          { _id: uploaderId },
          { role: "admin" },
          { role: "program_officer", department },
        ],
      })
        .select("_id fullName")
        .lean();

      const uploader = users.find((u) => u._id.toString() === uploaderId);
      const recipients = users
        .filter((u) => u._id.toString() !== uploaderId)
        .map((u) => u._id);

      const reminderPayload = {
        fileId: file._id,
        fileName: file.fileName,
        dueDate: file.dueDate,
        reminderAt: file.reminderAt,
        uploadedBy: uploaderId,
      };

      if (senderSocketId) {
        io.to("role:admin")
          .except(senderSocketId)
          .emit("reminder", reminderPayload);
        if (department) {
          io.to(`role:program_officer:department:${department}`)
            .except(senderSocketId)
            .emit("reminder", reminderPayload);
        }
      } else {
        io.to("role:admin").emit("reminder", reminderPayload);
        if (department) {
          io.to(`role:program_officer:department:${department}`).emit(
            "reminder",
            reminderPayload
          );
        }
      }

      await sendNotification({
        recipients,
        createdBy: uploaderId,
        title: "Reminder Due",
        message: `${uploader?.fullName || "A user"}'s file is due soon.`,
        fileId: file._id,
        fileName: file.fileName,
        remarks: file.remarks,
        status: file.status,
      });

      file.reminderSent = true;
      await file.save();
    }
  });

  console.log("📅 Reminder cron job started.");
};
