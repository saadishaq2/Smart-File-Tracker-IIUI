import BadRequest from "../Error/BadRequest.js";
import Response from "../Models/Response.js";
import * as authService from "../Services/authService.js";

export const signUp = async (req, res, next) => {
  try {
    const { fullName, rollNumber, email, password, department } = req.body;

    if (!fullName || !email || !password) {
      throw new BadRequest("Data is missing", "E4000");
    }

    const data = await authService.signUp(req, res);
    const response = new Response();
    response.data = data;
    response.message = "User signed up successfully";
    response.statusCode = "S000";
    response.success = true;
    res.status(201).json(response);
  } catch (err) {
    return next(err)
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequest("Data is missing", "E4000");
    }

    const data = await authService.signIn(req, res);
    const response = new Response();
    response.data = data;
    response.message = "User signed in successfully";
    response.statusCode = "S001";
    response.success = true;
    res.status(200).json(response);
  } catch (err) {
    return next(err)
  }
};
