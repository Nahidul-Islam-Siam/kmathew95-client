"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Star, Download, Award, CheckCircle, SquarePen, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useGetUserQuery } from "@/redux/service/userApi";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyProfilePage() {
  const { data, isLoading, isError } = useGetUserQuery();
  const [modalOpen, setModalOpen] = useState(false);

  console.log(data);

  // Extract real user and trader data
  const user = data?.data;
  const trader = user?.trader;

  // Form state
  const [hourlyRate, setHourlyRate] = useState([trader?.mininumHoulyRate || 20]);
  const [skills, setSkills] = useState(trader?.skills?.join(", ") || "");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  useEffect(() => {
    return () => {
      if (pdfPreview) URL.revokeObjectURL(pdfPreview);
    };
  }, [pdfPreview]);

  if (isLoading) {
    return <Skeleton />;
  }

  if (isError || !user) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-red-600">Failed to load profile</h2>
      </div>
    );
  }

  // Derived values
  const fullName = `${trader?.fastName || ""} ${trader?.lastName || ""}`.trim() || user.username;
  const avatar = profileImage || user.avatar || "/images/profiles/avatar1.png";
  const cvFileName = pdfFile?.name || trader?.resumeFile || "resume.pdf";
  const rating = 4.8;

  const handleEditProfile = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target?.result as string);
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

  const togglePdfPreview = () => setShowPdfPreview(!showPdfPreview);

  const handleSave = () => {
    // TODO: Dispatch update mutation when API is ready
    console.log("Saving profile:", {
      fullName,
      hourlyRate: hourlyRate[0],
      skills: skills.split(",").map(s => s.trim()),
      profileImage,
      pdfFile,
    });

    alert("Profile updated successfully!");
    handleCloseModal();
  };

  return (
    <>
      <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Image
                  src={avatar}
                  alt={fullName}
                  width={150}
                  height={150}
                  className="rounded object-cover border border-gray-200"
                />
                <div className="space-y-2">
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-900">{fullName}</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">Rating {rating}</span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={handleEditProfile}
                    className="bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-2 text-sm px-4 h-9 mt-1"
                  >
                    <SquarePen className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </div>
              </div>
              <div className="text-left md:text-right space-y-2 mt-4 sm:mt-0">
                <div className="text-lg md:text-2xl font-semibold text-gray-900">
                  ${hourlyRate[0].toFixed(2)} / hr
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: Award, label: "Task Bids Won", value: trader?.id ? 15 : 0 },
            { icon: Star, label: "Reviews", value: trader?.id ? 10 : 0 },
            { icon: CheckCircle, label: "Completed Tasks", value: trader?.id ? 8 : 0 },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl md:text-3xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Description */}
        <Card className="lg:w-1/2">
          <CardContent className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-900">Description</h2>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              {trader?.description || "No description provided yet."}
            </p>
          </CardContent>
        </Card>

        {/* Attached Files */}
        <Card className="lg:w-1/2">
          <CardContent className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-900">Attached Files</h2>
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 font-medium text-sm">CV</span>
                </div>
                <span className="font-medium text-gray-900">{cvFileName}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-orange-600 hover:text-orange-700"
                onClick={() => pdfPreview && window.open(pdfPreview, "_blank")}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card>
          <CardContent className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-900">Reviews</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="bg-orange-50 text-orange-600 text-xs px-2 py-1">
                      {i === 0 ? "Top Performer" : "Reliable"}
                    </Badge>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= (i === 0 ? 5 : 4)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {i === 0 ? "Exceeded expectations. Highly recommend!" : "Delivered on time and quality."}
                  </p>
                  <div className="flex items-center gap-3">
                    <Image
                      src="/images/profiles/avatar2.png"
                      alt="Reviewer"
                      width={32}
                      height={32}
                      className="rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <p className="font-medium text-sm text-gray-900">{i === 0 ? "Jane Doe" : "Michael Smith"}</p>
                      <p className="text-xs text-muted-foreground">{i === 0 ? "Project Lead" : "Team Manager"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ✅ Edit Profile Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-blue-950 rounded-xl w-full max-w-5xl max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
              <button
                onClick={handleCloseModal}
                className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="p-6 space-y-6">
              {/* Profile Image */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                    <Image
                      src={profileImage || user.avatar || "/images/profiles/avatar1.png"}
                      width={64}
                      height={64}
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
                  <h3 className="font-medium text-gray-900">{fullName}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input
                    defaultValue={trader?.fastName || ""}
                    placeholder="Enter your first name"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input
                    defaultValue={trader?.lastName || ""}
                    placeholder="Enter your last name"
                    className="h-12"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue={user.email} disabled className="h-12 bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input defaultValue={user.contactNo || ""} placeholder="+1" className="h-12" />
                </div>
              </div>

              {/* Skills & Rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Skills</Label>
                  <Input
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. Figma, React, UI/UX"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Minimal Hourly Rate</Label>
                  <div className="space-y-2">
                    <div className="text-lg font-semibold">${hourlyRate[0].toFixed(2)}/hr</div>
                    <Slider
                      value={hourlyRate}
                      onValueChange={setHourlyRate}
                      min={5}
                      max={100}
                      step={0.01}
                    />
                  </div>
                </div>
              </div>

              {/* Nationality & Tagline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nationality</Label>
                  <Input placeholder="e.g. Bangladeshi" className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input placeholder="e.g. Expert in Figma & Prototyping" className="h-12" />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  defaultValue={trader?.description || ""}
                  placeholder="Tell us about yourself"
                  className="min-h-[100px]"
                />
              </div>

              {/* CV Upload */}
              <div className="space-y-2">
                <Label>Upload CV (PDF)</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="pdfUpload"
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4" />
                      Choose PDF
                    </label>
                    <input
                      id="pdfUpload"
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfUpload}
                      className="hidden"
                    />
                    {pdfFile && (
                      <span className="text-sm text-gray-600">{pdfFile.name}</span>
                    )}
                  </div>

                  {showPdfPreview && pdfPreview && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium">PDF Preview</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(pdfPreview, "_blank")}
                          className="text-orange-500"
                        >
                          Open in New Tab
                        </Button>
                      </div>
                      <iframe src={pdfPreview} className="w-full h-64 rounded border" title="CV Preview" />
                    </div>
                  )}

                  {pdfFile && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={togglePdfPreview}
                      className="text-orange-500 border-orange-500"
                    >
                      {showPdfPreview ? "Hide Preview" : "Show Preview"}
                    </Button>
                  )}
                </div>
              </div>

              {/* Save & Cancel */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full"
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  className="border-orange-500 text-orange-500 px-8 py-3 rounded-full"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
