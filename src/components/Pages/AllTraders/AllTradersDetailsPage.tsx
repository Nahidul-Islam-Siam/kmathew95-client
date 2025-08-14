"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import img from "@/assets/profiles/profile1.jpg"
import img2 from "@/assets/profiles/profile2.jpg"
import {
  Star,
  Download,
  Heart,
  MessageCircle,
  Award,
  CheckCircle,
} from "lucide-react";

import { useParams } from "next/navigation";

// Dummy Data
const dummyMember = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  ratePerHour: 120,
  taskBidsWon: 25,
  reviewsCount: 42,
  completedTasks: 30,
  metrics: { rate: 85 },
  description:
    "Experienced trader with expertise in equity and fixed income markets. Passionate about delivering strong portfolio performance and managing risk effectively.",
  cvFileName: "JohnDoeCV.pdf",
  reviews: [
    {
      badge: "Top Rated",
      rating: 5,
      reviewText:
        "Excellent trader, very professional and highly skilled. Will work with him again!",
      reviewerName: "Alice Johnson",
      reviewerTitle: "Senior Manager",
    },
    {
      badge: "Reliable",
      rating: 4,
      reviewText:
        "Good experience overall. Delivered tasks on time and met expectations.",
      reviewerName: "Michael Smith",
      reviewerTitle: "Investment Analyst",
    },
  ],
};

export default function AllTradersDetailsPage() {
  const params = useParams();
  const Id = Number(params.id);

  const member = dummyMember; // Directly using dummy data (no array search)

  if (!member) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-red-600">
          Trader not found.
        </h2>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Image
                // src="/images/profiles/avatar1.png"
                src={img}
                alt={member.name}
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
              <div className="space-y-2">
                <h1 className="text-xl md:text-2xl font-semibold">
                  {member.name}
                </h1>
                <p className="text-muted-foreground">{member.email}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">
                    Rating {member.metrics.rate / 20}
                  </span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(member.metrics.rate / 20)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <Button className="bg-slate-800 hover:bg-slate-700 text-white">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
            <div className="text-left md:text-right space-y-2">
              <div className="text-lg md:text-2xl font-semibold">
                ${member.ratePerHour} / Per Hour
              </div>
              <button className="text-orange-500 text-sm hover:underline flex items-center gap-1">
                <Heart className="w-4 h-4" />
                Add to favorites
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { icon: Award, label: "Task Bids won", value: member.taskBidsWon },
          { icon: Star, label: "Reviews", value: member.reviewsCount },
          {
            icon: CheckCircle,
            label: "Completed Task",
            value: member.completedTasks,
          },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-semibold">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Description */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
            Description
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
            {member.description}
          </p>
        </CardContent>
      </Card>

      {/* Attached Files */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
            Attached Files
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-medium text-sm">CV</span>
              </div>
              <span className="font-medium">{member.cvFileName}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-orange-600 hover:text-orange-700"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reviews */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Review</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {member.reviews.map((review, i) => (
              <div key={i} className="p-4 border rounded-lg bg-white">
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    variant="secondary"
                    className="text-orange-600 bg-orange-50"
                  >
                    {review.badge}
                  </Badge>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {review.reviewText}
                </p>
                <div className="flex items-center gap-3">
                  <Image
                    // src="/images/profiles/avatar1.png"
                    src={img2}
                    alt={review.reviewerName}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-sm">{review.reviewerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {review.reviewerTitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
