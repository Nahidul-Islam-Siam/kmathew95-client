/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Button, Typography, Card } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { useGetCategoryQuery } from "@/redux/service/admin/category";
import { useEffect, useState } from "react";
import Link from "next/link";

const { Title, Text } = Typography;

// Define types
interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  files: string[];
  SubCategory: SubCategory[];
}

// Fallback dummy data with local images
const fallbackCategories = [
  {
    id: "fallback-1",
    name: "Development & IT",
    icon: "/images/categories/category-1.jpg.png",
    files: [],
    SubCategory: [],
  },
  {
    id: "fallback-2",
    name: "Design & Creative",
    icon: "/images/categories/category-2.jpg.png",
    files: [],
    SubCategory: [],
  },
  {
    id: "fallback-3",
    name: "Digital Marketing",
    icon: "/images/categories/category-3.jpg.png",
    files: [],
    SubCategory: [],
  },
  {
    id: "fallback-4",
    name: "Writing & Translation",
    icon: "/images/categories/category-5.jpg.png",
    files: [],
    SubCategory: [],
  },
  {
    id: "fallback-5",
    name: "Video & Animation",
    icon: "/images/categories/category-3.jpg.png",
    files: [],
    SubCategory: [],
  },
];

// Helper to determine safe image source (avoid localhost)
const getSafeImageSrc = (url: string | undefined, categoryName?: string): string => {
  // If no URL, use fallback
  if (!url) return "/placeholder.svg";

  // If it's a relative/local path (e.g. /images/...), trust it
  if (url.startsWith("/")) return url;

  try {
    const parsedUrl = new URL(url);
    // Block localhost and 127.0.0.1
    if (
      parsedUrl.hostname === "localhost" ||
      parsedUrl.hostname === "127.0.0.1"
    ) {
      // Try to map category name to fallback image
      const fallbackMap: Record<string, string> = {
        "Development & IT": "/images/categories/category-1.jpg.png",
        "Design & Creative": "/images/categories/category-2.jpg.png",
        "Digital Marketing": "/images/categories/category-3.jpg.png",
        "Writing & Translation": "/images/categories/category-5.jpg.png",
        "Video & Animation": "/images/categories/category-3.jpg.png",
      };
      return fallbackMap[categoryName || ""] || "/images/categories/category-1.jpg.png";
    }
    return url; // Safe external URL
  } catch (e) {
    // If URL is malformed, fall back
    return categoryName
      ? getSafeImageSrc(undefined, categoryName)
      : "/images/categories/category-1.jpg.png";
  }
};

export default function TraderCategorySection() {
  const {  data:categoriesData, isLoading, error } = useGetCategoryQuery();
  const [categories, setCategories] = useState<Category[]>([]);

  // Extract and map real data from API
  useEffect(() => {
    if (categoriesData?.data?.data) {
      const mapped = categoriesData.data.data.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon || cat.files?.[0], // prefer icon, fallback to first file
        files: cat.files || [],
        SubCategory: Array.isArray(cat.SubCategory) ? cat.SubCategory : [],
      }));
      setCategories(mapped);
    }
  }, [categoriesData]);

  // Use real categories or fallback
  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  if (error) {
    console.error("Failed to load categories", error);
  }

  // Default link: first category or fallback
  const defaultCategory = displayCategories[0];
  const categoryLink = defaultCategory
    ? `/all-services?category=${encodeURIComponent(defaultCategory.name)}`
    : "/all-services";

  return (
    <div className="py-16 px-4 bg-gray-50 font-dm">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <div>
            <h1 className="text-[#E57931] text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4">
              Categories
            </h1>
            <Text className="text-gray-600 text-base">
              Explore our diverse range of categories tailored for traders.
            </Text>
          </div>

          {/* View All Button */}
          <Link href={categoryLink} passHref>
            <Button
              type="text"
              className="text-[#E57931] rounded-2xl bg-[#FCF2EA] hover:text-orange-600 font-medium border hover:border-orange-300 px-6 py-3 h-auto text-xs md:text-[15px]"
            >
              View All
            </Button>
          </Link>
        </div>

        {/* Swiper Carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              prevEl: ".category-swiper-button-prev",
              nextEl: ".category-swiper-button-next",
            }}
            pagination={{
              clickable: true,
              el: ".category-pagination-dots",
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
            className="category-swiper"
          >
            {displayCategories.map((category) => {
              const skillCount = category.SubCategory.length || 0;
              const imageSrc = getSafeImageSrc(category.icon, category.name);

              return (
                <SwiperSlide key={category.id}>
                  <Link
                    href={`/all-services?category=${encodeURIComponent(category.name)}`}
                    passHref
                  >
                    <Card
                      hoverable
                      className="h-80 overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl cursor-pointer"
                      bodyStyle={{ padding: 0 }}
                      cover={
                        <div className="relative h-80">
                          <Image
                            alt={category.name}
                            width={500}
                            height={500}
                            src={imageSrc}
                            className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-300"
                            unoptimized // Recommended if using dynamic external images
                          />
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-40 hover:bg-opacity-30 transition-all duration-300" />
                          {/* Content */}
                          <div className="absolute bottom-6 left-6 text-white">
                            <Text className="text-white text-sm md:text-base font-medium block !mb-1">
                              {skillCount} {skillCount === 1 ? "skill" : "skills"}
                            </Text>
                            <h2 className="text-white text-lg md:text-xl font-bold truncate max-w-[140px]">
                              {category.name}
                            </h2>
                          </div>
                        </div>
                      }
                    />
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="category-swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
            <LeftOutlined className="text-gray-600 text-lg" />
          </button>
          <button className="category-swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
            <RightOutlined className="text-gray-600 text-lg" />
          </button>

          {/* Pagination Dots */}
          <div className="category-pagination-dots mt-6 flex justify-center" />
        </div>
      </div>
    </div>
  );
}