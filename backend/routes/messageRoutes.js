import express from "express";
import * as Message from "../models/Message.js";

const router = express.Router();

// Get all messages for a user
router.get("/:senderId/:senderType", (req, res) => {
  const { senderId, senderType } = req.params;

  Message.getMessages(senderId, senderType, (err, messages) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, data: messages });
  });
});

// Send a message
router.post("/send", (req, res) => {
  const { sender_id, sender_type, receiver_id, receiver_type, content } = req.body;

  if (!sender_id || !sender_type || !content) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const messageData = {
    sender_id,
    sender_type,
    receiver_id,
    receiver_type,
    content,
  };

  Message.sendMessage(messageData, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, error: err.message });
    }
    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      messageId: result.insertId,
    });
  });
});

// Mark message as read
router.put("/:messageId/read", (req, res) => {
  const { messageId } = req.params;

  Message.markMessageAsRead(messageId, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, message: "Message marked as read" });
  });
});

// Get unread message count
router.get("/unread/:receiverId/:receiverType", (req, res) => {
  const { receiverId, receiverType } = req.params;

  Message.getUnreadCount(receiverId, receiverType, (err, count) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, unread_count: count });
  });
});

export default router;
