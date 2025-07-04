import express from "express";
import * as adminController from "../Controllers/adminController.js";

const adminRoutes = express.Router();

adminRoutes.get("/get-users", adminController.getUsers);
adminRoutes.post("/create-user", adminController.createUser);
adminRoutes.put("/update-user/:id", adminController.updateUser);
adminRoutes.delete("/delete-user/:id", adminController.deleteUser);
adminRoutes.patch("/change-password", adminController.changePassword);

export default adminRoutes;
