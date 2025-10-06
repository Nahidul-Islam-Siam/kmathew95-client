/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";
import { Download, Heart } from "lucide-react";
import defaultImg from "@/assets/CardImage/image 2.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateTaskRequestMutation, useGetTaskManagementByIdQuery } from "@/redux/service/admin/taskManagemant";
import { useAddFavoriteMutation } from "@/redux/service/favourite";
import { toast } from "sonner";
import { Spin } from "antd";

// Define types
interface Trader {
  firstName?: string;
  profilePhoto?: string;
}

interface JobData {
  title: string;
  description: string;
  min_salary?: number;
  max_salary?: number;
  require_skills: string[];
  tags: string[];
  location: string;
  deadline: string;
  files: string[];
  trader: Trader;
  taskType: string;
}

// Loading Skeleton Component
const JobDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 container mx-auto px-4 py-8 animate-pulse">
      {/* Header Card Skeleton */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-72 w-full h-52 md:h-auto bg-gray-300"></div>
          <div className="flex-1 p-6 space-y-4">
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-6 w-16 rounded-full bg-gray-200"></div>
              ))}
            </div>
            <div className="h-8 w-3/4 rounded bg-gray-200"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200"></div>

            {/* Salary & Deadline */}
            <div className="flex gap-6 mt-4">
              <div className="h-5 w-24 rounded bg-gray-200"></div>
              <div className="h-5 w-32 rounded bg-gray-200"></div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <div className="h-12 w-32 rounded-full bg-gray-200"></div>
              <div className="h-12 w-36 rounded-full bg-gray-200"></div>
              <div className="h-12 w-32 rounded-full bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex flex-col lg:flex-row gap-10 mt-10">
        {/* Left: Content */}
        <div className="flex-1 space-y-6">
          <div className="h-7 w-48 rounded bg-gray-200"></div>
          <div className="h-4 w-full rounded bg-gray-200"></div>
          <div className="h-4 w-5/6 rounded bg-gray-200"></div>
          <div className="h-4 w-4/6 rounded bg-gray-200"></div>

          {/* Skills */}
          <div className="mt-6">
            <div className="h-6 w-36 rounded bg-gray-200 mb-4"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 w-20 rounded-lg bg-gray-200"></div>
              ))}
            </div>
          </div>

          {/* Payment Type */}
          <div className="h-6 w-24 rounded bg-gray-200 mt-6"></div>
        </div>

        {/* Right: Order Summary */}
        <div className="w-full max-w-md">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="h-6 w-32 rounded bg-gray-200 mb-6"></div>

            {/* Task Preview */}
            <div className="flex items-start gap-3 pb-6 border-b border-gray-200">
              <div className="w-12 h-12 rounded-lg bg-gray-200"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="h-3 w-1/2 rounded bg-gray-200"></div>
              </div>
            </div>

            {/* Price */}
            <div className="py-4 space-y-2 border-b border-gray-200">
              <div className="h-4 w-full rounded bg-gray-200"></div>
            </div>

            {/* Button */}
            <div className="h-12 w-full rounded-lg bg-gray-200 mt-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServicesDetailsPage = () => {
  const params = useParams();
  const rawId = params?.id;
  const id = typeof rawId === "string" ? rawId : Array.isArray(rawId) ? rawId[0] : "";

  const isValidId = !!id;

  const {
    data: jobDataById,
    isLoading: isLoadingJob,
    error,
  } = useGetTaskManagementByIdQuery(id, {
    skip: !isValidId,
  });

  const [createTaskRequest] = useCreateTaskRequestMutation();
  const [addToFavorites, { isLoading: isAddingFavorite }] = useAddFavoriteMutation();

  const [isFavoriteModalOpen, setIsFavoriteModalOpen] = React.useState(false);
  const [isFavorited, setIsFavorited] = React.useState(false);

  const jobFromApi = jobDataById?.data as JobData | undefined;

  // Handle "Request Task"
  const handleRequestTask = async (taskId: string) => {
    if (!taskId) return;

    try {
      const res = await createTaskRequest({ taskId }).unwrap();
      if (res.success) {
        toast.success(res?.message || "Task request sent successfully.");
      } else {
        toast.error(res?.message || "Failed to send task request.");
      }
    } catch (error) {
      console.error("Failed to send task request:", error);
      toast.error("Failed to send task request.");
    }
  };

  // Handle "Add to Favorites"
  const handleAddFavorite = async () => {
    if (!id) return;

    const payload: { type: "TASK"; taskId: string } = {
      type: "TASK",
      taskId: id,
    };

    try {
      const res = await addToFavorites(payload).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Added to favorites!");
        setIsFavorited(true);
      } else {
        toast.error(res?.message || "Failed to add to favorites.");
      }
      setIsFavoriteModalOpen(false);
    } catch (err: any) {
      console.error("Favorite error:", err);
      toast.error(err?.data?.message || "Failed to add to favorites.");
    }
  };

  // ✅ Loading State
  if (isLoadingJob || !isValidId) {
    return <JobDetailSkeleton />;
  }

  // ✅ Error or No Data State
  if (error || !jobFromApi) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500">Oops! Job not found.</h2>
          <p className="text-gray-500 mt-2">
            The job you&apos;re looking for may have been removed or expired.
          </p>
          <Link href="/all-services">
            <Button className="mt-4 bg-orange-500 hover:bg-orange-600">
              Browse All Jobs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Extract Data
  const {
    title,
    description,
    min_salary,
    max_salary,
    require_skills = [],
    tags = [],
    location,
    deadline,
    files: attachedFiles = [],
    trader,
    taskType,
  } = jobFromApi;

  const company = trader?.firstName || "Freelancer";
  const profilePic = trader?.profilePhoto || defaultImg;

  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Not specified";

  const salaryText =
    min_salary && max_salary
      ? `$${min_salary} – $${max_salary}`
      : min_salary
      ? `$${min_salary}+`
      : "Price on request";

  const files = attachedFiles.map((url: string, i: number) => ({
    name:
      url.split("/").pop()?.split("-").slice(1).join("-") || `Attachment ${i + 1}`,
    type: url.split(".").pop()?.toUpperCase() || "FILE",
    url,
  }));

  const handleDownload = (fileName: string, fileUrl: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 container mx-auto px-4 py-8">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-72 w-full h-52 md:h-auto bg-gray-900 flex-shrink-0">
            <Image
              src={profilePic}
              alt={`${company} profile`}
              width={600}
              height={600}
              unoptimized={typeof profilePic === "string" && profilePic.startsWith("http")}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title & Location */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
              {title}
            </h1>
            <p className="text-gray-500 text-sm mb-4">{location}</p>

            {/* Salary & Deadline */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-orange-500">💰</span>
                <span className="font-semibold text-gray-900">{salaryText}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-red-500">📅</span>
                <time className="text-gray-600" dateTime={deadline}>
                  Deadline: {formattedDeadline}
                </time>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-medium"
                onClick={() => alert("Hire Now clicked")}
              >
                Hire Now
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                asChild
              >
                <Link href="/messages">Contact Trader</Link>
              </Button>

              {/* Favorite Button */}
              <Dialog open={isFavoriteModalOpen} onOpenChange={setIsFavoriteModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsFavoriteModalOpen(true);
                    }}
                    className={`flex items-center gap-2 ${
                      isFavorited
                        ? "text-red-500 hover:text-red-600"
                        : "text-gray-500 hover:text-red-500"
                    }`}
                    aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart
                      className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`}
                    />
                    <span>{isFavorited ? "Favorited" : "Favorite"}</span>
                  </Button>
                </DialogTrigger>

                {/* Confirmation Modal */}
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add to Favorites?</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to add <strong>{title}</strong> to your favorites?
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter className="sm:justify-end">
                    <Button
                      variant="ghost"
                      onClick={() => setIsFavoriteModalOpen(false)}
                      className="text-gray-500"
                    >
                      No, Cancel
                    </Button>
                    <Button
                      variant="default"
                      className="bg-orange-500 hover:bg-orange-600"
                      onClick={handleAddFavorite}
                      disabled={isAddingFavorite}
                    >
                      {isAddingFavorite ? "Adding..." : "Yes, Add"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-10 mt-10">
        {/* Left: Job Details */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Description</h2>
          <p className="text-gray-700 leading-relaxed mb-8">{description}</p>

          {/* Required Skills */}
          {require_skills.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {require_skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Task Type */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Type</h3>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
              {taskType}
            </span>
          </div>

          {/* Attached Files */}
          {/* 
          {files.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Attachments</h3>
              <div className="space-y-3">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded flex items-center justify-center">
                        <span className="text-orange-600 font-bold text-sm">
                          {file.type}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {file.type} • Click to download
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(file.name, file.url)}
                      aria-label={`Download ${file.name}`}
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          */}
        </div>

        {/* Right: Order Summary */}
        <div className="w-full max-w-md">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Request Task</h2>

            {/* Task Preview */}
            <div className="flex items-start gap-3 pb-6 border-b border-gray-200">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Image
                  src={profilePic}
                  alt="Task"
                  width={48}
                  height={48}
                  unoptimized={typeof profilePic === "string" && profilePic.startsWith("http")}
                  className="rounded-lg"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                  {title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">By {company}</p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="py-4 space-y-2 border-b border-gray-200">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Price Range</span>
                <span className="font-medium text-gray-900">{salaryText}</span>
              </div>
            </div>

            {/* Request Button */}
            <Button
              className="w-full mt-6 h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base rounded-lg"
              onClick={() => handleRequestTask(id)}
            >
              Request Task
            </Button>
          </div>
        </div>
      </div>

      {/* Similar Jobs Section (Commented out) */}
      {/* 
      <div className="mt-16 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex">
                <div className="w-32 h-24 bg-gray-900 flex-shrink-0">
                  <Image
                    src={defaultImg}
                    alt="Similar job"
                    width={128}
                    height={96}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                    Need a modern landing page with responsive design and animations
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">By {company}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-orange-600 font-medium">
                      ${min_salary || 150}+
                    </span>
                    <Link href={`/all-services/${id}`}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-orange-600 hover:text-orange-700"
                      >
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      */}
    </div>
  );
};

export default ServicesDetailsPage;