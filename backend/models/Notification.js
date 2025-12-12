import db from "../config/db.js";

// Create Notifications table if not exists
export const createNotificationsTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS notifications (
      id INT PRIMARY KEY AUTO_INCREMENT,
      type ENUM('Alert', 'Info', 'Warning') DEFAULT 'Info',
      message TEXT NOT NULL,
      related_to VARCHAR(100),
      related_id INT,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(sql, (err) => {
    if (err) console.error("Error creating notifications table:", err);
    else console.log("Notifications table ready");
  });
};

// Create notification
export const createNotification = (notificationData, callback) => {
  const sql = `
    INSERT INTO notifications (type, message, related_to, related_id)
    VALUES (?, ?, ?, ?)
  `;
  const values = [
    notificationData.type,
    notificationData.message,
    notificationData.related_to,
    notificationData.related_id
  ];
  
  db.query(sql, values, callback);
};

// Get all notifications
export const getAllNotifications = (callback) => {
  const sql = "SELECT * FROM notifications ORDER BY created_at DESC";
  db.query(sql, callback);
};

// Get unread notifications
export const getUnreadNotifications = (callback) => {
  const sql = "SELECT * FROM notifications WHERE is_read = FALSE ORDER BY created_at DESC";
  db.query(sql, callback);
};

// Mark notification as read
export const markNotificationAsRead = (id, callback) => {
  const sql = "UPDATE notifications SET is_read = TRUE WHERE id = ?";
  db.query(sql, [id], callback);
};

// Delete notification
export const deleteNotification = (id, callback) => {
  const sql = "DELETE FROM notifications WHERE id = ?";
  db.query(sql, [id], callback);
};
