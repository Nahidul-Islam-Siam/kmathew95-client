"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Star, Download, Award, CheckCircle, SquarePen } from "lucide-react";
// If the file exists, ensure the path and filename are correct:

// If the file does not exist, place a valid PNG file at the specified path or use a placeholder:
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";


import { Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const member = {
  id: 1,
  name: "Robert Fox",
  title: "Product Manager",
  department: "Product",
  email: "robert@example.com",
  avatar: "/placeholder.svg?height=60&width=60",
  ratePerHour: 22,
  status: {
    flying: "Flying",
    ethics: "Ethics",
    performance: "Strong",
  },
  metrics: {
    rate: 80,
    taskBidsWon: 15,
    reviewsCount: 10,
    completedTasks: 8,
  },
  description:
    "Experienced Product Manager with a strong background in Agile methodologies and cross-functional leadership.",
  cvFileName: "robert_cv.pdf",
  reviews: [
    {
      badge: "Top Performer",
      rating: 5,
      reviewText:
        "Robert delivered outstanding results and exceeded our expectations.",
      reviewerName: "Jane Doe",
      reviewerTitle: "Project Lead",
    },
    {
      badge: "Reliable",
      rating: 4,
      reviewText:
        "Always on time and committed to quality work. Will hire again.",
      reviewerName: "Michael Smith",
      reviewerTitle: "Team Manager",
    },
  ],
};

export default function MyProfilePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const handleEditProfile = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // modal stuff
  const [hourlyRate, setHourlyRate] = useState([7.99]);
  const [skills, setSkills] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      const url = URL.createObjectURL(file);
      setPdfPreview(url);
    }
  };

  const togglePdfPreview = () => {
    setShowPdfPreview(!showPdfPreview);
  };

  // Cleanup PDF URL when component unmounts
  useEffect(() => {
    return () => {
      if (pdfPreview) {
        URL.revokeObjectURL(pdfPreview);
      }
    };
  }, [pdfPreview]);

  return (
    <>
      <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Image
                  src="/images/profiles/avatar1.png"
                  alt={member.name}
                  width={150}
                  height={150}
                  className="rounded bg-red-600 object-cover"
                  // when use api remove the bg-red-600
                />
                <div className="space-y-2">
                  <h1 className="text-xl md:text-2xl font-semibold">
                    {member.name}
                  </h1>
                  <p className="text-muted-foreground">{member.email}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">
                      Rating {member.metrics.rate / 20}
                    </span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(member.metrics.rate / 20)
                              ? "fill-orange-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={handleEditProfile}
                    className="bg-slate-800   hover:bg-slate-700 text-white"
                  >
                    <SquarePen />
                    Edit Profile
                  </Button>
                </div>
              </div>
              <div className="text-left md:text-right space-y-2">
                <div className="text-lg md:text-2xl font-semibold">
                  ${member.ratePerHour} / Per Hour
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              icon: Award,
              label: "Task Bids Won",
              value: member.metrics.taskBidsWon,
            },
            {
              icon: Star,
              label: "Reviews",
              value: member.metrics.reviewsCount,
            },
            {
              icon: CheckCircle,
              label: "Completed Tasks",
              value: member.metrics.completedTasks,
            },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl md:text-3xl font-semibold">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Description */}
        <Card className="lg:w-1/2">
          <CardContent className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
              Description
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              {member.description}
            </p>
          </CardContent>
        </Card>

        {/* Attached Files */}
        <Card className="lg:w-1/2">
          <CardContent className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
              Attached Files
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 font-medium text-sm">
                    CV
                  </span>
                </div>
                <span className="font-medium">{member.cvFileName}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-orange-600 hover:text-orange-700"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card>
          <CardContent className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Review</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {member.reviews.map((review, i) => (
                <div key={i} className="p-4 border rounded-lg bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      variant="secondary"
                      className="text-orange-600 bg-orange-50"
                    >
                      {review.badge}
                    </Badge>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {review.reviewText}
                  </p>
                  <div className="flex items-center gap-3">
                    <Image
                      src="/images/profiles/avatar2.png"
                      alt={review.reviewerName}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-sm">
                        {review.reviewerName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {review.reviewerTitle}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white   border p-10 rounded-xl border-blue-950 w-full h-[80vh] overflow-auto md:h-full max-w-5xl mx-auto mt-8">
            {/* Profile Header */}
            <div className="flex justify-end items-center mb-6">
              <button
                onClick={handleCloseModal}
                className=" bg-red-500 hover:bg-red-700 text-white px-[10px] py-1 rounded"
              >
                X
              </button>
            </div>
            <div className="flex items-center gap-4 pb-6 border-b border-gray-200 mb-8">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                  <Image
                    src={profileImage || "/images/profiles/avatar1.png"}
                    width={100}
                    height={100}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label
                  htmlFor="profileUpload"
                  className="absolute -bottom-1 -right-1 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-1 cursor-pointer"
                >
                  <Upload className="h-3 w-3" />
                </label>
                <input
                  id="profileUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Khan</h1>
                <p className="text-gray-600">zain.aminoff@email.com</p>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First name<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last name<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    className="h-12"
                  />
                </div>
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone number
                  </Label>
                  <Input id="phone" placeholder="+1" className="h-12" />
                </div>
              </div>

              {/* Skills and Hourly Rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="skills" className="text-sm font-medium">
                    Skills
                  </Label>
                  <Input
                    id="skills"
                    placeholder="e.g. Marketing,Designing"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Minimal hourly rate
                  </Label>
                  <div className="space-y-3">
                    <div className="text-lg font-semibold">
                      ${hourlyRate[0].toFixed(2)}/hr
                    </div>
                    <Slider
                      value={hourlyRate}
                      onValueChange={setHourlyRate}
                      max={100}
                      min={5}
                      step={0.01}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Nationality and Tagline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nationality" className="text-sm font-medium">
                    Nationality
                  </Label>
                  <Input
                    id="nationality"
                    placeholder="Enter your Nationality"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline" className="text-sm font-medium">
                    Tagline
                  </Label>
                  <Input
                    id="tagline"
                    placeholder="E.g. Expert figma"
                    className="h-12"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter your description"
                  className="min-h-[100px] resize-none"
                />
              </div>

              {/* PDF Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Upload Your CV (PDF)
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="pdfUpload"
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4" />
                      Choose PDF File
                    </label>
                    <input
                      id="pdfUpload"
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfUpload}
                      className="hidden"
                    />
                    {pdfFile && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {pdfFile.name}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={togglePdfPreview}
                          className="text-orange-500 border-orange-500 hover:bg-orange-50 bg-transparent"
                        >
                          {showPdfPreview ? "Hide Preview" : "Preview"}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* PDF Preview */}
                  {showPdfPreview && pdfPreview && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium">PDF Preview</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(pdfPreview, "_blank")}
                          className="text-orange-500 hover:text-orange-600"
                        >
                          Open in New Tab
                        </Button>
                      </div>
                      <div className="w-full h-96 border border-gray-300 rounded">
                        <iframe
                          src={pdfPreview}
                          className="w-full h-full rounded"
                          title="PDF Preview"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 flex  gap-5">
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full"
                >
                  Save Changes
                </Button>
                <button
                  onClick={handleCloseModal}
                  className="border-orange-500 border  text-orange-500  font-bold px-8 py-2 rounded-full"
                >
                  cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
