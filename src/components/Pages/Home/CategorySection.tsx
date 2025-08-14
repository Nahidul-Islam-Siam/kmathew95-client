"use client"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import { Button, Typography, Card } from "antd"
import { LeftOutlined, RightOutlined } from "@ant-design/icons"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import Image from "next/image"

const { Title, Text } = Typography

interface CategoryData {
  id: number
  title: string
  skillCount: number
  image: string
}

const categories: CategoryData[] = [
  {
    id: 1,
    title: "Development & IT",
    skillCount: 1853,
    image: "/images/categories/category-1.jpg.png",
  },
  {
    id: 2,
    title: "Design & Creative",
    skillCount: 1853,
    image: "/images/categories/category-2.jpg.png",
  },
  {
    id: 3,
    title: "Digital Marketing",
    skillCount: 1853,
    image: "/images/categories/category-3.jpg.png",
  },
  {
    id: 4,
    title: "Writing & Translation",
    skillCount: 1853,
    image: "/images/categories/category-5.jpg.png",
  },
  {
    id: 5,
    title: "Music & Audio",
    skillCount: 1853,
    image: "/images/categories/category-3.jpg.png",
  },
  {
    id: 6,
    title: "Video & Animation",
    skillCount: 1853,
    image: "/images/categories/category-3.jpg.png",
  },
]

export default function TraderCategorySection() {
  return (
    <div className="py-16 px-4 bg-gray-50 grid grid-cols-1 gap-4 font-dm">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-[#E57931] text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4">
              Browse Trader by Category
            </h1>
            <Text className="text-gray-600 text-base">Lorem ipsum dolor sit amet, consectetur.</Text>
          </div>
          <Button
            type="text"
            className="text-[#E57931] rounded-2xl bg-[#FCF2EA] hover:text-orange-600 font-medium border  hover:border-orange-300 px-6 py-3 h-auto text-xs  md:text-[15px]"
          >
            All Category
          </Button>
        </div>

        {/* Swiper Carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              prevEl: ".category-swiper-button-prev",
              nextEl: ".category-swiper-button-next",
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
              1280: {
                slidesPerView: 5,
              },
            }}
            className="category-swiper"
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id}>
                <Card
                  hoverable
                  className="h-80 overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  bodyStyle={{ padding: 0 }}
                  cover={
                    <div className="relative h-ful font-dm">
                      <Image
                        alt={category.title}
                        width={500}
                        height={500}
                        src={category.image || "/placeholder.svg"}
                        className="w-full h-80 object-cover filter grayscale hover:grayscale-0 transition-all duration-300"
                      />

                      <div className="absolute inset-0 bg-black bg-opacity-40 hover:bg-opacity-30 transition-all duration-300" />
                      <div className="absolute top-6 left-6 text-white">
                        <Text className="text-white md:text-base font-medium block !mb-1">{category.skillCount} skills</Text>
                        <h1 className="!text-white max-w-[100px]  !text-lg ">
                          {category.title}
                        </h1>
                      </div>
                    </div>
                  }
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <button className="category-swiper-button-prev ... absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
            <LeftOutlined className="text-gray-600 text-lg" />
          </button>
          <button className="category-swiper-button-next ... absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
            <RightOutlined className="text-gray-600 text-lg" />
          </button>
        </div>
      </div>
    </div>
  )
}
