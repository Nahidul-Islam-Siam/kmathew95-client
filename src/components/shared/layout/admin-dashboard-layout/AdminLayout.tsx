/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { ReactNode } from "react";

import { Layout, Menu, Spin } from "antd";
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
import { MdAddCircleOutline } from "react-icons/md";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetUserQuery } from "@/redux/service/userApi";

const { Sider, Content, Header } = Layout;

// Types based on your API response
interface Admin {
  fastName: string;
  lastName: string;
  userId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
  contactNo: string;
  description: string;
  lang: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  admin?: Admin;
  data?: any;
}

interface UserApiResponse {
  success: boolean;
  message: string;
  data: UserData;
  meta: null | unknown;
  isLoading: boolean;
  isError: boolean;
}

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Fetch user data
  const { data: apiResponse, isLoading, isError } = useGetUserQuery<UserApiResponse>();

  // Extract user from response
  const userData = apiResponse?.data;

  // Fallback values
  const fallbackName = "User";

  // Extract name parts safely
  const fastName = userData?.admin?.fastName || "";
  const lastName = userData?.admin?.lastName || "";
  const fullName = fastName && lastName
    ? `${fastName} ${lastName}`
    : userData?.username || fallbackName;

  const displayName = fullName;
  const displayEmail = userData?.email || "user@example.com";
  const avatarUrl = userData?.avatar || null;
  const role = userData?.role || "USER";

  // Generate initials for fallback avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    console.log("Logging out...");
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
      label: "Dashboard",
    },
    // {
    //   key: "/admin/tasks-post",
    //   icon: <MdAddCircleOutline size={20} />,
    //   label: "Tasks Post",
    // },
    {
      key: "/admin/users",
      icon: <User size={20} />,
      label: "Users",
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
    // {
    //   key: "/admin/referral",
    //   icon: <BookmarkCheck size={20} />,
    //   label: "Referral",
    // },
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

  // Optional: Show loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p><Spin size="small" /></p>
      </div>
    );
  }

  // Optional: Handle error
  if (isError || !userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Failed to load user. Please log in again....</p>
      </div>
    );
  }

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
                Skill<span style={{ color: "#E57931" }}>Switch</span>
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

        {/* Logout Section */}
        <div className="p-4" style={{ marginTop: "auto" }}>
          <div
            onClick={handleLogout}
            className="flex items-center gap-2 cursor-pointer font-medium text-[15px]"
            style={{ color: "#ef4444" }}
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
            {/* Welcome Text */}
            <h1
              className="hidden md:block text-lg font-semibold"
              style={{ color: "#092c4c" }}
            >
              Welcome back, <span className="capitalize">{fastName.toLowerCase()}</span>
            </h1>

            {/* User Dropdown */}
            <div className="flex justify-center items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Avatar className="h-10 w-10 border border-gray-200">
                      <AvatarImage src={avatarUrl || undefined} alt={displayName} />
                      <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start justify-center">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#374151" }}
                      >
                        {displayName}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "#6b7280" }}
                      >
                        {role}
                      </span>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
     
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600"
                  >
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
            padding: "24px",
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