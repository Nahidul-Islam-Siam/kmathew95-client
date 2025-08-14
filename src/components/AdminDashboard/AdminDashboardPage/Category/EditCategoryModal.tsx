/* eslint-disable @typescript-eslint/no-explicit-any */
// components/category/EditCategoryModal.tsx
import { Modal, Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { useState } from "react";

import { toast } from "sonner";
import { useUpdateCategoryMutation } from "@/redux/service/admin/category";

const { TextArea } = Input;

interface EditCategoryModalProps {
  open: boolean;
  onClose: () => void;
  category: {
    id: string;
    name: string;
    description: string; 
    files: string[]; // URLs of existing images
    icon: string; // URL of icon
  };
}

export default function EditCategoryModal({
  open,
  onClose,
  category,
}: EditCategoryModalProps) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  console.log({ fileList });
  const [iconList, setIconList] = useState<UploadFile[]>([]);
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

  // Initialize form and file lists when category changes
  const initializeForm = () => {
    form.setFieldsValue({
      name: category.name,
      description: category.description,
    });

    // Set icon
    if (category.icon) {
      setIconList([
        {
          uid: "-2",
          name: "Current Icon",
          status: "done",
          url: category.icon,
          response: { data: category.icon },
        },
      ]);
    }
  }; 

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

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { name, description } = values;

      const formData = new FormData();
      formData.append("data", JSON.stringify(values));
      if (fileList.length > 0) {
        fileList.forEach((file) =>
          formData.append("files", file.originFileObj as File)
        );
      }
      if (iconList[0]?.originFileObj) {
        formData.append("icon", iconList[0].originFileObj as File);
      }


      const payload = {
        id: category.id,
        data: formData,
      };

     
      

      await updateCategory(payload).unwrap();
      toast.success("Category updated successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update category");
      console.error("Update error:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setIconList([]);
    onClose();
  };

  return (
    <Modal
      title="Edit Category"
      open={open}
      onOk={handleOk}
      okButtonProps={{ loading: isLoading }}
      onCancel={handleCancel}
      width={600}
      afterOpenChange={(visible) => {
        if (visible) initializeForm();
      }}
    >
      <Form form={form} layout="vertical" initialValues={category}>
        <Form.Item
          name="name"
          label="Category Name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input placeholder="e.g. Graphic Design" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <TextArea rows={4} placeholder="Describe this category..." />
        </Form.Item>

        <Form.Item label="Update Image (Optional)">
          <Upload
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false}
            accept="image/*"
            maxCount={1}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Select New Image</Button>
          </Upload>
          <small>Leave empty to keep current image.</small>
        </Form.Item>

        <Form.Item label="Update Icon">
          <Upload
            fileList={iconList}
            onChange={handleIconChange}
            beforeUpload={() => false}
            accept="image/svg+xml,image/png"
            maxCount={1}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Select New Icon</Button>
          </Upload>
          <small>You must select a new icon to update.</small>
        </Form.Item>
      </Form>
    </Modal>
  );
}
