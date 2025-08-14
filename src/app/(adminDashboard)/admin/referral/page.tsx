/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

import { Search, MoreHorizontal, Copy, Eye, Trash2 } from "lucide-react"
import { debounce } from "lodash"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Referral {
  id: string
  userId: string
  userName: string
  referralLink: string
  countsUser: number
  earnings: string
}

export default function ReferralPage() {
  const [searchText, setSearchText] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState(searchText)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const [referralsData, setReferralsData] = useState<{
    data: Referral[]
    total: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fake API
  useEffect(() => {
    const fetchReferrals = async () => {
      setIsLoading(true)
      await new Promise((res) => setTimeout(res, 500))

      const allReferrals: Referral[] = [
        {
          id: "1",
          userId: "12345",
          userName: "Jocelyn Kenter",
          referralLink: "https://referral.com...",
          countsUser: 12,
          earnings: "123$",
        },
        {
          id: "2",
          userId: "12345",
          userName: "Jocelyn Kenter",
          referralLink: "https://referral.com...",
          countsUser: 25,
          earnings: "123$",
        },
        {
          id: "3",
          userId: "12345",
          userName: "Jocelyn Kenter",
          referralLink: "https://referral.com...",
          countsUser: 2,
          earnings: "123$",
        },
        {
          id: "4",
          userId: "12345",
          userName: "Jocelyn Kenter",
          referralLink: "https://referral.com...",
          countsUser: 5,
          earnings: "123$",
        },
        {
          id: "5",
          userId: "12345",
          userName: "Jocelyn Kenter",
          referralLink: "https://referral.com...",
          countsUser: 80,
          earnings: "123$",
        },
        {
          id: "6",
          userId: "12345",
          userName: "Jocelyn Kenter",
          referralLink: "https://referral.com...",
          countsUser: 6,
          earnings: "123$",
        },
        {
          id: "7",
          userId: "12345",
          userName: "Jocelyn Kenter",
          referralLink: "https://referral.com...",
          countsUser: 50,
          earnings: "123$",
        },
        {
          id: "8",
          userId: "12345",
          userName: "Jocelyn Kenter",
          referralLink: "https://referral.com...",
          countsUser: 45,
          earnings: "123$",
        },
        {
          id: "9",
          userId: "12345",
          userName: "Jocelyn Kenter",
          referralLink: "https://referral.com...",
          countsUser: 65,
          earnings: "123$",
        },
        {
          id: "10",
          userId: "12345",
          userName: "Jocelyn Kenter",
          referralLink: "https://referral.com...",
          countsUser: 0,
          earnings: "123$",
        },
        // Add more referrals for pagination
        {
          id: "11",
          userId: "67890",
          userName: "Sarah Johnson",
          referralLink: "https://referral.com/sarah123",
          countsUser: 35,
          earnings: "456$",
        },
        {
          id: "12",
          userId: "54321",
          userName: "Mike Wilson",
          referralLink: "https://referral.com/mike456",
          countsUser: 18,
          earnings: "789$",
        },
        {
          id: "13",
          userId: "98765",
          userName: "Emma Davis",
          referralLink: "https://referral.com/emma789",
          countsUser: 92,
          earnings: "321$",
        },
        {
          id: "14",
          userId: "13579",
          userName: "Alex Brown",
          referralLink: "https://referral.com/alex012",
          countsUser: 7,
          earnings: "654$",
        },
        {
          id: "15",
          userId: "24680",
          userName: "Lisa Garcia",
          referralLink: "https://referral.com/lisa345",
          countsUser: 41,
          earnings: "987$",
        },
      ]

      const filtered = allReferrals.filter(
        (referral) =>
          referral.userId.includes(debouncedSearch) ||
          referral.userName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          referral.referralLink.toLowerCase().includes(debouncedSearch.toLowerCase()),
      )

      const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

      setReferralsData({ data: paginated, total: filtered.length })
      setIsLoading(false)
    }

    fetchReferrals()
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

  const referrals = referralsData?.data || []
  const total = referralsData?.total || 0

  const handleAction = (action: string, referral: Referral) => {
    switch (action) {
      case "copy":
        navigator.clipboard.writeText(referral.referralLink)
        toast.success("Referral link copied to clipboard!")
        break
      case "view":
        toast.info(`Viewing details for ${referral.userName}`)
        break
      case "delete":
        toast.success(`Referral for ${referral.userName} deleted`)
        break
      default:
        break
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="bg-white w-full">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">All Referral history</h2>
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
              <TableHead className="text-white font-medium">User Name</TableHead>
              <TableHead className="text-white font-medium">Referral link</TableHead>
              <TableHead className="text-white font-medium">Counts user</TableHead>
              <TableHead className="text-white font-medium">Earnings</TableHead>
              <TableHead className="text-white font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  Loading...
                </TableCell>
              </TableRow>
            ) : referrals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No referrals found.
                </TableCell>
              </TableRow>
            ) : (
              referrals.map((referral, index) => (
                <TableRow key={referral.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <TableCell className="text-gray-700">{referral.userId}</TableCell>
                  <TableCell className="text-gray-700">{referral.userName}</TableCell>
                  <TableCell className="text-gray-700 max-w-xs truncate">{referral.referralLink}</TableCell>
                  <TableCell className="text-gray-700">{referral.countsUser.toString().padStart(2, "0")}</TableCell>
                  <TableCell className="text-gray-700">{referral.earnings}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAction("copy", referral)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("view", referral)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("delete", referral)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
