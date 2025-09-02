import OrderListPage from "@/components/UserDashboard/UserDashboardPage/OrderListPage";
import UserDashboardChart from "@/components/UserDashboard/UserDashboardPage/UserDashboardChart";
import UserDashboardPage from "@/components/UserDashboard/UserDashboardPage/UserDashboardPage";
import { User } from "lucide-react";
import React from "react";

const DashBoardPage = () => {

  
  return (
    <div>
      <UserDashboardPage />
      <div>
        <UserDashboardChart />
      </div>
      <div>
        <OrderListPage />
      </div>
    </div>
  );
};

export default DashBoardPage;
