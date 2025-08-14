"use client"

import { useState } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Paperclip } from "lucide-react" // Using Lucide React for icons

const MessageInput = ({ onSend }: { onSend: (text: string) => void }) => {
    const [message, setMessage] = useState("")

    const handleSendMessage = () => {
        if (message.trim()) {
            onSend(message)
            setMessage("")
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSendMessage()
        }
    }

    return (
        <div className="">
            <div className="flex items-center space-x-2 flex-1 p-5 border border-figma-light-gray rounded-xl bg-gray-100 text-figma-text-dark placeholder:text-figma-text-gray focus:ring-0 focus:border-figma-light-gray"
            >
                <Input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full bg-white h-12"
                />
                <Button variant="ghost" size="lg" className="text-figma-text-white hover:text-figma-dark-blue">
                    <Paperclip className="h-8 w-8" />
                </Button>
                <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-figma-orange hover:bg-figma-orange/90 text-white rounded-xl px-6 py-6 transition-colors"
                >
                    Send
                </Button>
            </div>
        </div>
    )
}

export default MessageInput
