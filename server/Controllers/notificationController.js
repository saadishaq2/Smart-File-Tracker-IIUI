import BadRequest from "../Error/BadRequest.js";
import Response from "../Models/Response.js";
import * as notificationService from "../Services/notificationService.js";

export const getNotifications = async (req, res, next) => {
  try {
    const data = await notificationService.getNotifications(req, res);
    const response = new Response();
    response.data = data;
    response.message = "Notifications fetched successfully";
    response.statusCode = "S001";
    response.success = true;
    res.status(200).json(response);
  } catch (err) {
    return next(err);
  }
};

export const viewAllNotifications = async (req, res, next) => {
  try {
    const data = await notificationService.viewAllNotifications(req, res);
    const response = new Response();
    response.data = data;
    response.message = "Notifications fetched successfully";
    response.statusCode = "S001";
    response.success = true;
    res.status(200).json(response);
  } catch (err) {
    return next(err);
  }
};

export const updateNotificationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new BadRequest("Id is missing", "E4000");
    }

    const data = await notificationService.updateNotificationById(req, res);
    const response = new Response();
    response.data = data;
    response.message = "Notification updated successfully";
    response.statusCode = "S001";
    response.success = true;
    res.status(200).json(response);
  } catch (err) {
    return next(err);
  }
};

export const updateAllNotifications = async (req, res, next) => {
  try {
    const data = await notificationService.updateAllNotifications(req, res);
    const response = new Response();
    response.data = data;
    response.message = "All Notifications are updated successfully";
    response.statusCode = "S001";
    response.success = true;
    res.status(200).json(response);
  } catch (err) {
    return next(err);
  }
};
