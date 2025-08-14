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

const ForPc = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  // ✅ Get role from Redux
  const role = useSelector((state: RootState) => state.auth.user?.role);

  // ✅ Get auth status
  const sign = useSelector((state: any) => state.auth.accessToken);

  const categories = [
    {
      title: "Home Services",
      items: [
        { name: "Roofing", href: "/categories/roofing" },
        { name: "Siding", href: "/categories/siding" },
        { name: "Windows", href: "/categories/windows" },
        { name: "Gutters", href: "/categories/gutters" },
      ],
    },
    {
      title: "Commercial Services",
      items: [
        { name: "Commercial Roofing", href: "/categories/commercial-roofing" },
        { name: "Building Maintenance", href: "/categories/maintenance" },
        { name: "Property Management", href: "/categories/property" },
        { name: "Emergency Services", href: "/categories/emergency" },
      ],
    },
    {
      title: "Specialized Services",
      items: [
        { name: "Solar Installation", href: "/categories/solar" },
        { name: "Insulation", href: "/categories/insulation" },
        { name: "Waterproofing", href: "/categories/waterproofing" },
        { name: "HVAC", href: "/categories/hvac" },
      ],
    },
    {
      title: "Popular Services",
      items: [
        { name: "Roof Inspection", href: "/categories/inspection" },
        { name: "Storm Damage", href: "/categories/storm-damage" },
        { name: "Maintenance Plans", href: "/categories/maintenance-plans" },
        { name: "Free Estimates", href: "/categories/estimates" },
      ],
    },
  ];

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/all-services", label: "Browse Tasks" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact-us", label: "Contact" },
  ];

  return (
    <div className="bg-[#1C2A47] z-50 w-full shadow-md fixed top-0">
      <div className="container mx-auto hidden lg:flex py-0 items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link href="/">
          <div className="relative w-10 h-10 bg-orange-500 rounded-full overflow-hidden cursor-pointer">
            <Image
              src="/logo.jpg"
              alt="Company Logo"
              fill
              className="object-cover"
              priority
            />
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
                    pathname === link.href
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
            <DropdownMenuContent className="w-[800px] p-6 bg-white rounded-lg shadow-lg border">
              <div className="grid grid-cols-4 gap-6">
                {categories.map((category, index) => (
                  <div key={index}>
                    <h5 className="text-slate-700 mb-3 uppercase tracking-wide text-xs font-semibold">
                      {category.title}
                    </h5>
                    <div className="space-y-2">
                      {category.items.map((item, i) => (
                        <Link
                          key={i}
                          href={item.href}
                          className={`block p-3 rounded-md transition-colors duration-200 no-underline ${
                            pathname === item.href
                              ? "bg-orange-100 text-orange-600 font-semibold"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="text-sm font-medium">{item.name}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link
                  href="/categories"
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  View all categories →
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
              Other Services
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
          <Link href="/favorite">
            <Button
              variant="ghost"
              className={`h-auto p-0 hover:bg-transparent align-middle ${
                pathname === "/favorite"
                  ? "text-orange-400"
                  : "text-white hover:text-orange-300"
              }`}
            >
              <Heart className="h-8 w-8" />
            </Button>
          </Link>

          {/* Auth Menu */}
          {sign ? (
            <Dropdown
              menu={{
                items: [
                  {
                    key: "1",
                    label: <Link href="/profile">My Profile</Link>,
                  },
                  {
                    key: "2",
                    label: <h1 onClick={handleLogout}>Logout</h1>,
                  },
                  {
                    key: "3",
                    label: (
                      <Link
                        href={
                          role?.toLowerCase() === "admin"
                            ? "/admin"
                            : "/dashboard"
                        }
                      >
                        Dashboard
                      </Link>
                    ),
                  },
                ],
              }}
              placement="bottomRight"
              arrow
            >
              <div className="cursor-pointer">
                <Avatar
                  style={{
                    backgroundColor: "#E57931",
                    verticalAlign: "middle",
                  }}
                  icon={<UserOutlined />}
                  size="large"
                />
              </div>
            </Dropdown>
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
