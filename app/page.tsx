// ChatApp.tsx
"use client";
import axios from "axios";
import Pusher from "pusher-js";
import React, { useState, useEffect } from "react";
interface MessageType {
  id: string;
  message: string;
  userId: string;
}
const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  const handleSendMessage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { data } = await axios.post("/api/pusher", { newMessage });
    // console.log(data);

    if (data) {
      setNewMessage("");
    }
  };

  useEffect(() => {
    const FetchData = async () => {
      const { data } = await axios.get("/api/messages");
      console.log(data);
      setMessages(data);
    };
    FetchData();
  }, []);

  useEffect(() => {
    const pusher = new Pusher("bdb4da4cc2ac5a663df4", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("my-channel");
    channel.bind("my-event", function (data: MessageType) {
      console.log(data);
      setMessages((prevMessages) => [...prevMessages, data]);
      // alert(JSON.stringify(data));
    });
    return () => {
      pusher.unsubscribe("my-channel");
    };
  }, []);

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 ">
        <div className="space-y-2 bg-gray-400 h-full overflow-y-scroll">
          {messages.map((message, index) => (
            <div key={index} className="rounded-lg p-2 bg-blue-300 max-w-xs">
              {message.message}
            </div>
          ))}
        </div>
      </div>
      <div className="p-4">
        <div className="flex">
          <input
            type="text"
            className="flex-1 rounded-full border px-4 py-2 mr-2"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-200 text-white rounded-full px-4 py-2"
            onClick={handleSendMessage}
            disabled={!newMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
