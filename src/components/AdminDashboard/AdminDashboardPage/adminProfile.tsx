"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Trash2 } from "lucide-react";
import {
  useGetUserQuery,
  useUpdateAdminByIdMutation,
} from "@/redux/service/userApi";
import { toast } from "sonner";

export default function AdminProfilePage() {
  const { data: userData, isLoading, isError, refetch } = useGetUserQuery();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminByIdMutation();

  const user = userData?.data;
  const admin = user?.admin;

  // Form state
  const [adminInfo, setAdminInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Profile image (can be URL or local data URL)
  const [profileImage, setProfileImage] = useState<string>(
    "/placeholder.svg?height=64&width=64"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Track selected file

  // Load data from API
  useEffect(() => {
    if (user && admin) {
      const fullName =
        [admin.fastName, admin.lastName].filter(Boolean).join(" ") ||
        "Admin User";
      setAdminInfo({
        name: fullName,
        email: user.email || "",
        phone: user.contactNo || "",
        address: user.description || "",
      });

      if (user.avatar) {
        setProfileImage(user.avatar);
      }
    }
  }, [user, admin]);

  const handleAdminInfoChange = (field: string, value: string) => {
    setAdminInfo((prev) => ({ ...prev, [field]: value }));
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
      toast.error("Please upload a valid image (JPG, PNG, GIF).");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image is too large. Please upload an image under 2MB.");
      return;
    }

    // Set preview
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Save file for later upload
    setSelectedFile(file);
  };

  const handleAvatarClick = () => {
    document.getElementById("profile-image-input")?.click();
  };

  const handleRemoveImage = () => {
    if (user?.avatar) {
      setProfileImage(user.avatar);
      setSelectedFile(null);
    } else {
      setProfileImage("/placeholder.svg?height=64&width=64");
      setSelectedFile(null);
    }
  };

  // Save changes
  const handleSaveChanges = async () => {
    if (!admin) return;

    const [fastName, ...lastNameParts] = adminInfo.name.trim().split(" ");
    const lastName = lastNameParts.join(" ") || null;

    // Prepare data object
    const userData = {
      username: adminInfo.name,
      email: adminInfo.email,
      contactNo: adminInfo.phone,
      description: adminInfo.address,
      admin: {
        fastName: fastName || null,
        lastName,
      },
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(userData));

    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }

    try {
      const res = await updateAdmin({ id: user.id, data: formData }).unwrap();
      if (res?.success) {
        toast.success(res.message || "Profile updated successfully!");
        refetch(); // Re-fetch user data
      } else {
        toast.error(res.message || "Failed to update profile.");
      }
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load profile data.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600">
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            <Avatar
              className="h-16 w-16 border-2 border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleAvatarClick}
            >
              <AvatarImage src={profileImage} alt="Profile picture" />
              <AvatarFallback>
                {adminInfo.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div
              className="absolute -bottom-1 -right-1 bg-slate-800 text-white p-1 rounded-full cursor-pointer hover:bg-slate-700 transition"
              onClick={handleAvatarClick}
            >
              <Camera className="h-3 w-3" />
            </div>

            <input
              id="profile-image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-medium">{adminInfo.name}</h3>
            <p className="text-sm text-gray-600">{adminInfo.email}</p>

            {selectedFile && (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-2 h-8"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                type="button"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Reset Photo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Admin Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Admin Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name*
            </Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={adminInfo.name}
              onChange={(e) => handleAdminInfoChange("name", e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email*
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={adminInfo.email}
              onChange={(e) => handleAdminInfoChange("email", e.target.value)}
              className="h-10"
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </Label>
            <Input
              id="phone"
              placeholder="+1 (555) 000-0000"
              value={adminInfo.phone}
              onChange={(e) => handleAdminInfoChange("phone", e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Address / Bio
            </Label>
            <Input
              id="address"
              placeholder="Enter your address or bio"
              value={adminInfo.address}
              onChange={(e) => handleAdminInfoChange("address", e.target.value)}
              className="h-10"
            />
          </div>

          <div className="pt-2">
            <Button
              onClick={handleSaveChanges}
              disabled={isUpdating}
              className="bg-slate-800 hover:bg-slate-700 disabled:bg-slate-400"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
