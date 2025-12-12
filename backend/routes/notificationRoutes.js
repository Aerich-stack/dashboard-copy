import express from "express";
import * as NotificationController from "../controllers/NotificationController.js";

const router = express.Router();

// Initialize tables
router.post("/init", NotificationController.initializeTables);

// Notification CRUD routes
router.post("/", NotificationController.createNotification);
router.get("/", NotificationController.getAllNotifications);
router.get("/unread", NotificationController.getUnreadNotifications);
router.patch("/:id/read", NotificationController.markAsRead);
router.delete("/:id", NotificationController.deleteNotification);

export default router;
