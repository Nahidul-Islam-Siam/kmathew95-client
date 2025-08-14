"use client"
import { useCallback, useMemo, useState } from "react"
import { MessageCircle, Bell, ChevronLeft } from "lucide-react"
import ChatHeader from "@/components/messages/ChatHeader"
import MessageInput from "@/components/messages/MessageInput"
import MessageList from "@/components/messages/MessageList"
import UserList from "@/components/messages/UserList"
import SearchBoxAdmin from "@/components/messages/SearchBox"
import AlertListItem from "@/components/messages/AllertListItem"
import AlertDetail from "@/components/messages/AllertDetail"


/* -------------------------------------------------------------------- */
/* Helpers & types                                                      */
/* -------------------------------------------------------------------- */
interface User {
    id: string // Room ID
    unReadCount: number
    user: {
        id: string // User Profile ID
        firstName: string
        lastName: string
        avatar: string
    }
    lastMessage?: string
}

interface TMessage {
    id: string
    senderId: string // User Profile ID
    receiverId: string // User Profile ID
    content: string
    createdAt: string
    isRead: boolean
    senderAvatar?: string
}

interface TCreateChatRoom {
    name: string
    description: string
    participantUserId: string
}

interface Alert {
    id: string
    type: string
    shortDescription: string
    fullDescription: string
    timestamp: string
}

const EMPTY_MESSAGES: TMessage[] = []

/* -------------------------------------------------------------------- */
/* Loading Spinner Component                                            */
/* -------------------------------------------------------------------- */
const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-4">
        <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-figma-orange border-t-transparent"></div>
            <span className="text-sm text-figma-text-gray">Creating chatroom...</span>
        </div>
    </div>
)

/* -------------------------------------------------------------------- */
/* Dummy Data                                                           */
/* -------------------------------------------------------------------- */
const DUMMY_CHAT_USERS: User[] = [
    {
        id: "room1",
        unReadCount: 2,
        user: {
            id: "user1_profile",
            firstName: "Sophia",
            lastName: "Clark",
            avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avatar1.png?query=Sophia+Clark+avatar",
        },
        lastMessage: "Hi there! How are you?",
    },
    {
        id: "room2",
        unReadCount: 0,
        user: {
            id: "user2_profile",
            firstName: "Ethan",
            lastName: "Bennett",
            avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avatar2.png?query=Ethan+Bennett+avatar",
        },
        lastMessage: "Meeting at 3PM today",
    },
    {
        id: "room3",
        unReadCount: 5,
        user: {
            id: "user3_profile",
            firstName: "Liam",
            lastName: "Turner",
            avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avatar3.png?query=Liam+Turner+avatar",
        },
        lastMessage: "Sent the updated documents.",
    },
    {
        id: "room4",
        unReadCount: 1,
        user: {
            id: "user4_profile",
            firstName: "Ava",
            lastName: "Mitchell",
            avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avatar4.png?query=Ava+Mitchell+avatar",
        },
        lastMessage: "Let's catch up tomorrow.",
    },
    {
        id: "room5",
        unReadCount: 3,
        user: {
            id: "user5_profile",
            firstName: "Noah",
            lastName: "Hughes",
            avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avatar5.png?query=Noah+Hughes+avatar",
        },
        lastMessage: "Check your inbox.",
    },
    {
        id: "room6",
        unReadCount: 0,
        user: {
            id: "user6_profile",
            firstName: "Olivia",
            lastName: "Scott",
            avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avatar6.png?query=Olivia+Scott+avatar",
        },
        lastMessage: "Noted, thank you.",
    },
    {
        id: "room7",
        unReadCount: 4,
        user: {
            id: "user7_profile",
            firstName: "Lucas",
            lastName: "Morgan",
            avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avatar7.png?query=Lucas+Morgan+avatar",
        },
        lastMessage: "Project phase 2 is complete.",
    },
    {
        id: "room8",
        unReadCount: 0,
        user: {
            id: "user888_profile",
            firstName: "Isabella",
            lastName: "Reed",
            avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avatar8.png?query=Isabella+Reed+avatar",
        },
        lastMessage: "Final report has been submitted.",
    },
    {
        id: "room9",
        unReadCount: 4,
        user: {
            id: "user77_profile",
            firstName: "Lucas",
            lastName: "Morgan",
            avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avatar7.png?query=Lucas+Morgan+avatar",
        },
        lastMessage: "Project phase 2 is complete.",
    },
    {
        id: "room10",
        unReadCount: 0,
        user: {
            id: "user88_profile",
            firstName: "Isabella",
            lastName: "Reed",
            avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avatar8.png?query=Isabella+Reed+avatar",
        },
        lastMessage: "Final report has been submitted.",
    },
    {
        id: "room11",
        unReadCount: 0,
        user: {
            id: "user9_profile",
            firstName: "Isabella",
            lastName: "Reed",
            avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avatar8.png?query=Isabella+Reed+avatar",
        },
        lastMessage: "Final report has been submitted.",
    },
]

