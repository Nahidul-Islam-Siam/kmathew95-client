/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import img1 from "@/assets/CardImage/image 2.png";
import { toast } from "sonner";
import { useAcceptTaskOfferByIdMutation } from "@/redux/service/taskapplication";

type User = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  rating: number;
  price: string;
  deliveryTime: string;
  priceType: string;
};

type Task = {
  id: string;
  title: string;
  duration: string;
  price: string;
  logo: string;
  users: User[];
  taskType: "PAYMENT" | "CASH";
};

interface OrderSummaryModalProps {
  open: boolean;
  onClose: () => void;
  task: Task;
  user: User;
}

export default function OrderModal({ open, onClose, task, user }: OrderSummaryModalProps) {
  const [useWallet, setUseWallet] = useState(true);
  const [acceptTaskOfferById, { isLoading }] = useAcceptTaskOfferByIdMutation(); // Get isLoading

  const walletBalance = 5000.5;



  console.log(user.id , "User ID");


  // Base price from freelancer's offer
  const basePrice = parseFloat(user.price.replace("$", "")) || 0;

  // Calculate wallet deduction
  const walletDeduction = useWallet ? Math.min(walletBalance, basePrice) : 0;
  const remainingAmount = Math.max(0, basePrice - walletDeduction);

  const handleMakePayment = async () => {
    try {
      if (task.taskType === "CASH") {
        // ✅ For CASH: just confirm
        toast.success(`Order confirmed! Pay ${user.name} in cash upon delivery.`);
        onClose();
        return;
      }

      // 🔥 For PAYMENT: Accept offer via API
      // Pass only the `id` (string), not an object
      const response = await acceptTaskOfferById(user.id.toString()).unwrap();
      console.log(response, "acceptable Offer");

    if(response.success){
      toast.success (response?.message || "Offer accepted successfully!");
    }else {
      toast.error (response?.message || "Failed to accept offer.");
    }

//  when api hit then data. in another tabs open  sessionURL link
      window.open(response.data.sessionUrl, "_blank");
      onClose();
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to accept offer. Please try again.";
      toast.error(message);
      console.error("Accept offer error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto p-4">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">Order Summary</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Service Details */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={img1}
                alt="Service"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-sm leading-tight">{task?.title}</h3>
              <p className="text-sm text-gray-600 mt-1">by {user?.name}</p>
              <p className="text-sm text-gray-500">Delivery: {user?.deliveryTime}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-sm">${basePrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Order Breakdown */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Service Price</span>
              <span>${basePrice.toFixed(2)}</span>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between font-medium">
                <span>Subtotal</span>
                <span>${basePrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Wallet Balance */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-blue-900">Wallet Balance</span>
                <span className="font-medium text-blue-900">${walletBalance.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="useWallet"
                  checked={useWallet}
                  onChange={(e) => setUseWallet(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="useWallet" className="text-blue-800">
                  Use wallet balance
                </label>
              </div>
            </div>
          </div>

          {/* Final Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${remainingAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={onClose}
              disabled={isLoading}
            >
              Close
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleMakePayment}
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : task.taskType === "CASH"
                ? "Confirm Order"
                : remainingAmount === 0
                ? "Complete Order"
                : `Pay $${remainingAmount.toFixed(2)}`}
            </Button>
          </div>

          {/* Info Note */}
          <p className="text-xs text-gray-500 text-center">
            {task.taskType === "CASH"
              ? "You will pay the freelancer in cash upon delivery."
              : "Secure payment will be processed after confirmation."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}