/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import img1 from "@/assets/CardImage/image 2.png";
import img2 from "@/assets/profiles/profile2.jpg";
import EditTaskModal from "./EditTaskModal";
import OrderModal from "./OrderModal";

import { toast } from "sonner";
import Swal from "sweetalert2";
import { useGetAllMyTaskRequestQuery } from "@/redux/service/taskapplication";
import { useDeleteTaskManagementMutation } from "@/redux/service/admin/taskManagemant";


// === TYPES ===
interface OfferByTrader {
  id: string;
  userId: string;
  isActive: boolean;
  stripeAccountId: string | null;
  fastName: string;
  lastName: string;
  skills: string[];
  mininumHoulyRate: number | null;
  nationality: string | null;
  tagline: string[];
  description: string | null;
  attachments: string[];
  resumeFile: string | null;
  socialMediaLink: string[];
  isVerified: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TaskApplication {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  offerId: string;
  taskId: "PAYMENT" | "CASH";
  offerByTrader: OfferByTrader;
}

export interface ApiTask {
  id: string;
  title: string;
  taskType: string;
  location: string;
  max_salary: number;
  min_salary: number;
  require_skills: string[];
  description: string;
  deadline: string;
  tags: string[];
  files: string[];
  isActive: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  traderId: string;
  categoryid: string;
  subCategoryid: string | null;
  task_Application: TaskApplication[];
}

interface ApiResponseData {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: ApiTask[];
}

interface ApiResponse {
  message: string;
  success: boolean;
  meta: null;
  data: ApiResponseData;
}

interface TraderOffer {
  id: number;
  name: string;
  email: string;
  avatar: string;
  rating: number;
  price: string;
  deliveryTime: string;
  priceType: string;
}

interface Task {
  id: string;
  title: string;
  duration: string;
  price: string;
  logo: string;
  users: TraderOffer[];
  taskType: "PAYMENT" | "CASH";
}

export default function ManageTradersPage() {
  const [openTasks, setOpenTasks] = useState<{ [taskId: string]: boolean }>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<{
    task: Task;
    user: TraderOffer;
  } | null>(null);
  const [displayedTasks, setDisplayedTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<ApiTask | null>(null);

  const { data: apiResponse, isLoading, error,refetch } = useGetAllMyTaskRequestQuery();
console.log(apiResponse,"API Response");

  const [deleteTask] = useDeleteTaskManagementMutation();

  // Map API response to UI tasks
  useEffect(() => {
    if (!apiResponse?.data?.data) return;

    const tasks: Task[] = apiResponse.data.data.map((apiTask:any) => {
      const offers: TraderOffer[] = apiTask.task_Application.map((app:any, idx:number) => {
        const trader = app.offerByTrader;
        const baseEmail = `${trader.fastName.toLowerCase()}.${trader.lastName.toLowerCase()}@example.com`;
        const offerId = app.id; // Use application ID as offer ID


        return {
          id: offerId,
          name: `${trader.fastName} ${trader.lastName}`,
          email: baseEmail,
          avatar: img2.src, // You can use real avatar if available
          rating: parseFloat((Math.random() * 1.0 + 3.8).toFixed(1)), // mock rating
          price: `$${apiTask.max_salary.toFixed(2)}`, // or use a real bid amount
          deliveryTime: `${Math.floor(Math.random() * 10) + 3}D`,
          priceType: "Fixed Price",
          taskType: apiTask.taskType
        };
      });

      const durationInDays = Math.max(
        1,
        Math.ceil((apiTask.max_salary - apiTask.min_salary) / 25)
      );

      return {
        id: apiTask.id,
        title: apiTask.title,
        duration: `${durationInDays} Day${durationInDays > 1 ? "s" : ""}`,
        price: `$${apiTask.max_salary.toFixed(2)}`,
        logo: img1.src,
        users: offers,
        taskType: apiTask.taskType
      };
    });

    setDisplayedTasks(tasks);
  }, [apiResponse]);

  const toggleUsers = (taskId: string) => {
    setOpenTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
            ? "fill-yellow-400/50 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  const handleOpenEditModal = (task: ApiTask) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  const handleAcceptOffer = (task: Task, user: TraderOffer) => {
    setSelectedOffer({ task, user });
    setIsOrderSummaryOpen(true);
  };

  const handleCloseOrderSummary = () => {
    setIsOrderSummaryOpen(false);
    setSelectedOffer(null);
  };

const handleDeleteTask = async (taskId: string, taskTitle: string) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: `Do you really want to delete "${taskTitle}"? This action cannot be undone.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  try {
    await deleteTask(taskId).unwrap();

    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: `Task "${taskTitle}" deleted successfully!`,
      timer: 2000,
      showConfirmButton: false,
    });

    refetch(); // ✅ Refresh task list from API
  } catch (error: any) {
    const message =
      error?.data?.message || "Failed to delete task. Please try again.";
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: message,
      confirmButtonText: "OK",
    });
    console.error("Delete error:", error);
  }
};

  if (isLoading) return <p className="text-center">Loading tasks...</p>;
  if (error) return <p className="text-center text-red-500">Failed to load tasks.</p>;
  if (!displayedTasks.length) return <p className="text-center text-gray-500">No tasks found.</p>;

  return (
    <>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {displayedTasks.map((task) => {
          const showAll = openTasks[task.id] || false;
          const usersToDisplay = showAll ? task.users : task.users.slice(0, 1);

          // Find the original API task (if needed for editing)
          const realTask = apiResponse?.data?.data.find((t:any) => t.id === task.id) || null;

          return (
            <Card key={task.id} className="bg-white shadow-sm">
              <CardContent className="p-6">
                {/* Task Header */}
                <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="w-40 h-24 bg-slate-900 rounded-lg flex items-center justify-center">
                      <Image
                        src={task.logo}
                        width={80}
                        height={80}
                        alt={task.title}
                        className="w-12 h-12 object-contain filter invert"
                      />
                    </div>
                    <div>
                      <Link href={`/all-services/${task.id}`}>
                        <h3 className="text-sm text-gray-700 font-medium hover:underline">
                          {task.title}
                        </h3>
                      </Link>

                      {/* Show taskType here */}
                      <p className="text-sm text-gray-500 rounded w-24 text-center border bg-gray-100">{task.taskType}</p>
                      <div className="flex space-x-3 mt-4">
                        <Button
                          onClick={() => realTask && handleOpenEditModal(realTask)}
                        >
                          Edit Task
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleDeleteTask(task.id, task.title)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete Task
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {task.duration} / {task.price}
                  </div>
                </div>

                {/* Freelancer Offers */}
                <div className="space-y-4 mt-6">
                  {usersToDisplay.map((user) => (
                    <Card key={user?.id} className="bg-gray-50 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          {/* Left: Avatar + Info */}
                          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                            <Image
                              src={user?.avatar}
                              alt={`${user?.name}'s avatar`}
                              width={60}
                              height={60}
                              className="rounded-full"
                            />
                            <div className="text-center sm:text-left">
                              <Link href={`/all-traders/${user.id}`}>
                                <h3 className="text-lg font-semibold text-gray-900 hover:underline">
                                  {user?.name}
                                </h3>
                              </Link>
                              <p className="text-sm text-gray-600">{user?.email}</p>
                              <div className="flex flex-col gap-2 md:flex-row items-center justify-center sm:justify-start space-x-1 mt-3">
                                <span className="text-sm font-medium">Rating {user?.rating}</span>
                                <div className="flex space-x-0.5">{renderStars(user?.rating)}</div>
                              </div>
                            </div>
                          </div>

                          {/* Right: Price & Delivery */}
                          <div className="text-center md:text-right">
                            <div className="text-sm md:text-base font-semibold text-gray-900">
                              {user?.price} | {user?.deliveryTime} Delivery
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row sm:justify-start gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto bg-transparent"
                            onClick={() => handleAcceptOffer(task, user)}
                          >
                            Accept Offer
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="w-full sm:w-auto bg-slate-700 hover:bg-slate-800"
                          >
                            Send Message
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Toggle Button */}
                  {task.users.length > 1 && (
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        onClick={() => toggleUsers(task.id)}
                        className="flex items-center space-x-2"
                      >
                        <span>
                          {showAll
                            ? "Show Less"
                            : `Show All (${task.users.length})`}
                        </span>
                        {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modals */}
      {isEditModalOpen && editingTask && (
        <EditTaskModal
          open={isEditModalOpen}
          onClose={handleCloseEditModal}
          task={editingTask}
          refetch={refetch}
        />
      )}

      {isOrderSummaryOpen && selectedOffer && (
        <OrderModal
          open={isOrderSummaryOpen}
          onClose={handleCloseOrderSummary}
          task={selectedOffer.task}
          user={selectedOffer.user}
        />
      )}
    </>
  );
}