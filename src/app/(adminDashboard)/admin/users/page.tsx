/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Swal from "sweetalert2";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Star, Trash2, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useGetAllTraderListQuery } from "@/redux/service/customerApi";


// ======= Types =======
interface TraderProfile {
  id: string;
  fastName: string;
  lastName: string;
  isVerified: boolean;
  user: {
    id: string;
    username: string;
    email: string;
    contactNo: string;
    isVerified: boolean;
    role: string;
  };
}

interface GetUserListResponse {
  message: string;
  success: boolean;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  } | null;
  data: TraderProfile[];
}

type UserStatus = "Verified" | "Unverified" | "Processing";

export default function Users() {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // Fetch all users (no pagination from backend)
  const {
    data: apiData,
    isLoading: isUserLoading,
    error: userError,
  } = useGetAllTraderListQuery(); 

  console.log(apiData);



  // Flatten and prepare data
  const allUsers = useMemo(() => {
    return apiData?.data || [];
  }, [apiData]);

  // Frontend Search Filter
  const filteredUsers = useMemo(() => {
    if (!searchText.trim()) return allUsers;

    const term = searchText.toLowerCase().trim();
    return allUsers.filter((user:any) => {
      const fullName = `${user.fastName} ${user.lastName}`.toLowerCase();
      return (
        user.user.username.toLowerCase().includes(term) ||
        user.user.email.toLowerCase().includes(term) ||
        user.user.contactNo.includes(term) ||
        fullName.includes(term)
      );
    });
  }, [allUsers, searchText]);

  // Frontend Pagination
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, currentPage, pageSize]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  // Status logic
  const getUserStatus = (user: TraderProfile): UserStatus => {
    if (user.isVerified && user.user.isVerified) return "Verified";
    if (!user.isVerified || !user.user.isVerified) return "Unverified";
    return "Processing";
  };

  const statusColors: Record<UserStatus, string> = {
    Verified: "bg-green-100 text-green-800 border border-green-200",
    Unverified: "bg-orange-100 text-orange-800 border border-orange-200",
    Processing: "bg-blue-100 text-blue-800 border border-blue-200",
  };

  // Handle remove user
  const handleRemoveUser = (id: string, username: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to remove user: ${username}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success(`${username} has been removed.`);
        // 🚧 Optional: Trigger delete mutation
      }
    });
  };

  if (userError) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Failed to load users. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="bg-white w-full rounded-lg shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b gap-4">
        <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search locally..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10 w-full border-gray-200 focus-visible:ring-2"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="text-gray-700 font-medium">User ID</TableHead>
              <TableHead className="text-gray-700 font-medium">Name</TableHead>
              <TableHead className="text-gray-700 font-medium">Username</TableHead>
              <TableHead className="text-gray-700 font-medium">Email</TableHead>
              <TableHead className="text-gray-700 font-medium">Phone</TableHead>
              <TableHead className="text-gray-700 font-medium">Status</TableHead>
              <TableHead className="text-gray-700 font-medium">Review</TableHead>
              <TableHead className="text-gray-700 font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isUserLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                  No users match your search.
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user:any) => {
                const fullName = `${user.fastName} ${user.lastName}`.trim();
                const status = getUserStatus(user);

                return (
                  <TableRow
                    key={user.id}
                    className="hover:bg-gray-25 transition-colors duration-150"
                  >
                    <TableCell className="font-mono text-sm text-gray-600">{user.id}</TableCell>
                    <TableCell className="font-medium text-gray-900">{fullName || "No Name"}</TableCell>
                    <TableCell className="text-gray-700">{user.user.username}</TableCell>
                    <TableCell className="text-gray-700">{user.user.email}</TableCell>
                    <TableCell className="text-gray-700">{user.user.contactNo || "-"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className={`px-3 py-1 rounded-md text-xs font-medium ${statusColors[status]} hover:opacity-90 transition`}
                          >
                            {status}
                            <ChevronDown className="w-3 h-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem>Verified</DropdownMenuItem>
                          <DropdownMenuItem>Unverified</DropdownMenuItem>
                          <DropdownMenuItem>Processing</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-700">4.8</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveUser(user.id, user.user.username)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
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
            disabled={currentPage === 1 || isUserLoading}
            className="w-8 h-8"
          >
            ‹
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                size="icon"
                className={`w-8 h-8 ${
                  currentPage === page
                    ? "bg-slate-700 hover:bg-slate-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setCurrentPage(page)}
                disabled={isUserLoading}
              >
                {page}
              </Button>
            );
          })}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage >= totalPages || isUserLoading}
            className="w-8 h-8"
          >
            ›
          </Button>
        </div>
      </div>
    </div>
  );
}