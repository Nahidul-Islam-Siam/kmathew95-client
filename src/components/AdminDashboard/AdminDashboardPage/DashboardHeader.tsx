"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardHeader() {
  return (
    <header className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8 border-b bg-background">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold text-gray-800">
          Welcome Back, John Doe!
        </h1>{" "}
        {/* Adjusted text color */}
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src="/placeholder.svg?height=36&width=36"
                  alt="John Doe"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-right">
                <span className="font-medium text-gray-800">John Doe!</span>{" "}
                {/* Adjusted text color */}
                <span className="text-sm text-muted-foreground">Admin</span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
