/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; 

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import CreateTaskModal from "./CreateTaskModal";
import { useGetTaskManagementQuery } from "@/redux/service/admin/taskManagemant";
import Image from "next/image";

export default function ManageTask() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch real task management data
  const { data: taskManagementData, isLoading, isError } = useGetTaskManagementQuery();

  // Extract tasks from response
  const tasks = taskManagementData?.data?.data || [];
  const meta = taskManagementData?.data?.meta;

  // Format time left (simplified: just show "X days left")
  const getTimeLeft = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diffInHours = (end.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffInHours <= 0) return "Expired";
    if (diffInHours < 24) return `${Math.ceil(diffInHours)}h left`;
    return `${Math.ceil(diffInHours / 24)}d left`;
  };

  // Get status badge style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-10 w-48 bg-gray-200 rounded mb-6"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border p-4 rounded-md bg-white shadow-sm mb-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-red-500">
        Failed to load tasks. Please try again later.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Create New Task Button */}
      {/* <Button
        onClick={() => setIsModalOpen(true)}
        className="mb-6 bg-slate-800 hover:bg-slate-700 text-white"
      >
        + Create New Task
      </Button> */}

      {/* No Tasks Found */}
      {tasks.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-gray-700">No tasks found</h3>
          <p className="text-gray-500 mt-1">You haven&lsquo;t posted any tasks yet.</p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-slate-800 hover:bg-slate-700 text-white"
          >
            Post Your First Task
          </Button>
        </div>
      ) : (
        /* Render Tasks */
        <div className="space-y-4">
          {tasks.map((task: any) => {
            const timeLeft = getTimeLeft(task.deadline);
            const traderName = `${task.trader?.fastName || "Unknown"} ${task.trader?.lastName || ""}`.trim();

            return (
              <div
                key={task.id}
                className="border p-4 rounded-md bg-white shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  {/* Left Side: Task Info */}
                  <div className="space-y-2 flex-1">
                    <h2 className="text-xl font-bold text-gray-900">{task.title}</h2>
                    <p className="text-sm text-gray-600">
                      <span>{traderName}</span> • <span>{task.location}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      ${task.min_salary} - ${task.max_salary} • {timeLeft}
                    </p>

                    {/* Tags & Skills */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {task.require_skills.slice(0, 3).map((skill: string, i: number) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {task.require_skills.length > 3 && (
                        <span className="text-xs text-gray-500">+{task.require_skills.length - 3} more</span>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`inline-block text-xs px-2 py-1 mt-2 rounded ${getStatusStyle(
                        task.status
                      )}`}
                    >
                      {task.status.replace("_", " ")}
                    </div>
                  </div>

                  {/* Right Side: Actions */}
                  <div className="text-right md:w-48">
                    {/* File Preview */}
                    {task.files && task.files.length > 0 && (
                      <div className="mb-2">
                        <Image
                          width={100}
                          height={100}
                          src={task.files[0]}
                          alt="Attachment"
                          className="w-16 h-16 object-cover rounded border"
                        />
                      </div>
                    )}
                    <Link href={`/admin/tasks/${task.id}`} passHref>
                      <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for creating new task */}
      <CreateTaskModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}