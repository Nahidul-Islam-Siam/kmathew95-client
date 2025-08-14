"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import MyProfilePage from "./MyProfilePage";
import AddProfilePage from "./AddProfilePage";
import ProfileRefer from "./ProfileRefer";

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState("My-Profile");

  return (
    <div className="min-h-screen mt-10 ">
      {/* Header Section */}
      <div className="container mx-auto px-4  text-center">
        {/* Tab Navigation */}
        <div className="flex flex-col md:flex-row py-2 justify-center gap-2 ">
          <Button
            onClick={() => setActiveTab("My-Profile")}
            className={`px-16 py-3 rounded-md font-medium transition-all ${
              activeTab === "My-Profile"
                ? "bg-blue-950 text-white hover:bg-blue-900"
                : "bg-white text-blue-900 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            My-Profile
          </Button>
          <Button
            onClick={() => setActiveTab("Add-Profile")}
            className={`px-16 py-3 rounded-md font-medium transition-all ${
              activeTab === "Add-Profile"
                ? "bg-blue-950 text-white hover:bg-blue-900"
                : "bg-white text-blue-900 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Add Profile
          </Button>
          <Button
            onClick={() => setActiveTab("Refer")}
            className={`px-16 py-3 rounded-md font-medium transition-all ${
              activeTab === "Refer"
                ? "bg-blue-950 text-white hover:bg-blue-900"
                : "bg-white text-blue-900 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Refer
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="my-10">
        {activeTab === "My-Profile" && (
          <div>
            <MyProfilePage />
          </div>
        )}

        {activeTab === "Add-Profile" && (
          <div>
            <AddProfilePage />
          </div>
        )}
        {activeTab === "Refer" && (
          <div>
           <ProfileRefer />
          </div>
        )}
      </div>
    </div>
  );
}
