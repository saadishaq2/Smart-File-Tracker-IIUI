import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    title: { type: String, required: true },
    message: { type: String, required: true },
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: "Files", default: null },
    fileUniqueId: { type: String, default: null },
    fileName: { type: String },
    status: { type: String, enum: ["submitted", "forwarded", "reviewed", "approved", "rejected", null], default: null },
    remarks: { type: String, default: "" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
