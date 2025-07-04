import express from "express";
import * as aiController from "../Controllers/aiController.js"

const aiRoutes = express.Router();

aiRoutes.post("/suggest-reminder", aiController.suggestReminder);

export default aiRoutes;
