/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { use, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { MessageCircle, ChevronLeft, Circle } from "lucide-react"
import { io, Socket } from "socket.io-client"
import { useGetMessagesWithUserQuery, useGetSingleUserQuery, useGetUserListQuery } from "@/redux/service/message/message"
import { get } from "http"

// ===== Types =====
interface Message {
  id: string
  senderId: string
  receiverId: string
  message: string
  timestamp: string
  isRead: boolean
}

export interface User {
  id: string
  username: string
  email: string
  avatar: string | null
  description: string | null
  isOnline: boolean
  lastSeen: string
  isTyping: boolean
}

// ===== API Configuration =====
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6565/api/v1"
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:6565"

// ===== Fake Data (Fallback) =====

const FAKE_USERS: User[] = [
  {
    id: "user-1",
    username: "Alice Johnson",
    email: "alice@example.com",
    avatar: null,
    description: "Frontend Developer",
    isOnline: true,
    lastSeen: new Date().toISOString(),
    isTyping: false,
  },
  {
    id: "user-2",
    username: "Bob Smith",
    email: "bob@example.com",
    avatar: null,
    description: "Backend Developer",
    isOnline: true,
    lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    isTyping: false,
  },
  {
    id: "user-3",
    username: "Carol Davis",
    email: "carol@example.com",
    avatar: null,
    description: "UI/UX Designer",
    isOnline: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isTyping: false,
  },
  {
    id: "user-4",
    username: "David Wilson",
    email: "david@example.com",
    avatar: null,
    description: "Product Manager",
    isOnline: true,
    lastSeen: new Date().toISOString(),
    isTyping: false,
  },
  {
    id: "user-5",
    username: "Emma Brown",
    email: "emma@example.com",
    avatar: null,
    description: "DevOps Engineer",
    isOnline: false,
    lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isTyping: false,
  }
]

const FAKE_MESSAGE_HISTORY: Record<string, Message[]> = {
  "user-1": [
    {
      id: "msg-1",
      senderId: "user-1",
      receiverId: "current-user",
      message: "Hey! How's the project going?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "msg-2",
      senderId: "current-user",
      receiverId: "user-1",
      message: "Going well! Just finished the authentication module.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "msg-3",
      senderId: "user-1",
      receiverId: "current-user",
      message: "That's awesome! Can you show me the demo later?",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "msg-4",
      senderId: "current-user",
      receiverId: "user-1",
      message: "I'll set up a meeting for 3 PM.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      isRead: false,
    },
  ],
  "user-2": [
    {
      id: "msg-5",
      senderId: "user-2",
      receiverId: "current-user",
      message: "The API endpoints are ready for testing",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "msg-6",
      senderId: "current-user",
      receiverId: "user-2",
      message: "Perfect! I'll start integration testing today.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "msg-7",
      senderId: "user-2",
      receiverId: "current-user",
      message: "Let me know if you need any help with the documentation",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      isRead: false,
    },
  ],
  "user-3": [
    {
      id: "msg-8",
      senderId: "user-3",
      receiverId: "current-user",
      message: "I've updated the design mockups",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "msg-9",
      senderId: "current-user",
      receiverId: "user-3",
      message: "They look great! The new color scheme is much better.",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
  ],
  "user-4": [
    {
      id: "msg-10",
      senderId: "user-4",
      receiverId: "current-user",
      message: "Can we schedule a sprint review for tomorrow?",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "msg-11",
      senderId: "current-user",
      receiverId: "user-4",
      message: "Yes, 10 AM works for me. I'll send the calendar invite.",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "msg-12",
      senderId: "user-4",
      receiverId: "current-user",
      message: "Great! I'll prepare the progress report.",
      timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      isRead: false,
    },
  ],
  "user-5": [
    {
      id: "msg-13",
      senderId: "user-5",
      receiverId: "current-user",
      message: "The deployment pipeline is now automated",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
  ],
}



export default function ChatPage() {
  const [token, setToken] = useState<string>("")
  const [users, setUsers] = useState<User[]>([])
  const [newUserId , setNewUserId] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [receiverId, setReceiverId] = useState<string>("")
  const [showSidebarOnMobile, setShowSidebarOnMobile] = useState(true)
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [CURRENT_USER_ID, setCurrentUserId] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const socketRef = useRef<Socket | null>(null)

   // ✅ Call hooks directly, not inside useEffect
  const { data: userList, error: userError, isLoading: userLoading, refetch: refetchUserList } = useGetUserListQuery();
  const { data: userMessage, error: msgError, isLoading: msgLoading } = useGetMessagesWithUserQuery(receiverId, { skip: !receiverId });
  const {data: singleuser, isLoading: singleUserLoading, error: singleUserError} = useGetSingleUserQuery(newUserId, { skip: !newUserId });
  
  console.log(singleuser,'checking single user');
  
  // geting token 
  useEffect(() => {
    const token = localStorage.getItem('persist:auth')
    const jsonParsToken = JSON.parse(token!)
    if (jsonParsToken) {
      const userId = JSON.parse(jsonParsToken.user).id || CURRENT_USER_ID
      const token = JSON.parse(jsonParsToken.accessToken)
      setToken(token)
      setCurrentUserId(userId)
    }
  }, []);

  // Persist and restore selected receiverId
  useEffect(() => {
    const lastChatUser = localStorage.getItem('lastChatUser');
    if (lastChatUser) {
      setReceiverId(lastChatUser);
    }
  }, []);

  useEffect(() => {
    if (receiverId) {
      localStorage.setItem('lastChatUser', receiverId);
    }
  }, [receiverId]);

  // task user get here 
  useEffect(() => {
   const getingTaskId =  localStorage.getItem("redirectFromMessage");
   if(getingTaskId){
    setNewUserId(getingTaskId)
   }else{
    setNewUserId("")
   }
  }, []);

  // Handle single user from redirect
  // useEffect(() => {
  //   if (singleuser && !singleUserLoading && !singleUserError) {
  //     setUsers((prev) => {
  //       if (!prev.find((u) => u.id === singleuser.id)) {
  //         return [...prev, {
  //           id: singleuser.id,
  //           username: singleuser.username,
  //           email: singleuser.email,
  //           avatar: singleuser.avatar,
  //           description: singleuser.description || null,
  //           isOnline: false, // Default, will be updated via socket
  //           lastSeen: new Date().toISOString(),
  //           isTyping: false,
  //         }];
  //       }
  //       return prev;
  //     });
  //     setReceiverId(singleuser.id);
  //     localStorage.removeItem("redirectFromMessage");
  //   }
  // }, [singleuser, singleUserLoading, singleUserError]);

  // but don’t call hooks inside it
  useEffect(() => {
    if (userList && Array.isArray(userList.data)) {
      setUsers(userList.data.map((u: any) => ({
        ...u,
        isOnline: false, // Initial, updated via socket
        lastSeen: u.lastSeen || new Date().toISOString(),
        isTyping: false,
      })));
      setIsLoadingUsers(false);
    }
  }, [userList]);

  // get message here 
 useEffect(() => {
  if (userMessage) {
    console.log("Message history here: ", userMessage);
    if (Array.isArray(userMessage.data)) {
      setMessages(userMessage.data);
    }
  }
}, [receiverId, userMessage]);

  // Mark conversation as read when chat opens
  useEffect(() => {
    if (receiverId && socketRef.current?.connected && messages.length > 0) {
      const unreadMessages = messages.filter(
        (msg) => msg.senderId === receiverId && !msg.isRead
      );
      if (unreadMessages.length > 0) {
        socketRef.current.emit("markConversationAsRead", { senderId: receiverId });
        // Optimistically update local messages (for receiver, isRead not displayed, but for consistency)
        setMessages((prev) =>
          prev.map((msg) =>
            unreadMessages.find((um) => um.id === msg.id)
              ? { ...msg, isRead: true }
              : msg
          )
        );
      }
    }
  }, [receiverId, messages]);

  // all seocket logic Lissener in here
  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      timeout: 5000,
    })

    const socket = socketRef.current
    socket.on("connect", () => {
      console.log("[v0] Socket connected:", socket.id)
      setApiError(null)
      socket.emit("authentication", { token });
    })

    socket.on("connect_error", (error) => {
      console.log("[v0] Socket connection error:", error)
      setApiError("Real-time messaging unavailable")
    })

    socket.on("authenticated", (user) => {
      console.log("🔑 Authenticated as:", user);
      // Request initial online users
      socket.emit("getOnlineUsers");
    });

    socket.on("disconnect", () => {
      console.log("[v0] Socket disconnected")
    })

    socket.on("message", (receivedMessage: Message & { sender: Partial<User> }) => {
      console.log("[v0] Received new message:", receivedMessage)
      setMessages((prev) => [...prev, receivedMessage]);
      
      // If message from new user, add to user list
      if (!users.find((u) => u.id === receivedMessage.senderId)) {
        setUsers((prev) => [
          ...prev,
          {
            id: receivedMessage.senderId,
            username: receivedMessage.sender.username || `User ${receivedMessage.senderId.slice(0, 5)}`,
            email: receivedMessage.sender.email || '',
            avatar: receivedMessage.sender.avatar || null,
            description: null,
            isOnline: true, // Since they just sent a message
            lastSeen: new Date().toISOString(),
            isTyping: false,
          },
        ]);
        refetchUserList(); // Refetch to sync with API if needed
      }

      // If chat is open for this sender, mark as read immediately
      if (receivedMessage.senderId === receiverId) {
        socket.emit("markConversationAsRead", { senderId: receivedMessage.senderId });
        // Optimistically set isRead true (though not displayed for received)
      }
    })

    socket.on("userTyping", ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
      console.log("[v0] User typing event:", userId, isTyping)
      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, isTyping } : user)))
    })

    socket.on("userStoppedTyping", ({ userId }) => {
      console.log("[v0] User stopped typing event:", userId);
      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, isTyping: false } : user)))
    })

    socket.on("userStatus", ({ userId, isOnline, lastSeen }: { userId: string; isOnline: boolean; lastSeen: string }) => {
      console.log("[v0] User status update:", userId, isOnline, lastSeen);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, isOnline, lastSeen: isOnline ? new Date().toISOString() : lastSeen }
            : user
        )
      );
    });

    socket.on("onlineUsers", (onlineUsersList: User[]) => {
      console.log("[v0] Received online users list:", onlineUsersList);
      setUsers((prev) =>
        prev.map((user) => {
          const onlineUser = onlineUsersList.find((ou) => ou.id === user.id);
          return onlineUser
            ? { ...user, isOnline: true, lastSeen: onlineUser.lastSeen }
            : { ...user, isOnline: false };
        })
      );
    });

    socket.on("messageSeen", ({ userId }) => {
      console.log(`🛑 User ${userId} Message Seen`);
    });

    socket.on("message_read", ({ messageId }: { messageId: string }) => {
      console.log("[v0] Message read:", messageId)
      setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isRead: true } : msg)))
    })

    return () => {
      console.log("[v0] Cleaning up socket connection")
      socket.disconnect()
    }
  }, [token])

  // sending Socket All Others  Event
  useEffect(() => {
    console.log(input, "input here");
  }, [input])

  const selectedUser = useMemo(() => users.find((u) => u.id === receiverId), [users, receiverId])

  const onlineUsersCount = useMemo(() => users.filter((user) => user.isOnline).length, [users])

  const getLastMessage = useCallback((userId: string) => {
    const userMessages = FAKE_MESSAGE_HISTORY[userId] || []
    return userMessages[userMessages.length - 1]
  }, [])

  const getUnreadCount = useCallback((userId: string) => {
    const userMessages = FAKE_MESSAGE_HISTORY[userId] || []
    return userMessages.filter((msg) => !msg.isRead && msg.senderId === userId).length
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // geting user
  useEffect(() => {
    if (apiError) {
      // Removed fake status simulation as real-time is now handled via socket
    }
  }, [receiverId, apiError])

  // sending message blog here
  const sendMessage = useCallback(() => {
    if (!input.trim() || !receiverId) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: CURRENT_USER_ID,
      receiverId,
      message: input.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
    }
        //  payload: { receiverId: string; message: string; images?: string[] },

    setMessages((prev) => [...prev, newMessage])
    setInput("")

    console.log(receiverId,'checking receiver id here');

    if (socketRef.current?.connected) {
      console.log("[v0] Sending message via socket:", newMessage)
      socketRef.current.emit("sendMessage", {
        receiverId,
        message: input.trim(),
      })
    } else {
      console.log("[v0] Socket not available, using fallback response")
      setTimeout(
        () => {
          const responses = [
            "Thanks for the update!",
            "Got it, I'll check that out.",
            "Sounds good to me!",
            "Let me get back to you on that.",
            "Perfect, thanks!",
            "I'll take a look at this later.",
            "Awesome work!",
          ]

          const responseMessage: Message = {
            id: `msg-${Date.now()}-response`,
            senderId: receiverId,
            receiverId: CURRENT_USER_ID,
            message: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date().toISOString(),
            isRead: false,
          }

          setMessages((prev) => [...prev, responseMessage])
        },
        Math.random() * 2000 + 1000,
      )
    }
  }, [input, receiverId])


  // handle typing Event call

  const handleTyping = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value)

      console.log(input,'chekcing isniput ')

      if (socketRef.current?.connected && receiverId) {
        socketRef.current.emit("typing", { receiverId, isTyping: true })
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      typingTimeoutRef.current = setTimeout(() => {
        if (socketRef.current?.connected && receiverId) {
          socketRef.current.emit("typing", { receiverId, isTyping: false })
        }
      }, 1000)
    },
    [receiverId],
  )


  // hanlde Event Stop typing

  useEffect(()=>{
        if (socketRef.current?.connected && receiverId && input.trim() === "") {
        socketRef.current.emit("stopTyping", { receiverId })
      }
  },[input])


  const selectUser = useCallback((user: User) => {
    setReceiverId(user.id)
    setShowSidebarOnMobile(false)
  }, [])

  const formatTime = useCallback((timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      })
    }
  }, [])

  const formatLastSeen = useCallback((timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60)

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`

    const diffInHours = diffInMinutes / 60
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`

    const diffInDays = diffInHours / 24
    return `${Math.floor(diffInDays)}d ago`
  }, [])

  const formatName = (user: User) => user.username || `User ${user.id.slice(0, 5)}`

  return (
    <div className="flex flex-col md:flex-row flex-1 h-[88vh] bg-gray-50">
      {apiError && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 text-sm">
          <p className="font-medium">⚠️ {apiError}</p>
        </div>
      )}

      <aside
        className={`w-full md:w-1/4 md:min-w-[300px] md:max-w-[350px] h-screen bg-white border-r border-gray-200 flex flex-col ${
          !showSidebarOnMobile ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
            {socketRef.current?.connected && (
              <div className="w-2 h-2 bg-green-500 rounded-full" title="Real-time connected" />
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Circle className="h-2 w-2 fill-green-500 text-green-500" />
            <span>{onlineUsersCount} online</span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            All Users ({isLoadingUsers ? "..." : users.length})
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          {isLoadingUsers ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            users.map((user) => {
              const lastMessage = getLastMessage(user.id)
              const unreadCount = getUnreadCount(user.id)

              return (
                <div
                  key={user.id}
                  onClick={() => selectUser(user)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors ${
                    receiverId === user.id ? "bg-blue-100" : ""
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg">
                      {user.username?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        user.isOnline ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    {user.isTyping && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-800 truncate">{formatName(user)}</p>
                      {lastMessage && (
                        <span className="text-xs text-gray-500">{formatTime(lastMessage.timestamp)}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {user.isTyping ? (
                          <p className="text-sm text-blue-600 italic">typing...</p>
                        ) : lastMessage ? (
                          <p className="text-sm text-gray-600 truncate">
                            {lastMessage.senderId === CURRENT_USER_ID ? "You: " : ""}
                            {lastMessage.message}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">No messages yet</p>
                        )}

                        <p className="text-xs text-gray-500">
                          {user.isOnline ? "Online" : `Last seen ${formatLastSeen(user.lastSeen)}`}
                        </p>
                      </div>

                      {unreadCount > 0 && (
                        <div className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          {receiverId ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebarOnMobile(true)}
                className="md:hidden text-gray-600 hover:text-gray-800"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold">
                  {selectedUser?.username?.charAt(0).toUpperCase() || "?"}
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    selectedUser?.isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-gray-800">{selectedUser?.username || "User"}</p>
                <p className="text-sm text-gray-600">
                  {selectedUser?.isTyping ? (
                    <span className="text-blue-600 italic">typing...</span>
                  ) : selectedUser?.isOnline ? (
                    <span className="text-green-600">Online</span>
                  ) : (
                    <span className="text-gray-500">
                      Last seen {selectedUser ? formatLastSeen(selectedUser.lastSeen) : ""}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-gray-500">Select a user to chat</p>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                <span>{onlineUsersCount} users online</span>
              </div>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {receiverId ? (
            <>
              {isLoadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <MessageCircle className="h-12 w-12 mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Start the conversation!</p>
                  <p className="text-sm">Send a message to {selectedUser?.username}</p>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => {
                    const isMine = msg.senderId === CURRENT_USER_ID
                    const showSender = i === 0 || messages[i - 1].senderId !== msg.senderId

                    return (
                      <div key={msg.id} className="mb-4">
                        {showSender && !isMine && (
                          <p className="text-xs text-gray-500 mb-1 ml-2">{selectedUser?.username}</p>
                        )}
                        <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                              isMine
                                ? "bg-blue-600 text-white rounded-br-md"
                                : "bg-white text-gray-800 rounded-bl-md shadow-sm border"
                            }`}
                          >
                            <p className="break-words">{msg.message}</p>
                            <div className="flex items-center justify-between mt-1">
                              <p className={`text-xs ${isMine ? "text-blue-100" : "text-gray-500"}`}>
                                {formatTime(msg.timestamp)}
                              </p>
                              {isMine && (
                                <div className={`text-xs ${msg.isRead ? "text-blue-200" : "text-blue-300"}`}>
                                  {msg.isRead ? "Read" : "Sent"}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {selectedUser?.isTyping && (
                    <div className="flex mb-4 justify-start">
                      <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border">
                        <div className="flex items-center gap-1">
                          <div className="flex gap-1">
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            />
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            />
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 ml-2">{selectedUser.username} is typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageCircle className="h-16 w-16 mb-4 text-gray-300" />
              <p className="text-xl font-medium mb-2">Welcome to Chat</p>
              <p className="text-center">
                Select a user from the sidebar to start chatting
                <br />
                <span className="text-sm">{onlineUsersCount} users are currently online</span>
              </p>
            </div>
          )}
        </div>

        <footer className="bg-white border-t border-gray-200 p-4">
          {receiverId ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={handleTyping}
                placeholder={`Message ${selectedUser?.username || "user"}...`}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                disabled={isLoadingMessages}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoadingMessages}
                className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-2">Select a user to send a message</p>
          )}
        </footer>
      </div>
    </div>
  )
}