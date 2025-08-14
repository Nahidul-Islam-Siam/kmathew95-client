"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Categories
const categories = [
  "UI/UX Design",
  "Web Development",
  "Marketing",
  "AI Development",
  "Sales Executive",
];

// Services Data
const services = [
  {
    id: 1,
    image: "/images/services/service1.png",
    title: "UI Design + Figma + Logo",
    price: "5.00",
    duration: "2 Day",
    rating: 5.0,
    reviews: 73,
    isPopular: true,
    category: "UI/UX Design",
  },
  {
    id: 2,
    image: "/images/services/service1.png",
    title: "UI Design + Figma + Logo",
    price: "5.00",
    duration: "2 Day",
    rating: 5.0,
    reviews: 73,
    isPopular: true,
    category: "UI/UX Design",
  },
  {
    id: 3,
    image: "/images/services/service1.png",
    title: "UI Design + Figma + Logo",
    price: "5.00",
    duration: "2 Day",
    rating: 5.0,
    reviews: 73,
    isPopular: true,
    category: "UI/UX Design",
  },
  {
    id: 4,
    image: "/images/services/service1.png",
    title: "UI Design + Figma + Logo",
    price: "5.00",
    duration: "2 Day",
    rating: 5.0,
    reviews: 73,
    isPopular: true,
    category: "UI/UX Design",
  },

  {
    id: 5,
    image: "/images/services/service1.png",
    title: "UI Design + Figma + Logo",
    price: "5.00",
    duration: "2 Day",
    rating: 5.0,
    reviews: 73,
    isPopular: true,
    category: "UI/UX Design",
  },
  {
    id: 6,
    image: "/images/services/service1.png",
    title: "UI Design + Figma + Logo",
    price: "5.00",
    duration: "2 Day",
    rating: 5.0,
    reviews: 73,
    isPopular: true,
    category: "UI/UX Design",
  },
  {
    id: 7,
    image: "/images/services/service2.png",
    title: "Frontend Development with React",
    price: "10.00",
    duration: "3 Day",
    rating: 4.8,
    reviews: 60,
    isPopular: true,
    category: "Web Development",
  },
  {
    id: 8,
    image: "/images/services/service3.png",
    title: "Facebook & Google Ads",
    price: "15.00",
    duration: "4 Day",
    rating: 4.7,
    reviews: 50,
    isPopular: true,
    category: "Marketing",
  },
  {
    id: 9,
    image: "/images/services/service4.png",
    title: "Custom AI Chatbot",
    price: "100.00",
    duration: "7 Day",
    rating: 5.0,
    reviews: 99,
    isPopular: true,
    category: "AI Development",
  },
  {
    id: 10,
    image: "/images/services/service5.png",
    title: "Sales Funnel Strategy",
    price: "20.00",
    duration: "3 Day",
    rating: 4.5,
    reviews: 35,
    isPopular: false,
    category: "Sales Executive",
  },
  {
    id: 11,
    image: "/images/services/service6.png",
    title: "AI Logo Generation",
    price: "8.00",
    duration: "2 Day",
    rating: 5.0,
    reviews: 42,
    isPopular: true,
    category: "AI Development",
  },
];

export default function TrendingServices() {
  const [activeCategory, setActiveCategory] = useState("UI/UX Design");

  const filteredServices = services.filter(
    (service) => service.category === activeCategory
  );

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50 font-dm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header and Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 md:mb-12 gap-6">
          <div className="text-center lg:text-left max-w-2xl">
            <h2 className="text-2xl  md:text-[32px] font-bold text-[#E57931] mb-3">
              Trending Services
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              The most popular and best-selling services of all time
            </p>
          </div>

          {/* Tabs */}
          <div className="w-full lg:w-auto mb-4">
            <Tabs
              value={activeCategory}
              onValueChange={setActiveCategory}
              className="w-full"
            >
              <TabsList className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5  rounded-full p-1 shadow-sm">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="  px-3 py-2 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-orange-100 data-[state=active]:text-orange-600 whitespace-nowrap rounded-[32px] border border-[#E6E6E6] bg-white shadow-[0_6px_15px_0_rgba(64,79,104,0.05)]"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10 ">
          {filteredServices.map((service, id) => (
            <ServiceCard key={id} {...service} />
          ))}
        </div>

        {/* All Services Button */}
        <div className="text-center">
          <Link href="/all-services">
            <Button className="bg-orange-100 text-orange-600 hover:bg-orange-200 rounded-full px-6 py-5 sm:px-8 sm:py-6 text-sm sm:text-base font-medium transition-colors">
              All Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ServiceCard Component
function ServiceCard({
  image,
  id,
  title,
  price,
  duration,
  rating,
  reviews,
  isPopular = false,
}: {
  image: string;
  title: string;
  id: number;
  price: string;
  duration: string;
  rating: number;
  reviews: number;
  isPopular?: boolean;
}) {
  return (
    <div className="w-full rounded-xl shadow-sm border border-[#E6E6E6] flex flex-col sm:flex-row bg-white overflow-hidden transition-all hover:shadow-md font-inter ">
      {/* Image */}
      <div className="relative sm:w-2/5 min-h-[140px] sm:min-h-[0] aspect-[4/2] sm:aspect-auto">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          priority={false}
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col">
        {/* Top Row */}
        <div className="flex justify-between items-start mb-3">
          {isPopular && (
            <Badge className="bg-[#FCF2EA] text-[#E57931] text-xs font-normal px-3 py-1 rounded-md">
              Popular
            </Badge>
          )}
          <Link href="/dashboard/messages">
          <Button
            variant="secondary"
            className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-md text-xs sm:text-sm h-auto transition-colors"
          >
            Message
          </Button>
          </Link>
        </div>

        {/* Title & Price */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
          <h3 className="font-semibold text-base sm:text-lg md:text-xl leading-tight">
            {title}
          </h3>
          <div className="font-semibold text-gray-900 text-sm sm:text-base whitespace-nowrap">
            {duration} / <span className="text-orange-600">${price}</span>
          </div>
        </div>

        {/* Rating & Button */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center mt-auto pt-3 gap-3">
          <div className="flex items-center text-sm text-gray-700">
            <Star className="h-4 w-4 fill-[#E57931] text-[#E57931] mr-1" />
            <span className="font-medium">{rating}</span>
            <span className="text-black ml-1">({reviews})</span>
          </div>
          <Link href={`/all-services/${id}`}>
            <Button className="bg-[#E57931] hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm h-auto transition-colors">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
