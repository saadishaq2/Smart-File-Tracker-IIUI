import bcrypt from 'bcryptjs';
import Users from '../Models/Users.js';
import AlreadyExist from '../Error/AlreadyExist.js';
import Forbidden from '../Error/Forbidden.js';
import NotFound from '../Error/NotFound.js';
import { createJwtToken } from './common.js'

export const signUp = async (req, res) => {
  const { fullName, rollNumber, email, password, department } = req.body;

  const existingUser = await Users.findOne({ email });
  if (existingUser) {
    throw new AlreadyExist("User already exists with this email", "E4001");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const savedUser = await Users.create({
    fullName,
    rollNumber,
    email,
    password: hashedPassword,
    department,
  });
  return {
    _id: savedUser._id,
    fullName: savedUser.fullName,
    email: savedUser.email,
    role: savedUser.role,
    department: savedUser.department,
    rollNumber: savedUser.rollNumber
  };
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ email });
  if (!user) {
    throw new NotFound('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new NotFound('Invalid email or password');
  }

  const token = await createJwtToken({
    id: user._id,
    role: user.role,
    email: user.email,
  });

  return {
    token,
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department,
      rollNumber: user.rollNumber
    }
  };
};
