import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Star } from "lucide-react";

interface TraderCardProps {
  avatarSrc: string;
  name: string;
  role: string;
  rating: number;
  reviews: number;
  skills: string[];
  location: string;
  rate: string;
  jobSuccess: string;
}

export default function TraderCard({
  avatarSrc,
  name,
  role,
  rating,
  reviews,
  skills,
  location,
  rate,
  jobSuccess,
}: TraderCardProps) {
  return (
    <Card className="w-full rounded-xl shadow-sm p-6 text-center">
      <CardContent className="flex flex-col items-center p-0">
        <div className="relative mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarSrc || "/placeholder.svg"} alt={name} />
          </Avatar>
          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600 mb-2">{role}</p>
        <div className="flex items-center text-sm text-gray-800 mb-6">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
          <span>
            {rating} <span className="text-gray-600">({reviews} reviews)</span>
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="bg-yellow-100 text-yellow-800 text-xs font-medium px-4 py-2 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm text-gray-700 w-full mb-8">
          <div className="flex flex-col items-start">
            <span className="font-medium text-black">Location</span>
            <span>{location}</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-medium text-black">Rate</span>
            <span>{rate}</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-medium text-black">Job Success</span>
            <span>{jobSuccess}</span>
          </div>
        </div>
        <Button
          variant="default"
          className="w-full bg-orange-100 hover:bg-orange-200 text-orange-500 px-6 py-6 rounded-full text-base font-medium"
        >
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
}
