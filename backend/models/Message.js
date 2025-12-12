import db from "../config/db.js";

// Create messages table
export const createMessagesTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sender_id INT NOT NULL,
      sender_type ENUM('teacher', 'admin') NOT NULL,
      receiver_id INT,
      receiver_type ENUM('teacher', 'admin'),
      content TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  db.query(query, (err) => {
    if (err) {
      console.error("Error creating messages table:", err);
    } else {
      console.log("Messages table ready");
    }
  });
};

// Get messages for a user
export const getMessages = (senderId, senderType, callback) => {
  const query = `
    SELECT m.*, 
           CASE WHEN m.sender_type = 'teacher' THEN t.name ELSE 'Admin' END as sender_name,
           CASE WHEN m.receiver_type = 'teacher' THEN t2.name ELSE 'Admin' END as receiver_name
    FROM messages m
    LEFT JOIN teachers t ON m.sender_id = t.id AND m.sender_type = 'teacher'
    LEFT JOIN teachers t2 ON m.receiver_id = t2.id AND m.receiver_type = 'teacher'
    WHERE (m.sender_id = ? AND m.sender_type = ?) 
       OR (m.receiver_id = ? AND m.receiver_type = ?)
    ORDER BY m.created_at DESC
  `;

  db.query(query, [senderId, senderType, senderId, senderType], (err, results) => {
    if (err) {
      console.error("Error fetching messages:", err);
      callback(err, null);
    } else {
      callback(null, results || []);
    }
  });
};

// Send a message
export const sendMessage = (messageData, callback) => {
  const { sender_id, sender_type, receiver_id, receiver_type, content } = messageData;

  const query = `
    INSERT INTO messages (sender_id, sender_type, receiver_id, receiver_type, content)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [sender_id, sender_type, receiver_id, receiver_type, content],
    (err, result) => {
      if (err) {
        console.error("Error sending message:", err);
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
};

// Mark message as read
export const markMessageAsRead = (messageId, callback) => {
  const query = `UPDATE messages SET is_read = TRUE WHERE id = ?`;

  db.query(query, [messageId], (err, result) => {
    if (err) {
      console.error("Error marking message as read:", err);
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

// Get unread message count
export const getUnreadCount = (receiverId, receiverType, callback) => {
  const query = `
    SELECT COUNT(*) as unread_count 
    FROM messages 
    WHERE receiver_id = ? AND receiver_type = ? AND is_read = FALSE
  `;

  db.query(query, [receiverId, receiverType], (err, results) => {
    if (err) {
      console.error("Error fetching unread count:", err);
      callback(err, null);
    } else {
      callback(null, results[0]?.unread_count || 0);
    }
  });
};
