import BadRequest from "../Error/BadRequest.js";
import Response from "../Models/Response.js";
import * as adminService from "../Services/adminService.js";

export const getUsers = async (req, res, next) => {
  try {
    const data = await adminService.getUsers(req, res);
    const response = new Response();
    response.data = data;
    response.message = "Users fetched successfully";
    response.statusCode = "S001";
    response.success = true;
    res.status(200).json(response);
  } catch (err) {
    return next(err)
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { fullName, email, password, department, role, rollNumber } = req.body;

    if (!fullName || !email || !password) {
      throw new BadRequest("Data is missing", "E4000");
    }

    const data = await adminService.createUser(req, res);
    const response = new Response();
    response.data = data;
    response.message = "User created successfully";
    response.statusCode = "S001";
    response.success = true;
    res.status(200).json(response);
  } catch (err) {
    return next(err)
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, email, password, department, role } = req.body;

    if (!id) {
      throw new BadRequest("id is missing", "E4000");
    }
    if (!fullName || !email || !department || !role) {
      throw new BadRequest("Data is missing", "E4000");
    }

    const data = await adminService.updateUser(req, res);
    const response = new Response();
    response.data = data;
    response.message = "User updated successfully";
    response.statusCode = "S001";
    response.success = true;
    res.status(200).json(response);
  } catch (err) {
    return next(err)
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new BadRequest("id is missing", "E4000");
    }

    const data = await adminService.deleteUser(req, res);
    const response = new Response();
    response.data = data;
    response.message = "User deleted successfully";
    response.statusCode = "S001";
    response.success = true;
    res.status(200).json(response);
  } catch (err) {
    return next(err)
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new BadRequest("Data is missing", "E4000");
    }
    
    const data = await adminService.changePassword(req, res);
    const response = new Response();
    response.data = data;
    response.message = "Password changed successfully";
    response.statusCode = "S001";
    response.success = true;
    res.status(200).json(response);
  } catch (err) {
    return next(err)
  }
};