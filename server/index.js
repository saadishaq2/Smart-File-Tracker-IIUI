import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./db.js";
import mainRoutes from "./Routes/mainRoutes.js";
import { initSocket } from "./socket.js";
import { startReminderScheduler } from "./Services/common.js";

dotenv.config();
const app = express();
connectDB();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

initSocket(io);
startReminderScheduler()
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", mainRoutes);

app.use((err, req, res, next) => {
  const errorCode = err.code || 500;
  const statusCode = err.statusCode || "E5000";
  res.status(errorCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errorCode,
    statusCode,
  });
});

const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
