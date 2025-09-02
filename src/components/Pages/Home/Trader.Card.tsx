import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Link from "next/link";
import { format } from "path";

interface TraderCardProps {
  id: string; // Trader profile ID
  userId: string; // User ID for profile link
  avatarSrc?: string;
  name: string;
  role: string;
  rating: number;
  reviews: number;
  skills: string[];
  location: string;
  rate: string;
  jobSuccess: string;
  description?: string;
}

export default function TraderCard({
  id,
  userId,
  avatarSrc,
  name,
  role,
  rating,
  reviews,
  skills,
  location,
  rate,
  jobSuccess,
  description,
}: TraderCardProps) {
  return (
    <Card className="w-full rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow duration-200">
      <CardContent className="flex flex-col items-center p-0">
        {/* Avatar with Online Status */}
        <div className="relative mb-4">
          <Avatar className="h-16 w-16 border-2 border-gray-100">
            <AvatarImage src={avatarSrc || "/images/profiles/default-avatar.jpg"} alt={name} />
            <AvatarFallback>
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
        </div>

        {/* Name & Role */}
        <h3 className="text-lg font-semibold text-gray-900 truncate w-full">{name}</h3>
        <p className="text-sm text-gray-600 mb-2 truncate w-full">{role || "Professional Trader"}</p>

        {/* Rating */}
        <div className="flex items-center text-sm text-gray-800 mb-4">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
          <span>
            {rating.toFixed(1)}{" "}
            <span className="text-gray-500">({reviews} {reviews === 1 ? "review" : "reviews"})</span>
          </span>
        </div>

        {/* Skills Badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-5">
          {skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full truncate max-w-[100px]"
            >
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
              +{skills.length - 3}
            </span>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-3 gap-x-3 gap-y-2 text-sm text-gray-700 w-full mb-6">
          <div className="flex flex-col items-start">
            <span className="font-medium text-gray-900">Location</span>
            <span className="text-gray-600">{location || "Global"}</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-medium text-gray-900">Rate</span>
            <span className="text-gray-600">{rate}</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-medium text-gray-900">Success</span>
            <span className="text-gray-600">{jobSuccess}</span>
          </div>
        </div>

        {/* View Profile Button */}
        <Link href={`/all-traders/${userId}`} passHref>
          <Button
            variant="default"
            className="w-full bg-orange-50 hover:bg-orange-100 text-orange-600 hover:text-orange-700 
                       px-6 py-6 rounded-full text-base font-medium transition-colors duration-200 
                       border border-orange-200"
          >
            View Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}