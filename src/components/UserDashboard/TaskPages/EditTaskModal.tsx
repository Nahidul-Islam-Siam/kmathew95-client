/* eslint-disable @typescript-eslint/no-explicit-any */
// components/management/EditTaskModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Upload as LucideUploadIcon } from "lucide-react"; // ✅ Icon only
import { FileText, MapPin, Plus, Upload, X, Trash2 } from "lucide-react";
import Image from "next/image";
import { useGetCategoryQuery } from "@/redux/service/admin/category";
import { useUpdateTaskManagementMutation } from "@/redux/service/admin/taskManagemant";
import { toast } from "sonner";
import Swal from "sweetalert2";

// 🔽 Import types
import { TaskManagementResponseData } from "@/redux/service/admin/taskManagemant";

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  task: TaskManagementResponseData | null; // ← Accept real API task
}

export default function EditTaskModal({ open, onClose, task }: EditModalProps) {
  const [title, setTitle] = useState("");
  const [taskType, setTaskType] = useState<"CASH" | "PAYMENT">("PAYMENT");
  const [location, setLocation] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [categoryid, setCategoryid] = useState("");
  const [subCategoryid, setSubCategoryid] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Fetch categories
  const {  data: categoryData, isLoading: isCategoryLoading } = useGetCategoryQuery();

  // Mutation
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskManagementMutation();

  const categoryOptions = categoryData?.data?.data || [];

  // Subcategories
  const subCategoryOptions = categoryOptions
    .find((cat: any) => cat.id === selectedCategoryId)
    ?.SubCategory || [];

  // 📦 Handle file upload
// 📦 Handle file upload
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    toast.error("Only PDF and image files are allowed.");
    return; 
  }

  setUploadedFile(file);
  const url = URL.createObjectURL(file);
  setFilePreview(url);
};

  const togglePreview = () => setShowPreview(!showPreview);

  // Clean up blob URL
  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  // 🔄 Load task data when modal opens
  useEffect(() => {
    if (open && task) {
      setTitle(task.title);
      setTaskType(task.taskType as "CASH" | "PAYMENT");
      setLocation(task.location);
      setMinSalary(task.min_salary.toString());
      setMaxSalary(task.max_salary.toString());
      setTags([...task.tags]);
      setSkills([...task.require_skills]);
      setCategoryid(task.categoryid);
      setSubCategoryid(task.subCategoryid);
      setDescription(task.description);
      setDeadline(task.deadline.split("T")[0]); // Convert to YYYY-MM-DD
      setSelectedCategoryId(task.categoryid);
    }
  }, [open, task]);

  // Add tag
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Add skill
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setCategoryid(value);
    setSubCategoryid(null);
    setSelectedCategoryId(value);
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !deadline || skills.length === 0) {
      toast.error("Please fill all required fields.");
      return;
    }

    const numMin = parseFloat(minSalary);
    const numMax = parseFloat(maxSalary);

    if (isNaN(numMin) || isNaN(numMax) || numMin <= 0 || numMax <= 0) {
      toast.error("Please enter valid salary values.");
      return;
    }

    if (numMin > numMax) {
      toast.error("Minimum salary cannot exceed maximum.");
      return;
    }

    // Prepare postData
    const postData = {
      title,
      taskType,
      location,
      min_salary: numMin,
      max_salary: numMax,
      require_skills: skills,
      description,
      deadline: `${deadline}T23:59:59.000Z`,
      tags,
      categoryid,
      subCategoryid: subCategoryid || undefined,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(postData));

    if (uploadedFile) {
      formData.append("files", uploadedFile);
    }

    try {
      const result = await updateTask({ id: task!.id, formData }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: result.message || "Task updated successfully!",
        timer: 2000,
        showConfirmButton: false,
      });

      onClose();
    } catch (error: any) {
      const message =
        error?.data?.message || error?.message || "Failed to update task.";
      toast.error(message);
    }
  };

  if (!open || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 z-50 flex items-center justify-center overflow-auto p-4">
      <div className="max-w-4xl w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 flex items-center justify-center rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Task</h1>
          <div className="flex items-center gap-2 text-gray-600 mt-1">
            <FileText className="w-4 h-4" />
            <span>Update your job post</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Job Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Job Type</Label>
              <Select value={taskType} onValueChange={(value) => setTaskType(value as "CASH" | "PAYMENT")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Paid With Hand Cash</SelectItem>
                  <SelectItem value="PAYMENT">Paid With Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category & Subcategory & Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Job Category</Label>
              <Select value={categoryid} onValueChange={handleCategoryChange} disabled={isCategoryLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sub-Category</Label>
              <Select
                value={subCategoryid || ""}
                onValueChange={setSubCategoryid}
                disabled={!selectedCategoryId || subCategoryOptions.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={subCategoryOptions.length ? "Select Sub-Category" : "No subcategories"} />
                </SelectTrigger>
                <SelectContent>
                  {subCategoryOptions.map((sub: any) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <div className="relative">
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Dhaka, Bangladesh"
                  className="pr-10"
                />
                <MapPin className="absolute right-3 top-1/2 w-4 h-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Salary Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Salary Range (USD)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    type="text"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder="Min"
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">USD</span>
                </div>
                <div className="relative">
                  <Input
                    type="text"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder="Max"
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">USD</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="e.g., Figma"
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                />
                <Button type="button" onClick={addTag} size="icon" className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-red-500">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Required Skills */}
          <div className="space-y-2">
            <Label>Required Skills</Label>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="e.g., React"
                onKeyPress={(e) => e.key === "Enter" && addSkill()}
              />
              <Button type="button" onClick={addSkill} size="icon" className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm"
                >
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="ml-1 text-blue-500">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Job Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task..."
              className="min-h-32"
              required
            />
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label>Deadline</Label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <Label>Upload New Reference File (Optional)</Label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="edit-file-upload"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <Upload className="h-4 w-4" />
                Choose File
              </label>
              <input
                id="edit-file-upload"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
              {uploadedFile && <span className="text-sm text-gray-600">{uploadedFile.name}</span>}
            </div>

            {uploadedFile && (
              <div className="flex items-center gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={togglePreview}
                  className="text-orange-500 border-orange-500 hover:bg-orange-50"
                >
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </Button>
              </div>
            )}

            {/* Preview */}
            {showPreview && filePreview && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium">File Preview</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(filePreview, "_blank")}
                    className="text-orange-500"
                  >
                    Open in New Tab
                  </Button>
                </div>

                {uploadedFile?.type === "application/pdf" ? (
                  <iframe src={filePreview} className="w-full h-96 border rounded" title="PDF Preview" />
                ) : (
                  <Image
                    src={filePreview}
                    alt="Preview"
                    width={600}
                    height={400}
                    className="max-h-96 w-full object-contain border rounded"
                  />
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Task"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-orange-500 text-orange-500 hover:text-orange-600 hover:border-orange-600"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}