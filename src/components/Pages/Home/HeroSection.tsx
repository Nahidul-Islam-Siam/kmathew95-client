/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import hero1 from "@/assets/hero/Rectangle 158.png";
import hero2 from "@/assets/hero/Rectangle 157.png";
import { SearchBar } from "./SearchBar"; // Adjust path if needed
import { motion } from "framer-motion";
import { useGetCategoryQuery } from "@/redux/service/admin/category";
import { useState } from "react";

// 🔽 Fallback / Mock Category Data
const fallbackCategories = [
  { id: "68ad18ce3af9fbf6b9e6b3a6", name: "Web Development", icon: "💻" },
  { id: "68ad19a13af9fbf6b9e6b3a7", name: "Design & UI/UX", icon: "🎨" },
  { id: "68ad1a2c3af9fbf6b9e6b3a8", name: "Mobile Development", icon: "📱" },
  { id: "68ad1ab43af9fbf6b9e6b3a9", name: "Writing & Content", icon: "✍️" },
  { id: "68ad1b2f3af9fbf6b9e6b3aa", name: "Marketing", icon: "📢" },
  { id: "68ad1bb83af9fbf6b9e6b3ab", name: "Video Editing", icon: "🎥" },
  { id: "68ad1c3d3af9fbf6b9e6b3ac", name: "AI & Automation", icon: "🤖" },
  { id: "68ad1cc53af9fbf6b9e6b3ad", name: "Customer Support", icon: "📞" },
];

export default function Hero() {
  const { data: categoryResponse, isLoading, isError } = useGetCategoryQuery();

  // Use real data or fallback
  const categories = isError || isLoading || !categoryResponse?.data?.data?.length
    ? fallbackCategories
    : categoryResponse.data.data;

  // Ensure each category has required fields (map fallback if needed)
  const processedCategories = categories.map((cat: any) => ({
    id: cat.id || cat._id || crypto.randomUUID?.(),
    name: cat.name || "Unknown Category",
    icon: cat.icon || "📌",
  }));

  const handleSearch = (query: string, categoryId: string) => {
    console.log("Search Query:", query);
    console.log("Selected Category ID:", categoryId);
    // Implement actual search logic (e.g., route navigation or filtering)
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const imageContainerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        when: "beforeChildren",
      },
    },
  };

  const imageItemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-[#1C2A47] relative overflow-hidden">
      <div className="container mx-auto md:py-16 py-10 px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="space-y-4 text-center md:text-left" variants={itemVariants}>
              <h1 className="text-orange-500 text-4xl md:text-5xl font-bold">No Money?</h1>
              <h2 className="text-white text-4xl md:text-5xl font-bold">No Problem</h2>
              <p className="text-gray-300 text-lg max-w-md mx-auto md:mx-0">
                It is a long established fact that a reader will be distracted by the readable content.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <SearchBar categories={processedCategories} onSearch={handleSearch} />
            </motion.div>
          </motion.div>

          {/* Right Images */}
          <motion.div
            className="relative"
            variants={imageContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex gap-3 justify-end">
              <motion.div
                variants={imageItemVariants}
                whileHover={{ scale: 1.05 }}
                className="w-1/2"
              >
                <Image
                  src={hero1}
                  alt="Team collaboration"
                  width={500}
                  height={500}
                  className="rounded-md object-cover shadow-lg"
                  priority
                />
              </motion.div>
              <motion.div
                variants={imageItemVariants}
                whileHover={{ scale: 1.05 }}
                className="w-1/2"
              >
                <Image
                  src={hero2}
                  alt="Creative workspace"
                  width={500}
                  height={600}
                  className="rounded-md object-cover shadow-lg"
                  priority
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Optional: Show small indicator if using fallback */}
      {isError && (
        <div className="absolute bottom-4 left-4 text-xs text-gray-500">
          Displaying demo categories (API unavailable).
        </div>
      )}
    </div>
  );
}