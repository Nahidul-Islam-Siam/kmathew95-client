/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useDeletePaymentMutation, useGetPaymentsQuery } from "@/redux/service/admin/payment";
import { format } from "date-fns";
import {
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  MoreVertical,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useState } from "react";

// Format amount to USD (assuming amount is in cents)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100);
};

// Format date
const formatDate = (dateString: string) => {
  return format(new Date(dateString), "MMM dd, yyyy");
};

// Status badge colors
const getStatusColor = (status: string) => {
  switch (status) {
    case "SUCCEEDED":
      return "bg-green-100 text-green-800 border-green-200";
    case "PENDING":
    case "ON_HOLD":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "FAILED":
    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-200";
    case "REFUNDED":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// Get readable label for payment type
const getPaymentLabel = (type: string) => {
  switch (type) {
    case "TASK_PAYMENT":
      return "Task Payment";
    case "SUBSCRIPTION":
      return "Subscription";
    default:
      return type.replace(/_/g, " ");
  }
};

export default function Payment() {
  const { data: paymentData, isLoading, error } = useGetPaymentsQuery();
  const [deletePayment, { isLoading: isDeleting }] = useDeletePaymentMutation();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Handle delete with confirmation and feedback
  const handleDeletePayment = async (paymentId: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this payment? This action cannot be undone."
    );
    if (!confirm) return;

    setDeletingId(paymentId);

    try {
      await deletePayment({ id: paymentId }).unwrap();
      toast.success("✅ Payment deleted successfully.");
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "❌ Failed to delete payment. Please try again.";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="w-full max-w-6xl">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/4 mb-8 mx-auto"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !paymentData?.data?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-medium mb-2">Failed to load payments</p>
          <p className="text-gray-500 mb-4">Please check your connection and try again.</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const payments = paymentData.data.data;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="text-center mb-8 mt-8">
        <h1 className="text-3xl font-bold text-gray-800">Payment History</h1>
        <p className="text-base text-gray-600">We are glad to see you again!</p>
      </div>

      {/* Filters and Actions */}
      <div className="w-full max-w-6xl mb-6 flex justify-between items-center">
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} />
            Filter
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Export
          </Button>
        </div>
        <div className="text-sm text-gray-500">
          {payments.length} {payments.length === 1 ? "payment" : "payments"} found
        </div>
      </div>

      {/* Table */}
      <div className="w-full max-w-6xl overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-left text-sm font-medium uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 rounded-tl-xl">Description</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  No payment history found.
                </td>
              </tr>
            ) : (
              payments.map((payment: any) => (
                <tr
                  key={payment.id}
                  className="hover:bg-blue-50 transition-colors duration-150 group"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {payment.taskId
                        ? "Task Delivery"
                        : payment.subscriptionPlanId
                        ? "Subscription"
                        : "Payment"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payment.id.slice(0, 8)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-800">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {getPaymentLabel(payment.paymentType)}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        payment.paymentStatus
                      )}`}
                    >
                      <span className="w-2 h-2 rounded-full mr-1.5 bg-current opacity-70"></span>
                      {payment.paymentStatus.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(payment.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end items-center space-x-2">
                      {/* View */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                        asChild
                      >
                        <a
                          href={`/dashboard/payments/${payment.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye size={16} />
                        </a>
                      </Button>

                      {/* Edit */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-600 hover:text-green-800 hover:bg-green-100"
                        onClick={() => alert("Edit functionality coming soon")}
                        disabled
                      >
                        <Edit size={16} />
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-100"
                        onClick={() => handleDeletePayment(payment.id)}
                        disabled={isDeleting}
                      >
                        {deletingId === payment.id ? (
                          <span className="animate-spin">⏳</span>
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </Button>

                      {/* More Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            <span>Download Receipt</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}