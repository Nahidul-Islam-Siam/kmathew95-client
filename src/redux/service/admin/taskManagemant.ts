/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

// --- Task Interface ---


interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  traderId: string;
  files: string[];
  min_salary: number;
  max_salary: number;
  trader: {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
    profilePhoto: string | null;
  };
}

export interface TaskManagementResponseData {
  id: string;
  title: string;
  taskType: string;
  location: string;
  max_salary: number;
  min_salary: number;
  require_skills: string[];
  task: Task;
  taskId: string;
  task_Application: {
    id: string;
    userId: string;
    fastName: string;
    lastName: string;
    profilePhoto: string | null;
  };

  task_ApplicationId: {
    id: string;
    userId: string;
    fastName: string;
    lastName: string;
    profilePhoto: string | null;

  };



  /**
   * @deprecated Use `files` instead. This may be legacy.
   */
  provide_attachments?: string[]; // Optional, legacy
  description: string;
  deadline: string;
  tags: string[];
  files: string[]; // ✅ Primary field for attachments
  isActive: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  traderId: string;
  categoryid: string;
  subCategoryid: string | null;

  // Embedded trader info
  trader?: {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
    profilePhoto: string | null;
  };
}

// --- Pagination Meta ---
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

// --- Generic API Response Wrapper ---
export interface ApiResponse<T = unknown> {
  message: string;
  success: boolean;
  meta: PaginationMeta | null;
  data: T;
}

// --- Generic Paginated Response ---
export interface PaginatedResponse<T> {
  meta: PaginationMeta;
  data: T[];
}

// --- Specific Response Types ---
export type GetTasksResponse = ApiResponse<PaginatedResponse<TaskManagementResponseData>>;
export type GetTaskByIdResponse = ApiResponse<TaskManagementResponseData>;
export type AddTaskManagementResponse = ApiResponse<TaskManagementResponseData>;
export type DeleteTaskResponse = ApiResponse<null>;
export type CreateTaskRequestResponse = ApiResponse<{ id: string; message: string }>;

// --- Active Offer ---
export interface ActiveOffer {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  offerId: string;
  taskId: string;
  task: TaskManagementResponseData;
}
export type TaskActiveOfferResponse = ApiResponse<PaginatedResponse<ActiveOffer>>;

// --- Filter Params ---
export interface TaskFilterParams {
  title?: string;
  taskType?: string;
  location?: string;
  min_salary?: number;
  max_salary?: number;
  require_skills?: string[];
  status?: string;
  isActive?: boolean;
  traderId?: string;
  categoryid?: string;
  subCategoryid?: string | null;
  page?: number;
  size?: number; // Backend uses `size`, but we map to `limit`
  category?: string; // Possibly unused
  fastName?: string; // Likely typo – consider removing
  lastName?: string;
}

// --- Request Task Payload ---
export interface CreateTaskRequestPayload {
  taskId: string;
  coverLetter?: string;
  proposedPrice?: number;
  // Add other fields as needed
}

// --- RTK Query API ---
export const taskManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get filtered tasks (paginated)
    getTaskManagement: builder.query<GetTasksResponse, TaskFilterParams>({
      query: (params) => ({
        url: "/task-management",
        method: "GET",
        params: {
          ...params,
          require_skills: params.require_skills?.join(","),
          limit: params.size ?? 10,
          page: params.page ?? 1,
        },
      }),
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map(({ id }) => ({
                type: "TaskManagement",
                id,
              }) as const),
              { type: "TaskManagement", id: "LIST" },
            ]
          : [{ type: "TaskManagement", id: "LIST" }],
    }),

    // ✅ Get single task by ID
    getTaskManagementById: builder.query<GetTaskByIdResponse, string>({
      query: (id) => `/task-management/${id}`,
      providesTags: (_, __, id) => [{ type: "TaskManagement", id }],
    }),

    // ✅ Add new task
    addTaskManagement: builder.mutation<AddTaskManagementResponse, FormData>({
      query: (formData) => ({
        url: "/task-management",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "TaskManagement", id: "LIST" }],
    }),

    // ✅ Create a task application/request
    createTaskRequest: builder.mutation<CreateTaskRequestResponse, CreateTaskRequestPayload>({
      query: (body) => ({
        url: "/task-application",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "TaskApplication" }],
    }),

    // ✅ Update task
    updateTaskManagement: builder.mutation<
      AddTaskManagementResponse,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/task-management/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "TaskManagement", id },
        { type: "TaskManagement", id: "LIST" },
      ],
    }),


requestSubmit: builder.mutation<ApiResponse<{ message: string }>, { id: string; formData: FormData }>({
  query: ({ id, formData }) => ({
    url: `/task-application/request/${id}`,
    method: "PATCH",
    body: formData,
  }),
  invalidatesTags: [{ type: "TaskApplication" }], 
}),

taskApplicationHistory: builder.query<GetTasksResponse, TaskFilterParams>({
  query: () => ({
    url: "/task-application/history",
    method: "GET",
    
  }),
  providesTags: [{ type: "TaskApplication" }],
}),

    // ✅ Delete task
    deleteTaskManagement: builder.mutation<DeleteTaskResponse, string>({
      query: (id) => ({
        url: `/task-management/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "TaskManagement", id: "LIST" }],
    }),

    activeTaskOffer: builder.query<GetTasksResponse, TaskFilterParams>({
      query: () => ({
        url: "/task-management/active",
        method: "GET",
       
      }),
    }),

    findingAllMyDelivery: builder.query<GetTasksResponse, TaskFilterParams>({
      query: () => ({
        url: "/task-application/delivery",
        method: "GET",
      }),
      providesTags: [{ type: "TaskApplication" }],
    }),

    getPrivateTasks: builder.query<GetTasksResponse, TaskFilterParams>({
      query: () => ({
        url: "/task-management/privet-all",
        method: "GET",
      
      }),
      providesTags: ["TaskManagement"]
    }),

    // ✅ My applied/offered tasks
    findingMyTasksOffers: builder.query<GetTasksResponse, TaskFilterParams>({
      query: (params) => ({
        url: "/task-application/offer",
        method: "GET",
        params: {
          ...params,
          require_skills: params.require_skills?.join(","),
          limit: params.size ?? 10,
          page: params.page ?? 1,
        },
      }),
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map(({ id }) => ({
                type: "TaskApplication",
                id,
              }) as const),
              { type: "TaskApplication", id: "MY_TASKS" },
            ]
          : [{ type: "TaskApplication", id: "MY_TASKS" }],
    }),
  }),
});

// ✅ Export all hooks
export const {
  useGetTaskManagementQuery,
  useGetTaskManagementByIdQuery,
  useAddTaskManagementMutation,
  useUpdateTaskManagementMutation,
  useDeleteTaskManagementMutation,
  useCreateTaskRequestMutation,
  useFindingMyTasksOffersQuery,
  useActiveTaskOfferQuery,
  useRequestSubmitMutation,
  useTaskApplicationHistoryQuery,
  useGetPrivateTasksQuery,
  useFindingAllMyDeliveryQuery,

} = taskManagementApi;

export default taskManagementApi;
