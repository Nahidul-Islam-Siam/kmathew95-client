"use client";

import type React from "react";

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
import { MdAddCircleOutline } from "react-icons/md"; // Re-adding this as per original code

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Using shadcn Avatar
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Using shadcn DropdownMenu

const { Sider, Content, Header } = Layout;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
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
      key: "/admin",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboards",
    },
    {
      key: "/admin/tasks-post",
      icon: <MdAddCircleOutline size={20} />, // Reverted to MdAddCircleOutline
      label: "Tasks Post",
    },
    {
      key: "/admin/users",
      icon: <User size={20} />,
      label: "User",
    },
    
   
    {
      key: "/admin/wallet",
      icon: <Wallet size={20} />,
      label: "Wallet",
    },
    {
      key: "/admin/subscription",
      icon: <CreditCard size={20} />,
      label: "Subscription",
    },
    {
      key: "/admin/referral",
      icon: <BookmarkCheck size={20} />, // Reverted to BookmarkCheck
      label: "Referral",
    },
    {
      key: "/admin/reviews",
      icon: <Star size={20} />,
      label: "Reviews",
    },
    {
      key: "/admin/add-category",
      icon: <MdAddCircleOutline size={20} />,
      label: "Add Category",
    },
    {
      key: "/admin/profile",
      icon: <Settings size={20} />,
      label: "Profile",
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
          boxShadow: "2px 0 5px rgba(0,0,0,0.06)",
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
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src="/placeholder.svg?height=40&width=40"
                        alt="User Avatar"
                      />
                      <AvatarFallback>AG</AvatarFallback>
                    </Avatar>
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

export default AdminLayout;
