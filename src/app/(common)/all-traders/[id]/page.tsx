"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import img from "@/assets/profiles/profile1.jpg";
import img2 from "@/assets/profiles/profile2.jpg";
import {
  Star,
  Download,
  Heart,
  MessageCircle,
  Award,
  CheckCircle,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useGetSingleTraderQuery } from "@/redux/service/customerApi";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {  CreateFavoritePayload, useAddFavoriteMutation } from "@/redux/service/favourite";
import { useState } from "react";
import { toast } from "sonner";

export default function AllTradersDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError } = useGetSingleTraderQuery({ id });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // RTK Mutation
  const [addFavorite, { isLoading: isAddingFavorite }] =
    useAddFavoriteMutation();

  if (isLoading) {
    return <TraderDetailSkeleton />;
  }

  if (isError || !data?.data) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-red-600">
          Trader not found.
        </h2>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

  const user = data.data;
  const trader = user.trader;

  // Derived data
  const fullName =
    `${trader?.fastName || ""} ${trader?.lastName || ""}`.trim() ||
    "Unknown Trader";
  const avatar = user.avatar || img;
  const hourlyRate = trader?.mininumHoulyRate ?? 50;
  const completedTasks = 30;
  const taskBidsWon = 25;
  const reviewsCount = 42;
  const rating = 4.8;
  const cvFileName = "Resume.pdf";

  // ✅ Handle Add to Favorites
  const handleAddFavorite = async () => {
    try {
      const payload: CreateFavoritePayload= {
        type: "TRADER",
        traderOwnerId: trader?.userId, // assert that trader?.id is not undefined
      };

      const res = await addFavorite(payload).unwrap();

      if (res.success) {
        toast.success("Added to favorites!");
      } else {
        toast.error("Failed to add to favorites.");
      }

      setIsModalOpen(false);
    } catch (error) {
      // ❌ Error
      toast.error("Failed to add to favorites.");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 container mx-auto">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Image
                src={avatar}
                alt={fullName}
                width={80}
                height={80}
                className="rounded-full object-cover border-2 border-gray-100"
              />
              <div className="space-y-2">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                  {fullName}
                </h1>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">
                    Rating {rating}
                  </span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <Button className="bg-slate-800 hover:bg-slate-700 text-white text-sm px-4 h-9">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>

            <div className="text-left md:text-right space-y-2 mt-4 sm:mt-0">
              <div className="text-lg md:text-2xl font-semibold text-gray-900">
                ${hourlyRate} / hr
              </div>
              <button
                className="text-orange-500 hover:text-red-600 text-sm font-medium flex items-center gap-1 transition-colors duration-200"
                onClick={() => setIsModalOpen(true)}
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isModalOpen ? "fill-red-500" : "fill-transparent"
                  }`}
                />
                Add to Favorites
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { icon: Award, label: "Task Bids Won", value: taskBidsWon },
          { icon: Star, label: "Reviews", value: reviewsCount },
          {
            icon: CheckCircle,
            label: "Completed Tasks",
            value: completedTasks,
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
                  <p className="text-2xl md:text-3xl font-semibold text-gray-900">
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
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-900">
            Description
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
            {trader?.description ||
              user.description ||
              "This trader has not provided a description yet."}
          </p>
        </CardContent>
      </Card>

      {/* Attached Files */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-900">
            Attached Files
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-medium text-sm">CV</span>
              </div>
              <span className="font-medium text-gray-900">{cvFileName}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-orange-600 hover:text-orange-700"
              disabled
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reviews */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-900">
            Reviews
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    variant="secondary"
                    className="bg-orange-50 text-orange-600 text-xs px-2 py-1"
                  >
                    {i === 0 ? "Top Rated" : "Reliable"}
                  </Badge>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= (i === 0 ? 5 : 4)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {i === 0
                    ? "Excellent trader, very professional and highly skilled. Will work with him again!"
                    : "Good experience overall. Delivered tasks on time and met expectations."}
                </p>
                <div className="flex items-center gap-3">
                  <Image
                    src={img2}
                    alt="Reviewer"
                    width={32}
                    height={32}
                    className="rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {i === 0 ? "Alice Johnson" : "Michael Smith"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {i === 0 ? "Senior Manager" : "Investment Analyst"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ✅ Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Favorites?</DialogTitle>
            <DialogDescription>
              Are you sure you want to add <strong>{fullName}</strong> to your
              favorites?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              No, Cancel
            </Button>
            <Button
              variant="default"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleAddFavorite}
              disabled={isAddingFavorite}
            >
              {isAddingFavorite ? "Adding..." : "Yes, Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Skeleton Component
function TraderDetailSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-4">
              <Skeleton className="w-20 h-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-36" />
              </div>
            </div>
            <div className="ml-auto space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4 md:p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4 md:p-6">
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
