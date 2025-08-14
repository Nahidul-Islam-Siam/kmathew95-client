"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

import Image from "next/image";

interface Review {
  reviewerName: string;
  reviewerTitle: string;
  reviewerAvatar: string;
  reviewText: string;
  rating: number;
  badge: string;
}

interface ReviewCardProps {
  review: Review;
}

function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="w-full h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <Badge
            variant="secondary"
            className="bg-orange-100 text-orange-600 hover:bg-orange-100"
          >
            {review.badge}
          </Badge>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed mb-6 flex-grow">
          {review.reviewText}
        </p>

        <div className="flex items-center gap-3 mt-auto">
          <Image
            // src={review.reviewerAvatar || "/placeholder.svg"}
            src="/images/profiles/avatar1.png"
            width={32}
            height={32}
            alt={review.reviewerName}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-sm text-gray-900">
              {review.reviewerName}
            </p>
            <p className="text-xs text-gray-500">{review.reviewerTitle}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReviewsPage() {
  const [showAll, setShowAll] = useState(false);

  const reviews: Review[] = [
    {
      reviewerName: "Courtney Henry",
      reviewerTitle: "Web Designer",
      reviewerAvatar: "/placeholder.svg?height=32&width=32",
      reviewText:
        "Robert was amazing to work with — great communicator and very organized.",
      rating: 5,
      badge: "Great Skill",
    },
    {
      reviewerName: "Jane Cooper",
      reviewerTitle: "Frontend Developer",
      reviewerAvatar: "/placeholder.svg?height=32&width=32",
      reviewText:
        "Delivered everything on time and went above and beyond our expectations.",
      rating: 5,
      badge: "Outstanding",
    },
    {
      reviewerName: "Courtney Henry",
      reviewerTitle: "Web Designer",
      reviewerAvatar: "/placeholder.svg?height=32&width=32",
      reviewText:
        "Lorem ipsum dolor sit amet consectetur id vitae tempor eget eget tincidunt ut nulla arcu consequat. Turpis lacus arcu eu congue lectus.",
      rating: 5,
      badge: "Great Skill",
    },
    {
      reviewerName: "Courtney Henry",
      reviewerTitle: "Web Designer",
      reviewerAvatar: "/placeholder.svg?height=32&width=32",
      reviewText:
        "Lorem ipsum dolor sit amet consectetur id vitae tempor eget eget tincidunt ut nulla arcu consequat. Turpis lacus arcu eu congue lectus.",
      rating: 5,
      badge: "Great Skill",
    },
    {
      reviewerName: "Sarah Johnson",
      reviewerTitle: "UI/UX Designer",
      reviewerAvatar: "/placeholder.svg?height=32&width=32",
      reviewText:
        "Exceptional work quality and attention to detail. Would definitely work with again.",
      rating: 5,
      badge: "Excellent",
    },
    {
      reviewerName: "Mike Wilson",
      reviewerTitle: "Product Manager",
      reviewerAvatar: "/placeholder.svg?height=32&width=32",
      reviewText:
        "Professional, reliable, and delivered exactly what we needed. Highly recommended!",
      rating: 5,
      badge: "Top Quality",
    },
  ];

  const displayedReviews = showAll ? reviews : reviews.slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      <div className="text-center mb-8"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {displayedReviews.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}
      </div>

      {!showAll && reviews.length > 4 && (
        <div className="text-center">
          <Button
            onClick={() => setShowAll(true)}
            variant="ghost"
            className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 bg-orange-100"
          >
            View All
          </Button>
        </div>
      )}

      {showAll && (
        <div className="text-center">
          <Button
            onClick={() => setShowAll(false)}
            variant="ghost"
            className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
          >
            Show Less
          </Button>
        </div>
      )}
    </div>
  );
}
