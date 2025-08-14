/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Swal from "sweetalert2"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Search, Star, Trash2, ChevronDown } from "lucide-react"
import { debounce } from "lodash"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

type UserStatus = "Processing" | "Verified" | "Cancel"

interface User {
  id: string
  userName: string
  userEmail: string
  phoneNumber: string
  status: UserStatus
  review: number
}

export default function Users() {
  const [searchText, setSearchText] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState(searchText)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 9 // Changed to 9 to match the image
  const [usersData, setUsersData] = useState<{
    data: User[]
    total: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fake API
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      await new Promise((res) => setTimeout(res, 500))

      const allUsers: User[] = [
        {
          id: "12345",
          userName: "Tatiana Franci",
          userEmail: "user@email.com",
          phoneNumber: "0123456789",
          status: "Processing" as UserStatus,
          review: 5.0,
        },
        {
          id: "67890",
          userName: "Tatiana Franci",
          userEmail: "user@email.com",
          phoneNumber: "0123456789",
          status: "Verified" as UserStatus,
          review: 5.0,
        },
        {
          id: "54321",
          userName: "Tatiana Franci",
          userEmail: "user@email.com",
          phoneNumber: "0123456789",
          status: "Verified" as UserStatus,
          review: 5.0,
        },
        {
          id: "01234",
          userName: "Tatiana Franci",
          userEmail: "user@email.com",
          phoneNumber: "0123456789",
          status: "Verified" as UserStatus,
          review: 5.0,
        },
        {
          id: "01235",
          userName: "Tatiana Franci",
          userEmail: "user@email.com",
          phoneNumber: "0123456789",
          status: "Cancel" as UserStatus,
          review: 5.0,
        },
        {
          id: "01236",
          userName: "Tatiana Franci",
          userEmail: "user@email.com",
          phoneNumber: "0123456789",
          status: "Processing" as UserStatus,
          review: 5.0,
        },
        {
          id: "01237",
          userName: "Tatiana Franci",
          userEmail: "user@email.com",
          phoneNumber: "0123456789",
          status: "Processing" as UserStatus,
          review: 5.0,
        },
        {
          id: "01238",
          userName: "Tatiana Franci",
          userEmail: "user@email.com",
          phoneNumber: "0123456789",
          status: "Cancel" as UserStatus,
          review: 5.0,
        },
        {
          id: "01239",
          userName: "Tatiana Franci",
          userEmail: "user@email.com",
          phoneNumber: "0123456789",
          status: "Processing" as UserStatus,
          review: 5.0,
        },
        // Add more users for pagination
        {
          id: "01240",
          userName: "John Smith",
          userEmail: "john@email.com",
          phoneNumber: "0987654321",
          status: "Verified" as UserStatus,
          review: 4.8,
        },
        {
          id: "01241",
          userName: "Jane Doe",
          userEmail: "jane@email.com",
          phoneNumber: "0555123456",
          status: "Processing" as UserStatus,
          review: 4.9,
        },
        {
          id: "01242",
          userName: "Mike Johnson",
          userEmail: "mike@email.com",
          phoneNumber: "0444987654",
          status: "Cancel" as UserStatus,
          review: 4.5,
        },
      ]

      const filtered = allUsers.filter(
        (user) =>
          user.id.includes(debouncedSearch) ||
          user.userName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          user.userEmail.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          user.status.toLowerCase().includes(debouncedSearch.toLowerCase()),
      )

      const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

      setUsersData({ data: paginated, total: filtered.length })
      setIsLoading(false)
    }

    fetchUsers()
  }, [debouncedSearch, currentPage, pageSize])

  const debouncedSetSearch = useMemo(
    () =>
      debounce((val: string) => {
        setDebouncedSearch(val)
      }, 400),
    [],
  )

  useEffect(() => {
    debouncedSetSearch(searchText)
  }, [searchText, debouncedSetSearch])

  const users = usersData?.data || []
  const total = usersData?.total || 0

  const statusColors: Record<UserStatus, string> = {
    Processing: "bg-blue-100 text-blue-600 border border-blue-200",
    Verified: "bg-green-100 text-green-600 border border-green-200",
    Cancel: "bg-orange-100 text-orange-600 border border-orange-200",
  }

  const handleRemoveUser = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to remove user ID: ${id}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success(`User ${id} removed successfully`)
      }
    })
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="bg-white w-full">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">All User</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search orders..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10 w-64 border-gray-200"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-700 hover:bg-slate-700">
              <TableHead className="text-white font-medium">User ID</TableHead>
              <TableHead className="text-white font-medium">User name</TableHead>
              <TableHead className="text-white font-medium">User Email</TableHead>
              <TableHead className="text-white font-medium">Phone number</TableHead>
              <TableHead className="text-white font-medium">Status</TableHead>
              <TableHead className="text-white font-medium">Documents</TableHead>
              <TableHead className="text-white font-medium">Review</TableHead>
              <TableHead className="text-white font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-24">
                  Loading...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-24">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow key={user.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <TableCell className="font-medium text-gray-900">{user.id}</TableCell>
                  <TableCell className="text-gray-700">{user.userName}</TableCell>
                  <TableCell className="text-gray-700">{user.userEmail}</TableCell>
                  <TableCell className="text-gray-700">{user.phoneNumber}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`px-3 py-1 rounded-md text-sm font-medium ${statusColors[user.status]} hover:opacity-80`}
                        >
                          {user.status}
                          <ChevronDown className="w-3 h-3 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem>Processing</DropdownMenuItem>
                        <DropdownMenuItem>Verified</DropdownMenuItem>
                        <DropdownMenuItem>Cancel</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      className="bg-slate-700 hover:bg-slate-800 text-white px-3 py-1 rounded-md text-sm font-medium"
                    >
                      Documents
                      <Download className="w-4 h-4 ml-1" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                      <span className="text-sm font-medium text-gray-700">{user.review.toFixed(1)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveUser(user.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center py-6 border-t bg-gray-50">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8"
          >
            ‹
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNumber = i + 1
            return (
              <Button
                key={pageNumber}
                variant={currentPage === pageNumber ? "default" : "ghost"}
                size="icon"
                className={`w-8 h-8 ${
                  currentPage === pageNumber
                    ? "bg-slate-700 text-white hover:bg-slate-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setCurrentPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            )
          })}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage >= totalPages}
            className="w-8 h-8"
          >
            ›
          </Button>
        </div>
      </div>
    </div>
  )
}
