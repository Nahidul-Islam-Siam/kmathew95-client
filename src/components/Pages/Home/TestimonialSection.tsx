"use client"

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import TestimonialCard from "./TestimonialCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function TestimonialSection() {
  const testimonials = [
    {
      title: "Great Skill",
      rating: 5,
      quote: "Lorem ipsum dolor sit amet, consectetur...",
      authorName: "Courtney Henry",
      authorRole: "Web Designer",
      authorAvatarSrc: "images/profiles/profile1.jpg",
    },
    {
      title: "Excellent Service",
      rating: 5,
      quote: "This platform has transformed how I find talent...",
      authorName: "Jane Doe",
      authorRole: "Project Manager",
      authorAvatarSrc: "images/profiles/profile2.jpg",
    },
    {
      title: "Highly Recommended",
      rating: 4,
      quote: "I was skeptical at first, but the quality of work...",
      authorName: "Mark Johnson",
      authorRole: "Startup Founder",
      authorAvatarSrc: "images/profiles/profile3.jpg",
    },
  ];

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-orange-50 font-dm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Text & Stats */}
          <div className="space-y-6 lg:space-y-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Everyone&apos;s loving to learn with Skill Switch!
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-md">
              Discover what makes our learners and clients stay with us.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
              {[
                { title: "38/4", desc: "Clients give a shout-out to pros on Freelio." },
                { title: "95%", desc: "Customers are happy with their freelancers!" },
                { title: "Award Winner", desc: "Owning a home is a big deal!" },
              ].map((stat, i) => (
                <div 
                  key={i} 
                  className="flex flex-col space-y-1 p-4 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-md cursor-default"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">{stat.title}</h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Swiper Testimonials */}
          <div className="relative w-full">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              loop
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
              {testimonials.map((testimonial, index) => (
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