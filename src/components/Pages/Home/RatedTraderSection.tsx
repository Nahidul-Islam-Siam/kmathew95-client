/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import TraderCard from "./Trader.Card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Typography, Spin } from "antd";
import Link from "next/link";
import { useGetAllTraderListQuery } from "@/redux/service/customerApi"; // assuming this is correct path
import { useEffect } from "react";

const { Title, Text } = Typography;

// Mock average rating and reviews (since not in API yet)
// You can later replace with actual review data via `useGetPublicReviewsQuery` if available
const MOCK_RATINGS = {
  "68ae4a7890db6da22b14eb63": { rating: 4.9, reviews: 595 },
  "68ae46d990db6da22b14eb61": { rating: 4.8, reviews: 420 },
  "68addca790db6da22b14eb5a": { rating: 4.7, reviews: 310 },
  "68adcd84d17443b785513d84": { rating: 4.6, reviews: 280 },
  "68ad100c9736fc05685dccf3": { rating: 4.9, reviews: 720 },
};

export default function RatedTraderSection() {
  const { data, isLoading, error } = useGetAllTraderListQuery();

  // Extract traders
  const tradersData = data?.data || [];

  // Filter only verified and active traders
  const verifiedTraders = tradersData
    .filter((trader: any) => trader.isVerified && trader.isActive)
    .map((trader: any) => {
      const user = trader.user || {};
      const profileId = trader.id;

      // Get mock rating or fallback
     const { rating = 4.5, reviews = 100 } = MOCK_RATINGS[profileId as keyof typeof MOCK_RATINGS] || {};

      return {
        id: profileId,
        avatarSrc: user.avatar || "/images/profiles/default-avatar.jpg",
        name: user.username || `${trader.fastName} ${trader.lastName}`.trim() || "Unknown Trader",
        role: trader.tagline?.length > 0 ? trader.tagline[0] : "Trader",
        rating,
        reviews,
        skills: trader.skills.length > 0 ? trader.skills : ["Trading", "Analysis"],
        location: trader.nationality || "Global",
        rate: trader.mininumHoulyRate
          ? `$${trader.mininumHoulyRate.toFixed(2)} / hr`
          : "$50 / hr", // fallback
        jobSuccess: "95%", // placeholder; can be enhanced later
        description: trader.description || "Professional trader with verified performance.",
        userId: user.id,
      };
    })
    // Sort by rating (highest first)
    .sort((a: any, b: any) => b.rating - a.rating);

  // Optional: limit to top 5
  const topTraders = verifiedTraders.slice(0, 5);

  // Loading state
  if (isLoading) {
    return (
      <section className="w-full py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 flex justify-center">
          <Spin size="large" />
          <span className="ml-4 text-gray-600">Loading top traders...</span>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="w-full py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center text-red-500">
            <p>Failed to load traders. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  // No traders found
  if (topTraders.length === 0) {
    return (
      <section className="w-full py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center text-gray-600">
            <p>No verified traders found at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <div>
            <h1 className="text-[#E57931] text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4">
              Highest Rated Trader
            </h1>
            <Text className="text-gray-600 text-base">
              Top-performing and verified traders trusted by the community.
            </Text>
          </div>
          <Link href="/all-traders">
            <Button className="text-[#E57931] rounded-2xl bg-[#FCF2EA] hover:text-orange-600 font-medium border hover:border-orange-300 px-6 py-3 h-auto text-xs md:text-[15px]">
              All Traders
            </Button>
          </Link>
        </div>

        {/* Trader Cards Swiper Carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              prevEl: ".rated-swiper-button-prev",
              nextEl: ".rated-swiper-button-next",
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="trader-swiper"
          >
            {topTraders.map((trader) => (
              <SwiperSlide key={trader.id}>
                <TraderCard {...trader} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="rated-swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
            <LeftOutlined className="text-gray-600 text-lg" />
          </button>
          <button className="rated-swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
            <RightOutlined className="text-gray-600 text-lg" />
          </button>
        </div>
      </div>
    </section>
  );
}