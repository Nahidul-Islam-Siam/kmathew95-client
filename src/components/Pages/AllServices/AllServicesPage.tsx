"use client";
import { useState } from "react";
import { Search, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import img from "@/assets/CardImage/image 2.png";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Fake JSON data for categories
const jobCategories = {
  "UI/UX Design": [
    "Web Design",
    "Mobile Design",
    "User Research",
    "Prototyping",
  ],
  "Web Development": ["Frontend", "Backend", "Full Stack", "DevOps"],
  Marketing: ["Digital Marketing", "Content Marketing", "SEO", "Social Media"],
  "AI Development": [
    "Machine Learning",
    "Data Science",
    "Computer Vision",
    "NLP",
  ],
  "Sales Executive": [
    "Inside Sales",
    "Field Sales",
    "Account Management",
    "Business Development",
  ],
} as const;

type JobCategory = keyof typeof jobCategories;

// Adapted service data based on jobListings and ServiceCard props
const serviceListings = [
  {
    id: 1,
    title: "bespoke Logo Design + One Day Delivery + Unlimited Revisions + Favicon + Source files",
    // Using the imported image for all cards for now
    image: img.src,
    price: "4173",
    duration: "2 day",
    rating: 5.0,
    reviews: 120,
    isPopular: true,
    // company: "Lamborghini", // Not directly used in ServiceCard but available
    // timePosted: "2 day / $4.00", // Handled by duration/price
    // tags: ["Popular"], // Handled by isPopular prop
    // type: "remote", // Not directly used in ServiceCard
    description:
      "This remote freelance service offers bespoke logo design with one-day delivery, unlimited revisions, favicon creation, and source files included. Clients receive high-quality branding assets. Perfect for creative professionals seeking quick-turnaround branding work.",
  },
  {
    id: 2,
    title: "bespoke Logo Design + One Day Delivery + Unlimited Revisions + Favicon + Source files",
    image: img.src,
    price: "4173",
    duration: "2 day",
    rating: 4.8,
    reviews: 95,
    isPopular: true,
    description: "High-quality logo design service with fast turnaround.",
  },
  {
    id: 3,
    title: "bespoke Logo Design + One Day Delivery + Unlimited Revisions + Favicon + Source files",
    image: img.src,
    price: "4173",
    duration: "2 day",
    rating: 4.9,
    reviews: 88,
    isPopular: true,
    description: "Professional branding solutions for your business.",
  },
  {
    id: 4,
    title: "bespoke Logo Design + One Day Delivery + Unlimited Revisions + Favicon + Source files",
    image: img.src,
    price: "4173",
    duration: "2 day",
    rating: 5.0,
    reviews: 210,
    isPopular: true,
    description: "Get your unique logo designed quickly and efficiently.",
  },
  {
    id: 5,
    title: "bespoke Logo Design + One Day Delivery + Unlimited Revisions + Favicon + Source files",
    image: img.src,
    price: "4173",
    duration: "2 day",
    rating: 4.7,
    reviews: 76,
    isPopular: true,
    description: "Comprehensive logo design package with all necessary files.",
  },
  {
    id: 6,
    title: "bespoke Logo Design + One Day Delivery + Unlimited Revisions + Favicon + Source files",
    image: img.src,
    price: "4173",
    duration: "2 day",
    rating: 4.9,
    reviews: 154,
    isPopular: true,
    description: "Expert logo design services tailored to your needs.",
  },
  {
    id: 7,
    title: "bespoke Logo Design + One Day Delivery + Unlimited Revisions + Favicon + Source files",
    image: img.src,
    price: "4173",
    duration: "2 day",
    rating: 5.0,
    reviews: 92,
    isPopular: true,
    description: "Award-winning logo design delivered in one day.",
  },
  {
    id: 8,
    title: "bespoke Logo Design + One Day Delivery + Unlimited Revisions + Favicon + Source files",
    image: img.src,
    price: "4173",
    duration: "2 day",
    rating: 4.8,
    reviews: 67,
    isPopular: true,
    description: "Creative and professional logo design services.",
  },
];

// Define the ServiceCard component
function ServiceCard({
  id,
  image,
  title,
  price,
  duration,
  rating,
  reviews,
  isPopular = false,
}: {
  id: number;
  image: string;
  title: string;
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
            <span className="bg-[#FCF2EA] text-[#E57931] text-xs font-normal px-3 py-1 rounded-md">
              Popular
            </span>
          )}
          <Button
            variant="secondary"
            className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-md text-xs sm:text-sm h-auto transition-colors"
          >
            Message
          </Button>
        </div>
        {/* Title & Price */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
          <h3 className="font-semibold text-base sm:text-lg md:text-xl leading-tight line-clamp-2">
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
          {/* Assuming the link is based on service ID */}
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

export default function AllServicesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("UI/UX Design");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Simple pagination logic (show all for now, adjust ITEMS_PER_PAGE as needed)
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(serviceListings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedServices = serviceListings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto">
        {/* Search Section */}
        <div className="mb-8">
          <div className="flex gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-gray-300 rounded-lg"
              />
            </div>
            <Button className="h-12 px-8 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">
              Search
            </Button>
          </div>
        </div>
        {/* Category Dropdowns */}
        <div className="flex gap-1 justify-center flex-wrap mb-6">
          {(Object.keys(jobCategories) as JobCategory[]).map((category) => (
            <DropdownMenu key={category}>
              <DropdownMenuTrigger asChild>
                <Button
            
                  variant={
                    (jobCategories[category] as readonly string[]).includes(
                      activeCategory
                    )
                      ? "default"
                      : "ghost"
                  }
                  className={`h-10 px-4 rounded-full flex items-center gap-1 border ${
                    (jobCategories[category] as readonly string[]).includes(
                      activeCategory
                    )
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {category}
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                {jobCategories[category].map((subcategory) => (
                  <DropdownMenuItem
                    key={subcategory}
                    className="cursor-pointer"
                    onClick={() => setActiveCategory(subcategory)}
                  >
                    {subcategory}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-500 text-sm">All ({serviceListings.length})</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
          {paginatedServices.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              image={service.image}
              title={service.title}
              price={service.price}
              duration={service.duration}
              rating={service.rating}
              reviews={service.reviews}
              isPopular={service.isPopular}
            />
          ))}
        </div>
        {/* Pagination */}
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
          {/* Render page numbers dynamically */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
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
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            ›
          </Button>
        </div>
      </div>
    </div>
  );
}