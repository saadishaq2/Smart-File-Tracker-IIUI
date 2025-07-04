import Users from "../Models/Users.js";
import Files from "../Models/Files.js";
import Forbidden from "../Error/Forbidden.js";
import NotFound from "../Error/NotFound.js";
import BadRequest from "../Error/BadRequest.js";
import { getNextSequence, sendNotification } from "./common.js";
import { getIO, getUserSocketId } from "../socket.js";

const departments = {
  "CS": "Computer Science",
  "SE": "Software Engineering",
  "IT": "Information Technology",
  "PHY": "Physics",
  "MATH": "Mathematics",
  "Fin": "Finance",
  "Exam": "Examination",
  "Hostel": "Hostel",
}

export const uploadFile = async (req, res) => {
  const { remarks, department, dueDate, reminderAt } = req.body;
  const file = req.file;
  const user = res.locals.userInfo;

  const uniqueId = await getNextSequence("file_unique_id");

  const parsedDueDate = dueDate ? new Date(dueDate) : null;
  const parsedReminderAt = reminderAt ? new Date(reminderAt) : null;

  const fileDoc = new Files({
    fileName: file.originalname,
    fileSize: file.size,
    fileType: file.mimetype,
    fileBuffer: file.buffer,
    uploadedBy: user.id,
    status: "submitted",
    department: department || null,
    remarks: remarks || "",
    uploadedDate: new Date(),
    uniqueId,
    history: [
      {
        remarks: remarks || "",
        status: "submitted",
        changedBy: user.id,
        date: new Date(),
      },
    ],
    dueDate: parsedDueDate || null,
    reminderAt: parsedReminderAt || null
  });

  await fileDoc.save();

  const populatedFile = await Files.findById(fileDoc._id)
    .populate("uploadedBy", "fullName email role department")
    .populate("history.changedBy", "fullName email role")
    .select("-fileBuffer");

  const io = getIO();
  const uploadedBy = populatedFile.uploadedBy._id;
  const users = await Users.find({
    $or: [
      { _id: uploadedBy },
      { role: "admin" },
      { role: "program_officer", department: populatedFile.department },
    ],
  })
    .select("_id fullName")
    .lean();

  const fullUser = users.find((u) => {
    return u._id.toString() == user.id.toString();
  });
  const recipients = users
    .filter((u) => u._id.toString() != user.id.toString())
    .map((u) => u._id);

  for (const userId of recipients) {
    io.to(`user:${userId}`).emit("file:created", populatedFile);
  }

  await sendNotification({
    recipients: recipients,
    createdBy: user.id,
    title: "File Uploaded",
    message: `${fullUser?.fullName} uploaded the file`,
    fileId: populatedFile._id,
    fileUniqueId: populatedFile.uniqueId,
    fileName: populatedFile.fileName,
    remarks: populatedFile.remarks,
    status: populatedFile.status,
  });

  return populatedFile;
};

export const getAllFiles = async (req, res) => {
  const user = res.locals.userInfo;
  let query = {};

  if (user.role === "student") {
    query.uploadedBy = user.id;
  } else if (user.role === "program_officer") {
    const officer = await Users.findById(user.id).select("department");
    query.$or = [
      { department: officer.department },
      { forwardedTo: officer.department },
    ];
  }

  const files = await Files.find(query)
    .populate("uploadedBy", "fullName email role")
    .populate("history.changedBy", "fullName email role")
    .sort({ uploadedDate: -1 })
    .select("-fileBuffer")
    .lean();

  return files;
};

export const updateFileStatus = async (req, res) => {
  const { id } = req.params;
  const { status, remarks } = req.body;
  const user = res.locals.userInfo;

  if (!["admin", "program_officer"].includes(user.role)) {
    throw new Forbidden("Access denied", "E4003");
  }

  const allowedStatuses = ["approved", "rejected"];
  if (!allowedStatuses.includes(status)) {
    throw new BadRequest("Invalid status value", "E4004");
  }

  const file = await Files.findById(id);
  if (!file) {
    throw new NotFound("File not found", "E4040");
  }

  file.status = status;
  if (remarks) file.remarks = remarks;

  file.history.push({
    remarks: remarks || "",
    status,
    changedBy: user.id,
    date: new Date(),
  });

  await file.save();

  const populatedFile = await Files.findById(file._id)
    .populate("uploadedBy", "fullName email role department")
    .populate("history.changedBy", "fullName email role")
    .select("-fileBuffer");

  const io = getIO();

  const uploadedBy = file.uploadedBy._id;
  const users = await Users.find({
    $or: [
      { _id: uploadedBy },
      { role: "admin" },
      { role: "program_officer", department: file.department },
      { role: "program_officer", department: file.forwardedTo },
    ],
  })
    .select("_id fullName")
    .lean();

  const fullUser = users.find((u) => u._id.toString() === user.id.toString());
  const recipients = users
    .filter((u) => u._id.toString() != user.id.toString())
    .map((u) => u._id);

  for (const userId of recipients) {
    io.to(`user:${userId}`).emit("file:updated", populatedFile);
  }

  await sendNotification({
    recipients: recipients,
    createdBy: user.id,
    title: "File Status Updated",
    message: `${fullUser?.fullName} ${status} the file`,
    fileId: file._id,
    fileUniqueId: file.uniqueId,
    fileName: file.fileName,
    remarks: file.remarks,
    status: file.status,
  });

  return populatedFile;
};

