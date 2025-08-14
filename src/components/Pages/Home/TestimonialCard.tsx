import { Star } from "lucide-react"
import { Card } from "antd"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { CardContent } from "@/components/ui/card"

interface TestimonialCardProps {
  title: string
  rating: number
  quote: string
  authorName: string
  authorRole: string
  authorAvatarSrc: string
}

export default function TestimonialCard({
  title,
  rating,
  quote,
  authorName,
  authorRole,
  authorAvatarSrc,
}: TestimonialCardProps) {
  return (
    <Card className="relative w-full rounded-2xl shadow-lg border border-gray-100 p-5 md:p-6 bg-white font-dm transition-all duration-300 hover:shadow-xl">
      {/* Quote icon - subtle, in the background */}
      <span className="absolute top-4 right-4 text-gray-100 text-5xl md:text-6xl font-serif leading-none select-none">&ldquo;</span>

      <CardContent className="flex flex-col p-0">
        <h3 className="text-base md:text-lg font-semibold text-orange-500 mb-2">{title}</h3>
        <div className="flex items-center mb-3 md:mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 md:h-5 md:w-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
            />
          ))}
        </div>
        <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-5 md:mb-6">{quote}</p>
        <div className="flex items-center gap-3 md:gap-4 border-t border-gray-100 pt-4 mt-4">
          <Avatar className="h-10 w-10 md:h-12 md:w-12">
            <AvatarImage 
              src={authorAvatarSrc || "/placeholder.svg"} 
              alt={authorName} 
            />
          </Avatar>
          <div>
            <p className="font-semibold text-gray-900 text-sm md:text-base">{authorName}</p>
            <p className="text-xs md:text-sm text-gray-600">{authorRole}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}