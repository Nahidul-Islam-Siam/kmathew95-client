/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import CreateTaskModal from "./CreateTaskModal";
import { useGetAllMyTaskRequestOfferQuery } from "@/redux/service/taskapplication";
import { useRequestSubmitMutation } from "@/redux/service/admin/taskManagemant";
import { useCreateReviewMutation } from "@/redux/service/admin/review";
import ReviewModal from "./ReviewModal";
import { toast } from "sonner";


export default function MyTaskApplications() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ✅ Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<{
    taskId: string;
    reviewReceiverId: string;
  } | null>(null);

  // ✅ RTK Mutations
  const [requestSubmit] = useRequestSubmitMutation();
  const [createReview, { isLoading: isReviewSubmitting }] = useCreateReviewMutation();

  const {
    data: applicationsData,
    isLoading,
    isError,
    refetch,
  } = useGetAllMyTaskRequestOfferQuery();

  const applications = applicationsData?.data?.data || [];

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center">
        <p className="text-gray-600">Loading your applications...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center">
        <p className="text-red-600">Failed to load applications. Please try again later.</p>
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "ACCEPTED":
        return "bg-orange-100 text-orange-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTimeLeft = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diffInHours = Math.floor((end.getTime() - now.getTime()) / (1000 * 60 * 60));
    if (diffInHours <= 0) return "Expired";
    if (diffInHours < 24) return `${diffInHours}h left`;
    return `${Math.floor(diffInHours / 24)}d left`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  const handleTaskSubmit = async (applicationId: string) => {
    if (!files || files.length === 0) {
      setSubmitError("Please select at least one file.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      await requestSubmit({ id: applicationId, formData }).unwrap();
      setSubmitSuccess("Task submitted successfully!");
      setFiles(null);
      setSubmittingTaskId(null);
      setTimeout(() => refetch(), 2000);
    } catch (err: any) {
      setSubmitError(err.data?.message || err.message || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Handle Review Submit
  const handleReviewSubmit = async (reviewData: {
    taskId: string;
    rating: number;
    comment: string;
    reviewReceiverId: string;
  }) => {
    try {
      const result = await createReview(reviewData).unwrap();
if(result?.success) {
  toast.success(result.message || "Review submitted successfully!");
      setReviewModalOpen(false);
}     else{
  toast.error(result.message || "Failed to submit review. Please try again.");
}
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to submit review. Please try again.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {applications.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-gray-700">No Task Applications Found</h3>
          <p className="text-gray-500 mt-1">You haven&lsquo;t applied to any tasks yet.</p>
          <Link href="/tasks" className="mt-4 inline-block">
            <Button className="bg-slate-800 hover:bg-slate-700 text-white">
              Browse Tasks
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              My Task Applications ({applications.length})
            </h2>
          </div>

          <div className="space-y-4">
            {applications.map((app: any) => {
              const task = app.task;
              const timeLeft = getTimeLeft(task.deadline);
              const isDelivered = task.status === "DELIVERED";

              return (
                <div
                  key={app.id}
                  className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm flex flex-col md:flex-row md:items-start gap-4"
                >
                  {/* Task Info */}
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>

                    <div className="text-xs text-gray-500">
                      Budget: ${task.min_salary} - ${task.max_salary} | {timeLeft}
                    </div>

                    {/* Task Submission Form */}
                    {submittingTaskId === app.id && (
                      <div className="mt-4 p-4 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Upload Your Work</h4>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                        />

                        {submitError && <p className="text-red-500 text-xs mt-2">{submitError}</p>}
                        {submitSuccess && <p className="text-green-500 text-xs mt-2">{submitSuccess}</p>}

                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            disabled={isSubmitting}
                            onClick={() => handleTaskSubmit(app.id)}
                          >
                            {isSubmitting ? "Uploading..." : "Upload & Submit"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSubmittingTaskId(null)}
                            disabled={isSubmitting}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 items-end">
                    <div
                      className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${getStatusStyle(
                        app.status
                      )}`}
                    >
                      {app.status.replace("_", " ")}
                    </div>

                    <Link href={`/all-services/${task.id}`} className="inline-block">
                      <Button variant="default" size="sm">
                        View Task
                      </Button>
                    </Link>

                    {/* Submit Work Button */}
                    {!isDelivered && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() =>
                          setSubmittingTaskId((prev) => (prev === app.id ? null : app.id))
                        }
                      >
                        {submittingTaskId === app.id ? "Cancel" : "Submit Work"}
                      </Button>
                    )}

                    {/* ✅ Review Button (only if DELIVERED) */}
                    {isDelivered && (
                      <Button
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => {
                          setReviewTarget({
                            taskId: task.id,
                            reviewReceiverId: task.traderId, // Person who posted the task
                          });
                          setReviewModalOpen(true);
                        }}
                      >
                        Review Trader
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ✅ Review Modal */}
      {reviewTarget && (
        <ReviewModal
          open={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          loading={isReviewSubmitting}
          onSubmit={(data: any) =>
            handleReviewSubmit({
              ...data,
              taskId: reviewTarget.taskId,
              reviewReceiverId: reviewTarget.reviewReceiverId,
            })
          }
        />
      )}

      <CreateTaskModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}