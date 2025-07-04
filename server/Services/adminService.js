import bcrypt from "bcryptjs";
import Users from "../Models/Users.js";
import AlreadyExist from "../Error/AlreadyExist.js";
import Forbidden from "../Error/Forbidden.js";
import NotFound from "../Error/NotFound.js";
import BadRequest from "../Error/BadRequest.js";
import { getIO, getUserSocketId } from "../socket.js";

export const getUsers = async (req, res) => {
  if (res.locals.userInfo.role !== "admin") {
    throw new Forbidden("Access Denied", "E4003");
  }

  const users = await Users.find().sort({ createdAt: -1 });

  const result = users.map((user) => ({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    department: user.department,
    rollNumber: user.rollNumber || null,
  }));

  return result;
};

export const createUser = async (req, res) => {
  const { fullName, email, password, department, role, rollNumber } = req.body;
  const currentAdminId = res.locals.userInfo.id;

  if (res.locals.userInfo.role !== "admin") {
    throw new Forbidden("Access Denied", "E4003");
  }

  const existingUser = await Users.findOne({ email });
  if (existingUser) {
    throw new AlreadyExist("User already exists with this email", "E4001");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const savedUser = await Users.create({
    fullName,
    email,
    password: hashedPassword,
    department,
    role,
    rollNumber: rollNumber || null,
  });

  const newUser = {
    _id: savedUser._id,
    fullName: savedUser.fullName,
    email: savedUser.email,
    role: savedUser.role,
    department: savedUser.department,
    rollNumber: savedUser.rollNumber,
  };

  const io = getIO();
  const senderSocketId = getUserSocketId(currentAdminId);
  if (senderSocketId) {
    io.to("role:admin").except(senderSocketId).emit("user:created", newUser);
  } else {
    io.to("role:admin").emit("user:created", newUser);
  }

  return newUser;
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName, email, password, department, role, rollNumber } = req.body;
  const currentAdminId = res.locals.userInfo.id;

  if (res.locals.userInfo.role !== "admin") {
    throw new Forbidden("Access Denied", "E4003");
  }

  const user = await Users.findById(id);
  if (!user) {
    throw new NotFound("User not found", "E4040");
  }

  user.fullName = fullName;
  user.email = email;
  user.department = department;
  user.role = role;
  user.rollNumber = rollNumber;

  if (password && password.trim() !== "") {
    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
  }

  const updatedUser = await user.save();

  const updatedData = {
    _id: updatedUser._id,
    fullName: updatedUser.fullName,
    email: updatedUser.email,
    department: updatedUser.department,
    role: updatedUser.role,
    rollNumber: updatedUser.rollNumber,
  };

  const io = getIO();
  const senderSocketId = getUserSocketId(currentAdminId);
  if (senderSocketId) {
    io.to("role:admin")
      .except(senderSocketId)
      .emit("user:updated", updatedData);
  } else {
    io.to("role:admin").emit("user:updated", updatedData);
  }

  return updatedData;
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const currentAdminId = res.locals.userInfo.id;

  if (res.locals.userInfo.role !== "admin") {
    throw new Forbidden("Access Denied", "E4003");
  }

  const user = await Users.findById(id);
  if (!user) {
    throw new NotFound("User not found", "E4004");
  }

  await Users.findByIdAndDelete(id);

  const io = getIO();
  const senderSocketId = getUserSocketId(currentAdminId);
  if (senderSocketId) {
    io.to("role:admin").except(senderSocketId).emit("user:deleted", { id });
  } else {
    io.to("role:admin").emit("user:deleted", { id });
  }

  return { id };
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = res.locals.userInfo.id;

  const user = await Users.findById(userId);
  if (!user) {
    throw new NotFound("User not found", "E4040");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new BadRequest("Current password is incorrect", "E4002");
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;

  await user.save();

  return true;
};

