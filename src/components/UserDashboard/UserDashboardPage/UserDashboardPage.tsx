"use client";
import React, { useEffect, useState } from "react";
import { Gavel, BriefcaseBusiness, Star } from "lucide-react";

interface DashboardStats {
  taskBidWon: number;
  jobsApplied: number;
  reviews: number;
}

const UserDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    taskBidWon: 20,
    jobsApplied: 30,
    reviews: 20,
  });
  //   setStats when call apis

  const taskbar = [
    {
      name: "Task Bid Won",
      icon: Gavel,
      color: "green",
      value: stats.taskBidWon,
    },
    {
      name: "Jobs Applied",
      icon: BriefcaseBusiness,
      color: "blue",
      value: stats.jobsApplied,
    },
    {
      name: "Reviews",
      icon: Star,
      color: "yellow",
      value: stats.reviews,
    },
  ];

  return (
    <div className="my-10">
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {taskbar.map((task, index) => {
          const Icon = task.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-4 p-5 border shadow-md rounded-xl border-gray-200 bg-white hover:shadow-lg transition-shadow"
            >
              <div
                className={`p-2 rounded-full bg-blue-900 text-white`}
              >
                <Icon className="w-6 h-6" />
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-gray-500">{task.name}</span>
                <span className="text-2xl font-bold text-gray-800">
                  {task.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserDashboardPage;