const DUMMY_MESSAGES_DATA: Record<string, TMessage[]> = {
    room1: [
        {
            id: "msg1_room1",
            senderId: "user1_profile",
            receiverId: "my_admin_id",
            content: "Hi, how are you doing today?",
            createdAt: "2025-07-21T10:00:00Z",
            isRead: true,
        },
        {
            id: "msg2_room1",
            senderId: "my_admin_id",
            receiverId: "user1_profile",
            content: "I'm doing well, thanks! How about you?",
            createdAt: "2025-07-21T10:05:00Z",
            isRead: true,
        },
        {
            id: "msg3_room1",
            senderId: "user1_profile",
            receiverId: "my_admin_id",
            content: "All good! Just wrapped up a major project 🥳",
            createdAt: "2025-07-21T10:10:00Z",
            isRead: true,
        },
        {
            id: "msg4_room1",
            senderId: "my_admin_id",
            receiverId: "user1_profile",
            content: "Wow, congrats! What was the project about?",
            createdAt: "2025-07-21T10:12:00Z",
            isRead: false,
        },
        {
            id: "msg5_room1",
            senderId: "user1_profile",
            receiverId: "my_admin_id",
            content: "A new mobile app for freelancers. Took 2 months.",
            createdAt: "2025-07-21T10:14:00Z",
            isRead: false,
        },
    ],
    room2: [
        {
            id: "msg1_room2",
            senderId: "user2_profile",
            receiverId: "my_admin_id",
            content: "Hello, is this customer support?",
            createdAt: "2025-07-20T14:30:00Z",
            isRead: true,
        },
        {
            id: "msg2_room2",
            senderId: "my_admin_id",
            receiverId: "user2_profile",
            content: "Yes, how can I help you today?",
            createdAt: "2025-07-20T14:35:00Z",
            isRead: true,
        },
        {
            id: "msg3_room2",
            senderId: "user2_profile",
            receiverId: "my_admin_id",
            content: "I need to reschedule my consultation.",
            createdAt: "2025-07-20T14:40:00Z",
            isRead: true,
        },
        {
            id: "msg4_room2",
            senderId: "my_admin_id",
            receiverId: "user2_profile",
            content: "Sure, please provide a new date and time.",
            createdAt: "2025-07-20T14:42:00Z",
            isRead: false,
        },
    ],
    room3: [
        {
            id: "msg1_room3",
            senderId: "user3_profile",
            receiverId: "my_admin_id",
            content: "Hi, I need urgent help with my account access.",
            createdAt: "2025-07-19T09:00:00Z",
            isRead: false,
        },
        {
            id: "msg2_room3",
            senderId: "my_admin_id",
            receiverId: "user3_profile",
            content: "Of course. Can you describe the issue in detail?",
            createdAt: "2025-07-19T09:05:00Z",
            isRead: false,
        },
        {
            id: "msg3_room3",
            senderId: "user3_profile",
            receiverId: "my_admin_id",
            content: "It says my email isn’t recognized during login.",
            createdAt: "2025-07-19T09:07:00Z",
            isRead: false,
        },
    ],
    room4: [
        {
            id: "msg1_room4",
            senderId: "user4_profile",
            receiverId: "my_admin_id",
            content: "Reminder: Submit your Q3 reports before Friday.",
            createdAt: "2025-07-18T08:00:00Z",
            isRead: true,
        },
        {
            id: "msg2_room4",
            senderId: "my_admin_id",
            receiverId: "user4_profile",
            content: "Thanks, already working on it.",
            createdAt: "2025-07-18T08:10:00Z",
            isRead: true,
        },
    ],
    room5: [
        {
            id: "msg1_room5",
            senderId: "user5_profile",
            receiverId: "my_admin_id",
            content: "Hey, are we still on for lunch this Friday?",
            createdAt: "2025-07-17T12:20:00Z",
            isRead: false,
        },
    ],
    room6: [
        {
            id: "msg1_room6",
            senderId: "user6_profile",
            receiverId: "my_admin_id",
            content: "Just wanted to say thanks for your help earlier!",
            createdAt: "2025-07-16T11:15:00Z",
            isRead: true,
        },
        {
            id: "msg2_room6",
            senderId: "my_admin_id",
            receiverId: "user6_profile",
            content: "You're most welcome, anytime 🙂",
            createdAt: "2025-07-16T11:18:00Z",
            isRead: true,
        },
    ],
}

