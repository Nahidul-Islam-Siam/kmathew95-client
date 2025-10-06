/* eslint-disable @typescript-eslint/no-explicit-any */
// components/MyActiveTaskTab.tsx
"use client";

import { useActiveTaskOfferQuery } from "@/redux/service/admin/taskManagemant";
import { ActiveTaskCard } from "./ActiveTaskCard";

import { useState } from "react";
import TaskModal from "./TaskModal";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeliveredTaskCard } from "./DeliveryTaskData";
import { Textarea } from "@/components/ui/textarea";

export default function MyActiveTaskTab() {
  const [reviewModal, setReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  // Fetch the task data
  const { data: activeTaskData, isLoading } = useActiveTaskOfferQuery({});

  const allTasks = activeTaskData?.data?.data || [];
  
  // Find active task
  const activeTask = allTasks.find((t: any) =>
    ["APPROVED", "IN_PROGRESS", "PENDING"].includes(t.status)
  );

  // Find delivered task
  const deliveredTask = allTasks.find((t: any) => t.status === "DELIVERED");

  if (isLoading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  if (!activeTask && !deliveredTask) {
    return <p className="text-center text-gray-600">No active or delivered task found.</p>;
  }

  return (
    <>
      {/* Show Active Task */}
      {activeTask && (
        <ActiveTaskCard
          task={activeTask}
          onOpenSubmitModal={() => setTaskModalOpen(true)}
          onOpenReviewModal={() => setReviewModal(true)}
        />
      )}

      {/* Show Delivered Task if no active task */}
      {!activeTask && deliveredTask && (
        <DeliveredTaskCard
          task={deliveredTask}
          onOpenReviewModal={() => setReviewModal(true)}
        />
      )}

      {/* Task Submission Modal */}
      <TaskModal
        open={taskModalOpen}
        onCancel={() => setTaskModalOpen(false)}
        onSubmit={(values) => {
          console.log("Submitted:", values);
          setTaskModalOpen(false);
        }}
      />

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-50 p-4 md:p-20 rounded-lg max-h-screen overflow-y-auto">
            <Card className="w-full max-w-md rounded-xl shadow-lg p-6">
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setReviewModal(false)}
                  className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  ✕
                </button>
              </div>
              <CardContent className="p-0">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Leave a Review</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Your feedback helps improve our platform.
                </p>

                <div className="mb-6">
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Your rating:
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((starIndex) => (
                      <Star
                        key={starIndex}
                        className={`w-6 h-6 cursor-pointer ${
                          (hoverRating || rating) >= starIndex
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-300 text-gray-300"
                        }`}
                        onClick={() => setRating(starIndex)}
                        onMouseEnter={() => setHoverRating(starIndex)}
                        onMouseLeave={() => setHoverRating(0)}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <Input id="title" placeholder="Review Title" className="w-full" />
                </div>

                <div className="mb-6">
                  <Textarea id="comment" placeholder="Write your comment" className="w-full min-h-20" />
                </div>

                <div className="flex justify-center">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-lg font-medium">
                    Submit Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>





          
        </div>
      )}
    </>
  );
}