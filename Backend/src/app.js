
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

app.use(cors());

app.use(express.json({
  limit: "100kb"
}));

// Initialize MongoDB and required models
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

// Ensure backend is initialized before API requests
app.use(async (req, res, next) => {
  try {
    await initializeBackend();
    next();
  } catch (error) {
    console.error("Backend initialization failed:", error.message);

    res.status(503).json({
      success: false,
      message: "Database connection unavailable"
    });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ready" });
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

// Error handler
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      msg: "Invalid JSON request"
    });
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({
      msg: "Request is too large"
    });
  }

  console.error("Request failed:", error.message);

  return res.status(500).json({
    msg: "Something went wrong. Please try again"
  });
});

export default app;
