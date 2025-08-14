import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

import Image from "next/image";

const jobListings = [
  {
    id: 1,
    title: "bespoke Logo+OneDay+Unlimited Rev+Favicon+Source files",
    name: "Lamborghini",
    logo: "/placeholder.svg?height=80&width=80&text=L",
    salary: "$4,173",
    timePosted: "2 day / $4.00",
    tags: ["Popular"],
    type: "remote",
    description:
      "This remote freelance job offers bespoke logo design with one-day delivery, unlimited revisions, favicon creation, and source files included. Clients receive high-quality branding assets from renowned companies like Lamborghini. The role pays $4,173 and is tagged as 'Popular'. This job listing is perfect for creative professionals seeking quick-turnaround branding work with consistent pricing and strong brand recognition. Use this data to test or prototype UI components, especially job boards or freelance service listings. Posting age shows '2 day / $4.00'.",
  },
  {
    id: 2,
    title: "bespoke Logo+OneDay+Unlimited Rev+Favicon+Source files",
    name: "Slack",
    logo: "/placeholder.svg?height=80&width=80&text=S",
    salary: "$4,173",
    timePosted: "2 day / $4.00",
    tags: ["Popular"],
    type: "remote",
    description:
      "This remote freelance job offers bespoke logo design with one-day delivery, unlimited revisions, favicon creation, and source files included. Clients receive high-quality branding assets from renowned companies like Slack. The role pays $4,173 and is tagged as 'Popular'. This job listing is perfect for creative professionals seeking quick-turnaround branding work with consistent pricing and strong brand recognition. Use this data to test or prototype UI components, especially job boards or freelance service listings. Posting age shows '2 day / $4.00'.",
  },
  {
    id: 3,
    title: "bespoke Logo+OneDay+Unlimited Rev+Favicon+Source files",
    name: "Lamborghini",
    logo: "/placeholder.svg?height=80&width=80&text=L",
    salary: "$4,173",
    timePosted: "2 day / $4.00",
    tags: ["Popular"],
    type: "remote",
    description:
      "This remote freelance job offers bespoke logo design with one-day delivery, unlimited revisions, favicon creation, and source files included. Clients receive high-quality branding assets from renowned companies like Lamborghini. The role pays $4,173 and is tagged as 'Popular'. This job listing is perfect for creative professionals seeking quick-turnaround branding work with consistent pricing and strong brand recognition. Use this data to test or prototype UI components, especially job boards or freelance service listings. Posting age shows '2 day / $4.00'.",
  },
  {
    id: 4,
    title: "bespoke Logo+OneDay+Unlimited Rev+Favicon+Source files",
    name: "Slack",
    logo: "/placeholder.svg?height=80&width=80&text=S",
    salary: "$4,173",
    timePosted: "2 day / $4.00",
    tags: ["Popular"],
    type: "remote",
    description:
      "This remote freelance job offers bespoke logo design with one-day delivery, unlimited revisions, favicon creation, and source files included. Clients receive high-quality branding assets from renowned companies like Slack. The role pays $4,173 and is tagged as 'Popular'. This job listing is perfect for creative professionals seeking quick-turnaround branding work with consistent pricing and strong brand recognition. Use this data to test or prototype UI components, especially job boards or freelance service listings. Posting age shows '2 day / $4.00'.",
  },
  {
    id: 5,
    title: "bespoke Logo+OneDay+Unlimited Rev+Favicon+Source files",
    name: "Lamborghini",
    logo: "/placeholder.svg?height=80&width=80&text=L",
    salary: "$4,173",
    timePosted: "2 day / $4.00",
    tags: ["Popular"],
    type: "remote",
    description:
      "This remote freelance job offers bespoke logo design with one-day delivery, unlimited revisions, favicon creation, and source files included. Clients receive high-quality branding assets from renowned companies like Lamborghini. The role pays $4,173 and is tagged as 'Popular'. This job listing is perfect for creative professionals seeking quick-turnaround branding work with consistent pricing and strong brand recognition. Use this data to test or prototype UI components, especially job boards or freelance service listings. Posting age shows '2 day / $4.00'.",
  },
  {
    id: 6,
    title: "bespoke Logo+OneDay+Unlimited Rev+Favicon+Source files",
    name: "Slack",
    logo: "/placeholder.svg?height=80&width=80&text=S",
    salary: "$4,173",
    timePosted: "2 day / $4.00",
    tags: ["Popular"],
    type: "remote",
    description:
      "This remote freelance job offers bespoke logo design with one-day delivery, unlimited revisions, favicon creation, and source files included. Clients receive high-quality branding assets from renowned companies like Slack. The role pays $4,173 and is tagged as 'Popular'. This job listing is perfect for creative professionals seeking quick-turnaround branding work with consistent pricing and strong brand recognition. Use this data to test or prototype UI components, especially job boards or freelance service listings. Posting age shows '2 day / $4.00'.",
  },
  {
    id: 7,
    title: "bespoke Logo+OneDay+Unlimited Rev+Favicon+Source files",
    name: "Lamborghini",
    logo: "/placeholder.svg?height=80&width=80&text=L",
    salary: "$4,173",
    timePosted: "2 day / $4.00",
    tags: ["Popular"],
    type: "remote",
    description:
      "This remote freelance job offers bespoke logo design with one-day delivery, unlimited revisions, favicon creation, and source files included. Clients receive high-quality branding assets from renowned companies like Lamborghini. The role pays $4,173 and is tagged as 'Popular'. This job listing is perfect for creative professionals seeking quick-turnaround branding work with consistent pricing and strong brand recognition. Use this data to test or prototype UI components, especially job boards or freelance service listings. Posting age shows '2 day / $4.00'.",
  },
  {
    id: 8,
    title: "bespoke Logo+OneDay+Unlimited Rev+Favicon+Source files",
    name: "Slack",
    logo: "/placeholder.svg?height=80&width=80&text=S",
    salary: "$4,173",
    timePosted: "2 day / $4.00",
    tags: ["Popular"],
    type: "remote",
    description:
      "This remote freelance job offers bespoke logo design with one-day delivery, unlimited revisions, favicon creation, and source files included. Clients receive high-quality branding assets from renowned companies like Slack. The role pays $4,173 and is tagged as 'Popular'. This job listing is perfect for creative professionals seeking quick-turnaround branding work with consistent pricing and strong brand recognition. Use this data to test or prototype UI components, especially job boards or freelance service listings. Posting age shows '2 day / $4.00'.",
  },
];

const FavoriteTraders = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {jobListings.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row items-center p-4 gap-4">
              {/* Company Logo */}
              <div className="flex-shrink-0 w-24 h-24 border-3 rounded-full border-blue-600 flex items-center justify-center">
                <Image
                  src="/images/profiles/avatar1.png"
                  alt={`${job.name} logo`}
                  width={300}
                  height={300}
                  className="rounded-full object-contain"
                />
              </div>

              {/* Job Details */}
              <div className="flex-1 w-full">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {job.name}
                </h3>
                <p className="text-sm sm:text-base font-medium text-gray-800 line-clamp-2 my-2">
                  {job.title}
                </p>
                <div className="flex flex-wrap justify-between items-center mt-2">
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-orange-500 text-xl">★</span>
                    <span className="font-semibold text-gray-900">4.5/5</span>
                  </div>

                  <Link href={`/all-traders/${job.id}`}>
                    <Button
                      size="extraSmall"
                      className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 rounded-full"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteTraders;
