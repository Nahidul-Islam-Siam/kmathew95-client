// components/EditProfileModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";
import { useGetUserQuery } from "@/redux/service/userApi";
import { useUpdateTraderByIdMutation } from "@/redux/service/userApi";

type EditProfileModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function EditProfileModal({ open, onClose }: EditProfileModalProps) {
  const { data } = useGetUserQuery();
  const user = data?.data;
  const trader = user?.trader;

  const [formValues, setFormValues] = useState({
    fastName: "",
    lastName: "",
    contactNo: "",
    userDescription: "",
    nationality: "",
    tagline: "",
    skills: "",
    mininumHoulyRate: 20,
    socialMediaLink: "",
    traderDescription: "",
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [updateTrader] = useUpdateTraderByIdMutation();

  // Initialize form
  useEffect(() => {
    if (trader && user) {
      setFormValues({
        fastName: trader.fastName || "",
        lastName: trader.lastName || "",
        contactNo: user.contactNo || "",
        userDescription: user.description || "",
        nationality: trader.nationality || "",
        tagline: trader.tagline?.join(", ") || "",
        skills: trader.skills?.join(", ") || "",
        mininumHoulyRate: trader.mininumHoulyRate || 20,
        socialMediaLink: trader.socialMediaLink?.[0] || "",
        traderDescription: trader.description || "",
      });
    }
  }, [trader, user]);

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (pdfPreview) URL.revokeObjectURL(pdfPreview);
    };
  }, [pdfPreview]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      toast.warning("Please upload a valid image (JPG, PNG, GIF).");
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("PDF must be under 5MB.");
        return;
      }
      setPdfFile(file);
      const url = URL.createObjectURL(file);
      setPdfPreview(url);
    } else {
      toast.warning("Please upload a valid PDF file.");
    }
  };

  const togglePdfPreview = () => setShowPdfPreview(!showPdfPreview);

  const handleSave = async () => {
    if (!user) return;

    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        username: [formValues.fastName.trim(), formValues.lastName.trim()]
          .filter(Boolean)
          .join(" "),
        description: formValues.userDescription,
        contactNo: formValues.contactNo,
        trader: {
          fastName: formValues.fastName.trim() || null,
          lastName: formValues.lastName.trim() || null,
          skills: formValues.skills
            ? formValues.skills.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
          mininumHoulyRate: formValues.mininumHoulyRate,
          nationality: formValues.nationality.trim() || null,
          tagline: formValues.tagline
            ? formValues.tagline.split(",").map((t) => t.trim()).filter(Boolean)
            : [],
          description: formValues.traderDescription,
          socialMediaLink: formValues.socialMediaLink
            ? [formValues.socialMediaLink.trim()]
            : [],
          attachments: trader?.attachments || [],
        },
      })
    );

    if (profileImage && user.avatar && !user.avatar.includes(profileImage)) {
      const blob = await fetch(profileImage).then((r) => r.blob());
      formData.append("avatar", new File([blob], "avatar.png", { type: "image/png" }));
    }

    if (pdfFile) {
      formData.append("resumeFile", pdfFile);
    }

    try {
      await updateTrader({ id: user.id, data: formData }).unwrap();
      toast.success("✅ Profile updated successfully!");
      onClose();
    } catch (error) {
      toast.error("❌ Failed to update profile. Please try again.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-blue-950 rounded-xl w-full max-w-5xl max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="p-6 space-y-6">
          {/* Profile Image */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                <Image
                  src={profileImage || user?.avatar || "/images/profiles/avatar1.png"}
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
              <h3 className="font-medium text-gray-900">
                {formValues.fastName} {formValues.lastName}
              </h3>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                value={formValues.fastName}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, fastName: e.target.value }))
                }
                placeholder="Enter your first name"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                value={formValues.lastName}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, lastName: e.target.value }))
                }
                placeholder="Enter your last name"
                className="h-12"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email} disabled className="h-12 bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={formValues.contactNo}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, contactNo: e.target.value }))
                }
                placeholder="+1"
                className="h-12"
              />
            </div>
          </div>

          {/* User Description */}
          <div className="space-y-2">
            <Label>Bio / About Me</Label>
            <Textarea
              value={formValues.userDescription}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, userDescription: e.target.value }))
              }
              placeholder="Tell us about your background"
              className="min-h-[80px]"
            />
          </div>

          {/* Skills & Rate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Skills</Label>
              <Input
                value={formValues.skills}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, skills: e.target.value }))
                }
                placeholder="React, NestJS, Prisma"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label>Minimal Hourly Rate</Label>
              <div className="space-y-2">
                <div className="text-lg font-semibold">
                  ${formValues.mininumHoulyRate.toFixed(2)}/hr
                </div>
                <Slider
                  value={[formValues.mininumHoulyRate]}
                  onValueChange={([value]) =>
                    setFormValues((prev) => ({ ...prev, mininumHoulyRate: value }))
                  }
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
              <Input
                value={formValues.nationality}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, nationality: e.target.value }))
                }
                placeholder="e.g. Bangladeshi"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input
                value={formValues.tagline}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, tagline: e.target.value }))
                }
                placeholder="Fullstack Developer, Remote Worker"
                className="h-12"
              />
            </div>
          </div>

          {/* Professional Description */}
          <div className="space-y-2">
            <Label>Professional Description</Label>
            <Textarea
              value={formValues.traderDescription}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, traderDescription: e.target.value }))
              }
              placeholder="Experienced developer with 5+ years of expertise."
              className="min-h-[100px]"
            />
          </div>

          {/* Social Media */}
          <div className="space-y-2">
            <Label>Social Media (LinkedIn, GitHub)</Label>
            <Input
              value={formValues.socialMediaLink}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, socialMediaLink: e.target.value }))
              }
              placeholder="https://linkedin.com/in/johndoe"
              className="h-12"
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
                {pdfFile && <span className="text-sm text-gray-600">{pdfFile.name}</span>}
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
              onClick={onClose}
              className="border-orange-500 text-orange-500 px-8 py-3 rounded-full"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}