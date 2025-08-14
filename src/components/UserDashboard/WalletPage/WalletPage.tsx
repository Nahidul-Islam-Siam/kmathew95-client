import { Button } from "@/components/ui/button";
import React from "react";

const WalletPage = () => {
  return (
    <>
      <div className="flex gap-4 mt-4">
        <Button className="bg-orange-500 hover:bg-orange-600
         text-white font-semibold px-6 py-2 rounded-md shadow-md transition">
          Withdraw Now
        </Button>
        <Button className="bg-white border border-orange-500
         text-orange-500 hover:bg-orange-50 font-semibold px-6 py-2 rounded-md
          shadow-sm transition">
          + Add Fund
        </Button>
      </div>
    </>
  );
};

export default WalletPage;
