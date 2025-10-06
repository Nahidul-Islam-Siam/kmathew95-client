/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import AllTaskHistory from "./AllTaskHistory";

export default function HistoryTabs() {
  // No need for activeTab state since we only show task history
  return (
    <div className="min-h-screen mt-10">
      {/* Header Section */}
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Task History</h1>
        
        {/* Optional: Keep styled heading or remove if not needed */}
        <div className="inline-block">
          <Button
            className="bg-blue-950 text-white px-16 py-3 rounded-md font-medium cursor-default hover:bg-blue-950"
            disabled // Visual only – not clickable
          >
            Task History
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="my-10">
        <AllTaskHistory />
      </div>
    </div>
  );
}