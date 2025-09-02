"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetAllTraderListQuery } from "@/redux/service/customerApi";
import { Skeleton } from "@/components/ui/skeleton";

// Fallback image
import fallbackImg from "@/assets/profiles/profile3.jpg";

type TraderProfile = {
  id: string;
  fastName: string;
  lastName: string;
  title?: string;
  user: {
    username: string;
    avatar: string | null;
  };
  location?: string;
  rating?: number;
  reviewCount?: number;
  mininumHoulyRate?: number | null;
  skills?: string[];
  isOnline?: boolean;
};

export default function AllTradersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch real traders
  const { data, isLoading, error } = useGetAllTraderListQuery();

  // Extract traders
  const traders: TraderProfile[] = data?.data || [];

  // Filter traders
  const filteredTraders = traders.filter((trader) => {
    const fullName = `${trader.fastName} ${trader.lastName}`.toLowerCase();
    const username = trader.user.username.toLowerCase();
    const title = trader.title?.toLowerCase() || "";
    const location = trader.location?.toLowerCase() || "";

    const term = searchTerm.toLowerCase();
    return fullName.includes(term) || username.includes(term) || title.includes(term) || location.includes(term);
  });

  // Pagination
  const totalPages = Math.ceil(filteredTraders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTraders = filteredTraders.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 my-6 p-6">
        <div className="mb-8 flex justify-center">
          <div className="relative max-w-xl w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input type="text" placeholder="Search traders..." className="pl-10" disabled />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white p-6 border shadow-sm h-[420px]">
              <div className="flex flex-col items-center mb-5">
                <Skeleton className="w-20 h-20 rounded-full mb-4" />
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-24 mb-4" />
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 text-gray-300" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mb-5">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="grid grid-cols-3 text-center mb-4">
                <div>
                  <Skeleton className="h-3 w-12 mx-auto mb-1" />
                  <Skeleton className="h-4 w-16 mx-auto" />
                </div>
                <div>
                  <Skeleton className="h-3 w-12 mx-auto mb-1" />
                  <Skeleton className="h-4 w-16 mx-auto" />
                </div>
                <div>
                  <Skeleton className="h-3 w-12 mx-auto mb-1" />
                  <Skeleton className="h-4 w-16 mx-auto" />
                </div>
              </div>
              <Skeleton className="h-12 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 text-lg">Failed to load traders.</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 my-6 p-6">
      {/* Search Bar */}
      <div className="mb-8 flex justify-center">
        <div className="relative max-w-xl w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search traders by name, title, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Traders Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {paginatedTraders.length > 0 ? (
          paginatedTraders.map((trader) => {
            const fullName = `${trader.fastName} ${trader.lastName}`;
            const rate = trader.mininumHoulyRate || 50; // fallback
            const rating = trader.rating || 4.5;
            const reviewCount = trader.reviewCount || 0;
            const location = trader.location || "Unknown";

            return (
              <div
                key={trader.id}
                className="flex flex-col justify-between h-[420px] rounded-2xl bg-white p-6 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Top Content */}
                <div>
                  <div className="flex flex-col items-center mb-5">
                    <div className="relative mb-4">
                      <Image
                        src={trader.user.avatar || fallbackImg}
                        alt={fullName}
                        width={80}
                        height={80}
                        className="rounded-full border-4 border-gray-100 object-cover"
                      />
                      <span
                        className={`absolute bottom-1 right-1 block w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                          trader.isOnline ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900">{fullName}</h3>
                    <p className="text-sm text-gray-500">{trader.title || "Trader"}</p>

                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-sm">{rating}</span>
                      <span className="text-gray-500 text-xs">({reviewCount})</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center mb-5">
                    <Badge className="bg-blue-100 text-blue-800 text-xs">Flying</Badge>
                    <Badge className="bg-green-100 text-green-800 text-xs">Ethical</Badge>
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">Excellent</Badge>
                  </div>

                  <div className="grid grid-cols-3 text-center mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-medium text-sm">{location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Rate</p>
                      <p className="font-medium text-sm">${rate}/hr</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Success</p>
                      <p className="font-medium text-sm">95%</p>
                    </div>
                  </div>
                </div>

                {/* Button */}
                <Link href={`/all-traders/${trader.id}`}>
                  <Button className="w-full rounded-full text-[#E57931] bg-[#FCF2EA] hover:bg-orange-600 hover:text-white py-6 text-[14px] font-semibold transition-colors duration-300">
                    View Profile
                  </Button>
                </Link>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No traders found matching your search.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-xl"
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              variant={currentPage === index + 1 ? "default" : "outline"}
              onClick={() => handlePageChange(index + 1)}
              className="rounded-xl w-10 h-10 p-0"
            >
              {index + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-xl"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}