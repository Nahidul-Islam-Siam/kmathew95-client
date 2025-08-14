/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/category/EditSubCategoryModal.tsx
import { Modal, Form, Input, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { useState } from "react";
import { toast } from "sonner";
import { useUpdateSubCategoryMutation } from "@/redux/service/admin/category";

const { TextArea } = Input;

interface EditSubCategoryModalProps {
  open: boolean;
  onClose: () => void;
  categoryId: string;
  subcategory: {
    id: string;
    name: string;
    description: string;
    files: string[];
    icon: string | null;
    categoryId: string;
  };
}

export default function EditSubCategoryModal({
  categoryId,
  open,
  onClose,
  subcategory,
}: EditSubCategoryModalProps) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [iconList, setIconList] = useState<UploadFile[]>([]);
  const [updateSubcategory, { isLoading }] = useUpdateSubCategoryMutation();

  // Initialize form and file lists
  const initializeForm = () => {
    form.setFieldsValue({
      name: subcategory.name,
      description: subcategory.description,
    });

    if (subcategory.files?.length > 0 && !fileList.length) {
      setFileList([
        {
          uid: "-1",
          name: "Current Image",
          status: "done",
          url: subcategory.files[0],
        },
      ]);
    }

    if (subcategory.icon && !iconList.length) {
      setIconList([
        {
          uid: "-2",
          name: "Current Icon",
          status: "done",
          url: subcategory.icon,
        },
      ]);
    }
  };

  const handleFileChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleIconChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setIconList(newFileList);
  };

  const handleOk = async () => {
    try {
       const values = await form.validateFields();
      const { name, description,categoryId } = values;

      const formData = new FormData();
      formData.append("data", JSON.stringify(values));
      if (fileList.length > 0) {
        fileList.forEach((file) =>
          formData.append("files", file.originFileObj as File)
        );
      }

      // Append image files
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("files", file.originFileObj);
        }
      });

      // Append icon
      if (!iconList[0]?.originFileObj) {
       formData.append("icon", iconList[0].originFileObj as File);
      }
    

      // ✅ Log FormData contents
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // ✅ Correct payload
      const payload = {
        id: subcategory.id,
        data: formData,
      };

      // ✅ Call mutation
      const res = await updateSubcategory(payload).unwrap();

      if (res.success) {
        toast.success(res.message || "Subcategory updated successfully!");
      } else {
        toast.error(res.message || "Failed to update subcategory.");
      }

      onClose();
    } catch (error: any) {
      const errorMsg = error?.data?.message || error?.message || "Failed to update.";
      toast.error(errorMsg);
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
      title="Edit Subcategory"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isLoading}
      width={600}
      afterOpenChange={(visible) => {
        if (visible) initializeForm();
      }}
    >
      <Form form={form} layout="vertical" initialValues={subcategory}>
        <Form.Item
          name="name"
          label="Subcategory Name"
          rules={[{ required: true, message: "Enter subcategory name" }]}
        >
          <Input placeholder="e.g. Logo Design" />
        </Form.Item>

   

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Enter description" }]}
        >
          <TextArea rows={4} placeholder="Describe this subcategory..." />
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
          {subcategory.files?.length > 0 && !fileList.length && (
            <small>Existing image will be preserved unless replaced.</small>
          )}
        </Form.Item>

        <Form.Item label="Update Icon (Required)" required>
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
          <small>You must select a new icon to save changes.</small>
        </Form.Item>
      </Form>
    </Modal>
  );
}