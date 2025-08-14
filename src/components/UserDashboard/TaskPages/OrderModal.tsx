"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import img1 from "@/assets/CardImage/image 2.png";

interface DiscountCode {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  description: string;
}

const validDiscountCodes: DiscountCode[] = [
  { code: "SAVE10", type: "percentage", value: 10, description: "10% off" },
  { code: "WELCOME20", type: "percentage", value: 20, description: "20% off" },
  { code: "FIXED5", type: "fixed", value: 5, description: "$5 off" },
  {
    code: "STUDENT15",
    type: "percentage",
    value: 15,
    description: "15% student discount",
  },
];

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
};

interface OrderSummaryModalProps {
  open: boolean;
  onClose: () => void;
  task: Task;
  user: User;
}

export default function OrderModal({
  open,
  onClose,
  task,
  user,
}: OrderSummaryModalProps) {
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(
    null
  );
  const [error, setError] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const [walletBalance] = useState(5000.5); // User's wallet balance
  const [useWallet, setUseWallet] = useState(true); // Whether to use wallet balance

  // Convert user price to number
  const basePrice = Number.parseFloat(user?.price?.replace("$", "") || "0");
  const platformCharge = Math.round(basePrice * 0.15 * 100) / 100; // 15%
  const baseTax = Math.round(basePrice * 0.08 * 100) / 100; // 8%

  const calculateDiscount = (discount: DiscountCode, price: number) => {
    if (discount.type === "percentage") {
      return (price * discount.value) / 100;
    }
    return discount.value;
  };

  const discountAmount = appliedDiscount
    ? calculateDiscount(appliedDiscount, basePrice)
    : 0;
  const discountedPrice = basePrice - discountAmount;
  const finalTotal = discountedPrice + platformCharge + baseTax;

  const walletDeduction = useWallet ? Math.min(walletBalance, finalTotal) : 0;
  const remainingAmount = Math.max(0, finalTotal - walletDeduction);

  const paymentBlocked =
    useWallet && walletBalance < finalTotal && remainingAmount === finalTotal;

  const handleApplyCode = async () => {
    setIsApplying(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 500));

    const foundCode = validDiscountCodes.find(
      (code) => code.code.toLowerCase() === discountCode.toLowerCase()
    );

    if (foundCode) {
      setAppliedDiscount(foundCode);
      setError("");
    } else {
      setError("Invalid discount code");
      setAppliedDiscount(null);
    }

    setIsApplying(false);
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
    setError("");
  };

  const handleMakePayment = () => {
    if (paymentBlocked) return;

    console.log("Payment processed", {
      task: task.title,
      user: user.name,
      amount: remainingAmount,
      walletUsed: walletDeduction,
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Order Summary
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
              <h3 className="font-medium text-gray-900 text-sm leading-tight">
                {task?.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">by {user?.name}</p>
              <p className="text-sm text-gray-500">
                Delivery: {user?.deliveryTime}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">${basePrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Discount Code */}
          <div>
            <div className="flex gap-2">
              <Input
                placeholder="Gift or discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="flex-1"
                disabled={isApplying}
              />
              <Button
                onClick={handleApplyCode}
                disabled={!discountCode.trim() || isApplying}
                className="bg-gray-800 hover:bg-gray-700 text-white px-6"
              >
                {isApplying ? "..." : "Apply"}
              </Button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {appliedDiscount && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-green-700 text-sm font-medium">
                    {appliedDiscount.description} applied!
                  </span>
                  <button
                    onClick={handleRemoveDiscount}
                    className="text-green-600 hover:text-green-800 text-sm underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Service Price</span>
              <span>${basePrice.toFixed(2)}</span>
            </div>

            {appliedDiscount && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount ({appliedDiscount.code})</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span>Platform Charge</span>
              <span>${platformCharge.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${baseTax.toFixed(2)}</span>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between text-sm font-medium">
                <span>Subtotal</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Wallet Balance */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">
                  Wallet Balance
                </span>
                <span className="text-sm font-medium text-blue-900">
                  ${walletBalance.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="useWallet"
                  checked={useWallet}
                  onChange={(e) => setUseWallet(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="useWallet" className="text-sm text-blue-800">
                  Use wallet balance
                </label>
              </div>
              {useWallet && (
                <div className="flex justify-between text-sm text-blue-600 mt-2">
                  <span>Wallet Applied</span>
                  <span>-${walletDeduction.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Final Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">
                {remainingAmount > 0 ? "Remaining Amount" : "Total Paid"}
              </span>
              <span className="text-lg font-semibold">
                $
                {remainingAmount > 0
                  ? remainingAmount.toFixed(2)
                  : finalTotal.toFixed(2)}
              </span>
            </div>
            {remainingAmount === 0 && useWallet && (
              <p className="text-green-600 text-sm mt-1">
                Fully covered by wallet balance!
              </p>
            )}
          </div>

          {/* Payment Block Error */}
          {paymentBlocked && (
            <p className="text-red-500 text-sm mt-2 text-center">
              Please add money to your wallet. Not enough funds to complete the
              order.
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              onClick={handleMakePayment}
              disabled={paymentBlocked}
            >
              {remainingAmount === 0
                ? "Complete Order"
                : `Pay $${remainingAmount.toFixed(2)}`}
            </Button>
          </div>

          {/* Demo Codes */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800 text-xs font-medium mb-1">
              Demo discount codes:
            </p>
            <p className="text-blue-600 text-xs">
              SAVE10, WELCOME20, FIXED5, STUDENT15
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
