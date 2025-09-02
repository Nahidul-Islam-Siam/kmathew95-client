/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Heart, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/features/auth";
import type { RootState } from "@/redux/store";
import { useGetSubCategoryQuery } from "@/redux/service/admin/category";
import { useEffect, useState } from "react";
import { useGetUserQuery } from "@/redux/service/userApi";

const ForPc = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  // ✅ Auth state
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.accessToken);

  // ✅ Fetch logged-in user data
  const { data: userApiData } = useGetUserQuery(undefined, {
    skip: !isAuthenticated,
  });

  // ✅ Fetch subcategories
  const { data: subCategoryData, isLoading } = useGetSubCategoryQuery();

  // State: grouped categories
  const [groupedCategories, setGroupedCategories] = useState<
    { categoryId: string; categoryName: string; subcategories: Array<{ id: string; name: string; href: string }> }[]
  >([]);

  // Group subcategories and create query-param-based href
  useEffect(() => {
    if (subCategoryData?.data?.data) {
      const subcategories = subCategoryData.data.data;
      const groupMap = new Map<string, { categoryId: string; categoryName: string; subcategories: any[] }>();

      subcategories.forEach((sub: any) => {
        const categoryId = sub.categoryId;
        const categoryName = sub.category?.name || "Other Services";

        if (!groupMap.has(categoryId)) {
          groupMap.set(categoryId, {
            categoryId,
            categoryName,
            subcategories: [],
          });
        }

        // ✅ Create URL with encoded category name: "Wireframing & Prototyping" → query param
        const encodedCategory = encodeURIComponent(sub.name); // Handles & → %26, spaces → +
        const href = `/all-services?category=${encodedCategory}`;

        groupMap.get(categoryId)?.subcategories.push({
          id: sub.id,
          name: sub.name,
          href,
        });
      });

      const groupedArray = Array.from(groupMap.values()).sort((a, b) =>
        a.categoryName.localeCompare(b.categoryName)
      );

      setGroupedCategories(groupedArray);
    }
  }, [subCategoryData]);

  // === Nav Links with active logic ===
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/all-services", label: "Browse Tasks" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact-us", label: "Contact" },
  ];

  // Helper to determine active state (for top nav)
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <div className="bg-[#1C2A47] z-50 w-full shadow-md fixed top-0">
      <div className="container mx-auto hidden lg:flex py-0 items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link href="/">
          <div className="relative w-10 h-10 bg-orange-500 rounded-full overflow-hidden cursor-pointer">
            <Image src="/logo.jpg" alt="Company Logo" fill className="object-cover" priority />
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-16">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`h-auto p-0 hover:bg-transparent text-[15px] ${
                    isActive(link.href)
                      ? "text-orange-400 font-semibold"
                      : "text-white hover:text-orange-300"
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Categories Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-white hover:text-orange-300 h-auto px-2 py-2 rounded-full"
              >
                <LayoutGrid className="mr-2 h-4 w-4" />
                Categories
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[800px] p-6 bg-white rounded-lg shadow-lg border max-h-96 overflow-y-auto"
              align="start"
            >
              {isLoading ? (
                <p className="text-gray-500">Loading services...</p>
              ) : groupedCategories.length === 0 ? (
                <p className="text-gray-500">No services available</p>
              ) : (
                <div className="grid grid-cols-4 gap-6">
                  {groupedCategories.map((group) => (
                    <div key={group.categoryId}>
                      <h5 className="text-slate-700 mb-3 uppercase tracking-wide text-xs font-semibold">
                        {group.categoryName}
                      </h5>
                      <div className="space-y-2">
                        {group.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            href={sub.href} // ✅ e.g., /all-services?category=Wireframing+%26+Prototyping
                            className={`block p-3 rounded-md transition-colors duration-200 no-underline ${
                              pathname === "/all-services" &&
                              new URLSearchParams(window.location.search).get("category") === sub.name
                                ? "bg-orange-100 text-orange-600 font-semibold"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div className="text-sm font-medium">{sub.name}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link
                  href="/all-services"
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  View all services →
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Other Links */}
          <Link href="/all-traders">
            <Button
              variant="ghost"
              className={`h-auto p-0 hover:bg-transparent ${
                pathname === "/all-traders"
                  ? "text-orange-400 font-semibold"
                  : "text-white hover:text-orange-300"
              }`}
            >
              All Traders
            </Button>
          </Link>
          <Link href="/post-task">
            <Button
              variant="ghost"
              className={`h-auto p-0 hover:bg-transparent ${
                pathname === "/post-task"
                  ? "text-orange-400 font-semibold"
                  : "text-white hover:text-orange-300"
              }`}
            >
              Post a Task
            </Button>
          </Link>

          {/* Favorite Icon */}
          <Link href="/favorite">
            <Heart className="h-6 w-6 text-white hover:text-red-300 cursor-pointer" />
          </Link>

          {/* Authenticated User Menu */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "1",
                      label: (
                        <Link href={role === "ADMIN" ? "/admin/profile" : "/dashboard/profile"}>
                          My Profile
                        </Link>
                      ),
                    },
                    {
                      key: "3",
                      label: (
                        <Link href={role === "ADMIN" ? "/admin" : "/dashboard"}>
                          Dashboard
                        </Link>
                      ),
                    },
                    {
                      key: "2",
                      label: <span onClick={handleLogout}>Logout</span>,
                    },
                  ],
                }}
                placement="bottomRight"
                arrow
              >
                <Avatar
                  src={userApiData?.data?.avatar}
                  alt="User Avatar"
                  style={{ backgroundColor: "#E57931" }}
                  size="large"
                  icon={!userApiData?.data?.avatar ? <UserOutlined /> : null}
                  className="cursor-pointer"
                />
              </Dropdown>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  className={`h-auto p-0 hover:bg-transparent ${
                    pathname === "/login"
                      ? "text-orange-400 font-semibold"
                      : "text-white hover:text-orange-300"
                  }`}
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-white text-slate-800 rounded-2xl border-white hover:bg-gray-100 hover:text-slate-900 hover:border-gray-100">
                  Join
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForPc;