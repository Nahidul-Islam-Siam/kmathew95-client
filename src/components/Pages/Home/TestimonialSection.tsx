/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import TestimonialCard from "./TestimonialCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useGetPublicReviewsQuery } from "@/redux/service/admin/review";
import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

// Animated Counter Component
const AnimatedCounter = ({ from = 0, to, suffix = "" }: { from?: number; to: number; suffix?: string }) => {
  const [value, setValue] = useState(from);
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });

  useEffect(() => {
    if (inView) {
      const duration = 2000;
      const stepTime = Math.abs(Math.floor(duration / (to - from)));
      let currentValue = from;

      const timer = setInterval(() => {
        currentValue += (to - from) / (duration / stepTime);
        if ((to > from && currentValue >= to) || (to < from && currentValue <= to)) {
          currentValue = to;
          clearInterval(timer);
        }
        setValue(currentValue);
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [to, from, inView]);

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  return (
    <div ref={ref}>
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        className="text-xl md:text-2xl font-bold text-gray-900"
      >
        {value.toFixed(1)}{suffix}
      </motion.h3>
    </div>
  );
};

export default function TestimonialSection() {
  const { data: reviewsData, isLoading } = useGetPublicReviewsQuery();

  // Extract real testimonials
const testimonials = reviewsData?.data?.data?.map((review: any) => {
  const provider = review.reviewProvider?.user || review.reviewProvider || {};
  return {
    title: `Rated ${review.rating}/5`,
    rating: review.rating,
    quote: review.comment || "No comment provided.",
    authorName: provider.name || provider.fastName + " " + provider.lastName || "Unknown",
    authorRole: provider.trader || "Client",
    authorAvatarSrc: provider.avatar || "/images/avatar.png",
  };
}) || [];

  // Default fallback if no data
  const fallbackTestimonials = [
    {
      title: "Highly Recommend",
      rating: 5,
      quote: "Professional, responsive, and delivered beyond expectations.",
      authorName: "Jane Doe",
      authorRole: "Project Manager",
      authorAvatarSrc: "/images/profiles/profile2.jpg",
    },
  ];

  // Use real or fallback
  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  // Animation controls
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-orange-50 font-dm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Text & Stats */}
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={containerVariants}
            className="space-y-6 lg:space-y-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Everyone&apos;s loving to learn with Skill Switch!
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-md">
              Discover what makes our learners and clients stay with us.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
              {/* Stat 1: Average Rating */}
              <motion.div variants={itemVariants} className="flex flex-col space-y-1 p-4 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300">
                <AnimatedCounter to={4.8} suffix="/5" />
                <p className="text-xs sm:text-sm md:text-base text-gray-600">
                  Clients rate traders highly.
                </p>
              </motion.div>

              {/* Stat 2: Satisfaction Rate */}
              <motion.div variants={itemVariants} className="flex flex-col space-y-1 p-4 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300">
                <AnimatedCounter to={95} suffix="%" />
                <p className="text-xs sm:text-sm md:text-base text-gray-600">
                  Customers are happy with their freelancers!
                </p>
              </motion.div>

              {/* Stat 3: Award Winner */}
              <motion.div variants={itemVariants} className="flex flex-col space-y-1 p-4 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">Award Winner</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600">
                  Trusted platform for talent & clients.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Swiper Testimonials */}
          <div className="relative w-full">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              loop={true}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{
                clickable: true,
                el: ".testimonial-pagination-dots",
                bulletClass: "swiper-pagination-bullet w-3 h-3 rounded-full bg-gray-300 transition-all duration-300",
                bulletActiveClass: "swiper-pagination-bullet-active bg-orange-500 w-6 rounded-full",
              }}
              navigation={{
                prevEl: ".testimonial-swiper-button-prev",
                nextEl: ".testimonial-swiper-button-next",
              }}
              className="testimonial-swiper w-full"
            >
              {displayTestimonials.map((testimonial, index) => (
                <SwiperSlide key={index}>
                  <div className="transition-all duration-300 hover:scale-[1.02]">
                    <TestimonialCard {...testimonial} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 sm:mt-8">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="testimonial-swiper-button-prev w-10 h-10 bg-white rounded-full shadow hover:bg-gray-100 hover:scale-105 transition-all duration-300"
                  aria-label="Previous testimonial"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-700" />
                </Button>

                <div className="testimonial-pagination-dots flex gap-2 justify-center" />

                <Button
                  variant="ghost"
                  size="icon"
                  className="testimonial-swiper-button-next w-10 h-10 bg-white rounded-full shadow hover:bg-gray-100 hover:scale-105 transition-all duration-300"
                  aria-label="Next testimonial"
                >
                  <ArrowRight className="h-5 w-5 text-gray-700" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}