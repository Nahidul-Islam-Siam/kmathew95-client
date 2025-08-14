/* eslint-disable @typescript-eslint/no-explicit-any */
// components/category/CategoriesTable.tsx
import { Table, Pagination, Button, Popconfirm, Spin } from "antd";
import { useDeleteCategorybyIdMutation, useGetCategoryQuery } from "@/redux/service/admin/category";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import EditCategoryModal from "./EditCategoryModal";

export default function CategoriesTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch categories
  const { data, isLoading, isError } = useGetCategoryQuery();
  const [deleteCategory] = useDeleteCategorybyIdMutation();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen" style={{ textAlign: "center", padding: 20 }}>
      <Spin size="large" />
    </div>;
  }

  if (isError || !data?.data?.data) {
    return <div style={{ textAlign: "center", color: "red" }}>Failed to load categories.</div>;
  }

  // Extract categories
  const categories = data.data.data;

  // Map to table format
  const tableData = categories.map((cat: any) => ({
    key: cat.id,
    id: cat.id,
    name: cat.name,
    description: cat.description,
    icon: cat.icon,
    files: cat.files?.[0], // first image if exists
  }));

  const total = tableData.length;
  const paginatedData = tableData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handle Delete
  const handleDelete = async (id: string) => {
    try {
      const res = await deleteCategory(id).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Category deleted successfully.");
      } else {
        toast.error(res?.message || "Failed to delete category.");
      }
    } catch (error: any) {
      const errorMsg = error?.data?.message || error?.message || "Failed to delete category.";
      toast.error(errorMsg);
    }
  };

  // Handle Edit
  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const columns = [
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Icon",
      key: "icon",
      render: (_: any, record: any) =>
        record.icon ? (
          <Image
            src={record.icon}
            width={32}
            height={32}
            alt="icon"
            style={{ width: 32, height: 32, borderRadius: 4 }}
          />
        ) : (
          "—"
        ),
    },
    {
      title: "Image",
      key: "image",
      render: (_: any, record: any) =>
        record.files ? (
          <Image
            src={record.files}
            width={64}
            height={40}
            alt="category"
            style={{ width: 64, height: 40, objectFit: "cover", borderRadius: 4 }}
          />
        ) : (
          "—"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div style={{ display: "flex", gap: 8 }}>
          {/* Edit Button */}
          <Button type="primary" size="small" onClick={() => handleEdit(record)}>
            Update
          </Button>

          {/* Delete Button */}
          <Popconfirm
            title="Delete this category?"
            description="Are you sure you want to delete this category? This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes, Delete"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Table */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <h2 style={{ textAlign: "center", fontWeight: 500 }}>Categories</h2>

        <Table
          columns={columns}
          dataSource={paginatedData}
          bordered
          loading={isLoading}
          pagination={false}
          rowKey="key"
        />

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            current={currentPage}
            total={total}
            pageSize={pageSize}
            onChange={setCurrentPage}
            showSizeChanger={false}
          />
        </div>
      </div>

      {/* Edit Modal - Rendered Once, Outside Table */}
      {isModalOpen && editingCategory && (
        <EditCategoryModal
          open={isModalOpen}
          onClose={handleCloseModal}
          category={editingCategory}
        />
      )}
    </>
  );
}