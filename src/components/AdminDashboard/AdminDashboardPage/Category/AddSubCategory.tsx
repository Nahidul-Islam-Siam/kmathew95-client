/* eslint-disable @typescript-eslint/no-explicit-any */
// components/category/AddSubcategoryForm.tsx
import {
  Form,
  Input,
  Select,
  Button,
  message,
  UploadFile,
  UploadProps,
  Upload,
} from "antd";
import {
  useGetCategoryQuery,
  useAddSubcategoryMutation,
} from "@/redux/service/admin/category";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "sonner";

export default function AddSubcategoryForm() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [iconList, setIconList] = useState<UploadFile[]>([]);
  const { data, isLoading, isError } = useGetCategoryQuery();
  const categories = data?.data?.data || [];





  const [addSubcategory] = useAddSubcategoryMutation();

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
    const categoryId = form.getFieldValue("categoryId");
    const name = form.getFieldValue("subcategoryName");
    const description = form.getFieldValue("subcategoryDescription");

    if (!categoryId || !name || !description) {
      message.error("Please fill in all fields.");
      return;
    }

    if (!iconList[0]?.originFileObj) {
      message.error("Please select an icon.");
      return;
    }

    const payload = {
      data: {
        name,
        categoryId,
        description,
      },
      files: fileList
        .map((file) => file.originFileObj)
        .filter(Boolean) as File[],
      icon: iconList[0].originFileObj as File,
    };

    try {
      const res = await addSubcategory(payload).unwrap();
    

      if (res?.success) {
        toast.success(res?.message);
        form.resetFields();
      } else {
        toast.error(res?.message);
      }

      setFileList([]);
      setIconList([]);
    } catch (error) {
      toast.error("Failed to add subcategory. Please try again.");

    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="categoryId"
        label="Select Category"
        rules={[{ required: true, message: "Please select a category!" }]}
      >
        <Select
          placeholder="Choose a category"
          loading={isLoading}
          disabled={isLoading || isError}
          notFoundContent={isError ? "Failed to load categories" : undefined}
        >
          {categories.map((cat: any) => (
            <Select.Option key={cat.id} value={cat.id}>
              {cat.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="subcategoryName"
        label="Subcategory Name"
        rules={[{ required: true, message: "Enter subcategory name!" }]}
      >
        <Input placeholder="Enter name" />
      </Form.Item>

      <Form.Item
        name="subcategoryDescription"
        label="Subcategory Description"
        rules={[{ required: true, message: "Enter description!" }]}
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
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Add Subcategory
        </Button>
      </Form.Item>
    </Form>
  );
}