export const deleteFile = async (req, res) => {
  const { id } = req.params;
  const currentUser = res.locals.userInfo;

  const file = await Files.findById(id).populate(
    "uploadedBy",
    "role department _id"
  );
  if (!file) {
    throw new NotFound("File not found", "E4004");
  }

  await Files.findByIdAndDelete(id);

  const io = getIO();
  const payload = { id };
  const uploadedBy = file.uploadedBy._id;
  const users = await Users.find({
    $or: [
      { _id: uploadedBy },
      { role: "admin" },
      { role: "program_officer", department: file.department },
      { role: "program_officer", department: file.forwardedTo },
    ],
  })
    .select("_id fullName")
    .lean();

  const fullUser = users.find(
    (u) => u._id.toString() === currentUser.id.toString()
  );
  const recipients = users
    .filter((u) => u._id.toString() != currentUser.id.toString())
    .map((u) => u._id);

  for (const userId of recipients) {
    io.to(`user:${userId}`).emit("file:deleted", payload);
  }

  await sendNotification({
    recipients: recipients,
    createdBy: currentUser.id,
    title: "File Deleted",
    message: `${fullUser?.fullName} deleted the file`,
    fileId: file._id,
    fileUniqueId: file.uniqueId,
    fileName: file.fileName,
    remarks: file.remarks,
    status: file.status,
  });

  return { id };
};

export const viewFile = async (req, res) => {
  const { id } = req.params;
  const file = await Files.findById(id);
  if (!file) {
    throw new NotFound("File not found", "E4040");
  }
  return file;
};

export const forwardFile = async (req, res) => {
  const { id } = req.params;
  const { forwardedTo, remarks } = req.body;
  const user = res.locals.userInfo;

  const file = await Files.findById(id);
  if (!file) throw new NotFound("File not found", "E4041");

  if (!["program_officer", "admin"].includes(user.role)) {
    throw new Forbidden("Only program officers or admin can forward files", "E4006");
  }

  const fullUser = await Users.findById(user.id).select("department fullName");
  const senderDept = fullUser?.department;

  file.forwardedTo = forwardedTo;
  file.finalDecisionPending = true;
  file.status = "forwarded";

  file.history.push({
    status: "forwarded",
    changedBy: user.id,
    remarks,
    department: forwardedTo,
    date: new Date(),
  });

  await file.save();

  const populatedFile = await Files.findById(file._id)
    .populate("uploadedBy", "fullName email role department")
    .populate("history.changedBy", "fullName email role")
    .select("-fileBuffer");

  const io = getIO();
  const users = await Users.find({
    $or: [
      { _id: file.uploadedBy._id },
      { role: "admin" },
      { role: "program_officer", department: forwardedTo },
      { role: "program_officer", department: senderDept || file.department },
    ],
  }).select("_id fullName").lean();

  const recipients = users
    .filter((u) => u._id.toString() != user.id.toString())
    .map((u) => u._id);

  for (const userId of recipients) {
    io.to(`user:${userId}`).emit("file:forwarded", populatedFile);
  }

  await sendNotification({
    recipients: recipients,
    createdBy: user.id,
    title: "File Forwarded",
    message: `File is forwarded by ${fullUser?.fullName} to ${departments[forwardedTo]} department for review.`,
    fileId: file._id,
    fileUniqueId: file.uniqueId,
    fileName: file.fileName,
    remarks: remarks || "",
    status: file.status,
  });

  return populatedFile;
};

export const reviewFile = async (req, res) => {
  const { id } = req.params;
  const { remarks } = req.body;
  const user = res.locals.userInfo;

  const file = await Files.findById(id);
  if (!file) throw new NotFound("File not found");


  const originalDepartment = file.department;
  const reviewingDepartment = file?.forwardedTo;

  file.status = "reviewed";
  file.remarks = remarks;
  file.forwardedTo = null;
  file.finalDecisionPending = false;

  file.history.push({
    status: `reviewed`,
    changedBy: user.id,
    remarks,
    department: reviewingDepartment,
    date: new Date(),
  });

  await file.save();

  const populatedFile = await Files.findById(file._id)
    .populate("uploadedBy", "fullName email role")
    .populate("history.changedBy", "fullName role")
    .select("-fileBuffer");

  const io = getIO();
  const users = await Users.find({
    $or: [
      { _id: file.uploadedBy._id },
      { role: "admin" },
      { role: "program_officer", department: originalDepartment },
      { role: "program_officer", department: reviewingDepartment },
    ],
  }).select("_id fullName").lean();

  const recipients = users
    .map((u) => u._id);

  for (const userId of recipients) {
    io.to(`user:${userId}`).emit("file:reviewed", populatedFile);
  }

  const notificationRecipients = users
    .filter((u) => u._id.toString() != user.id.toString())
    .map((u) => u._id);

  await sendNotification({
    recipients: notificationRecipients,
    createdBy: user.id,
    title: "File Reviewed",
    message: `File was reviewed by ${departments[reviewingDepartment]} department and assigned back to ${departments[originalDepartment]} department for final decision`,
    fileId: file._id,
    fileUniqueId: file.uniqueId,
    fileName: file.fileName,
    status: file.status,
    remarks: remarks || "",
  });

  return populatedFile;
};

