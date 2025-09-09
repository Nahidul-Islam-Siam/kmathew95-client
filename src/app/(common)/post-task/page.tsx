/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Upload,
  Tag,
  Space,
  Modal,
  Typography,
  Row,
  Col,
  Divider,
  UploadProps,
} from "antd";
import {
  FileTextOutlined,
  PlusOutlined,
  UploadOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useGetCategoryQuery } from "@/redux/service/admin/category";
import { useAddTaskManagementMutation } from "@/redux/service/admin/taskManagemant";
import Image from "next/image";
import { toast } from "sonner";

import Swal from "sweetalert2";
import { useGetMeQuery } from "@/redux/service/auth/authApi";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  subCategory?: SubCategory[];
}

interface CategoryResponse {
  data: {
    data: Category[];
  };
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
  upload?: UploadProps["fileList"];
  requiredSkills?: string[]; // ← Added to fix TS error
}

export default function PostTask() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [fileList, setFileList] = useState<UploadProps["fileList"]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  // const traderId = useSelector((state: RootState) => state.auth.user?.id);

  const { data } = useGetMeQuery();

  const traderId = data?.data?.trader?.id;

  const [form] = Form.useForm<FormValues>();

  // Fetch categories
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useGetCategoryQuery();

  // Mutation for posting task
  const [addTaskManagement, { isLoading: isSubmitting }] =
    useAddTaskManagementMutation();

  // Category Options
  const categoryOptions = React.useMemo(
    () => categoryData?.data?.data || [],
    [categoryData]
  );
  // Subcategory Options
  const subCategoryOptions: SubCategory[] = React.useMemo(() => {
    if (!selectedCategoryId) return [];
    const category = categoryOptions.find(
      (cat: any) => cat.id === selectedCategoryId
    );
    return category?.subCategory || [];
  }, [selectedCategoryId, categoryOptions]);

  // Handle Category Change
  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
    form.setFieldsValue({ jobSubCategory: undefined });
  };

  // Upload Handlers
  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    if (newFileList.length <= 1) setFileList(newFileList);
  };

  const handlePreview = async (file: any) => {
    let preview = file.url || file.preview;
    if (!preview && file.originFileObj) {
      preview = URL.createObjectURL(file.originFileObj as Blob);
    }
    setPreviewFile(preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url?.substring(file.url.lastIndexOf("/") + 1) || ""
    );
  };

  // Add tag
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  // Remove tag
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

  // Remove skill
  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  // Input key press
  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSkillInputKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  // Form Submit
  const handleSubmit = async () => {
    try {
      // Validate form fields
      const values = await form.validateFields();

      const [minSalaryInput, maxSalaryInput] = values.salary || [];

      // Parse and validate salaries
      const min_salary = parseFloat(
        minSalaryInput?.replace(/[^0-9.]/g, "") ?? ""
      );
      const max_salary = parseFloat(
        maxSalaryInput?.replace(/[^0-9.]/g, "") ?? ""
      );

      if (isNaN(min_salary) || min_salary <= 0) {
        toast.error("Please enter a valid minimum salary greater than 0");
        return;
      }
      if (isNaN(max_salary) || max_salary <= 0) {
        toast.error("Please enter a valid maximum salary greater than 0");
        return;
      }
      if (min_salary > max_salary) {
        toast.error("Minimum salary cannot be greater than maximum");
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

      // Prepare the postData payload
      const postData = {
        title: values.title,
        taskType: values.taskType,
        location: values.location || "",
        min_salary,
        max_salary,
        require_skills: skills, // ← Correct field name
        description: values.description,
        deadline: `${values.deadline}T23:59:59.000Z`,
        tags,
        categoryid: selectedCategoryId,
        traderId,
      };

      // Create FormData    
      const formData = new FormData();
      formData.append("data", JSON.stringify(postData));

      // Append files
      fileList?.forEach((file) => {
        if (file.originFileObj) {
          formData.append("files", file.originFileObj);
        }
      });

      // ✅ Removed: return ← This was blocking API call!

      // Call API
      const result = await addTaskManagement(formData).unwrap();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: result.message || "Task posted successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
        console.log("Success:", result);
        // Reset form
        form.resetFields();
        setTags([]);
        setSkills([]);
        setFileList([]);
        setSelectedCategoryId(null);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: result.message || "Failed to post task. Please try again.",
          timer: 2000,
          showConfirmButton: false,
        });
        console.log("Error:", result.data);
      }

      // Success

      // Reset form
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to post task. Please try again.";
      toast.error(errorMessage);
      console.error("Submit error:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6 md:mb-8">
        <Title
          level={2}
          className="!text-xl md:!text-2xl !font-semibold !text-gray-900 !mb-2"
        >
          Post a Task
        </Title>
        <div className="flex items-center gap-2 text-gray-600">
          <FileTextOutlined />
          <span className="text-sm">Job Submission Form</span>
        </div>
      </div>

      <Form
        layout="vertical"
        form={form}
        className="w-full"
        onFinish={handleSubmit}
      >
        {/* Job Title & Type */}
        <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Job Title"
              name="title"
              rules={[{ required: true, message: "Please enter a job title" }]}
            >
              <Input placeholder="e.g., Design a modern landing page" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Job Type"
              name="taskType"
              rules={[{ required: true, message: "Please select a job type" }]}
            >
              <Select placeholder="Select Type">
                <Option value="CASH">Paid With Hand Cash</Option>
                <Option value="PAYMENT">Paid With Payment</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Category & Sub-Category */}
        <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
          <Col xs={24} md={8}>
            <Form.Item
              label="Job Category"
              name="jobCategory"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select
                placeholder="Select Category"
                loading={isCategoryLoading}
                onChange={handleCategoryChange}
                disabled={isCategoryLoading || isCategoryError}
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
                {subCategoryOptions.map((sub) => (
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
        <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
          <Col xs={24} md={12}>
            <Form.Item label="Salary Range (USD)">
              <Input.Group compact>
                <Form.Item
                  name={["salary", 0]}
                  noStyle
                  rules={[
                    { required: true, message: "Enter minimum salary" },
                    {
                      validator: (_, value) => {
                        if (
                          !value ||
                          isNaN(parseFloat(value.replace(/[^0-9.]/g, "")))
                        ) {
                          return Promise.reject(
                            new Error("Min must be a number")
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
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
                  rules={[
                    { required: true, message: "Enter maximum salary" },
                    {
                      validator: (_, value) => {
                        if (
                          !value ||
                          isNaN(parseFloat(value.replace(/[^0-9.]/g, "")))
                        ) {
                          return Promise.reject(
                            new Error("Max must be a number")
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
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
                    onPressEnter={handleTagInputKeyPress}
                  />
                  <Button
                    type="primary"
                    onClick={addTag}
                    icon={<PlusOutlined />}
                  />
                </div>
                {tags.length > 0 && (
                  <Space size={[0, 8]} wrap>
                    {tags.map((tag) => (
                      <Tag key={tag} closable onClose={() => removeTag(tag)}>
                        {tag}
                      </Tag>
                    ))}
                  </Space>
                )}
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
                placeholder="Add required skill"
                onPressEnter={handleSkillInputKeyPress}
              />
              <Button
                type="primary"
                onClick={addSkill}
                icon={<PlusOutlined />}
              />
            </div>
            {skills.length > 0 && (
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
            )}
          </div>
        </Form.Item>

        {/* Description */}
        <Row>
          <Col span={24}>
            <Form.Item
              label="Job Description"
              name="description"
              rules={[
                { required: true, message: "Please enter a description" },
              ]}
            >
              <TextArea
                autoSize={{ minRows: 4, maxRows: 8 }}
                placeholder="Describe the task in detail..."
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Deadline */}
        <Row>
          <Col xs={24} md={12}>
            <Form.Item
              label="Deadline"
              name="deadline"
              rules={[{ required: true, message: "Please select a deadline" }]}
            >
              <Input type="date" />
            </Form.Item>
          </Col>
        </Row>

        {/* File Upload */}
        <Row>
          <Col span={24}>
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
                    toast.error("Only PDF, PNG, JPG files are allowed.");
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
          </Col>
        </Row>

        <Divider className="my-6" />
        <div className="flex justify-end">
          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isSubmitting}
            >
              Submit Task
            </Button>
          </Form.Item>
        </div>
      </Form>

      {/* Preview Modal */}
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        {previewFile && (
          <Image
            alt="Preview"
            src={previewFile}
            style={{ width: "100%", maxHeight: "60vh", objectFit: "contain" }}
            width={800}
            height={600}
            unoptimized
          />
        )}
      </Modal>
    </div>
  );
}
