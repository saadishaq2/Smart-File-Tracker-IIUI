import express from "express";
import * as notificationController from "../Controllers/notificationController.js";

const notificationRoutes = express.Router();

notificationRoutes.get("/get-notifications", notificationController.getNotifications);
notificationRoutes.get("/view-all-notifications", notificationController.viewAllNotifications);
notificationRoutes.patch("/update-notification/:id", notificationController.updateNotificationById);
notificationRoutes.patch("/update-all-notifications", notificationController.updateAllNotifications);

export default notificationRoutes;
