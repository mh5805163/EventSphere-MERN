
import "dotenv/config";
import express from "express";
import cors from "cors";

import database from "./configs/dbconfig.js";

import Booth from "./models/boothmodel.js";
import Notification from "./models/notificationmodel.js";
import ExhibitorFile from "./models/exhibitorfilemodel.js";
import Message from "./models/messagemodel.js";

import authRouter from "./routes/authrouter.js";
import forgetRouter from "./routes/forgetrouter.js";
import eventRouter from "./routes/eventrouter.js";
import exhibitorRouter from "./routes/exhibitorrouter.js";
import attendeeRouter from "./routes/attendeerouter.js";
import notificationRouter from "./routes/notificationrouter.js";
import sessionRouter from "./routes/sessionrouter.js";
import analyticsRouter from "./routes/analyticsrouter.js";
import feedbackRouter from "./routes/feedbackrouter.js";
import boothRouter from "./routes/boothrouter.js";
import exhibitorFileRouter from "./routes/exhibitorfilerouter.js";
import messageRouter from "./routes/messagerouter.js";

import { announceChanges, streamUpdates } from "./services/liveupdates.js";

const app = express();

app.disable("x-powered-by");

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://event-sphere-mern-hrt5.vercel.app",
  "http://localhost:5173"
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json({ limit: "100kb" }));

let initializationPromise;

async function initializeBackend() {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      await database();

      await Promise.all([
        Booth.init(),
        Notification.init(),
        ExhibitorFile.init(),
        Message.init()
      ]);
    })().catch((error) => {
      initializationPromise = null;
      throw error;
    });
  }

  return initializationPromise;
}

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EventSphere backend is running"
  });
});

app.use(async (req, res, next) => {
  try {
    await initializeBackend();
    next();
  } catch (error) {
    console.error("Backend initialization failed:", error);

    res.status(503).json({
      success: false,
      message: "Database connection unavailable"
    });
  }
});

app.get("/updates", streamUpdates);

app.use(announceChanges);

app.use("/auth", authRouter);
app.use("/forget", forgetRouter);
app.use("/events", eventRouter);
app.use("/exhibitors", exhibitorRouter);
app.use("/attendees", attendeeRouter);
app.use("/notifications", notificationRouter);
app.use("/sessions", sessionRouter);
app.use("/analytics", analyticsRouter);
app.use("/feedback", feedbackRouter);
app.use("/booths", boothRouter);
app.use("/exhibitor-files", exhibitorFileRouter);
app.use("/messages", messageRouter);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request"
    });
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Request is too large"
    });
  }

  console.error("Request failed:", error);

  return res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again"
  });
});

export default app;
