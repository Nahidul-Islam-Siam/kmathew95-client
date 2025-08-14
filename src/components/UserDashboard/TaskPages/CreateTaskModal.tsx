/* eslint-disable @typescript-eslint/no-explicit-any */
// components/admin/task/CreateTaskModal.tsx
"use client";

import { Modal, Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { useState } from "react";

const { TextArea } = Input;

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({ open, onClose }: CreateTaskModalProps) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onClose();
  };

  const onFinish = async (values: any) => {
    try {
      setIsLoading(true);

      // Simulate formData creation
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          title: values.title,
          taskType: "PAYMENT",
          location: values.location || "Dhaka, Bangladesh",
          max_salary: values.max_salary,
          min_salary: values.min_salary,
          require_skills: values.require_skills
            .split(",")
            .map((skill: string) => skill.trim())
            .filter(Boolean),
          description: values.description,
          deadline: values.deadline,
          tags: values.tags
            .split(",")
            .map((tag: string) => tag.trim())
            .filter(Boolean),
          traderId: "68952450ce497e7c9dd26ed6",
          categoryId: "64ecf4b95a5c2d9c2a1ebf90",
        })
      );

      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("files", file.originFileObj);
        }
      });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Always success in dummy mode
      message.success("Task created successfully! (Dummy Mode)");
      form.resetFields();
      setFileList([]);
      onClose();
    } catch (error: any) {
      message.error("Failed to create task. (Dummy Mode)");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Create New Task"
      open={open}
      onOk={() => form.submit()}
      confirmLoading={isLoading}
      onCancel={handleCancel}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          location: "Dhaka, Bangladesh",
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter task title" }]}
        >
          <Input placeholder="e.g. Design a Landing Page" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <TextArea rows={4} placeholder="Describe what you need..." />
        </Form.Item>

        <Form.Item label="Attachments (Optional)">
          <Upload
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false}
            accept="image/*, .pdf, .zip"
            maxCount={5}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Upload Files</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="location"
          label="Location"
          rules={[{ required: true, message: "Please enter location" }]}
        >
          <Input placeholder="e.g. Dhaka, Bangladesh" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="min_salary"
            label="Minimum Budget"
            rules={[{ required: true, message: "Enter minimum budget" }]}
          >
            <Input type="number" placeholder="e.g. 150" />
          </Form.Item>

          <Form.Item
            name="max_salary"
            label="Maximum Budget"
            rules={[{ required: true, message: "Enter maximum budget" }]}
          >
            <Input type="number" placeholder="e.g. 300" />
          </Form.Item>
        </div>

        <Form.Item
          name="require_skills"
          label="Required Skills"
          rules={[{ required: true, message: "Enter skills (comma-separated)" }]}
        >
          <Input placeholder="Figma, UI/UX, HTML, CSS" />
        </Form.Item>

        <Form.Item
          name="tags"
          label="Tags"
          rules={[{ required: true, message: "Enter tags (comma-separated)" }]}
        >
          <Input placeholder="design, landing page, startup" />
        </Form.Item>

        <Form.Item
          name="deadline"
          label="Deadline"
          rules={[{ required: true, message: "Enter deadline date" }]}
        >
          <Input type="datetime-local" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
