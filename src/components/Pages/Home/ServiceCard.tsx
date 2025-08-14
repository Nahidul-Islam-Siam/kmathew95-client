
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import Image from "next/image"

interface ServiceCardProps {
  image: string
  title: string
  price: string
  duration: string
  rating: number
  reviews: number
  isPopular?: boolean
}

export function ServiceCard({ image, title, price, duration, rating, reviews, isPopular = false }: ServiceCardProps) {
  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-xl shadow-sm border border-gray-100 flex">
      {/* Image Section */}
      <div className="relative w-2/5 aspect-video overflow-hidden rounded-l-xl">
        <Image src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          priority // Preloads the image as it's above the fold [^1]
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        {/* Top Row: Popular Badge, Message Button, Price */}
        <div className="flex justify-between items-start mb-2">
          {isPopular && <Badge className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Popular</Badge>}
          <div className="flex flex-col items-end gap-1">
            <Button
              variant="default"
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm h-auto"
            >
              Message
            </Button>
          </div>
        </div>

        {/* Service Description */}
        <div className="flex items-start">
          <div className="w-1/2">
            <h3 className="font-semibold text-lg mb-2 leading-tight text-left">
              {title}
            </h3>
          </div>
          <div className="w-1/2 font-semibold text-gray-900 text-right mb-2">{duration} / ${price}</div>
        </div>

        {/* Bottom Row: Rating, View Details Button */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center text-sm text-gray-700">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-sm text-gray-500">({reviews})</span>
          </div>
          <Button
            variant="default"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm h-auto"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  )
}