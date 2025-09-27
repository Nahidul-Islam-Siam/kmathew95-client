/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import img from "@/assets/CardImage/image 2.png";
import { useGetTaskManagementQuery } from "@/redux/service/admin/taskManagemant";
import { useGetCategoryQuery } from "@/redux/service/admin/category";

// ServiceCard Component
function ServiceCard({
  id,
  traderUserId,
  image,
  title,
  price,
  duration,
  rating,
  reviews,
  isPopular = false,
  className = "",
  style,
}: {
  id: string;
  traderUserId: string;
  image: string;
  title: string;
  price: string;
  duration: string;
  rating: number;
  reviews: number;
  isPopular?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const router = useRouter();

  return (
    <div
      className={`w-full rounded-2xl shadow-lg border border-gray-100 flex flex-col sm:flex-row bg-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 font-inter group ${className}`}
      style={style}
    >
      {/* Image */}
      <div className="relative sm:w-2/5 min-h-[180px] sm:min-h-0 aspect-[4/3] sm:aspect-auto">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={false}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        
        {isPopular && (
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Popular
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-2 mb-1 group-hover:text-orange-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-500 flex items-center">
              <span className="w-4 h-4 mr-1">⏱</span>
              {duration}
            </p>
          </div>
          <Button
            variant="secondary"
            className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 rounded-lg text-sm h-auto transition-all shadow-sm hover:shadow-md flex items-center gap-1.5 ml-3 flex-shrink-0"
            onClick={(e) => {
              e.preventDefault();
              if (traderUserId) {
                localStorage.setItem("selectedTraderId", traderUserId);
                router.push("/messages");
              }
            }}
          >
            <MessageCircle className="h-4 w-4" />
            Message
          </Button>
        </div>

        {/* Price & Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">${price}</span>
            <span className="text-sm text-gray-500 ml-1">total</span>
          </div>
          
          <div className="flex items-center bg-amber-50 px-3 py-1 rounded-full">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
            <span className="font-semibold text-gray-900 text-sm">{rating}</span>
            <span className="text-gray-500 text-sm ml-1">({reviews})</span>
          </div>
        </div>

        {/* Description placeholder */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-5">
          Professional service with quick delivery and quality results guaranteed.
        </p>

        {/* Action Button */}
        <div className="mt-auto">
          <Link href={`/all-services/${id}`}>
            <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md hover:scale-[1.02] flex items-center justify-center gap-2">
              View Details
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main Page
export default function AllServicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const ITEMS_PER_PAGE = 6;

  // Read params from URL
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || ""
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );

  // Sync state → URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory) params.set("category", activeCategory);
    if (currentPage > 1) params.set("page", String(currentPage));
    router.push(`/all-services?${params.toString()}`);
  }, [activeCategory, currentPage, router]);

  // Fetch categories & tasks
  const { data: categoryData } = useGetCategoryQuery();


  // console.log("Category Data:", categoryData);

  
  const {
    data,
    isLoading,
    error,
    isFetching,
  } = useGetTaskManagementQuery({
    category: activeCategory || undefined,
    page: currentPage,
    size: ITEMS_PER_PAGE,
  });

  // Transform categories
  const categoryMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    categoryData?.data?.data?.forEach((cat: any) => {
      const subcategories = cat.subCategory?.map((sc: any) => sc.name) || [];
      map[cat.name] = subcategories;
    });
    return map;
  }, [categoryData]);

  // Set default active category
  useEffect(() => {
    if (!activeCategory && categoryData?.data?.data?.length > 0) {
      const firstCategory = categoryData.data.data[0];
      const firstSub = firstCategory.SubCategory?.[0]?.name;
      setActiveCategory(firstSub || firstCategory.name);
    }
  }, [categoryData, activeCategory]);

  const mainCategories = Object.keys(categoryMap);

  const tasks = data?.data?.data || [];
  const total = data?.data?.meta?.total || 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Loader Component
  const Loader = () => (
    <div className="flex justify-center py-6">
      <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full"></div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto text-center">
          <p className="text-red-500">
            Failed to load services. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        {/* Category Dropdowns */}
        <div className="flex gap-1 justify-center flex-wrap mb-6">
          {mainCategories.map((category, catIndex) => {
            const subcategories = categoryMap[category];
            const hasSubcategories = subcategories.length > 0;

            return (
              <DropdownMenu key={`${category}-${catIndex}`}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`h-10 px-4 rounded-full flex items-center gap-1 border ${
                      activeCategory === category ||
                      categoryMap[category]?.includes(activeCategory)
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setActiveCategory(category);
                      setCurrentPage(1);
                    }}
                  >
                    {categoryMap[category]?.includes(activeCategory)
                      ? activeCategory
                      : category}
                    {hasSubcategories && <ChevronDown className="w-3 h-3" />}
                  </Button>
                </DropdownMenuTrigger>

                {hasSubcategories && (
                  <DropdownMenuContent
                    align="center"
                    className="w-48 max-h-60 overflow-y-auto"
                  >
                    {subcategories.map((subcategory, subIndex) => (
                      <DropdownMenuItem
                        key={`${subcategory}-${catIndex}-${subIndex}`}
                        className={`cursor-pointer ${
                          activeCategory === subcategory
                            ? "bg-orange-500 text-white hover:bg-orange-600"
                            : ""
                        }`}
                        onClick={() => {
                          setActiveCategory(subcategory);
                          setCurrentPage(1);
                        }}
                      >
                        {subcategory}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                )}
              </DropdownMenu>
            );
          })}
        </div>

        {/* Heading */}
        <div className="text-center lg:text-left max-w-2xl mb-5">
          <h2 className="text-2xl md:text-[32px] font-bold text-[#E57931] mb-3">
            Trending Services
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            The most popular and best-selling services of all time
          </p>
        </div>

        {/* Task List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Initial Load: Full Skeleton */}
          {isLoading && !isFetching ? (
            Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="animate-pulse flex flex-col sm:flex-row bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <div className="sm:w-2/5 h-32 sm:h-auto bg-gray-200"></div>
                <div className="flex-1 p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))
          ) : isFetching ? (
            <div className="col-span-full">
              <Loader />
              {tasks.length > 0 && (
                <p className="text-center text-sm text-gray-500">Updating results...</p>
              )}
            </div>
          ) : tasks.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 py-10">
              No services found matching your criteria.
            </p>
          ) : (
            tasks.map((task: any, taskIndex: number) => {
              const firstImage = task.files?.[0] || img.src;
              const traderUserId = task.trader?.userId; // Adjust based on your API
              const avgRating = task.trader?.isVerified ? 4.8 : 4.5;
              const reviewCount = Math.floor(Math.random() * 200) + 50;

              return (
                <ServiceCard
                  key={`${task.id}-${taskIndex}`}
                  id={task.id}
                  traderUserId={traderUserId}
                  image={firstImage}
                  title={task.title}
                  price={((task.min_salary + task.max_salary) / 2).toFixed(0)}
                  duration={`${task.deadline.split("T")[0]} deadline`}
                  rating={avgRating}
                  reviews={reviewCount}
                  isPopular={true}
                  className="service-card"
                  style={{ animationDelay: `${taskIndex * 100}ms` }}
                />
              );
            })
          )}
        </div>

        {/* Pagination */}
        {!isLoading && !isFetching && tasks.length > 0 && (
          <div className="flex justify-end items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              ‹
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={`page-${page}`}
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                className={`w-8 h-8 p-0 ${
                  currentPage === page
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              ›
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}