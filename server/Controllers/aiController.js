import BadRequest from "../Error/BadRequest.js";
import Response from "../Models/Response.js";
import * as aiService from "../Services/aiService.js";

export const suggestReminder = async (req, res, next) => {
  try {
    const { dueDate } = req.body;

    if (!dueDate) {
      throw new BadRequest("Data is missing", "E4000");
    }

    const data = await aiService.suggestReminder(req, res);
    const response = new Response();
    response.data = data;
    response.message = "Reminder suggestion fetched successfully";
    response.statusCode = "S000";
    response.success = true;
    res.status(201).json(response);
  } catch (err) {
    return next(err);
  }
};
