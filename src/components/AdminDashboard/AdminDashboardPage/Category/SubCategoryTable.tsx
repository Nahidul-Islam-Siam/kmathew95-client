/* eslint-disable @typescript-eslint/no-explicit-any */
// components/category/SubCategoriesTable.tsx
import { Table, Pagination, Button, Popconfirm } from "antd";
import {
  useGetSubCategoryQuery,
  useGetCategoryQuery,
  useDeleteSubCategorybyIdMutation,

} from "@/redux/service/admin/category";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import EditSubCategoryModal from "./EditSubCategoryTable";

export default function SubCategoriesTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [editingSub, setEditingSub] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch subcategories and categories
  const { data: subCategoryResponse, isLoading: subLoading, isError: subError } = useGetSubCategoryQuery();
  const { data: categoryResponse, isLoading: catLoading } = useGetCategoryQuery();
  const [deleteSubCategory] = useDeleteSubCategorybyIdMutation();

  if (subLoading || catLoading) {
    return <div style={{ textAlign: "center", padding: 20 }}>Loading subcategories...</div>;
  }

  if (subError || !subCategoryResponse?.data?.data) {
    return <div style={{ textAlign: "center", color: "red" }}>Failed to load subcategories.</div>;
  }

  const subcategories = subCategoryResponse.data.data;

  // Map category IDs to names
  const categoryMap = new Map<string, string>();
  categoryResponse?.data?.data.forEach((cat: any) => {
    categoryMap.set(cat.id, cat.name);
  });

  // Format data for table
  const tableData = subcategories.map((sub: any) => ({
    key: sub.id,
    id: sub.id,
    subcategoryName: sub.name,
    subcategoryDescription: sub.description,
    categoryId: sub.categoryId,
    categoryName: categoryMap.get(sub.categoryId) || "Unknown Category",
    icon: sub.icon,
    image: sub.files?.[0] || null,
  }));

  const total = tableData.length;
  const paginatedData = tableData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handle Delete
  const handleDelete = async (id: string) => {
    try {
      const res = await deleteSubCategory(id).unwrap();
      if (res.success) {
        toast.success(res.message || "Subcategory deleted successfully.");
      } else {
        toast.error(res.message || "Failed to delete subcategory.");
      }
    } catch (error: any) {
      const errorMsg = error?.data?.message || error?.message || "Failed to delete.";
      toast.error(errorMsg);
    }
  };

  // Handle Edit
  const handleEdit = (sub: any) => {
    setEditingSub(sub);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSub(null);
  };

  const columns = [
    {
      title: "Category Name",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Subcategory Name",
      dataIndex: "subcategoryName",
      key: "subcategoryName",
    },
    {
      title: "Description",
      dataIndex: "subcategoryDescription",
      key: "subcategoryDescription",
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
            style={{ borderRadius: 4 }}
          />
        ) : (
          "—"
        ),
    },
    {
      title: "Image",
      key: "image",
      render: (_: any, record: any) =>
        record.image ? (
          <Image
            src={record.image}
            width={64}
            height={40}
            alt="subcategory"
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
          {/* Update Button */}
          <Button type="primary" size="small" onClick={() => handleEdit(record)}>
            Update
          </Button>

          {/* Delete Button */}
          <Popconfirm
            title="Delete this subcategory?"
            description="This action cannot be undone. Continue?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
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
      {/* Subcategories Table */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <h2 style={{ textAlign: "center", fontWeight: 500 }}>All Subcategories</h2>

        <Table
          columns={columns}
          dataSource={paginatedData}
          bordered
          loading={subLoading}
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

      {/* Edit Subcategory Modal */}
      {isModalOpen && editingSub && (
        <EditSubCategoryModal
        categoryId={editingSub.categoryId}
          open={isModalOpen}
          onClose={handleCloseModal}
          subcategory={editingSub}
        />
      )}
    </>
  );
}