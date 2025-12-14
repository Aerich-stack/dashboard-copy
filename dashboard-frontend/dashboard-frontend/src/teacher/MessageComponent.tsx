import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://payroll-backend-8214.onrender.com/api/messages";

interface Message {
  id: number;
  sender: string;
  receiver: string;
  message: string;
  created_at: string;
}

const MessagesComponent: React.FC<{
  teacherId?: number;
  teacherName?: string;
}> = ({ teacherId, teacherName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchMessages = async () => {
    if (!teacherId) return;

    try {
      const res = await axios.get(`${API}/teacher/${teacherId}`);
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !teacherId) return;

    try {
      const res = await axios.post(API, {
        sender: teacherName,
        receiver: "Admin",
        message: newMessage,
        teacher_id: teacherId,
      });

      if (res.data.success) {
        setNewMessage("");
        fetchMessages();
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [teacherId]);

  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20 text-white">
      <h2 className="text-2xl font-bold mb-4">Messages</h2>

      {/* Messages List */}
      <div className="max-h-80 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-white/20 p-3 rounded-lg border border-white/30"
          >
            <p className="text-sm opacity-80">
              {msg.sender} → {msg.receiver}
            </p>
            <p className="font-semibold">{msg.message}</p>
            <p className="text-xs opacity-60 mt-1">{msg.created_at}</p>
          </div>
        ))}

        {messages.length === 0 && (
          <p className="opacity-80">No messages yet.</p>
        )}
      </div>

      {/* Send Message */}
      <textarea
        className="w-full p-3 rounded bg-white/20 border border-white/30 text-white"
        rows={3}
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />

      <button
        onClick={sendMessage}
        className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded mt-3"
      >
        Send Message
      </button>
    </div>
  );
};

export default MessagesComponent;
