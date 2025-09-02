/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LayoutGrid, ChevronRight, ChevronDown, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetSubCategoryQuery } from "@/redux/service/admin/category";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/features/auth";
import type { RootState } from "@/redux/store";
import { usePathname, useSearchParams } from "next/navigation"; // ✅ SSR-safe routing

// 🔁 Temporary map: categoryId → readable name
// Replace when backend returns category names
const CATEGORY_NAME_MAP: Record<string, string> = {
  "68ad19473af9fbf6b9e6b3a9": "Artificial Intelligence",
  "68ad192a3af9fbf6b9e6b3a8": "Design & UX",
  "68ad19113af9fbf6b9e6b3a7": "Data & Analytics",
  "64ecf4b95a5c2d9c2a1ebf90": "Development",
  "64ecf4c75a5c2d9c2a1ebf91": "Marketing",
  "64ecf4d05a5c2d9c2a1ebf92": "Writing & Translation",
  "64ecf4d95a5c2d9c2a1ebf93": "Video & Animation",
  "64ecf4e25a5c2d9c2a1ebf94": "Finance & Accounting",
};

// === Types ===
interface SubCategory {
  id: string;
  name: string;
  categoryId: string;

  category?: {
    name: string;
    id: string;
    
  };
}

interface MobileMenuItemProps {
  label: string;
  href?: string;
  icon?: React.ElementType | null;
  subItems?: { key: string; label: string; href: string }[];
  onCloseDrawer: () => void;
  isActive?: boolean;
}

