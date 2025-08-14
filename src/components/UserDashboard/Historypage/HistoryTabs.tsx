"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import AllTradesHistory from "./AllTradesHistory";
import AllTaskHistory from "./AllTaskHistory";

export default function HistoryTabs() {
  const [activeTab, setActiveTab] = useState("trade-history");

  return (
    <div className="min-h-screen mt-10 ">
      {/* Header Section */}
      <div className="container mx-auto px-4  text-center">
        {/* Tab Navigation */}
        <div className="flex flex-col md:flex-row py-2 justify-center gap-2 ">
          <Button
            onClick={() => setActiveTab("trade-history")}
            className={`px-16 py-3 rounded-md font-medium transition-all ${
              activeTab === "trade-history"
                ? "bg-blue-950 text-white hover:bg-blue-900"
                : "bg-white text-blue-900 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Trade History
          </Button>

          <Button
            onClick={() => setActiveTab("task-history")}
            className={`px-16 py-3 rounded-md font-medium transition-all ${
              activeTab === "task-history"
                ? "bg-blue-950 text-white hover:bg-blue-900"
                : "bg-white text-blue-900 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Task History
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="my-10">
        {activeTab === "trade-history" && (
          <div>
            <AllTradesHistory />
          </div>
        )}

        {activeTab === "task-history" && (
          <div>
            <AllTaskHistory />
          </div>
        )}
      </div>
    </div>
  );
}