const DUMMY_ALERTS_DATA: Alert[] = [
    {
        id: "alert1",
        type: "New Trade Offer",
        shortDescription: "Received 2 hours ago",
        fullDescription:
            "You have received a new trade offer from Alex Carter for 100 shares of TechCorp at $150 per share. Review the offer and respond.",
        timestamp: "2025-07-22T14:00:00Z",
    },
    {
        id: "alert2",
        type: "Trade Offer Accepted",
        shortDescription: "Received 3 hours ago",
        fullDescription:
            "Your trade offer to purchase 50 shares of Innovate Solutions at $200 per share has been accepted by Jordan Bennett.",
        timestamp: "2025-07-22T13:00:00Z",
    },
    {
        id: "alert3",
        type: "Trade Offer Rejected",
        shortDescription: "Received 1 day ago",
        fullDescription:
            "Your trade offer to sell 75 shares of Global Energy at $75 per share has been rejected by Taylor Evans.",
        timestamp: "2025-07-21T10:00:00Z",
    },
    {
        id: "alert4",
        type: "Trade Offer Received",
        shortDescription: "Received 2 days ago",
        fullDescription:
            "You have received a new trade offer from Chris Davis for 200 shares of BioMed Inc. at $120 per share. Review the offer and respond.",
        timestamp: "2025-07-20T09:00:00Z",
    },
]

