/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "@/redux/api/baseApi";

// Interfaces for Task Management Response
export interface TaskManagementResponseData {
  id: string;
  title: string;
  taskType: string;
  location: string;
  max_salary: number;
  min_salary: number;
  require_skills: string[];
  provide_attachments: string[];
  description: string;
  deadline: string;
  tags: string[];
  files: string[];
  isActive: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  traderId: string;
  categoryid: string;
  subCategoryid: string | null;
  trader?: any; 
  data?: any;
  meta?: any;
}

// 🔁 Unified response format
export interface ApiResponse<T = unknown> {
  message: string;
  success: boolean;
  meta: unknown | null;
  data: T;
}

export type AddTaskManagementResponse = ApiResponse<TaskManagementResponseData>;
export type DeleteTaskResponse = ApiResponse<null>; // ✅ No data on delete

export const taskManagemantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all task managements
    getTaskManagement: builder.query<AddTaskManagementResponse, void>({
      query: () => ({
        url: "/task-management",
        method: "GET",
      }),
      providesTags: ["TaskManagement"],
    }),

    // ✅ Add new Task Management
    addTaskManagement: builder.mutation<AddTaskManagementResponse, FormData>({
      query: (formData) => ({
        url: "/task-management",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["TaskManagement"],
    }),

    // ✅ Update Task Management
    updateTaskManagement: builder.mutation<
      AddTaskManagementResponse,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/task-management/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["TaskManagement"],
    }),

    // ✅ Delete Task Management ← Fixed: Now returns DeleteTaskResponse
    deleteTaskManagement: builder.mutation<DeleteTaskResponse, string>({
      query: (id) => ({
        url: `/task-management/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TaskManagement"],
    }),
  }),
});

// ✅ Export hooks
export const {
  useGetTaskManagementQuery,
  useAddTaskManagementMutation,
  useUpdateTaskManagementMutation,
  useDeleteTaskManagementMutation,
} = taskManagemantApi;