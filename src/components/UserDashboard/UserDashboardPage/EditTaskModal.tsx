/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Tag,
  Space,
  Button,
  Typography,
  Row,
  Col,
  Divider,
  Image as AntdImage,
  message,
} from "antd";
import {
  FileTextOutlined,
  PlusOutlined,
  UploadOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useGetCategoryQuery } from "@/redux/service/admin/category";
import { useUpdateTaskManagementMutation } from "@/redux/service/admin/taskManagemant";
import { useGetMeQuery } from "@/redux/service/auth/authApi";
import { toast } from "sonner";
import Swal from "sweetalert2";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

// === Types ===
interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  SubCategory?: SubCategory[];
}

export interface Task {
  id: string;
  title: string;
  taskType: "CASH" | "PAYMENT";
  location?: string;
  min_salary: number;
  max_salary: number;
  require_skills: string[];
  description: string;
  deadline: string; // ISO date string (e.g., "2025-08-20T10:00:00.000Z")
  tags: string[];
  categoryid: string;
  subcategoryid?: string;
  uploadedFileUrl?: string;
}

interface FormValues {
  title: string;
  taskType: "CASH" | "PAYMENT";
  jobCategory: string;
  jobSubCategory?: string;
  location?: string;
  salary?: [string, string];
  tags?: string[];
  description: string;
  deadline: string;
  upload?: any[];
  requiredSkills?: string[];
}

interface UpdateTaskModalProps {
  open: boolean;
  onClose: () => void;
  task: Task; // ← Full task object passed from parent
  onSuccess?: () => void; // Optional callback after success
}

