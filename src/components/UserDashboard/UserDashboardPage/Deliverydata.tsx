/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Star, MessageCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFindingAllMyDeliveryQuery } from "@/redux/service/admin/taskManagemant";
import { useCreateReviewMutation } from "@/redux/service/admin/review";
import { toast } from "sonner";

// Types
interface ReviewData {
  taskId: string;
  rating: number;
  comment: string;
  reviewReceiverId: string; // This will be offerByTrader.id
}

export default function DeliveryData() {
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [reviewReceiverId, setReviewReceiverId] = useState<string | null>(null); // Will hold offerByTrader.id

  // Fetch delivery data
  const { data: deliveryData, isLoading, error } = useFindingAllMyDeliveryQuery({});

  // Mutation to submit review
  const [submitReview, { isLoading: isSubmittingReview }] = useCreateReviewMutation();

  // Simulated rating (replace with real average later)
  const getTraderRating = (traderId: string) => 4.5;

  // Render stars with hover and click support
  const renderStars = (
    currentRating: number,
    interactive = false,
    onRate?: (val: number) => void
  ) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = interactive
        ? starValue <= (hoveredStar || currentRating)
        : starValue <= Math.floor(currentRating);
      const isHalf =
        !interactive &&
        starValue === Math.ceil(currentRating) &&
        currentRating % 1 !== 0;

      return (
        <Star
          key={index}
          className={`w-4 h-4 ${interactive ? "cursor-pointer" : ""} ${
            isFilled
              ? "fill-accent text-accent"
              : isHalf
              ? "fill-accent/50 text-accent"
              : "fill-muted text-muted-foreground"
          }`}
          onClick={interactive ? () => onRate?.(starValue) : undefined}
          onMouseEnter={interactive ? () => setHoveredStar(starValue) : undefined}
          onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
        />
      );
    });
  };

  // Open modal and set context (including offerByTrader.id as receiver)
  const openReviewModal = (taskId: string, receiverId: string) => {
    setActiveTaskId(taskId);
    setReviewReceiverId(receiverId); // ✅ This is offerByTrader.id
    setReviewRating(0);
    setReviewComment("");
    setHoveredStar(0);
  };

  // Submit the review
  const handleSubmitReview = async () => {
    if (!activeTaskId || !reviewReceiverId || !reviewRating || !reviewComment.trim()) {
      toast.error("Please provide a rating and comment.");
      return;
    }

    const payload: ReviewData = {
      taskId: activeTaskId,
      rating: reviewRating,
      comment: reviewComment.trim(),
      reviewReceiverId, // ✅ Correct: this is offerByTrader.id
    };

    try {
      const result = await submitReview(payload).unwrap();

      if (result.success) {
        toast.success(result.message || "Thank you for your review!");
      } else {
        toast.error(result.message || "Failed to submit review.");
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.message ||
        err?.data?.error ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      // Reset all fields
      setActiveTaskId(null);
      setReviewReceiverId(null);
      setReviewRating(0);
      setReviewComment("");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-background p-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Delivery Tasks</h1>
          <p className="text-center text-muted-foreground">Loading deliveries...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-background p-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Delivery Tasks</h1>
          <p className="text-center text-red-500">
            Failed to load data. Please try again later.
          </p>
        </div>
      </main>
    );
  }

  // Extract delivered tasks
  const tasks = deliveryData?.data?.data || [];
  const deliveredTasks = tasks.filter((task) => task.status === "DELIVERED");

  if (deliveredTasks.length === 0) {
    return (
      <main className="min-h-screen bg-background p-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Delivered Tasks</h1>
          <p className="text-center text-muted-foreground">No delivered tasks found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-foreground">Delivered Tasks</h1>

        <div className="space-y-6">
          {deliveredTasks.map((task) => {
            // Get the approved application
            const application = Array.isArray(task.task_Application)
              ? task.task_Application[0]
              : null;
            const trader = application?.offerByTrader;

            if (!trader) return null;

            const traderRating = getTraderRating(trader.id);
            const taskPrice = task.max_salary ? `$${task.max_salary} Fixed` : "N/A";
            const deliveryTime = task.deadline
              ? `${Math.ceil(
                  (new Date(task.deadline).getTime() - new Date(task.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}d Delivery`
              : "Unknown";

            return (
              <Card key={task.id} className="w-full max-w-2xl mx-auto bg-card border-border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Trader Avatar */}
                    <Avatar className="w-20 h-20 border-2 border-border">
                      <AvatarImage
                        src="/professional-headshot.png" // Replace with trader.profileImage if available
                        alt={`${trader.fastName} ${trader.lastName}`}
                      />
                      <AvatarFallback>
                        {trader.fastName[0]}
                        {trader.lastName[0]}
                      </AvatarFallback>
                    </Avatar>

                    {/* Trader Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold text-foreground">
                            {trader.fastName} {trader.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">ID: {trader.userId}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">
                              Rating {traderRating}
                            </span>
                            <div className="flex items-center gap-1">
                              {renderStars(traderRating)}
                            </div>
                          </div>
                        </div>

                        {/* Price & Delivery Info */}
                        <div className="text-right space-y-1">
                          <p className="text-lg font-semibold text-foreground">{taskPrice}</p>
                          <p className="text-sm text-muted-foreground">{deliveryTime}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border text-foreground hover:bg-muted"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </Button>

                        <Button size="sm" className="bg-primary text-primary-foreground">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Send Message
                        </Button>

                        <Dialog onOpenChange={(open) => !open && setActiveTaskId(null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => openReviewModal(task.id, trader.id)} // ✅ trader.id = offerByTrader.id
                            >
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md bg-popover text-popover-foreground">
                            <DialogHeader>
                              <DialogTitle className="text-lg font-semibold">
                                Leave a Review for {trader.fastName} {trader.lastName}
                              </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                              {/* Rating */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Rating</Label>
                                <div className="flex items-center gap-1">
                                  {renderStars(reviewRating, true, setReviewRating)}
                                  <span className="ml-2 text-sm text-muted-foreground">
                                    {reviewRating > 0
                                      ? `${reviewRating} star${reviewRating !== 1 ? "s" : ""}`
                                      : "Select rating"}
                                  </span>
                                </div>
                              </div>

                              {/* Comment */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Comment</Label>
                                <Textarea
                                  placeholder="How was your experience working with this trader?"
                                  value={reviewComment}
                                  onChange={(e) => setReviewComment(e.target.value)}
                                  className="min-h-[100px] bg-input border-border"
                                />
                              </div>

                              {/* Submit Button */}
                              <Button
                                onClick={handleSubmitReview}
                                disabled={
                                  isSubmittingReview ||
                                  reviewRating === 0 ||
                                  !reviewComment.trim()
                                }
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                              >
                                {isSubmittingReview ? "Submitting..." : "Submit Review"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}