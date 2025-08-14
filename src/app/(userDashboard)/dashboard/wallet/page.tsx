import PaypmentHistory from "@/components/UserDashboard/WalletPage/PaypmentHistory";
import WalletPage from "@/components/UserDashboard/WalletPage/WalletPage";
import { CircleDollarSign } from "lucide-react";
import React from "react";

const Wallet = () => {
  return (
    <div className="max-w-5xl mx-auto py-5">
      <div className="text-center">
        <h1 className="text-2xl text-blue-950 font-bold">Wallet</h1>
        <p className="text-gray-400">we are glad to see yoy again!</p>
      </div>
      {/* Balance over view */}
      <div className="my-10 flex flex-col md:flex-row justify-center items-center gap-7 border-gray-500 rounded-md">
        {/* balance card */}
        <div className="border w-1/3 shadow-lg rounded-xl p-5">
          <div className="flex gap-2 w-32 p-1 border rounded-2xl">
            <CircleDollarSign className="text-orange-500" />
            <h1 className="font-semibold">Total Balance</h1>
          </div>
          <h1 className="text-2xl mt-2 font-bold text-blue-950">150$</h1>
        </div>
        {/* balance card */}
        <div className="border w-1/3 shadow-lg rounded-xl p-5">
          <div className="flex gap-2 w-32 p-1 border rounded-2xl">
            <CircleDollarSign className="text-orange-500" />
            <h1 className="font-semibold">Total Earn</h1>
          </div>
          <h1 className="text-2xl mt-2 font-bold text-blue-950">150$</h1>
        </div>
        {/* balance card */}
        <div className="border w-1/3 shadow-lg rounded-xl p-5">
          <div className="flex  gap-2 w-36 p-1 border rounded-2xl">
            <CircleDollarSign className="text-orange-500" />
            <h1 className="font-semibold">Total WithDraw</h1>
          </div>
          <h1 className="text-2xl mt-2 font-bold text-blue-950">150$</h1>
        </div>
      </div>
      {/* fund buttons */}
      <div>
        <WalletPage />
      </div>
      <div>
        <PaypmentHistory />
      </div>
    </div>
  );
};

export default Wallet;
