/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTaskApplicationHistoryQuery } from "@/redux/service/admin/taskManagemant";
import defaultImage from "@/assets/CardImage/image 2.png"; // fallback image

// Format date helper
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format status to friendly label
const getStatusLabel = (status: string) => {
  if (status === "DELIVERED") return "Completed";
  return status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, " ");
};

// Get badge color based on status
const getStatusColor = (status: string) => {
  switch (status) {
    case "DELIVERED":
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
    case "REJECTED":
      return "bg-red-100 text-red-800";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function AllTaskHistory() {
  const { data: taskHistory, isLoading, error } = useTaskApplicationHistoryQuery({});

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Loading task history...</p>
      </div>
    );
  }

  if (error || !taskHistory?.data?.data) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">Failed to load task history.</p>
      </div>
    );
  }

  const tasks = taskHistory.data.data;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      {tasks.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">No task history found.</p>
        </div>
      ) : (
        tasks.map((task: any) => {
          // Get the first accepted/active application (if any)
          const firstApplication = task.task_Application?.[0];
          const trader = firstApplication?.offerByTrader;

          return (
            <div
              key={task.id}
              className="flex items-center gap-4 p-4 py-6 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              {/* Task Image / Fallback */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-lg overflow-hidden">
                  <Image
                    src={defaultImage} // Replace with `task.thumbnail` if available
                    alt={task.title}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Task Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{task.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  By {trader?.fastName || "Unknown"} {trader?.lastName || ""}
                </p>
                <p className="text-xs text-gray-400 mt-1">Deadline: {formatDate(task.deadline)}</p>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 text-xs"
                  asChild
                >
                  <a href={`/all-services/${task.id}`} target="_blank">
                    View Details
                  </a>
                </Button>
              </div>

              {/* Price & Status */}
              <div className="flex flex-col items-end gap-2 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  ${task.min_salary} - ${task.max_salary}
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    task.status
                  )}`}
                >
                  {getStatusLabel(task.status)}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}