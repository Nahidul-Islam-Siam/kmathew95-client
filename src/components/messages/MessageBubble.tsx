import { convertDate } from "@/utils/dateConverter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  senderAvatar?: string; // Added for message sender's avatar
}

interface MessageBubbleProps {
  message: TMessage & { loggedUserId?: string };
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { senderId, loggedUserId, content, createdAt, senderAvatar } = message;
  const isMine = senderId === loggedUserId;

  return (
    <div
      className={`flex items-start gap-3 mb-4 ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      {/* Avatar (left for incoming) */}
      {!isMine && (
        <Avatar className="h-9 w-9">
          <AvatarImage
            src={
              senderAvatar ||
              "/placeholder.svg?height=40&width=40&query=user avatar"
            }
          />
          <AvatarFallback className="bg-gray-200 text-figma-text-dark">
            {senderAvatar ? "" : "U"}
          </AvatarFallback>
        </Avatar>
      )}
      {/* Bubble + timestamp */}
      <div className="max-w-[70%] flex flex-col">
        <p
          className={`rounded-2xl px-4 py-2 leading-snug break-words shadow-sm text-base
            ${
              isMine
                ? "bg-figma-dark-blue text-white rounded-br-none"
                : "bg-figma-light-gray text-figma-text-dark rounded-bl-none"
            }`}
        >
          {content}
        </p>
        <span
          className={`mt-1 text-xs tracking-tight tabular-nums ${
            isMine ? "text-right" : "text-left"
          } text-figma-text-gray`}
        >
          {convertDate(createdAt, "time")}
        </span>
      </div>
      {/* Avatar (right for your own bubble) */}
      {isMine && (
        <Avatar className="h-9 w-9">
          <AvatarImage
            src={
              senderAvatar ||
              "/placeholder.svg?height=40&width=40&query=user avatar"
            }
          />
          <AvatarFallback className="bg-gray-200 text-figma-text-dark">
            {senderAvatar ? "" : "Me"}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
