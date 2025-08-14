"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";
import { Download } from "lucide-react";
import img from "@/assets/CardImage/image 2.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      "This remote freelance job offers bespoke logo design with one-day delivery, unlimited revisions, favicon creation, and source files included. Clients receive high-quality branding assets from renowned companies like Lamborghini. The role pays $4,173 and is tagged as 'Popular'.",
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
      "This remote freelance job offers bespoke logo design with one-day delivery, unlimited revisions, favicon creation, and source files included. Clients receive high-quality branding assets from renowned companies like Slack. The role pays $4,173 and is tagged as 'Popular'.",
  },
];

const files = [
  { name: "Company logo", type: "PDF", url: "/path/to/file1.pdf" },
  { name: "Company logo", type: "PDF", url: "/path/to/file2.pdf" },
  { name: "Company logo", type: "PDF", url: "/path/to/file3.pdf" },
];

const ServicesDetailsPage = () => {
  const params = useParams();
  const id = Number(params?.id);
  const job = jobListings.find((job) => job.id === id);

  const handleDownload = (fileName: string, fileUrl: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!job) return <div className="text-center text-gray-500">Job not found.</div>;

  return (
    <div className="min-h-screen container mx-auto px-4 my-8">
      {/* header card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full h-52 md:h-full md:w-72 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <Image src={img} alt={`${job.company} logo`} width={600} height={600} className="rounded-lg" />
          </div>
          <div className="flex-1 min-w-0 p-4">
            <div className="flex flex-wrap items-start justify-between mb-2 gap-2">
              <div className="flex gap-2 flex-wrap">
                {job.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="px-3 py-1 bg-blue-900 text-white text-xs rounded-full">{job.type}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between my-2">
              <h3 className="font-medium text-gray-900 mb-3 line-clamp-2">{job.title}</h3>
              <h2 className="text-xs text-gray-500">{job.timePosted}</h2>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-orange-500">★</span>
                <span className="font-semibold text-gray-900">{job.salary}</span>
              </div>
              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 rounded-full"
                onClick={() => alert("Hire Now clicked")}
              >
                Hire Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Job Description & Order */}
      <div className="flex flex-col lg:flex-row gap-8 my-10">
        <div className="w-full lg:w-2/3">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Job Description</h2>
          <p className="text-gray-400 text-lg mb-3">{job.description}</p>
          <div className="w-full max-w-2xl py-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Attached Files</h2>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">{file.name}</span>
                    <span className="text-xs text-gray-500 uppercase">{file.type}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(file.name, file.url)} className="text-orange-600 hover:text-orange-700 hover:bg-orange-100">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full max-w-md mx-auto lg:mx-0 bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
          <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-gray-900 rounded flex-shrink-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-orange-400 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-gray-900 leading-tight">{job.title}</h3>
                <span className="text-lg font-semibold text-gray-900 ml-4">$49.80</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Brown Vegan Leather</p>
            </div>
          </div>

          <div className="py-6 border-b border-gray-200 flex gap-3">
            <Input placeholder="Give your Bit" className="flex-1 h-10 text-sm border-gray-300 focus:border-gray-400 focus:ring-0" />
            <Button variant="outline" className="px-6 h-10 text-sm border-gray-300 hover:bg-gray-50 bg-transparent">
              Apply
            </Button>
          </div>

          <div className="py-6 space-y-3 border-b border-gray-200">
            <div className="flex justify-between text-sm"><span>Total</span><span>$49.80</span></div>
            <div className="flex justify-between text-sm"><span>Platform Charge</span><span>$7.24</span></div>
            <div className="flex justify-between text-sm"><span>Tax</span><span>$7.24</span></div>
          </div>

          <div className="py-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-2xl font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-semibold text-gray-900">$59.28</span>
            </div>
            <Button className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium text-base rounded-md"
              onClick={() => alert("Task Requested")}>
              Request Task
            </Button>
          </div>
        </div>
      </div>

      {/* Similar Jobs */}
      <div className="mb-20">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Similar Jobs</h2>
        <div className="grid grid-cols-1 gap-6 mb-8">
          {jobListings
            .filter((j) => j.id !== id)
            .slice(0, 2)
            .map((job) => (
              <div key={job.id} className="bg-white md:max-w-3xl rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <div className="w-40 md:w-72 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Image src={img} alt={`${job.company} logo`} width={60} height={60} className="rounded-lg" />
                  </div>
                  <div className="flex-1 min-w-0 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex gap-2 flex-wrap">
                        {job.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="px-3 py-1 bg-blue-900 text-white text-xs rounded-full">Remote</span>
                    </div>
                    <div className="flex items-center justify-between my-2">
                      <h3 className="w-2/3 font-medium text-gray-900 mb-3 line-clamp-2">{job.title}</h3>
                      <h2 className="text-xs text-gray-500">{job.timePosted}</h2>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-orange-500">★</span>
                        <span className="font-semibold text-gray-900">{job.salary}</span>
                      </div>
                      <Link href={`/all-services/${job.id}`}>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 rounded-full">
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
    </div>
  );
};

export default ServicesDetailsPage;






