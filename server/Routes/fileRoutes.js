import express from "express";
import * as fileController from "../Controllers/fileController.js";
import fileUpload from "../Middlewares/multerMiddleware.js";

const fileRoutes = express.Router();

fileRoutes.post("/upload-file", fileUpload.single("file"), fileController.uploadFile);
fileRoutes.get("/get-all-files", fileController.getAllFiles);
fileRoutes.get("/view/:id", fileController.viewFile);
fileRoutes.patch("/update-file-status/:id", fileController.updateFileStatus);
fileRoutes.delete("/delete-file/:id", fileController.deleteFile);
fileRoutes.post("/forward-file/:id", fileController.forwardFile);
fileRoutes.post("/review-file/:id", fileController.reviewFile);

export default fileRoutes;
