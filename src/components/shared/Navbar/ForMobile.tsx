"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, LayoutGrid, ChevronRight, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"

// Collapsible menu component
interface MobileMenuItemProps {
  label: string
  href?: string
  icon?: React.ElementType
  subItems?: { key: string; label: string; href: string }[]
  onCloseDrawer: () => void
}

const MobileMenuItem: React.FC<MobileMenuItemProps> = ({ label, href, icon: Icon, subItems, onCloseDrawer }) => {
  const [isOpen, setIsOpen] = useState(false)

  if (subItems && subItems.length > 0) {
    return (
      <div className="border-b border-gray-200">
        <button
          className="flex items-center justify-between w-full py-3 px-4 text-gray-900 hover:bg-gray-100 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5" />}
            {label}
          </span>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {isOpen && (
          <div className="grid gap-2 pl-8 py-2 bg-gray-50">
            {subItems.map((child) => (
              <Link
                key={child.key}
                href={child.href}
                className="block py-2 px-4 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={onCloseDrawer}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={href || "#"}
      className="flex items-center gap-2 py-3 px-4 text-gray-900 hover:bg-gray-100 transition-colors border-b border-gray-200"
      onClick={onCloseDrawer}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {label}
    </Link>
  )
}

const ForMobile = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const mobileMenuItems = [
    { key: "home", label: "Home", href: "/" },
    { key: "browse-task", label: "Browse Task", href: "/all-services" },
    { key: "pricing", label: "Pricing", href: "/pricing" },
    { key: "contact", label: "Contact", href: "/contact-us" },
    { key: "other-services", label: "Other Services", href: "/all-traders" },
    {
      key: "categories",
      label: "Categories",
      icon: LayoutGrid,
      subItems: [
        { key: "roofing", label: "Roofing", href: "/categories/roofing" },
        { key: "siding", label: "Siding", href: "/categories/siding" },
        { key: "windows", label: "Windows", href: "/categories/windows" },
        { key: "gutters", label: "Gutters", href: "/categories/gutters" },
      ],
    },
    { key: "post-task", label: "Post a Task", href: "/post-task" },
    { key: "favorite", label: "Favorite", href: "/favorite" },
    { key: "sign-in", label: "Sign in", href: "/login" },
  ]

  return (
    <div className="flex justify-between items-center px-4 lg:hidden bg-[#1C2A47] h-16">
      {/* Logo */}
      <Link href={"/"}>
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
      >
        <Menu size={24} />
      </Button>

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/80" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative flex flex-col w-3/4 max-w-sm bg-white h-full animate-in slide-in-from-left">
            {/* Header */}
            <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
              <div className="relative w-10 h-10 bg-orange-500 rounded-full overflow-hidden">
                <Image
                  src="/logo.jpg"
                  alt="Company Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDrawerOpen(false)}
                className="text-white hover:text-orange-300"
              >
                <X size={24} />
              </Button>
            </div>


            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto">
              {mobileMenuItems.map((item) => (
                <MobileMenuItem
                  key={item.key}
                  label={item.label}
                  href={item.href}
                  icon={item.icon}
                  subItems={item.subItems}
                  onCloseDrawer={() => setIsDrawerOpen(false)}
                />
              ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <Link href="/signup">
                <Button
                  variant="default"
                  size="lg"
                  className="w-full bg-orange-500 border-orange-500 hover:bg-orange-600"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ForMobile
