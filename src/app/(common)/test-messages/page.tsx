/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSocket } from "@/lib/providers/SocketProvider";
import {
  useGetMessagesWithUserQuery,
  useGetUserListQuery,
} from "@/redux/service/message/message";
import { MessageCircle, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";

// Dummy data
// const dummyUsers = [
//   { id: "1", username: "Alice Johnson", isOnline: true },
//   { id: "2", username: "Bob Smith", isOnline: false },
//   { id: "3", username: "Carol Davis", isOnline: true },
//   { id: "4", username: "David Wilson", isOnline: false },
// ]

const dummyMessages = [
  {
    id: "1",
    senderId: "2",
    message: "Hey there! How are you doing?",
    timestamp: "10:30 AM",
    isMine: false,
  },
  {
    id: "2",
    senderId: "current",
    message: "I'm doing great! Thanks for asking.",
    timestamp: "10:32 AM",
    isMine: true,
  },
  {
    id: "3",
    senderId: "2",
    message: "That's awesome to hear!",
    timestamp: "10:33 AM",
    isMine: false,
  },
];
 
export default function DummyChat() {
  const [selectedUserId, setSelectedUserId] = useState<any>("");
  console.log({selectedUserId})
  const [showSidebarOnMobile, setShowSidebarOnMobile] = useState(true);
  const [messages, setMessages] = useState<any>(dummyMessages);
  const [input, setInput] = useState("");

  const { socket } = useSocket();

  //   const selectedUser = dummyUsers.find((u) => u.id === selectedUserId)

  //   api calls
  const { data, isLoading } = useGetUserListQuery();
  const { data: messageData, isLoading: messageLoading } =
    useGetMessagesWithUserQuery(selectedUserId, { skip: !selectedUserId });

  useEffect(() => {
    if (messageData?.data) {
      setMessages(messageData?.data);
    }
  }, [messageData]);

  const users: any = data?.data || [];

  useEffect(() => {
    if (!socket) return;
    socket.on("message", (msg) => {
      const newmsg = {...msg, receiverId: selectedUserId}
      console.log("New message received:", newmsg) ;
      setMessages((prevMessages: any) => [...prevMessages, newmsg]);
    });
    return () => {
      socket.off("message");
    };
  }, [socket, selectedUserId]);

  const handleSendMessage = () => {
    if (!socket) {
      return;
    }

    if (!input.trim() || !selectedUserId) return;

    socket.emit("sendMessage", {
      receiverId: selectedUserId,
      message: input,
    });

    setInput("");
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen md:h-[88vh] bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`w-full md:w-1/4 md:min-w-[280px] md:max-w-[320px] h-full bg-white border-r border-gray-200 flex flex-col ${
          !showSidebarOnMobile ? "hidden md:flex" : "flex md:flex"
        }`}
      >
        <div className="flex items-center gap-2 px-4 py-4 md:py-3 border-b border-gray-200">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
        </div>

        <div className="p-4 pb-2">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            All Users
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {users?.map((user: any) => (
            <div
              key={user.id}
              onClick={() => {
                setSelectedUserId(user?.id);
                setShowSidebarOnMobile(false);
              }}
              className={`flex items-center gap-3 p-4 md:p-3 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors ${
                selectedUserId === user?.id ? "bg-blue-100" : ""
              }`}
            >
              <div className="w-12 h-12 md:w-10 md:h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg md:text-base">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-800 text-base md:text-sm truncate">
                  {user.username}
                </p>
                <p
                  className="text-sm md:text-xs"
                  style={{
                    color: user?.isOnline ? "#10B981" : "#6B7280",
                  }}
                >
                  {user?.isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <header className="bg-white border-b border-gray-200 px-4 py-4 md:py-3 flex-shrink-0">
          {selectedUserId ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebarOnMobile(true)}
                className="md:hidden text-gray-600 p-1 -ml-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <div className="w-10 h-10 md:w-8 md:h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-base md:text-sm">
                {users?.username?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-800 text-base md:text-sm truncate">
                  {users?.username || "User"}
                </p>
                <p
                  className="text-sm md:text-xs"
                  style={{
                    color: users?.isOnline ? "#10B981" : "#6B7280",
                  }}
                >
                  {users?.isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center">Select a user to chat</p>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 min-h-0">
          {selectedUserId ? (
            <>
              {messages?.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex mb-4  ${
                    (msg?.receiverId === selectedUserId || msg?.userId === selectedUserId)
                      ? "!justify-end"
                      : "!justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-4 py-3 md:py-2 rounded-2xl ${
                      msg?.receiverId === selectedUserId
                        ? "bg-blue-500 text-white rounded-br-md"
                        : "bg-white text-gray-800 rounded-bl-md shadow-sm"
                    }`}
                  >
                    <p className="text-base md:text-sm leading-relaxed">
                      {msg.message}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        msg?.receiverId === selectedUserId
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p className="text-center px-4">
                Select a user to start chatting
              </p>
            </div>
          )}
        </div>

        <footer className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
          {selectedUserId ? (
            <div className="flex gap-3 md:gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 md:py-2 text-base md:text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim()}
                className="px-6 py-3 md:py-2 bg-blue-600 text-white rounded-full font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors text-base md:text-sm whitespace-nowrap"
              >
                Send
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm">
              Select a user to send a message
            </p>
          )}
        </footer>
      </div>
    </div>
  );
}
