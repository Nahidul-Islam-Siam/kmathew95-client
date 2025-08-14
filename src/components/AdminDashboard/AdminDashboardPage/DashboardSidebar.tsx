"use client";

import type * as React from "react";
import {
  LayoutDashboard,
  ClipboardList,
  User,
  Wallet,
  CreditCard,
  Share2,
  Star,
  PlusSquare,
  Settings,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Menu items.
const navItems = [
  {
    title: "Dashboards",
    url: "/dashboard/admin",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Tasks Post",
    url: "/dashboard/admin/tasks-post",
    icon: ClipboardList,
    isActive: true, // Marked as active based on screenshot
  },
  {
    title: "User",
    url: "/dashboard/admin/user",
    icon: User,
  },
  {
    title: "Wallet",
    url: "/dashboard/admin/wallet",
    icon: Wallet,
  },
  {
    title: "Subscription",
    url: "/dashboard/admin/subscription",
    icon: CreditCard,
  },
  {
    title: "Referral",
    url: "/dashboard/admin/referral",
    icon: Share2,
  },
  {
    title: "Reviews",
    url: "/dashboard/admin/reviews",
    icon: Star,
  },
  {
    title: "Add Category",
    url: "/dashboard/admin/add-category",
    icon: PlusSquare,
  },
  {
    title: "Profile",
    url: "/dashboard/admin/tasks",
    icon: Settings,
  },
];

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      {/* Wrapped all direct children of Sidebar in a single div */}
      <div className="flex flex-col h-full">
        <div className="flex h-16 items-center justify-between p-2">
          <div className="flex items-center gap-2 pl-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="/placeholder.svg?height=32&width=32"
                alt="Admin Dashboard Logo"
              />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <span className="text-lg font-semibold group-data-[state=collapsed]/sidebar-wrapper:hidden">
              Admin Dashboard
            </span>
          </div>
          <SidebarTrigger
            className="ml-auto group-data-[state=collapsed]/sidebar-wrapper:hidden"
            asChild
          >
            <button className="h-7 w-7 rounded-md flex items-center justify-center text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Toggle Sidebar</span>
            </button>
          </SidebarTrigger>
        </div>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.isActive}
                      className={
                        item.isActive
                          ? "bg-[#1A2B4B] text-white hover:bg-[#1A2B4B]/90 hover:text-white"
                          : ""
                      }
                    >
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </div>
    </Sidebar>
  );
}
