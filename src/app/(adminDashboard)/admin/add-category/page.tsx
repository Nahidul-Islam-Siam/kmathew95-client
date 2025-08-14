// app/admin/categories/page.tsx
"use client";

import AddCategoryForm from "@/components/AdminDashboard/AdminDashboardPage/Category/AddCategory";
import AddSubcategoryForm from "@/components/AdminDashboard/AdminDashboardPage/Category/AddSubCategory";
import CategoriesTable from "@/components/AdminDashboard/AdminDashboardPage/Category/CategorYTable";
import SubCategoriesTable from "@/components/AdminDashboard/AdminDashboardPage/Category/SubCategoryTable";
import Card from "antd/es/card";


export default function CategoryManagement() {
  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto", gap: 24, display: "flex", flexDirection: "column" }}>
      <Card title="Add Category">
        <AddCategoryForm />
      </Card>

      
      <Card title="Manage Categories">
        <CategoriesTable />
      </Card>

      <Card title="Add Subcategory">
        <AddSubcategoryForm />
      </Card>

        <Card title="Manage SubCategories">
        <SubCategoriesTable />
      </Card>

    </div>
  );
}