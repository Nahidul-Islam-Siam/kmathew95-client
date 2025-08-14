"use client";

import type React from "react";
import img from "@/assets/profiles/avatar1.png";

import { Layout, Menu } from "antd";
import {
  BookmarkCheck,
  CreditCard,
  LayoutDashboard,
  LogOut,
  ScrollText,
  Settings,
  Star,
  User,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Using shadcn Avatar
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
const { Sider, Content, Header } = Layout;

const UserAdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    console.log("Dummy logout triggered");
    router.push("/login");
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      handleLogout();
    } else {
      router.push(key);
    }
  };

  const menuItems = [
    {
      key: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    {
      key: "/dashboard/profile",
      icon: <User size={20} />,
      label: "Profile",
    },
    {
      key: "/dashboard/messages",
      icon: <ScrollText size={20} />,
      label: "Messages",
    },
    {
      key: "/dashboard/task",
      icon: <BookmarkCheck size={20} />,
      label: "Tasks",
    },
    {
      key: "/dashboard/wallet",
      icon: <Wallet size={20} />,
      label: "Wallet",
    },
    {
      key: "/dashboard/payment",
      icon: <CreditCard size={20} />,
      label: "Payment",
    },
    {
      key: "/dashboard/bookmarks",
      icon: <BookmarkCheck />,
      label: "Bookmarks",
    },
    {
      key: "/dashboard/reviews",
      icon: <Star size={20} />,
      label: "Reviews",
    },
    {
      key: "/dashboard/history",
      icon: <ScrollText size={20} />,
      label: "History",
    },
    {
      key: "/dashboard/setting",
      icon: <Settings size={20} />,
      label: "Settings",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={240}
        style={{
          background: "#fff",
          boxShadow: "2px 0 5px #1C2A47",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo & Collapse Toggle */}
        <div
          className="flex items-center justify-between px-4 py-4 border-b"
          style={{ height: 64, borderColor: "#f0f0f0" }}
        >
          {!collapsed && (
            <Link href="/">
              <span className="text-xl font-bold" style={{ color: "#1C2A47" }}>
                Skill
      
                  Switch
           
              </span>
            </Link>
          )}
          <span
            className="text-xl cursor-pointer"
            style={{ color: "#1C2A47", marginLeft: collapsed ? "auto" : "0" }}
            onClick={() => setCollapsed(!collapsed)}
          >
            »
          </span>
        </div>
        {/* Menu */}
        <Menu
          mode="inline"
          selectedKeys={[pathname ?? ""]}
          onClick={handleMenuClick}
          style={{
            borderRight: 0,
            paddingTop: 12,
            fontSize: 15,
            fontWeight: 500,
            flexGrow: 1,
          }}
          items={menuItems}
          className="admin-menu"
        />
        {/* Logout */}
        <div className="p-4" style={{ marginTop: "auto" }}>
          <div
            onClick={handleLogout}
            className="flex items-center gap-2 cursor-pointer font-medium text-[15px]"
            style={{ color: "#ef4444" }} // Tailwind red-500
          >
            <LogOut size={20} />
            {!collapsed && <span>Log out</span>}
          </div>
        </div>
      </Sider>
      {/* Main Content */}
      <Layout>
        <Header
          style={{
            height: 64,
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className="flex items-center justify-between w-full">
            <h1
              className="hidden md:block text-lg font-semibold"
              style={{ color: "#092c4c" }}
            >
              Welcome back, Alex Grinder
            </h1>
            <div className="flex justify-center items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Image
                      src={img}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full"
                      width={32}
                      height={32}
                    ></Image>
                    <div className="flex flex-col items-start justify-center">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#374151" }}
                      >
                        Alex Grinder
                      </span>
                      <span className="text-xs" style={{ color: "#6b7280" }}>
                        User
                      </span>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: 0,
            height: "calc(100vh - 64px)",
            overflowY: "auto",
            padding: 24,
            background: "#f9fafb", // Tailwind gray-50
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserAdminLayout;
