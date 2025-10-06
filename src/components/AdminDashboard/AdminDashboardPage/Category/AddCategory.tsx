// components/category/AddCategoryForm.tsx
import { Form, Input, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { useState } from "react";
import { useAddCategoryMutation } from "@/redux/service/admin/category";
import { toast } from "sonner";

export default function AddCategoryForm() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [iconList, setIconList] = useState<UploadFile[]>([]);
  const [addCategory] = useAddCategoryMutation();

  const handleFileChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);
  };

  const handleIconChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setIconList(newFileList);
  };

  const onFinish = async () => {
    const name = form.getFieldValue("name");
    const description = form.getFieldValue("description");

    if (!name || !description) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!iconList[0]?.originFileObj) {
      toast.error("Please select an icon."); 
      return;
    }

    // ✅ Correct payload structure: `data`, not `body`
    const payload = {
      data: { name, description },
      files: fileList
        .map((file) => file.originFileObj)
        .filter(Boolean) as File[],
      icon: iconList[0].originFileObj as File,
    };

    try {
      const res = await addCategory(payload).unwrap();

      if (res.success) {
        toast.success(res?.message);
        form.resetFields();
      }else {
        toast.error(res?.message);
      }

      setFileList([]);
      setIconList([]);
    } catch (error) {
      toast.error("Failed to add category. Please try again.");
      console.error("Add category error:", error);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="name"
        label="Category Name"
        rules={[{ required: true, message: "Please input category name!" }]}
      >
        <Input placeholder="Enter category name" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Category Description"
        rules={[{ required: true, message: "Please input description!" }]}
      >
        <Input.TextArea rows={4} placeholder="Enter description" />
      </Form.Item>

      <Form.Item label="Category Image">
        <Upload
          fileList={fileList}
          onChange={handleFileChange}
          beforeUpload={() => false}
          accept="image/*"
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Select Image</Button>
        </Upload>
      </Form.Item>

      <Form.Item label="Category Icon">
        <Upload
          fileList={iconList}
          onChange={handleIconChange}
          beforeUpload={() => false}
          accept="image/svg+xml,image/png"
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Select Icon</Button>
        </Upload>
      </Form.Item>

      <Form.Item style={{ textAlign: "right" }}>
        <Button type="primary" htmlType="submit">
          Add Category
        </Button>
      </Form.Item>
    </Form>
  );
}
