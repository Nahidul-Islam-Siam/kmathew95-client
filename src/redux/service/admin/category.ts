/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "@/redux/api/baseApi";

// ======= Types =======

// Single category 
export interface CategoryData {
  id: string;
  name: string;
  files: string[]; // URLs of uploaded images
  icon: string; // URL of icon
  description: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

// Response for GET: list of categories
export interface GetCategoriesResponse {
  message: string;
  success: boolean;
  meta: {
    page: number;
    size: number;
    total: number;
    totalPage: number;
  } | null;
  data: CategoryData[];
}

// Response for POST: single category
export interface AddCategoryResponse {
  message: string;
  success: boolean;
  meta: unknown | null;
  data: CategoryData;
}

export interface AddSubCategoryResponse {
  message: string;
  success: boolean;
  meta: unknown | null;
  data: SubcategoryData;
}

// Payload for creating a category
export interface CreateCategoryPayload {
  data: {
    name: string;
    description: string;
  };
  files: File[]; // multiple image files
  icon: File; // single file
}

// Subcategory Data
export interface SubcategoryData {
  id: string;
  name: string;
  categoryId: string;
  files: string[];
  icon: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Response for POST: single subcategory
export interface AddSubcategoryResponse {
  message: string;
  success: boolean;
  meta: unknown | null;
  data: SubcategoryData;
}

// Payload for creating a subcategory
export interface CreateSubcategoryPayload {
  data: {
    name: string;
    categoryId: string;
    description: string;
  };
  files: File[]; // multiple image files
  icon: File; // single file
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Add new category
    addCategory: builder.mutation<AddCategoryResponse, CreateCategoryPayload>({
      query: ({ data, files, icon }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        files.forEach((file) => formData.append("files", file));
        formData.append("icon", icon);

        return {
          url: "/task-category/main",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Category"], // triggers refetch when category is added
    }),

    // ✅ Get all categories
    getCategory: builder.query<any, void>({
      query: () => ({
        url: "/task-category/main",
        method: "GET",
      }),
      providesTags: ["Category"], // marks this data as "Category" for caching
    }),

    deleteCategorybyId: builder.mutation<any, string>({
      query: (id) => ({
        url: `/task-category/main/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"], // triggers refetch when category is deleted
    }),
 
    // redux/service/admin/category.ts
    // Inside builder.mutations in categoryApi

    updateCategory: builder.mutation<
      AddCategoryResponse,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => {
        return {
          url: `/task-category/main/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["Category"],
    }),


    updateSubCategory: builder.mutation<
      AddSubcategoryResponse,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => {
        return {
          url: `/task-category/sub/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["Category"],
    }),

    

    

    getSubCategory: builder.query<any, void>({
      query: () => ({
        url: "/task-category/sub",
        method: "GET",
      }),
      providesTags: ["Category"], // marks this data as "Category" for caching
    }),


    deleteSubCategorybyId: builder.mutation<any, string>({
      query: (id) => ({
        url: `/task-category/sub/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"], // triggers refetch when category is deleted
    }),

    // ✅ Add new subcategory
    addSubcategory: builder.mutation<
      AddSubcategoryResponse,
      CreateSubcategoryPayload
    >({
      query: ({ data, files, icon }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        files.forEach((file) => formData.append("files", file));
        formData.append("icon", icon);

        return {
          url: "/task-category/sub", // Endpoint for subcategories
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Category"], // Triggers refetch when subcategory is added
    }),
  }),
});

// ✅ Export hooks
export const {
  useAddCategoryMutation,
  useGetCategoryQuery,
  useAddSubcategoryMutation,
  useGetSubCategoryQuery,
  useDeleteCategorybyIdMutation,
  useUpdateCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategorybyIdMutation,
} = categoryApi;
