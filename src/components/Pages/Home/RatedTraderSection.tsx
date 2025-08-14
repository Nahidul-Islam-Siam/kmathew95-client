"use client"

import { Button } from "@/components/ui/button";
import TraderCard from "./Trader.Card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import Link from "next/link";

export default function RatedTraderSection() {
    const { Title, Text } = Typography

    const traders = [
        {
            avatarSrc: "/images/profiles/profile1.jpg",
            name: "Robert Fox",
            role: "Nursing Assistant",
            rating: 4.9,
            reviews: 595,
            skills: ["Figma", "Sketch", "HTML5"],
            location: "London",
            rate: "$90 / hr",
            jobSuccess: "%98",
        },
        {
            avatarSrc: "/images/profiles/profile2.jpg",
            name: "Kristin Watson",
            role: "Dog Trainer",
            rating: 4.9,
            reviews: 595,
            skills: ["Figma", "Sketch", "HTML5"],
            location: "London",
            rate: "$90 / hr",
            jobSuccess: "%98",
        },
        {
            avatarSrc: "/images/profiles/profile3.jpg",
            name: "Darrell Steward",
            role: "Medical Assistant",
            rating: 4.9,
            reviews: 595,
            skills: ["Figma", "Sketch", "HTML5"],
            location: "London",
            rate: "$90 / hr",
            jobSuccess: "%98",
        },
        {
            avatarSrc: "/images/profiles/profile4.jpg",
            name: "Theresa Webb",
            role: "Marketing Coordinator",
            rating: 4.9,
            reviews: 595,
            skills: ["Figma", "Sketch", "HTML5"],
            location: "London",
            rate: "$90 / hr",
            jobSuccess: "%98",
        },
        {
            avatarSrc: "/images/profiles/profile1.jpg",
            name: "John Doe",
            role: "Software Engineer",
            rating: 4.8,
            reviews: 450,
            skills: ["React", "Node.js", "TypeScript"],
            location: "New York",
            rate: "$120 / hr",
            jobSuccess: "%95",
        },
    ]

    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white    grid grid-cols-1">
            <div className=" px-4 md:px-6 container mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-[#E57931] text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4">
                            Highest Rated Trader
                        </h1>
                        <Text className="text-gray-600 text-base">Lorem ipsum dolor sit amet, consectetur.</Text>
                    </div>
                    <Link href="/all-traders">
                        <Button
                            type="button"
                            className="text-[#E57931] rounded-2xl bg-[#FCF2EA] hover:text-orange-600 font-medium border  hover:border-orange-300 px-6 py-3 h-auto text-xs  md:text-[15px]"
                        >
                            All Traders
                        </Button>
                    </Link>
                </div>
                {/* Trader Cards Swiper Carousel */}
                <div className="relative">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={24}
                        slidesPerView={1}
                        navigation={{
                            prevEl: ".rated-swiper-button-prev",
                            nextEl: ".rated-swiper-button-next",
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                            },
                            768: {
                                slidesPerView: 3,
                            },
                            1024: {
                                slidesPerView: 4,
                            },
                        }}
                        className="trader-swiper"
                    >
                        {traders.map((trader, index) => (
                            <SwiperSlide key={index}>

                                <TraderCard {...trader} />
                            </SwiperSlide>
                        ))}
                    </Swiper>


                    {/* Custom Navigation Buttons */}
                    <button className="rated-swiper-button-prev ... absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
                        <LeftOutlined className="text-gray-600 text-lg" />
                    </button>
                    <button className="rated-swiper-button-next ... absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
                        <RightOutlined className="text-gray-600 text-lg" />
                    </button>
                </div>
            </div>
        </section>
    )
}