export default function UpdateTaskModal({
  open,
  onClose,
  task,
  onSuccess,
}: UpdateTaskModalProps) {
  const [form] = Form.useForm<FormValues>();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  // Fetch current user
  const { data: meData } = useGetMeQuery();
  const traderId = meData?.data?.trader?.id;

  // Fetch categories
  const { data: categoryData, isLoading: isCategoryLoading } =
    useGetCategoryQuery();
  const [updateTask, { isLoading: isSubmitting }] =
    useUpdateTaskManagementMutation();

  // Options
  const categoryOptions = React.useMemo(
    () => categoryData?.data?.data || [],
    [categoryData]
  );

  const subCategoryOptions = React.useMemo(() => {
    if (!selectedCategoryId) return [];
    const category = categoryOptions.find(
      (cat: any) => cat.id === selectedCategoryId
    );
    return category?.SubCategory || [];
  }, [selectedCategoryId, categoryOptions]);

  // Pre-fill form using passed `task` prop
  useEffect(() => {
    if (open && task) {
      // Extract deadline date only (YYYY-MM-DD)
      const deadlineDate = task.deadline.split("T")[0];

      form.setFieldsValue({
        title: task.title,
        taskType: task.taskType,
        location: task.location,
        salary: [task.min_salary.toString(), task.max_salary.toString()],
        description: task.description,
        deadline: deadlineDate,
        tags: task.tags,
        jobCategory: task.categoryid,
        jobSubCategory: task.subcategoryid,
      });

      setTags(task.tags || []);
      setSkills(task.require_skills || []);
      setSelectedCategoryId(task.categoryid);

      // Set file if exists
      if (task.uploadedFileUrl) {
        const fileName =
          task.uploadedFileUrl.split("/").pop() || "Attached File";
        setFileList([
          {
            uid: "-1",
            name: fileName,
            status: "done",
            url: task.uploadedFileUrl,
          },
        ]);
      } else {
        setFileList([]);
      }
    }
  }, [open, task, form]);

  // Reset form and state when modal closes
  useEffect(() => {
    if (!open) {
      form.resetFields();
      setTags([]);
      setSkills([]);
      setFileList([]);
      setSelectedCategoryId(null);
      setTagInput("");
      setSkillInput("");
    }
  }, [open, form]);

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
    form.setFieldsValue({ jobSubCategory: undefined });
  };

  // Upload handlers
  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(0, 1)); // Only one file allowed
  };

  const handlePreview = async (file: any) => {
    let preview = file.url || file.preview;
    if (!preview && file.originFileObj) {
      preview = URL.createObjectURL(file.originFileObj);
    }
    setPreviewFile(preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name ||
        file.url?.substring(file.url.lastIndexOf("/") + 1) ||
        "Preview"
    );
  };

  // Tags
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // Skills
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  // Submit handler
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Parse salary
      const parseSalary = (val: string) =>
        parseFloat(val.replace(/[^0-9.]/g, "")) || NaN;

      const min_salary = parseSalary(values.salary?.[0] || "");
      const max_salary = parseSalary(values.salary?.[1] || "");

      if (isNaN(min_salary) || min_salary <= 0) {
        toast.error("Please enter a valid minimum salary greater than 0");
        return;
      }
      if (isNaN(max_salary) || max_salary <= 0) {
        toast.error("Please enter a valid maximum salary greater than 0");
        return;
      }
      if (min_salary > max_salary) {
        toast.error("Minimum salary cannot exceed maximum");
        return;
      }

      if (!selectedCategoryId) {
        toast.error("Please select a job category");
        return;
      }

      if (skills.length === 0) {
        toast.error("Please add at least one required skill");
        return;
      }

      if (!traderId) {
        toast.error("Authentication failed: Trader ID not found");
        return;
      }

      const postData = {
        title: values.title,
        taskType: values.taskType,
        location: values.location || "",
        min_salary,
        max_salary,
        require_skills: skills,
        description: values.description,
        deadline: `${values.deadline}T23:59:59.000Z`,
        tags,
        traderId,
        categoryid: selectedCategoryId,
        subcategoryid: values.jobSubCategory,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(postData));

      // Append file if new one selected
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("files", file.originFileObj);
        }
      });

      // ✅ Perform update
      const result = await updateTask({ id: task.id, formData }).unwrap();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: result.message || "Task updated successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
        onSuccess?.();
        onClose();
      } else {
        toast.error(result.message || "Failed to update task.");
      }
    } catch (error: any) {
      const msg = error?.data?.message || error?.message || "Update failed";
      toast.error(msg);
      console.error("Update task error:", error);
    }
  };

  // Close preview
  const handlePreviewClose = () => setPreviewOpen(false);

  // Close modal
  const handleCancel = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      title={
        <div className="flex items-center gap-2">
          <FileTextOutlined />
          <span>Edit Task</span>
        </div>
      }
      width={800}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      maskClosable={false}
      confirmLoading={isSubmitting}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="p-2"
      >
        {/* Job Title & Type */}
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Job Title"
              name="title"
              rules={[{ required: true, message: "Enter job title" }]}
            >
              <Input placeholder="e.g., Design a modern landing page" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Job Type"
              name="taskType"
              rules={[{ required: true, message: "Select job type" }]}
            >
              <Select>
                <Option value="CASH">Paid With Hand Cash</Option>
                <Option value="PAYMENT">Paid With Payment</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Category & Subcategory & Location */}
        <Row gutter={[16, 0]}>
          <Col xs={24} md={8}>
            <Form.Item
              label="Job Category"
              name="jobCategory"
              rules={[{ required: true, message: "Select category" }]}
            >
              <Select
                placeholder="Select Category"
                loading={isCategoryLoading}
                onChange={handleCategoryChange}
              >
                {categoryOptions.map((cat: any) => (
                  <Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Sub-Category" name="jobSubCategory">
              <Select
                placeholder={
                  selectedCategoryId
                    ? subCategoryOptions.length > 0
                      ? "Select Sub-Category"
                      : "No subcategories"
                    : "Select category first"
                }
                disabled={
                  !selectedCategoryId || subCategoryOptions.length === 0
                }
              >
                {subCategoryOptions.map((sub: any) => (
                  <Option key={sub.id} value={sub.id}>
                    {sub.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Location" name="location">
              <Input
                placeholder="e.g., Dhaka, Bangladesh"
                suffix={<EnvironmentOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Salary & Tags */}
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item label="Salary Range (USD)">
              <Input.Group compact>
                <Form.Item
                  name={["salary", 0]}
                  noStyle
                  rules={[{ required: true, message: "Min salary required" }]}
                >
                  <Input
                    style={{ width: "calc(50% - 12px)" }}
                    placeholder="Min"
                  />
                </Form.Item>
                <span className="mx-1 my-auto">-</span>
                <Form.Item
                  name={["salary", 1]}
                  noStyle
                  rules={[{ required: true, message: "Max salary required" }]}
                >
                  <Input
                    style={{ width: "calc(50% - 12px)" }}
                    placeholder="Max"
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Tags" name="tags">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="e.g., Figma, React"
                    onPressEnter={handleTagKeyPress}
                  />
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={addTag}
                  />
                </div>
                <Space size={[0, 8]} wrap>
                  {tags.map((tag) => (
                    <Tag key={tag} closable onClose={() => removeTag(tag)}>
                      {tag}
                    </Tag>
                  ))}
                </Space>
              </div>
            </Form.Item>
          </Col>
        </Row>

        {/* Required Skills */}
        <Form.Item
          label="Required Skills"
          name="requiredSkills"
          rules={[
            { required: true, message: "Add at least one required skill" },
          ]}
        >
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="e.g., Figma, React"
                onPressEnter={handleSkillKeyPress}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addSkill}
              />
            </div>
            <Space size={[0, 8]} wrap>
              {skills.map((skill) => (
                <Tag
                  key={skill}
                  color="blue"
                  closable
                  onClose={() => removeSkill(skill)}
                >
                  {skill}
                </Tag>
              ))}
            </Space>
          </div>
        </Form.Item>

        {/* Description */}
        <Form.Item
          label="Job Description"
          name="description"
          rules={[{ required: true, message: "Enter description" }]}
        >
          <TextArea
            autoSize={{ minRows: 4 }}
            placeholder="Describe the task..."
          />
        </Form.Item>

        {/* Deadline */}
        <Form.Item
          label="Deadline"
          name="deadline"
          rules={[{ required: true, message: "Select deadline" }]}
        >
          <Input type="date" />
        </Form.Item>

        {/* File Upload */}
        <Form.Item label="Upload Reference File" name="upload">
          <Upload
            listType="text"
            fileList={fileList}
            onChange={handleChange}
            onPreview={handlePreview}
            beforeUpload={(file) => {
              const allowedTypes = [
                "application/pdf",
                "image/png",
                "image/jpeg",
                "image/jpg",
              ];
              if (!allowedTypes.includes(file.type)) {
                message.error("Only PDF, PNG, JPG files are allowed.");
                return Upload.LIST_IGNORE;
              }
              return false;
            }}
            maxCount={1}
            accept=".pdf,.png,.jpg,.jpeg"
          >
            <Button icon={<UploadOutlined />}>Choose File</Button>
          </Upload>
        </Form.Item>

        <Divider />

        <div className="text-right">
          <Button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Update Task
          </Button>
        </div>
      </Form>

      {/* Preview Modal */}
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handlePreviewClose}
      >
        {previewFile && (
          <AntdImage
            alt="Preview"
            src={previewFile}
            style={{ width: "100%", maxHeight: "60vh", objectFit: "contain" }}
            preview={false}
          />
        )}
      </Modal>
    </Modal>
  );
}

// Fix for UploadProps type
type UploadProps = Parameters<typeof Upload>[0];
