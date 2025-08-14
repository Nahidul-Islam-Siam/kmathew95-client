/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"
import { debounce } from "lodash"
import { useEffect, useMemo, useState } from "react"

type PaymentStatus = "Processing" | "Done" | "pending" | "Cancel"

interface Payment {
  id: string
  userName: string
  userEmail: string
  transactionId: string
  amount: string
  status: PaymentStatus
  paymentDateTime: string
}

export default function Task() {
  const [searchText, setSearchText] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState(searchText)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 9
  const [paymentsData, setPaymentsData] = useState<{
    data: Payment[]
    total: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fake API
  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true)
      await new Promise((res) => setTimeout(res, 500))

      const allPayments: Payment[] = [
        {
          id: "1",
          userName: "Tatiana Franci",
          userEmail: "user@email.com",
          transactionId: "TXN-9876-LMN0",
          amount: "123$",
          status: "Processing" as PaymentStatus,
          paymentDateTime: "19 May 25 03:55 AM",
        },
        {
          id: "2",
          userName: "Tatiana Franci",
          userEmail: "user@email.com",
          transactionId: "TXN-9876-LMN0",
          amount: "123$",
          status: "Done" as PaymentStatus,
          paymentDateTime: "19 May 25 03:55 AM",
        },
        {
          id: "3",
          userName: "Tatiana Franci",
          userEmail: "user@email.com",
          transactionId: "TXN-9876-LMN0",
          amount: "123$",
          status: "pending" as PaymentStatus,
          paymentDateTime: "19 May 25 03:55 AM",
        },
        {
          id: "4",
          userName: "Tatiana Franci",
          userEmail: "user@email.com",
          transactionId: "TXN-9876-LMN0",
          amount: "123$",
          status: "Processing" as PaymentStatus,
          paymentDateTime: "19 May 25 03:55 AM",
        },
        {
          id: "5",
          userName: "Tatiana Franci",
          userEmail: "user@email.com",
          transactionId: "TXN-9876-LMN0",
          amount: "123$",
          status: "pending" as PaymentStatus,
          paymentDateTime: "19 May 25 03:55 AM",
        },
        {
          id: "6",
          userName: "Tatiana Franci",
          userEmail: "user@email.com",
          transactionId: "TXN-9876-LMN0",
          amount: "123$",
          status: "Done" as PaymentStatus,
          paymentDateTime: "19 May 25 03:55 AM",
        },
        {
          id: "7",
          userName: "Tatiana Franci",
          userEmail: "user@email.com",
          transactionId: "TXN-9876-LMN0",
          amount: "123$",
          status: "Done" as PaymentStatus,
          paymentDateTime: "19 May 25 03:55 AM",
        },
        {
          id: "8",
          userName: "Tatiana Franci",
          userEmail: "user@email.com",
          transactionId: "TXN-9876-LMN0",
          amount: "123$",
          status: "pending" as PaymentStatus,
          paymentDateTime: "19 May 25 03:55 AM",
        },
        {
          id: "9",
          userName: "Tatiana Franci",
          userEmail: "user@email.com",
          transactionId: "TXN-9876-LMN0",
          amount: "123$",
          status: "Cancel" as PaymentStatus,
          paymentDateTime: "19 May 25 03:55 AM",
        },
        // Add more payments for pagination
        {
          id: "10",
          userName: "John Smith",
          userEmail: "john@email.com",
          transactionId: "TXN-1234-ABC0",
          amount: "456$",
          status: "Done" as PaymentStatus,
          paymentDateTime: "18 May 25 02:30 PM",
        },
        {
          id: "11",
          userName: "Jane Doe",
          userEmail: "jane@email.com",
          transactionId: "TXN-5678-DEF0",
          amount: "789$",
          status: "Processing" as PaymentStatus,
          paymentDateTime: "17 May 25 01:15 PM",
        },
        {
          id: "12",
          userName: "Mike Johnson",
          userEmail: "mike@email.com",
          transactionId: "TXN-9012-GHI0",
          amount: "321$",
          status: "pending" as PaymentStatus,
          paymentDateTime: "16 May 25 11:45 AM",
        },
      ]

      const filtered = allPayments.filter(
        (payment) =>
          payment.userName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          payment.userEmail.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          payment.transactionId.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          payment.status.toLowerCase().includes(debouncedSearch.toLowerCase()),
      )

      const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

      setPaymentsData({ data: paginated, total: filtered.length })
      setIsLoading(false)
    }

    fetchPayments()
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

  const payments = paymentsData?.data || []
  const total = paymentsData?.total || 0

  const statusColors: Record<PaymentStatus, string> = {
    Processing: "bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium",
    Done: "bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium",
    pending: "bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm font-medium",
    Cancel: "bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium",
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="bg-white w-full">
      {/* Breadcrumb */}
      <div className="p-6 pb-2">
        <nav className="text-sm text-gray-500">
          <span>Wallet</span>
        </nav>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-6 pb-6">
        <h2 className="text-xl font-semibold text-gray-900">All payment history</h2>
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
              <TableHead className="text-white font-medium">User name</TableHead>
              <TableHead className="text-white font-medium">User Email</TableHead>
              <TableHead className="text-white font-medium">Payment Transaction ID</TableHead>
              <TableHead className="text-white font-medium">Amount</TableHead>
              <TableHead className="text-white font-medium">Status</TableHead>
              <TableHead className="text-white font-medium">Payment Date & Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  Loading...
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No payments found.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment, index) => (
                <TableRow key={payment.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <TableCell className="text-gray-700">{payment.userName}</TableCell>
                  <TableCell className="text-gray-700">{payment.userEmail}</TableCell>
                  <TableCell className="text-gray-700">{payment.transactionId}</TableCell>
                  <TableCell className="text-gray-700">{payment.amount}</TableCell>
                  <TableCell>
                    <span className={statusColors[payment.status]}>{payment.status}</span>
                  </TableCell>
                  <TableCell className="text-gray-700">{payment.paymentDateTime}</TableCell>
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
