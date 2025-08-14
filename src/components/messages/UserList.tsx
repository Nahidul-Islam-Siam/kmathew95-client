"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  id: string;
  unReadCount: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  lastMessage?: string; // Added for last message preview
}

const UserList = ({
  users,
  onSelectUser,
  selectedUser,
}: {
  users: User[];
  onSelectUser: (user: User) => void;
  selectedUser: User | null;
}) => {
  return (
    <div className="flex flex-col space-y-1 pt-4 pb-4 px-4">
      {users.map((user) => (
        <div
          key={user.id}
          className={`flex items-center space-x-3 py-3 px-3 rounded-xl cursor-pointer transition-colors duration-200
          ${
            selectedUser?.id === user.id
              ? "bg-orange-200 text-figma-dark-blue" // Selected state from Figma
              : "bg-transparent hover:bg-gray-100 text-figma-text-dark"
          }`}
          onClick={() => onSelectUser(user)}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={
                user.user?.avatar ||
                "/placeholder.svg?height=40&width=40&query=user avatar"
              }
            />
            <AvatarFallback className="bg-gray-200 text-figma-text-dark">
              {user.user.firstName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-semibold text-base truncate">
              {user.user.firstName} {user.user.lastName}
            </span>
            {user.lastMessage && (
              <span className="text-sm text-figma-text-gray truncate">
                {user.lastMessage}
              </span>
            )}
          </div>
          {user.unReadCount > 0 && (
            <span className="text-xs text-white bg-figma-orange px-2 py-1 rounded-full font-medium">
              {user.unReadCount}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserList;
