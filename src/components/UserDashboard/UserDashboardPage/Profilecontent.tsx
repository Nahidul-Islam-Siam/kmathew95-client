/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ProfileContent.tsx
"use client";

import Image from "next/image";
import { Star, Award, CheckCircle, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserQuery } from "@/redux/service/userApi";
import { useGetPrivateReviewsQuery } from "@/redux/service/admin/review";
import { Button } from "@/components/ui/button";
import { useCreateStripeVerificationMutation } from "@/redux/service/verification/stripe-verification";
import Swal from "sweetalert2";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Import Ant Design CSS reset
import "antd/dist/reset.css"; // Important for v5+

type ProfileContentProps = {
  onEditClick: () => void;
};

export default function ProfileContent({ onEditClick }: ProfileContentProps) {
  const { data, isLoading, isError } = useGetUserQuery();
  const { data: reviewData, isLoading: reviewsLoading } = useGetPrivateReviewsQuery();
  const [createStripeVerification] = useCreateStripeVerificationMutation();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !data?.data) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-red-600">Failed to load profile</h2>
        <p className="text-gray-500 mt-2">Please try again later.</p>
      </div>
    );
  }

  const user = data.data;
  const trader = user.trader;
  const fullName = [trader?.fastName, trader?.lastName].filter(Boolean).join(" ") || user.username;
  const avatar = user.avatar || "/images/profiles/avatar1.png";
  const cvFileName = trader?.resumeFile || "resume.pdf";
  const rating = 4.8; // Placeholder

  const stats = [
    { icon: Award, label: "Task Bids Won", value: 15 },
    { icon: Star, label: "Reviews", value: reviewData?.data?.data?.length || 0 },
    { icon: CheckCircle, label: "Completed Tasks", value: 8 },
  ];

  // Handler for Stripe Verification
  const handleStripeVerification = async () => {
    try {
      const result = await createStripeVerification({}).unwrap();

      if (result.success && result.data?.onboardingUrl) {
        // Show SweetAlert
        await Swal.fire({
          title: "Redirecting to Stripe",
          text: "You'll be redirected to complete your identity verification.",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Continue",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#007bff",
        });

        // Open Stripe onboarding URL in a new tab
        window.open(result.data.onboardingUrl, "_blank", "noopener,noreferrer");
      } else {
        Swal.fire("Error", "Unexpected response from server.", "error");
      }
    } catch (error: any) {
      const message =
        error?.data?.message || "Failed to initiate Stripe verification. Please try again.";
      Swal.fire("Verification Failed", message, "error");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Page Title */}
      <h1 className="text-center font-bold text-xl md:text-4xl text-blue-900 py-6">Profile</h1>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Image
                src={avatar}
                alt={fullName}
                width={150}
                height={150}
                className="rounded object-cover border border-gray-200"
              />
              <div className="space-y-2">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">{fullName}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Rating {rating}</span>
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

                {trader?.isVerified ? (
                  <Badge className="bg-blue-100 text-blue-800">Verified Trader</Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">Unverified Trader</Badge>
                )}

                <Button
                  onClick={onEditClick}
                  className="bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-2 text-sm px-4 h-9 mt-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    className="w-4 h-4"
                  >
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0zM11.5 6.5L14.5 9.5l-2 2L9.5 8.5l3-3zm-5 4L8 9l-2 2H4v-2l2-2 1.5 1.5L6 10z" />
                  </svg>
                  Edit Profile
                </Button>

                {/* Stripe Verification Button */}
                {!trader?.isVerified && (
                  <Button
                    onClick={handleStripeVerification}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 text-sm px-4 h-9 mt-1"
                  >
                    Verify with Stripe
                  </Button>
                )}
              </div>
            </div>
            <div className="text-left md:text-right space-y-2 mt-4 sm:mt-0">
              <div className="text-lg md:text-2xl font-semibold text-gray-900">
                ${trader?.mininumHoulyRate?.toFixed(2) ?? "20.00"} / hr
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Description */}
      <Card className="lg:w-1/2">
        <CardContent className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-900">Description</h2>
          <p className="text-muted-foreground leading-relaxed">
            {trader?.description || user.description || "N/A"}
          </p>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="lg:w-1/2">
        <CardContent className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-900">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {trader?.skills && trader.skills.length > 0 ? (
              trader.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 px-3 py-1 text-sm"
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-gray-500">No skills listed yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Attached Files */}
      <Card className="lg:w-1/2">
        <CardContent className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-900">
            Attached Files
          </h2>

          {/* Resume */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200 gap-4 mb-4">
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
              onClick={() => window.open(`/uploads/${cvFileName}`, "_blank")}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>

          {/* Other Attachments */}
          {trader?.attachments && trader.attachments.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Other Attachments</h3>
              <div className="flex flex-wrap gap-2">
                {trader.attachments.map((file, i) => (
                  <Badge key={i} variant="outline" className="px-2 py-1 text-xs">
                    {file}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviews */}
{/* Reviews */}
<Card>
  <CardContent className="p-4 md:p-6">
    <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-900">Reviews</h2>

    {reviewsLoading ? (
      <p className="text-muted-foreground">Loading reviews...</p>
    ) : !reviewData || !reviewData.data?.data?.length ? (
      <p className="text-muted-foreground">No reviews yet.</p>
    ) : (
      <div className="max-w-full">
        <Swiper
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            // Mobile: 1 slide
            640: {
              slidesPerView: 1,
            },
            // Tablet: 2 slides
            768: {
              slidesPerView: 2,
            },
            // Desktop: 3 slides
            1024: {
              slidesPerView: 3,
            },
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="my-swiper"
        >
          {reviewData.data.data.map((review) => {
            const provider = review.reviewProvider;
            const reviewerName = provider
              ? [provider.fastName, provider.lastName].filter(Boolean).join(" ")
              : "Unknown";
            const avatar = provider?.socialMediaLink?.[0]?.includes("linkedin")
              ? "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
              : "/images/profiles/avatar3.png";

            return (
              <SwiperSlide key={review.id}>
                <div className="p-2">
                  <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow transition-shadow duration-300 h-full flex flex-col">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-yellow-400 text-lg">
                          {star <= review.rating ? "★" : "☆"}
                        </span>
                      ))}
                      <span className="ml-2 text-sm text-gray-600 font-medium">
                        {review.rating} Star
                      </span>
                    </div>

                    {/* Comment */}
                    <p className="text-sm text-gray-700 mb-5 leading-relaxed line-clamp-3 flex-grow">
                      {review.comment}
                    </p>

                    {/* Reviewer Info */}
                    <a
                      href={provider?.socialMediaLink?.[0] ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3"
                    >
                      <Image
                        src={avatar}
                        alt={reviewerName}
                        width={40}
                        height={40}
                        className="rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{reviewerName}</p>
                        <p className="text-xs text-gray-500">Client</p>
                      </div>
                    </a>

                    {/* Task Title */}
                    {review.task?.title && (
                      <p
                        className="text-xs text-gray-500 mt-3 truncate"
                        title={review.task.title}
                      >
                        <strong>Project:</strong> {review.task.title}
                      </p>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    )}
  </CardContent>
</Card>
    </div>
  );
}

// Skeleton Loader
function ProfileSkeleton() {
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="text-center font-bold text-xl md:text-4xl text-blue-900 py-6">Profile</div>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="w-36 h-36 rounded-full" />
            <div className="space-y-3 flex-1">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}