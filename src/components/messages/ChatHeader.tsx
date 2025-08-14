"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";

interface User {
  id: string;
  unReadCount: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
}

const ChatHeader = ({
  user,
  onBackClick,
}: {
  user: User;
  onBackClick?: () => void;
}) => {
  return (
    <div className="flex items-center p-4 bg-figma-bg border-b border-gray-200 text-figma-text-dark">
      {onBackClick && (
        <div
          onClick={onBackClick}
          className="cursor-pointer mr-2 md:hidden text-figma-text-gray hover:text-figma-dark-blue p-2 rounded-md" // Added padding and rounded-md for clickable area
          aria-label="Back to chats"
          role="button" // Semantic role for accessibility
          tabIndex={0} // Makes the div focusable
          onKeyDown={(e) => {
            // Handles keyboard activation (Enter/Space)
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onBackClick?.();
            }
          }}
        >
          <ChevronLeft className="h-8 w-8" />{" "}
          {/* ChevronLeft icon with increased size */}
        </div>
      )}
      <div className="flex items-center">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={
              user.user.avatar ||
              "/placeholder.svg?height=40&width=40&query=user avatar"
            }
          />
          <AvatarFallback className="bg-gray-200 text-figma-text-dark">
            {user.user.firstName[0]}
          </AvatarFallback>
        </Avatar>
        <span className="ml-3 text-lg font-semibold">
          {user.user.firstName} {user.user.lastName}
        </span>
      </div>
    </div>
  );
};

export default ChatHeader;
