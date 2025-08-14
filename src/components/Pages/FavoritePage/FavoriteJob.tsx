import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import img from "@/assets/CardImage/image 2.png";
import Image from "next/image";

const jobListings = [
  {
    id: 1,
    title: "bespoke Logo+OneDay+Unlimited Rev+Favicon+Source files",
    company: "Lamborghini",
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
    company: "Slack",
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
    company: "Lamborghini",
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
    company: "Slack",
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
    company: "Lamborghini",
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
    company: "Slack",
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
    company: "Lamborghini",
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
    company: "Slack",
    logo: "/placeholder.svg?height=80&width=80&text=S",
    salary: "$4,173",
    timePosted: "2 day / $4.00",
    tags: ["Popular"],
    type: "remote",
    description:
      "This remote freelance job offers bespoke logo design with one-day delivery, unlimited revisions, favicon creation, and source files included. Clients receive high-quality branding assets from renowned companies like Slack. The role pays $4,173 and is tagged as 'Popular'. This job listing is perfect for creative professionals seeking quick-turnaround branding work with consistent pricing and strong brand recognition. Use this data to test or prototype UI components, especially job boards or freelance service listings. Posting age shows '2 day / $4.00'.",
  },
];

const FavoriteJob = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 gap-6">
        {jobListings.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row">
              {/* Company Logo */}
              <div className="w-full md:w-48 bg-gray-900 rounded-t-xl md:rounded-l-xl md:rounded-tr-none flex items-center justify-center p-4">
                <Image
                  src={img}
                  alt={`${job.company} logo`}
                  width={60}
                  height={60}
                  className="rounded-lg object-contain"
                />
              </div>

              {/* Job Details */}
              <div className="flex-1 min-w-0 p-4">
                {/* Tags & Remove Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button
                    size={"extraSmall"}
                    className="px-3 hover:text-orange-700 bg-[#FCF2EA] hover:bg-[#FCF2EA] text-orange-500 text-xs rounded-xl"
                  >
                    Remove
                  </Button>
                </div>

                {/* Title & Time */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between my-2 gap-2">
                  <h3 className="sm:w-2/3 font-medium text-gray-900 line-clamp-2">
                    {job.title}
                  </h3>
                  <h2 className="text-xs text-gray-500">{job.timePosted}</h2>
                </div>

                {/* Salary & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-orange-500">★</span>
                    <span className="font-semibold text-gray-900">
                      {job.salary}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size={"extraSmall"}
                      className="px-4 hover:bg-blue bg-blue-900 text-white text-xs rounded-full"
                    >
                      Message
                    </Button>
                    <Link href={`/all-services/${job.id}`}>
                      <Button
                        size="extraSmall"
                        className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 rounded-full"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteJob;
