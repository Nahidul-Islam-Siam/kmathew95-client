/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Star } from "lucide-react";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useGetPublicReviewsQuery } from "@/redux/service/admin/review";

// === Types (Optional: move to types/review.ts) ===
interface ReviewProvider {
  fastName: string;
  lastName: string;
}

interface Task {
  title: string;
}

interface ApiReview {
  id: string;
  comment: string;
  rating: number;
  createdAt: string;
  reviewProvider: ReviewProvider | null;
  task: Task | null;
}

interface ApiResponseData {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: ApiReview[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: null | unknown;
}

export default function Reviews() {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch real reviews
  const {  data:apiResponse, isLoading: isApiLoading } = useGetPublicReviewsQuery();

  // Extract all reviews from API
  const allReviewsFromApi = apiResponse?.data?.data || [];

  // Map API data to display format
  const mappedReviews = allReviewsFromApi.map((review) => {
    const userName = review.reviewProvider
      ? `${review.reviewProvider.fastName} ${review.reviewProvider.lastName}`
      : "Unknown User";

    const reviewTitle = review.task?.title || "No Task Title";
    const reviewText = review.comment;
    const rating = review.rating;
    const date = new Date(review.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return {
      id: review.id,
      userName,
      reviewTitle,
      reviewText,
      rating,
      date,
      isPublished: true, // Assuming all fetched reviews are public/published
    };
  });

  // Filter reviews by search term
  const filteredReviews = useMemo(() => {
    return mappedReviews.filter(
      (review) =>
        review.userName.toLowerCase().includes(searchText.toLowerCase()) ||
        review.reviewTitle.toLowerCase().includes(searchText.toLowerCase()) ||
        review.reviewText.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [mappedReviews, searchText]);

  // Paginate filtered results
  const totalPages = Math.ceil(filteredReviews.length / pageSize);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Debounced search
  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchText(value);
        setCurrentPage(1); // Reset to first page on new search
      }, 400),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel(); // Cleanup
    };
  }, [debouncedSetSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearch(e.target.value);
  };

  // Toggle publish status (frontend-only toggle for demo)
  const [publishedStatus, setPublishedStatus] = useState<Record<string, boolean>>({});
  const togglePublishStatus = (id: string) => {
    setPublishedStatus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isLoading = isApiLoading;

  return (
    <div className="bg-white w-full">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">All Reviews</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search reviews..."
            value={searchText}
            onChange={handleSearchChange}
            className="pl-10 w-64 border-gray-200"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-700 hover:bg-slate-700">
              <TableHead className="text-white font-medium">User Name</TableHead>
              <TableHead className="text-white font-medium">Review Title</TableHead>
              <TableHead className="text-white font-medium">Review Text</TableHead>
              <TableHead className="text-white font-medium">Date</TableHead>
              <TableHead className="text-white font-medium">Rating</TableHead>
              <TableHead className="text-white font-medium">Publish</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  Loading reviews...
                </TableCell>
              </TableRow>
            ) : paginatedReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No reviews found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              paginatedReviews.map((review) => (
                <TableRow key={review.id} className="hover:bg-gray-50">
                  <TableCell className="text-gray-700">{review.userName}</TableCell>
                  <TableCell className="text-gray-700 font-medium">{review.reviewTitle}</TableCell>
                  <TableCell className="text-gray-600 text-sm max-w-md truncate">
                    {review.reviewText}
                  </TableCell>
                  <TableCell className="text-gray-700">{review.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => togglePublishStatus(review.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                        publishedStatus[review.id] ?? review.isPublished
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          publishedStatus[review.id] ?? review.isPublished
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && filteredReviews.length > 0 && (
        <div className="flex justify-center items-center py-6 border-t bg-gray-50">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8"
            >
              ‹
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const startPage = Math.max(1, currentPage - 2);
              const pageNumber = startPage + i;
              if (pageNumber > totalPages) return null;

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "ghost"}
                  size="icon"
                  className={`w-8 h-8 ${
                    currentPage === pageNumber
                      ? "bg-slate-700 text-white hover:bg-slate-800"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
              className="w-8 h-8"
            >
              ›
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}