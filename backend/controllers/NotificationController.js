import * as Notification from "../models/Notification.js";

export const createNotification = (req, res) => {
  const notificationData = {
    type: req.body.type || 'Info',
    message: req.body.message,
    related_to: req.body.related_to,
    related_id: req.body.related_id
  };

  Notification.createNotification(notificationData, (err, result) => {
    if (err) {
      console.error("Error creating notification:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(201).json({ 
      success: true, 
      message: "Notification created successfully", 
      notificationId: result.insertId 
    });
  });
};

export const getAllNotifications = (req, res) => {
  Notification.getAllNotifications((err, results) => {
    if (err) {
      console.error("Error fetching notifications:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, data: results });
  });
};

export const getUnreadNotifications = (req, res) => {
  Notification.getUnreadNotifications((err, results) => {
    if (err) {
      console.error("Error fetching unread notifications:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, data: results });
  });
};

export const markAsRead = (req, res) => {
  const { id } = req.params;

  Notification.markNotificationAsRead(id, (err) => {
    if (err) {
      console.error("Error marking notification as read:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, message: "Notification marked as read" });
  });
};

export const deleteNotification = (req, res) => {
  const { id } = req.params;

  Notification.deleteNotification(id, (err) => {
    if (err) {
      console.error("Error deleting notification:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, message: "Notification deleted successfully" });
  });
};

// Initialize tables
export const initializeTables = (req, res) => {
  Notification.createNotificationsTable();
  res.status(200).json({ success: true, message: "Notifications table initialized" });
};
