import AllTradersPage from "@/components/Pages/AllTraders/AllTradersPage";
import React from "react";

const AllTraders = () => {
  return (
    <div className="min-h-screen mx-auto container my-10">
      <h1 className="text-center text-3xl font-bold"> All Traders</h1>
      <div>
        <AllTradersPage />
      </div>
    </div>
  );
};

export default AllTraders;