/* -------------------------------------------------------------------- */
/* Component                                                            */
/* -------------------------------------------------------------------- */
export default function SupportPage() {
    /* ---------------- local state ------------ */
    const [selectedUser, setSelectedUser] = useState<User | null>(DUMMY_CHAT_USERS[0])
    const [currentMessages, setCurrentMessages] = useState<TMessage[]>(
        DUMMY_MESSAGES_DATA[DUMMY_CHAT_USERS[0].id] || EMPTY_MESSAGES,
    )
    const [chatUsers, setChatUsers] = useState<User[]>(DUMMY_CHAT_USERS)
    const [isCreatingChatRoom, setIsCreatingChatRoom] = useState(false)
    const [activeTab, setActiveTab] = useState<"messages" | "alerts">("messages") // Type-safe state
    const [showSidebarOnMobile, setShowSidebarOnMobile] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(DUMMY_ALERTS_DATA[0])
    const [alerts] = useState<Alert[]>(DUMMY_ALERTS_DATA) // Keeping as is since it's static dummy data

    /* ---------------- dummy API functions ---- */
    const triggerMessages = useCallback(async (roomId: string) => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                setCurrentMessages(DUMMY_MESSAGES_DATA[roomId] || EMPTY_MESSAGES)
                resolve()
            }, 300)
        })
    }, [])

    const sendMessage = useCallback(
        (roomId: string, text: string) => {
            const newMessage: TMessage = {
                id: `msg${Date.now()}`,
                senderId: "my_admin_id",
                receiverId: selectedUser?.user.id || "",
                content: text,
                createdAt: new Date().toISOString(),
                isRead: false,
            }
            setCurrentMessages((prev) => [...prev, newMessage])
            // Update last message preview and unread count for the user
            if (selectedUser) {
                setChatUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.id === roomId
                            ? {
                                ...user,
                                lastMessage: text,
                                unReadCount: selectedUser.user.id === "my_admin_id" ? user.unReadCount : user.unReadCount + 1
                            }
                            : user
                    )
                );
            }
        },
        [selectedUser],
    )

    const readMessage = useCallback((roomId: string, userId: string) => {
        setCurrentMessages((prev) =>
            prev.map((msg) =>
                // Mark messages sent TO the admin (received by admin) as read
                msg.receiverId === "my_admin_id" && !msg.isRead ? { ...msg, isRead: true } : msg
            )
        )
        // Reset unread count for the user whose messages were read
        setChatUsers((prev) =>
            prev.map((user) =>
                user.id === roomId ? { ...user, unReadCount: 0 } : user
            )
        )
    }, [])

    /* ---------------- handlers --------------- */
    const handleSelectUser = useCallback(
        (user: User) => {
            setSelectedUser(user)
            triggerMessages(user.id).then(() => {
                readMessage(user.id, user.user.id)
            })
            setShowSidebarOnMobile(false)
        },
        [triggerMessages, readMessage],
    )

    const handleSelectAlert = useCallback((alert: Alert) => {
        setSelectedAlert(alert)
        setShowSidebarOnMobile(false)
    }, [])

    const handleBackToChats = useCallback(() => {
        setShowSidebarOnMobile(true)
        setSelectedUser(null)
        setCurrentMessages(EMPTY_MESSAGES)
        setSearchQuery("")
    }, [])

    const handleBackToAlerts = useCallback(() => {
        setShowSidebarOnMobile(true)
        setSelectedAlert(null)
    }, [])

    const filteredChatUsers = useMemo(() => {
        if (!searchQuery) {
            return chatUsers
        }
        const lowerCaseQuery = searchQuery.toLowerCase()
        return chatUsers.filter(
            (user) =>
                user.user.firstName.toLowerCase().includes(lowerCaseQuery) ||
                user.user.lastName.toLowerCase().includes(lowerCaseQuery) ||
                user.lastMessage?.toLowerCase().includes(lowerCaseQuery),
        )
    }, [chatUsers, searchQuery])

    const handleSendMessage = useCallback(
        (text: string) => {
            if (selectedUser) {
                sendMessage(selectedUser.id, text)
            }
        },
        [selectedUser, sendMessage],
    )

    /* ------------------------------------------------------------------ */
    /* Render                                                             */
    /* ------------------------------------------------------------------ */
    return (
        <div className="flex flex-col md:flex-row flex-1 h-[88vh] pb-0 bg-figma-bg">
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden bg-figma-bg">
                {/* Sidebar */}
                <aside
                    className={`w-full md:w-1/4 md:min-w-[300px] md:max-w-[350px] h-screen overflow-y-auto bg-figma-sidebar-bg border-r border-gray-200 flex flex-col
        ${!showSidebarOnMobile ? "hidden md:flex" : "flex"}`}
                >
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 p-4-">
                        <button
                            className={`flex-1 py-2 text-center text-lg font-medium relative transition-colors duration-200 ${activeTab === "messages" ? "text-figma-dark-blue" : "text-figma-text-gray hover:text-figma-dark-blue"
                                }`}
                            onClick={() => {
                                setActiveTab("messages")
                                setSelectedAlert(null)
                            }}
                        >
                            <MessageCircle className="inline-block mr-2 h-5 w-5" />
                            Messages
                            {activeTab === "messages" && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-figma-dark-blue transform translate-y-full"></span>
                            )}
                        </button>
                        <button
                            className={`flex-1 py-2 text-center text-lg font-medium relative transition-colors duration-200 ${activeTab === "alerts" ? "text-figma-dark-blue" : "text-figma-text-gray hover:text-figma-dark-blue"
                                }`}
                            onClick={() => {
                                setActiveTab("alerts")
                                setSelectedUser(null)
                            }}
                        >
                            <Bell className="inline-block mr-2 h-5 w-5" />
                            Alerts
                            {activeTab === "alerts" && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-figma-dark-blue transform translate-y-full"></span>
                            )}
                        </button>
                    </div>
                    {activeTab === "messages" && (
                        <>
                            <div className="p-4">
                                <h2 className="text-xl font-semibold text-figma-text-dark mb-4">Chats</h2>
                                <SearchBoxAdmin allChatUsers={chatUsers} onSearchSelect={handleSelectUser} />
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <UserList users={filteredChatUsers} onSelectUser={handleSelectUser} selectedUser={selectedUser} />
                                {isCreatingChatRoom && <LoadingSpinner />}
                            </div>
                        </>
                    )}
                    {activeTab === "alerts" && (
                        <>
                            <div className="p-4">
                                <h2 className="text-xl font-semibold text-figma-text-dark mb-4">Alerts</h2>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {alerts.map((alert) => (
                                    <AlertListItem
                                        key={alert.id}
                                        alert={alert}
                                        onSelectAlert={handleSelectAlert}
                                        isSelected={selectedAlert?.id === alert.id}
                                    />
                                ))}
                                {alerts.length === 0 && <div className="p-4 text-center text-figma-text-gray">No alerts to display.</div>}
                            </div>
                        </>
                    )}
                </aside>

                {/* Main content area */}
                <div className="flex flex-col flex-1">
                    <section
                        className={`flex-1 flex flex-col h-full bg-figma-bg
        ${showSidebarOnMobile ? "hidden md:flex" : "flex"}`}
                    >
                        {/* Header */}
                        <header className="sticky top-0 bg-figma-bg z-10">
                            {activeTab === "messages" &&
                                (selectedUser ? (
                                    <ChatHeader user={selectedUser} onBackClick={handleBackToChats} />
                                ) : (
                                    <div className="flex items-center p-4 bg-figma-bg border-b border-gray-200 text-figma-text-dark">
                                        <span className="text-lg font-semibold">No chat selected</span>
                                    </div>
                                ))}
                            {activeTab === "alerts" &&
                                (selectedAlert ? (
                                    <div className="flex items-center p-4 bg-figma-bg border-b border-gray-200 text-figma-text-dark">
                                        <button
                                            onClick={handleBackToAlerts}
                                            className="md:hidden text-figma-text-gray hover:text-figma-dark-blue p-2 rounded-md mr-2"
                                            aria-label="Back to alerts"
                                        >
                                            <ChevronLeft className="h-6 w-6" />
                                        </button>
                                        <span className="text-lg font-semibold">Alert Details</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center p-4 bg-figma-bg border-b border-gray-200 text-figma-text-dark">
                                        <span className="text-lg font-semibold">No alert selected</span>
                                    </div>
                                ))}
                        </header>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-figma-bg">
                            {activeTab === "messages" &&
                                (selectedUser ? (
                                    <MessageList messages={currentMessages} />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-figma-text-gray">
                                        Select a user to start chatting
                                    </div>
                                ))}
                            {activeTab === "alerts" &&
                                (selectedAlert ? (
                                    <AlertDetail alert={selectedAlert} />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-figma-text-gray">
                                        Select an alert to view details
                                    </div>
                                ))}
                        </div>

                        {/* Input/Footer */}
                        <footer className="sticky bottom-4 bg-figma-bg z-10 p-4 shadow-none border-t border-gray-200">
                            {activeTab === "messages" &&
                                (selectedUser ? (
                                    <MessageInput onSend={handleSendMessage} />
                                ) : (
                                    <div className="p-3 text-center text-figma-text-gray">Select a user to type a message</div>
                                ))}
                            {activeTab === "alerts" && (
                                <div className="p-3 text-center text-figma-text-gray">
                                    {selectedAlert ? "Alerts are read-only." : "Select an alert to view details."}
                                </div>
                            )}
                        </footer>
                    </section>
                    <p className="text-sm text-gray-500 mt-0 mb-4 text-center">
                        Your messages are end-to-end encrypted.
                    </p>
                </div>
            </div>
        </div>
    )
}