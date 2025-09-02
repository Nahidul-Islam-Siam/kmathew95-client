"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import img from "@/assets/CardImage/image 2.png"; // fallback image

// Import types to ensure type safety
import type { FavoriteItem } from "@/redux/service/favourite";

interface FavoriteJobProps {
  jobs: FavoriteItem[];
  onDelete: (id: string) => void;
}


const FavoriteJob = ({ jobs, onDelete }: FavoriteJobProps) => {
  const handleDelete = (id: string) => {
    onDelete(id);
  };
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 gap-6">
        {jobs.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No favorite jobs found.</p>
        ) : (
          jobs.map((fav) => {
            const task = fav.task;
            if (!task) return null;

            return (
              <div
                key={fav.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Company Logo / Image */}
                  <div className="w-full md:w-48 bg-gray-900 flex items-center justify-center p-4">
                    <Image
                      src={img} // You can replace with dynamic trader profile photo if available
                      alt={`${task.title} image`}
                      width={60}
                      height={60}
                      className="rounded-lg object-contain"
                    />
                  </div>

                  {/* Job Details */}
                  <div className="flex-1 min-w-0 p-4">
                    {/* Tags & Remove Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex flex-wrap gap-2">
                        {task.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Button
                        onClick={() => handleDelete(fav.id)}  
                        size="extraSmall"
                        className="px-3 bg-[#FCF2EA] hover:bg-orange-100 text-orange-500 hover:text-orange-700 text-xs rounded-xl transition-colors"
                      >
                        Remove
                      </Button>
                    </div>

                    {/* Title & Time Posted */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between my-2 gap-2">
                      <h3 className="sm:w-2/3 font-medium text-gray-900 line-clamp-2">
                        {task.title}
                      </h3>
                      <p className="text-xs text-gray-500 whitespace-nowrap">
                        Posted {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Salary & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-orange-500">★</span>
                        <span className="font-semibold text-gray-900">
                          ${task.min_salary} - ${task.max_salary}
                        </span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="extraSmall"
                          className="px-4 bg-blue-900 hover:bg-blue-800 text-white text-xs rounded-full transition-colors"
                        >
                          Message
                        </Button>
                        <Link href={`/all-services/${task.id}`}>
                          <Button
                            size="extraSmall"
                            className="px-3 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded-full transition-colors"
                          >
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FavoriteJob;