// === Mobile MenuItem Component ===
const MobileMenuItem: React.FC<MobileMenuItemProps> = ({
  label,
  href,
  icon: Icon,
  subItems,
  onCloseDrawer,
  isActive = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (subItems && subItems.length > 0) {
    return (
      <div className="border-b border-gray-200">
        <button
          className="flex items-center justify-between w-full py-3 px-4 text-gray-900 hover:bg-gray-100 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center gap-2 font-medium">
            {Icon && <Icon className="h-5 w-5" />}
            {label}
          </span>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {isOpen && (
          <div className="grid gap-1 pl-8 py-2 bg-gray-50">
            {subItems.map((child) => (
              <Link
                key={child.key}
                href={child.href}
                className={`block py-2 px-4 rounded-md transition-colors ${
                  isActive
                    ? "text-orange-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={onCloseDrawer}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={href || "#"}
      className={`flex items-center gap-2 py-3 px-4 border-b border-gray-200 transition-colors ${
        isActive
          ? "text-orange-600 font-semibold bg-orange-50"
          : "text-gray-900 hover:bg-gray-100"
      }`}
      onClick={onCloseDrawer}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {label}
    </Link>
  );
};

// === ForMobile Component ===
const ForMobile = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    setIsDrawerOpen(false);
  };

  // ✅ Auth state (declared only once)
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.accessToken);
  const role = useSelector((state: RootState) => state.auth.user?.role);

  // ✅ Fetch subcategories
  const { data: subCategoryData, isLoading, isError } = useGetSubCategoryQuery();

  // Grouped categories state
  const [groupedCategories, setGroupedCategories] = useState<
    { categoryId: string; categoryName: string; items: { key: string; label: string; href: string }[] }[]
  >([]);

  // Group subcategories by category
  useEffect(() => {
    if (subCategoryData?.data?.data) {
      const subcategories: SubCategory[] = subCategoryData.data.data;
      const groupMap = new Map<string, { categoryId: string; categoryName: string; items: any[] }>();

      subcategories.forEach((sub) => {
        const categoryId = sub.categoryId;
        const categoryName = CATEGORY_NAME_MAP[categoryId] || sub.category?.name || "Other Services";

        if (!groupMap.has(categoryId)) {
          groupMap.set(categoryId, {
            categoryId,
            categoryName,
            items: [],
          });
        }

        // ✅ Use query param to match PC behavior: /all-services?category=...
        const encodedName = encodeURIComponent(sub.name);
        const href = `/all-services?category=${encodedName}`;

        groupMap.get(categoryId)?.items.push({
          key: sub.id,
          label: sub.name,
          href,
        });
      });

      const groupedArray = Array.from(groupMap.values()).sort((a, b) =>
        a.categoryName.localeCompare(b.categoryName)
      );

      setGroupedCategories(groupedArray);
    }
  }, [subCategoryData]);

  // ✅ Use Next.js navigation hooks for SSR safety
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  // ✅ Active link detection
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/all-services") return pathname === "/all-services";
    return pathname === href;
  };

  // ✅ Menu Items
  type MenuItem = {
    key: string;
    label: string;
    href?: string;
    icon?: React.ElementType | null;
    subItems?: { key: string; label: string; href: string; subItems?: any }[];
    onClick?: () => void;
  };

  const menuItems: MenuItem[] = [
    { key: "home", label: "Home", href: "/", icon: null },
    { key: "browse", label: "Browse Tasks", href: "/all-services", icon: null },
    { key: "pricing", label: "Pricing", href: "/pricing", icon: null },
    { key: "contact", label: "Contact", href: "/contact-us", icon: null },
    { key: "traders", label: "All Traders", href: "/all-traders", icon: null },
    { key: "post-task", label: "Post a Task", href: "/post-task", icon: null },
    {
      key: "categories",
      label: "Categories",
      icon: LayoutGrid,
      subItems: isLoading
        ? [{ key: "loading", label: "Loading...", href: "#" }]
        : isError
        ? [{ key: "error", label: "Failed to load", href: "#" }]
        : groupedCategories.length === 0
        ? [{ key: "no-cat", label: "No services available", href: "#" }]
        : groupedCategories.map((group) => ({
            key: group.categoryId,
            label: group.categoryName,
            href: "#",
            subItems: group.items,
          })),
    },
    { key: "favorite", label: "Favorite", href: "/favorite", icon: Heart },
  ];

  // ✅ Authenticated / Guest Items
  const authItems = isAuthenticated
    ? [
        {
          key: "profile",
          label: "My Profile",
          href: role === "ADMIN" ? "/admin/profile" : "/dashboard/profile",
          icon: User,
        },
        {
          key: "dashboard",
          label: "Dashboard",
          href: role === "ADMIN" ? "/admin" : "/dashboard",
          icon: null,
        },
        { key: "logout", label: "Logout", href: "#", onClick: handleLogout, icon: null },
      ]
    : [{ key: "sign-in", label: "Sign in", href: "/login", icon: User }];

  return (
    <div className="flex justify-between items-center px-4 lg:hidden bg-[#1C2A47] h-16 text-white">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <div className="relative w-10 h-10 bg-orange-500 rounded-full overflow-hidden">
          <Image src="/logo.jpg" alt="Company Logo" fill className="object-cover" priority />
        </div>
      </Link>

      {/* Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:text-orange-300"
        onClick={() => setIsDrawerOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={24} />
      </Button>

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Sidebar */}
          <div className="relative w-3/4 max-w-sm bg-white h-full shadow-xl animate-in slide-in-from-left">
            {/* Header */}
            <div className="bg-[#1C2A47] p-4 border-b border-gray-200 flex items-center justify-between">
              <Link href="/" onClick={() => setIsDrawerOpen(false)}>
                <div className="relative w-10 h-10 bg-orange-500 rounded-full overflow-hidden">
                  <Image src="/logo.jpg" alt="Company Logo" fill className="object-cover" />
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDrawerOpen(false)}
                className="text-white hover:text-orange-300"
                aria-label="Close menu"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-2">
              {menuItems.map((item) => (
                <MobileMenuItem
                  key={item.key}
                  label={item.label}
                  href={item.href}
                  icon={item.icon}
                  subItems={
                    item.subItems?.flatMap((sub: any) =>
                      sub.subItems ? sub.subItems : [sub]
                    ) as any
                  }
                  onCloseDrawer={() => {
                    if (item.onClick) {
                      item.onClick();
                    }
                    setIsDrawerOpen(false);
                  }}
                  isActive={isActive(item.href ?? "")}
                />
              ))}

              {/* Auth Section */}
              <div className="border-t border-gray-200 mt-4 pt-2">
                {authItems.map((item) => (
                  <MobileMenuItem
                    key={item.key}
                    label={item.label}
                    href={item.href}
                    icon={item.icon}
                    onCloseDrawer={() => {
                      if (item.onClick) {
                        item.onClick();
                      } else {
                        setIsDrawerOpen(false);
                      }
                    }}
                    isActive={isActive(item.href)}
                  />
                ))}
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              {!isAuthenticated ? (
                <Link href="/signup" onClick={() => setIsDrawerOpen(false)}>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    Join Now
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  className="w-full text-gray-700"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForMobile;