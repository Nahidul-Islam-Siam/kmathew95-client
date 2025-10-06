/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Trash2 } from "lucide-react";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useDeletePaymentMutation, useGetPaymentsQuery } from "@/redux/service/admin/payment";
import { toast } from "sonner";

// === Types ===
type PaymentStatus =
  | "REQUIRES_PAYMENT_METHOD"
  | "REQUIRES_CONFIRMATION"
  | "REQUIRES_ACTION"
  | "PROCESSING"
  | "REQUIRES_CAPTURE"
  | "CANCELLED"
  | "SUCCEEDED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"
  | "FAILED";

interface Payment {
  id: string;
  paymentType: string;
  amount: number;
  currency: string;
  paymentOwnerId: string | null;
  paymentStatus: PaymentStatus;
  taskId: string | null;
  stripePaymentId: string | null;
  createdAt: string;
}

export default function Task() {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // State for delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);

  // Fetch ALL payments at once
  const {  data:apiResponse, isLoading: isApiLoading } = useGetPaymentsQuery();


  console.log(apiResponse);

 const [deletePayment] = useDeletePaymentMutation();
  // Extract and map all payments
  const allPayments = useMemo(() => {
    return (apiResponse?.data?.data || []).map((payment: any) => {
      const amountFormatted = `${payment.amount.toLocaleString()} ${payment.currency.toUpperCase()}`;
      const transactionId = payment.stripePaymentId || payment.id;

      // Placeholder user data
      const userName = payment.paymentOwnerId ? "User Name" : "System";
      const userEmail = payment.paymentOwnerId ? "user@example.com" : "system@skillswitch.com";

      const paymentDateTime = new Date(payment.createdAt).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        id: payment.id,
        userName,
        userEmail,
        transactionId,
        amount: amountFormatted,
        status: payment.paymentStatus as PaymentStatus,
        paymentDateTime,
      };
    });
  }, [apiResponse]);

  // Search Filtering
  const filteredPayments = useMemo(() => {
    return allPayments.filter(
      (payment) =>
        payment.userName.toLowerCase().includes(searchText.toLowerCase()) ||
        payment.userEmail.toLowerCase().includes(searchText.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(searchText.toLowerCase()) ||
        payment.status.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [allPayments, searchText]);

  // Frontend Pagination
  const totalPages = Math.ceil(filteredPayments.length / pageSize);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Debounced Search
  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchText(value);
        setCurrentPage(1);
      }, 400),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearch(e.target.value);
  };

  // Status Label Mapping
  const getStatusLabel = (status: PaymentStatus): string => {
    switch (status) {
      case "REQUIRES_PAYMENT_METHOD":
        return "Payment Method Required";
      case "REQUIRES_CONFIRMATION":
        return "Pending Confirmation";
      case "REQUIRES_ACTION":
        return "Action Required";
      case "PROCESSING":
        return "Processing";
      case "REQUIRES_CAPTURE":
        return "Awaiting Capture";
      case "CANCELLED":
        return "Cancelled";
      case "SUCCEEDED":
        return "Done";
      case "REFUNDED":
        return "Refunded";
      case "PARTIALLY_REFUNDED":
        return "Partially Refunded";
      case "FAILED":
        return "Failed";
      default:
        return "Unknown";
    }
  };

  // Status Badge Colors
  const getStatusColor = (status: PaymentStatus): string => {
    switch (status) {
      case "REQUIRES_PAYMENT_METHOD":
      case "REQUIRES_CONFIRMATION":
      case "REQUIRES_ACTION":
      case "REQUIRES_CAPTURE":
        return "bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm font-medium";
      case "PROCESSING":
        return "bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium";
      case "SUCCEEDED":
        return "bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium";
      case "FAILED":
        return "bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium";
      case "REFUNDED":
      case "PARTIALLY_REFUNDED":
        return "bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium";
      case "CANCELLED":
        return "bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium";
      default:
        return "bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm font-medium";
    }
  };

const handleDeleteClick = (id: string) => {
  setPaymentToDelete(id);
  setDeleteModalOpen(true);
};

// Confirm Delete (async with await)
const confirmDelete = async () => {
  // if (!paymentToDelete) return;

  // try {
  //   console.log("Deleting payment with ID:", paymentToDelete);

  //   // Call the mutation and wait for result
  //   // const result = await deletePayment(paymentToDelete).unwrap();

  //   if (result.success) {
  //     toast.success(result?.message);
  //   }else{
  //     toast.error(result?.message);
  //   }

  //   // Close modal
  //   setDeleteModalOpen(false);
  //   setPaymentToDelete(null);
  // } catch (error) {
  //   console.error("❌ Failed to delete payment:", error);

  //   // Optional: Show error alert or toast
  //   toast.error("Failed to delete payment. Please try again.");
  // }
  }

// Cancel Delete (synchronous, no async needed)
const cancelDelete = () => {
  setDeleteModalOpen(false);
  setPaymentToDelete(null);
};

  const isLoading = isApiLoading;

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
        <h2 className="text-xl font-semibold text-gray-900">All Payment History</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search payments..."
            value={searchText}
            onChange={handleSearchChange}
            className="pl-10 w-64 border-gray-200"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-700 hover:bg-slate-700">
              <TableHead className="text-white font-medium">User Name</TableHead>
              <TableHead className="text-white font-medium">User Email</TableHead>
              <TableHead className="text-white font-medium">Transaction ID</TableHead>
              <TableHead className="text-white font-medium">Amount</TableHead>
              <TableHead className="text-white font-medium">Status</TableHead>
              <TableHead className="text-white font-medium">Date & Time</TableHead>
              <TableHead className="text-white font-medium text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  Loading all payments...
                </TableCell>
              </TableRow>
            ) : paginatedPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  No payments found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              paginatedPayments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-gray-50">
                  <TableCell className="text-gray-700">{payment.userName}</TableCell>
                  <TableCell className="text-gray-700">{payment.userEmail}</TableCell>
                  <TableCell className="font-mono text-sm text-gray-600">
                    {payment.transactionId}
                  </TableCell>
                  <TableCell className="text-gray-700 font-medium">{payment.amount}</TableCell>
                  <TableCell>
                    <span className={getStatusColor(payment.status)}>
                      {getStatusLabel(payment.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-700">{payment.paymentDateTime}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleDeleteClick(payment.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && filteredPayments.length > 0 && (
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
              const startPage = Math.max(1, currentPage - 2);
              const pageNumber = startPage + i;
              if (pageNumber > totalPages) return null;

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
              );
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
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this payment? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}