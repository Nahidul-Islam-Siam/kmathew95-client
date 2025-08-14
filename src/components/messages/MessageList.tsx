"use client"

import { useEffect, useRef } from "react"
import MessageBubble from "./MessageBubble"

interface TMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  createdAt: string
  isRead: boolean
  senderAvatar?: string // Added for message sender's avatar
}

const MessageList = ({ messages }: { messages: TMessage[] }) => {
  console.log("MessageList rendered with messages:", messages)
  const loggedUserId = "my_admin_id" // Dummy logged in user ID

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      const container = messagesContainerRef.current
      const scrollHeight = container.scrollHeight
      const height = container.clientHeight
      const maxScrollTop = scrollHeight - height

      container.scrollTo({
        top: maxScrollTop,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div ref={messagesContainerRef} className="flex flex-col flex-1 space-y-4 overflow-y-auto p-4 sm:p-6 bg-figma-bg">
      {sortedMessages.map((message, index) => (
        <MessageBubble
          key={message.id || index}
          message={{
            ...message,
            loggedUserId,
            // Dummy avatars for messages based on senderId
            senderAvatar:
              message.senderId === "my_admin_id"
                ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_13-rh4bTmIruPy3x0hrRAsrAuHkpNIGDk.png?height=40&width=40&query=male avatar"
                : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_13-rh4bTmIruPy3x0hrRAsrAuHkpNIGDk.png?height=40&width=40&query=female avatar",
          }}
        />
      ))}
    <div ref={messagesEndRef} /> {/* Scroll target */}
    </div>
  )
}

export default MessageList
