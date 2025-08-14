/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Star } from "lucide-react"
import { debounce } from "lodash"
import { useEffect, useMemo, useState } from "react"

interface Review {
  id: string
  userName: string
  reviewTitle: string
  reviewText: string
  date: string
  rating: number
  isPublished: boolean
}

export default function Reviews() {
  const [searchText, setSearchText] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState(searchText)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const [reviewsData, setReviewsData] = useState<{
    data: Review[]
    total: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fake API
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true)
      await new Promise((res) => setTimeout(res, 500))

      const allReviews: Review[] = [
        {
          id: "1",
          userName: "Alena Gouse",
          reviewTitle: "Psum elit viverra...",
          reviewText: "We were extremely...",
          date: "May 19, 2025",
          rating: 5.0,
          isPublished: true,
        },
        {
          id: "2",
          userName: "Alena Gouse",
          reviewTitle: "Psum elit viverra...",
          reviewText: "We were extremely...",
          date: "May 19, 2025",
          rating: 5.0,
          isPublished: true,
        },
        {
          id: "3",
          userName: "Alena Gouse",
          reviewTitle: "Psum elit viverra...",
          reviewText: "We were extremely...",
          date: "May 19, 2025",
          rating: 5.0,
          isPublished: true,
        },
        {
          id: "4",
          userName: "Alena Gouse",
          reviewTitle: "Psum elit viverra...",
          reviewText: "We were extremely...",
          date: "May 19, 2025",
          rating: 5.0,
          isPublished: true,
        },
        {
          id: "5",
          userName: "Alena Gouse",
          reviewTitle: "Psum elit viverra...",
          reviewText: "We were extremely...",
          date: "May 19, 2025",
          rating: 5.0,
          isPublished: true,
        },
        {
          id: "6",
          userName: "Alena Gouse",
          reviewTitle: "Psum elit viverra...",
          reviewText: "We were extremely...",
          date: "May 19, 2025",
          rating: 5.0,
          isPublished: true,
        },
        {
          id: "7",
          userName: "Alena Gouse",
          reviewTitle: "Psum elit viverra...",
          reviewText: "We were extremely...",
          date: "May 19, 2025",
          rating: 5.0,
          isPublished: true,
        },
        {
          id: "8",
          userName: "Alena Gouse",
          reviewTitle: "Psum elit viverra...",
          reviewText: "We were extremely...",
          date: "May 19, 2025",
          rating: 5.0,
          isPublished: true,
        },
        {
          id: "9",
          userName: "Alena Gouse",
          reviewTitle: "Psum elit viverra...",
          reviewText: "We were extremely...",
          date: "May 19, 2025",
          rating: 5.0,
          isPublished: true,
        },
        {
          id: "10",
          userName: "Alena Gouse",
          reviewTitle: "Psum elit viverra...",
          reviewText: "We were extremely...",
          date: "May 19, 2025",
          rating: 5.0,
          isPublished: true,
        },
        // Add more reviews for pagination
        {
          id: "11",
          userName: "John Smith",
          reviewTitle: "Amazing service quality...",
          reviewText: "The team delivered exceptional...",
          date: "May 18, 2025",
          rating: 4.8,
          isPublished: true,
        },
        {
          id: "12",
          userName: "Jane Doe",
          reviewTitle: "Great experience overall...",
          reviewText: "I was impressed with the...",
          date: "May 17, 2025",
          rating: 4.9,
          isPublished: false,
        },
        {
          id: "13",
          userName: "Mike Johnson",
          reviewTitle: "Professional and reliable...",
          reviewText: "Highly recommend their services...",
          date: "May 16, 2025",
          rating: 4.7,
          isPublished: true,
        },
      ]

      const filtered = allReviews.filter(
        (review) =>
          review.userName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          review.reviewTitle.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          review.reviewText.toLowerCase().includes(debouncedSearch.toLowerCase()),
      )

      const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

      setReviewsData({ data: paginated, total: filtered.length })
      setIsLoading(false)
    }

    fetchReviews()
  }, [debouncedSearch, currentPage, pageSize])

  const debouncedSetSearch = useMemo(
    () =>
      debounce((val: string) => {
        setDebouncedSearch(val)
      }, 400),
    [],
  )

  useEffect(() => {
    debouncedSetSearch(searchText)
  }, [searchText, debouncedSetSearch])

  const reviews = reviewsData?.data || []
  const total = reviewsData?.total || 0

  const togglePublishStatus = (id: string) => {
    setReviewsData((prev) => {
      if (!prev) return prev

      const updatedData = prev.data.map((review) =>
        review.id === id ? { ...review, isPublished: !review.isPublished } : review,
      )

      return { ...prev, data: updatedData }
    })
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="bg-white w-full">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">All Reviews</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search orders..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value)
              setCurrentPage(1)
            }}
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
                  Loading...
                </TableCell>
              </TableRow>
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No reviews found.
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review, index) => (
                <TableRow key={review.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <TableCell className="text-gray-700">{review.userName}</TableCell>
                  <TableCell className="text-gray-700">{review.reviewTitle}</TableCell>
                  <TableCell className="text-gray-700">{review.reviewText}</TableCell>
                  <TableCell className="text-gray-700">{review.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                      <span className="text-sm font-medium text-gray-700">{review.rating.toFixed(1)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => togglePublishStatus(review.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                        review.isPublished ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          review.isPublished ? "translate-x-6" : "translate-x-1"
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
            const pageNumber = i + 1
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
            )
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
    </div>
  )
}
