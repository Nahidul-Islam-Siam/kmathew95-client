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
  SubscriptIcon,
  User,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

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
import { Skeleton } from "@/components/ui/skeleton";

const { Sider, Content, Header } = Layout;

const UserAdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Fetch user data
  const { data: userData, isLoading } = useGetUserQuery();

  // Extract user and trader data
  const user = userData?.data;
  const trader = user?.trader;

  // Derived values
  const fullName = [trader?.fastName, trader?.lastName].filter(Boolean).join(" ") || user?.username || "User";
  const role = user?.role || "User";
  const avatar = user?.avatar || "/images/profiles/avatar1.png";

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
      key: "/dashboard/subscription",
      icon: <SubscriptIcon size={20} />,
      label: "Subscriptions",
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
      key: "/dashboard/stripe-dashboard",
      icon: <Wallet size={20} />,
      label: "Stripe Dashboard",
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
                SkillSwitch
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
            <h1
              className="hidden md:block text-lg font-semibold"
              style={{ color: "#092c4c" }}
            >
              Welcome back, <span className="capitalize">{fullName}</span>
            </h1>

            <div className="flex justify-center items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    {isLoading ? (
                      <Skeleton className="h-10 w-10 rounded-full" />
                    ) : (
                      <Avatar className="w-10 h-10 border border-gray-200">
                        <AvatarImage src={avatar} alt={fullName} />
                        <AvatarFallback className="bg-slate-700 text-white">
                          {fullName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className="flex flex-col items-start justify-center">
                      {isLoading ? (
                        <>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </>
                      ) : (
                        <>
                          <span
                            className="text-sm font-medium"
                            style={{ color: "#374151" }}
                          >
                            {fullName}
                          </span>
                          <span className="text-xs" style={{ color: "#6b7280" }}>
                            {role}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                 
            
            
           
           
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
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
            padding: 24,
            background: "#f9fafb",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserAdminLayout;