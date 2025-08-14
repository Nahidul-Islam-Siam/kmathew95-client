/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import img1 from "@/assets/CardImage/image 2.png";
import img2 from "@/assets/profiles/profile2.jpg";
import EditTaskModal from "./EditTaskModal";
import OrderModal from "./OrderModal";
import { useDeleteTaskManagementMutation, useGetTaskManagementQuery } from "@/redux/service/admin/taskManagemant";

// 👉 Import SweetAlert2
import Swal from "sweetalert2";
import { Task, TraderOffer } from "@/interface/globalType";
import { toast } from "sonner";

// 🔽 Import real API response type
import { TaskManagementResponseData } from "@/redux/service/admin/taskManagemant";

export default function ManageTradersPage() {
  const [openTasks, setOpenTasks] = useState<{ [taskId: string]: boolean }>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<{
    task: Task;
    user: TraderOffer;
  } | null>(null);
  const [displayedTasks, setDisplayedTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<TaskManagementResponseData | null>(null); // ← Real task for edit

  const {  data: taskManagementData, isLoading, isError } = useGetTaskManagementQuery();

  // 👉 Delete mutation
  const [deleteTask] = useDeleteTaskManagementMutation();

  // Transform API data to UI tasks
  useEffect(() => {
    if (taskManagementData?.data?.data) {
      const tasks: Task[] = taskManagementData.data.data.map((apiTask: TaskManagementResponseData) => {
        const mockOffers = generateMockOffers(apiTask);
        const durationInDays = Math.max(
          1,
          Math.ceil((apiTask.max_salary - apiTask.min_salary) / 25)
        );

        return {
          id: apiTask.id,
          title: apiTask.title,
          duration: `${durationInDays} Day`,
          price: `$${apiTask.max_salary.toFixed(2)}`,
          logo: img1.src,
          users: mockOffers,
        };
      });
      setDisplayedTasks(tasks);
    } else {
      setDisplayedTasks([]);
    }
  }, [taskManagementData]);

  // Mock offers generator
  const generateMockOffers = (apiTask: TaskManagementResponseData): TraderOffer[] => {
    const trader = apiTask.trader;
    const baseName = `${trader.fastName} ${trader.lastName}`;
    const baseEmail = `${trader.fastName.toLowerCase()}.${trader.lastName.toLowerCase()}@example.com`;

    return [
      {
        id: 1,
        name: baseName,
        email: baseEmail,
        avatar: img2.src,
        rating: parseFloat((Math.random() * 0.9 + 4.1).toFixed(1)),
        price: `$${Math.floor(Math.random() * 40) + 20}.00`,
        deliveryTime: `${Math.floor(Math.random() * 10) + 3}D`,
        priceType: "Fixed Price",
      },
      ...(Math.random() > 0.4
        ? [
            {
              id: 2,
              name: `${baseName} (Express)`,
              email: `express_${baseEmail}`,
              avatar: img2.src,
              rating: parseFloat((Math.random() * 0.7 + 4.3).toFixed(1)),
              price: `$${Math.floor(Math.random() * 30) + 30}.00`,
              deliveryTime: `${Math.floor(Math.random() * 5) + 2}D`,
              priceType: "Fixed Price",
            },
          ]
        : []),
      ...(Math.random() > 0.7
        ? [
            {
              id: 3,
              name: "Alex Rivera",
              email: "alex.rivera@example.com",
              avatar: "/placeholder.svg?height=60&width=60",
              rating: parseFloat((Math.random() * 1.0 + 3.8).toFixed(1)),
              price: `$${Math.floor(Math.random() * 25) + 15}.00`,
              deliveryTime: `${Math.floor(Math.random() * 15) + 5}D`,
              priceType: "Fixed Price",
            },
          ]
        : []),
    ];
  };

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

  // ✅ Open edit modal with real task data
  const handleOpenEditModal = (task: TaskManagementResponseData) => {
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

  // 🔥 Delete Handler with SweetAlert2
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
      const res = await deleteTask(taskId).unwrap();

      if (res?.success) {
        setDisplayedTasks((prev) => prev.filter((task) => task.id !== taskId));
        toast.success(res.message || "Task deleted successfully.");
      } else {
        toast.error(res?.message || "Failed to delete task.");
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete the task. Please try again.",
        icon: "error",
      });
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading tasks...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Failed to load tasks.</div>;

  return (
    <>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {displayedTasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks available.</p>
        ) : (
          displayedTasks.map((task) => {
            const showAll = openTasks[task.id] || false;
            const usersToDisplay = showAll ? task.users : task.users.slice(0, 1);

            // 🔍 Find real API task by ID
            const realTask = taskManagementData?.data?.data.find(
              (t: TaskManagementResponseData) => t.id === task.id
            );

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
                        <div className="flex space-x-3 mt-4">
                          <div>
                            {/* ✅ Pass real task to edit handler */}
                            <Button
                              onClick={() => realTask && handleOpenEditModal(realTask)}
                            >
                              Edit Task
                            </Button>
                            <EditTaskModal
                              open={isEditModalOpen}
                              onClose={handleCloseEditModal}
                              task={editingTask} // ← Pass real task
                            />
                          </div>

                          {/* 🔴 Delete Button */}
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
                      <Card key={user.id} className="bg-gray-50 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* Left: Avatar + Info */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                              <Image
                                src={user.avatar}
                                alt={`${user.name}'s avatar`}
                                width={60}
                                height={60}
                                className="rounded-full"
                              />
                              <div className="text-center sm:text-left">
                                <Link href={`/all-traders/${user.id}`}>
                                  <h3 className="text-lg font-semibold text-gray-900 hover:underline">
                                    {user.name}
                                  </h3>
                                </Link>
                                <p className="text-sm text-gray-600">{user.email}</p>
                                <div className="flex flex-col gap-2 md:flex-row items-center justify-center sm:justify-start space-x-1 mt-3">
                                  <span className="text-sm font-medium">Rating {user.rating}</span>
                                  <div className="flex space-x-0.5">{renderStars(user.rating)}</div>
                                </div>
                              </div>
                            </div>

                            {/* Right: Price & Delivery */}
                            <div className="text-center md:text-right">
                              <div className="text-sm md:text-base font-semibold text-gray-900">
                                {user.price} {user.priceType} | {user.deliveryTime} Delivery
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
                              ? "Show Less Traders"
                              : `Show All Traders (${task.users.length})`}
                          </span>
                          {showAll ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Order Summary Modal */}
      {selectedOffer && (
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