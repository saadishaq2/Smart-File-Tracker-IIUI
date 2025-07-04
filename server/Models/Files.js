import mongoose from "mongoose";

const filesSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  fileBuffer: {
    type: Buffer,
    required: true,
  },
  uploadedDate: {
    type: Date,
    default: () => new Date(),
  },
  uploadedBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  path: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["submitted", "forwarded", "reviewed", "approved", "rejected"],
    default: "submitted",
  },
  department: {
    type: String,
    default: null,
  },
  remarks: {
    type: String,
    default: "",
  },
  uniqueId: {
    type: Number,
    default: null,
  },
  history: [
    {
      status: String,
      changedBy: { type: mongoose.Types.ObjectId, ref: "User" },
      remarks: { type: String, default: "" },
      department: { type: String, default: null },
      date: { type: Date, default: () => new Date() },
    },
  ],
  forwardedTo: {
    type: String,
    default: null,
  },
  finalDecisionPending: {
    type: Boolean,
    default: false,
  },
  reminderAt: {
    type: Date,
    default: null,
  },
  dueDate: {
    type: Date,
    default: null,
  },
  reminderSent: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model("Files", filesSchema);
