// app/TaskPage.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ManageTask from "./ManageTask";
import ManageTradersPage from "./ManageTradersPage";
import MyActiveTaskTab from "./ActiveTask";


export default function TaskPage() {
  const [activeTab, setActiveTab] = useState("Manage-Tasks");

  return (
    <div className="min-h-screen mt-10">
      {/* Header Section */}
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col md:flex-row py-2 justify-center gap-2">
          <Button
            onClick={() => setActiveTab("Manage-Tasks")}
            className={`flex-1 py-3 rounded-md font-medium transition-all ${
              activeTab === "Manage-Tasks"
                ? "bg-blue-950 text-white hover:bg-blue-900"
                : "bg-white text-blue-900 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            My Tasks
          </Button>
          <Button
            onClick={() => setActiveTab("manage-trader")}
            className={`flex-1 py-3 rounded-md font-medium transition-all ${
              activeTab === "manage-trader"
                ? "bg-blue-950 text-white hover:bg-blue-900"
                : "bg-white text-blue-900 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Manage Trader
          </Button>
          <Button
            onClick={() => setActiveTab("my-active-task")}
            className={`flex-1 py-3 rounded-md font-medium transition-all ${
              activeTab === "my-active-task"
                ? "bg-blue-950 text-white hover:bg-blue-900"
                : "bg-white text-blue-900 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            My Active Task
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="my-10">
        {activeTab === "Manage-Tasks" && <ManageTask />}
        {activeTab === "manage-trader" && <ManageTradersPage />}
        {activeTab === "my-active-task" && <MyActiveTaskTab />}
      </div>
    </div>
  );
}