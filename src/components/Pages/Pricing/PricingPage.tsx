"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import SubscriptionSection from "../Home/SubscriptionSection";
import BoostPage from "./BoostPage";

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState("plans");

  return (
    <div className="min-h-screen ">
      {/* Header Section */}
      <div className="container mx-auto px-4  text-center">
        {/* Tab Navigation */}
        <div className="flex flex-col md:flex-row py-2 justify-center gap-2 ">
          <Button
            onClick={() => setActiveTab("plans")}
            className={`px-16 py-3 rounded-md font-medium transition-all ${
              activeTab === "plans"
                ? "bg-slate-800 text-white hover:bg-slate-700"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Plans
          </Button>
          {/* <Button
            onClick={() => setActiveTab("boosts")}
            className={`px-16 py-3 rounded-md font-medium transition-all ${
              activeTab === "boosts"
                ? "bg-slate-800 text-white hover:bg-slate-700"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Boosts
          </Button> */}
        </div>
      </div>

      {/* Tab Content */}
      <div className="">
        {activeTab === "plans" && <SubscriptionSection />}

        {/* {activeTab === "boosts" && <BoostPage />} */}
      </div>
    </div>
  );
}
