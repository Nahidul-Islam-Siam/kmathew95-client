/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import img from "@/assets/profiles/profile1.jpg";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import React, { useState } from "react";
import TaskModal from "./TaskModal";

// Fake JSON data
const taskData = {
  title: "Wordpress Guru",
  hourlyRate: 22,
  timeLeft: "6Hours Left",
  price: 22,
  deliveryTime: "14D Delivery Time",
};

const userData = {
  name: "David Peterson",
  email: "david@example.com",
  rating: 4.5,
  walletBalance: 10, // 💰 Set wallet balance here
};

export default function ActiveTask() {
  const [reviewModal, SetReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const modalOpen = () => {
    SetReviewModal(true);
  };
  const closeModal = () => {
    SetReviewModal(false);
  };


    const [taskmodalOpen, setTaskModalOpen] = useState(false)

  const handleSubmit = (values: any) => {
    console.log("Task submitted:", values)
    setTaskModalOpen(false)
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
        {/* Header Section */}

        <h1 className="my-5 text-xl font-bold">My Tasks</h1>
        <div
          className="bg-white rounded-lg p-6
       shadow-sm border border-gray-300 mb-5"
        >
          <div className="flex flex-wrap items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              {taskData.title}
            </h1>
            <div className="flex items-center gap-2 text-lg text-gray-700">
              <span className="font-semibold">
                ${taskData.hourlyRate} Hourly
              </span>
              <span className="text-gray-400">|</span>
              <span className="font-medium">{taskData.timeLeft}</span>
            </div>
          </div>

          {/* Submit Button or Wallet Error */}

          <Button onClick={() => setTaskModalOpen(true)}  className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-md text-base font-medium mb-8">
            Submit Now
          </Button>

              <TaskModal open={taskmodalOpen} onCancel={() => setTaskModalOpen(false)} onSubmit={handleSubmit} />
        </div>

        {/* Profile Card */}
        <h1 className="my-5 text-xl font-bold">My Employers</h1>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex flex-wrap items-start gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <Image
                src={img}
                alt={userData.name}
                width={100}
                height={100}
                className="rounded-lg object-cover"
              />
            </div>

            {/* Profile Content */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {userData.name}
                  </h2>
                  <p className="text-base text-gray-500 mb-3">
                    {userData.email}
                  </p>

                  {/* Rating */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base text-gray-600">
                      Rating {userData.rating}
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4].map((star) => (
                        <Star
                          key={star}
                          className="w-5 h-5 fill-orange-400 text-orange-400"
                        />
                      ))}
                      <Star className="w-5 h-5 fill-gray-300 text-gray-300" />
                    </div>
                  </div>
                </div>

                {/* Price and Delivery Info */}
                <div className="text-right">
                  <div className="flex flex-wrap items-center gap-2 text-lg text-gray-700">
                    <span className="font-semibold">
                      ${taskData.price} Fixed Price
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="font-medium">{taskData.deliveryTime}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-4 ">
                  <Link href={`/all-traders/123`}>
                    <Button
                      variant="outline"
                      className="px-8 py-2.5 text-base border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                    >
                      Details
                    </Button>
                  </Link>
                  <Button className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-2.5 text-base">
                    Send Message
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={modalOpen}
                    className="bg-orange-100 
                hover:bg-orange-500 text-orange-500 hover:text-white px-8 py-2.5 text-base"
                  >
                    Review
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {reviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="flex items-center justify-center rounded-lg md:p-20 bg-gray-50 p-4">
            <Card className="w-full max-w-md rounded-xl shadow-lg p-6">
              <div className="flex justify-end items-center mb-6">
                <button
                  onClick={closeModal}
                  className=" bg-red-500 hover:bg-red-700 text-white px-[10px] py-1 rounded"
                >
                  X
                </button>
              </div>
              <CardContent className="p-0">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Leave a Review About Our Service
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Your email address will not be published
                  <span className="text-red-500">*</span>
                </p>

                <div className="mb-6">
                  <label
                    htmlFor="rating"
                    className="block text-base font-medium text-gray-700 mb-2"
                  >
                    Your rating<span className="text-red-500">*</span>:
                  </label>
                  <div
                    className="flex gap-1"
                    role="radiogroup"
                    aria-label="Your rating"
                  >
                    {[1, 2, 3, 4, 5].map((starIndex) => (
                      <Star
                        key={starIndex}
                        className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
                          (hoverRating || rating) >= starIndex
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-300 text-gray-300"
                        }`}
                        onClick={() => setRating(starIndex)}
                        onMouseEnter={() => setHoverRating(starIndex)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`${starIndex} star${
                          starIndex > 1 ? "s" : ""
                        }`}
                        role="radio"
                        aria-checked={rating === starIndex}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="title" className="sr-only">
                    Title
                  </label>
                  <Input
                    id="title"
                    placeholder="Title"
                    className="w-full px-4 py-2 rounded-lg bg-gray-100 border-none focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-700 placeholder:text-gray-500"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="comment" className="sr-only">
                    Write your comment
                  </label>
                  <Textarea
                    id="comment"
                    placeholder="Write your comment"
                    className="w-full px-4 py-2 rounded-lg bg-gray-100 border-none focus:ring-2 focus:ring-orange-500 focus:outline-none min-h-[120px] resize-none text-gray-700 placeholder:text-gray-500"
                  />
                </div>

                <div className="flex justify-center">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg text-base font-medium shadow-md transition-colors duration-200">
                    Submit
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
