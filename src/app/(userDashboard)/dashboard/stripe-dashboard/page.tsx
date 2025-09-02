/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetStripeLinkByIdMutation } from "@/redux/service/stripeApi";
import { RootState } from "@/redux/store";
import { Button } from "@nextui-org/react";
import { CircleDollarSign } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const StripeDashboard = () => {
  // Correct: useGetStripeLinkByIdMutation returns [trigger, { data, isLoading, ... }]
  const [getStripeLink, { isLoading }] = useGetStripeLinkByIdMutation();

  const id = useSelector((state: RootState) => state.auth.user?.id);

  const handleGotoStripe = async () => {
    if (!id) {
      Swal.fire({
        title: "Error",
        text: "User ID not found. Please log in again.",
        icon: "error",
      });
      return;
    }

    try {
      // ✅ Correctly trigger the mutation
      const res = await getStripeLink(id).unwrap();

      if (res?.success && res.data) {
        // Open Stripe Dashboard in a new tab
        window.open(res.data, "_blank", "noopener,noreferrer");
      } else {
        Swal.fire({
          title: "Failed",
          text: res?.message || "Failed to retrieve Stripe dashboard link.",
          icon: "error",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Failed to connect to Stripe. Please try again.";
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-5 min-h-screen flex items-center justify-center">
      <Button
        className="bg-blue-950 text-white flex items-center gap-2 px-6 py-3 text-lg"
        onClick={handleGotoStripe}
        disabled={!id || isLoading} // Disable if no ID or loading
        isLoading={isLoading} // Optional: show loading state
      >
        {isLoading ? "Loading..." : "Go to Stripe Dashboard"}
        <CircleDollarSign className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default StripeDashboard;