/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

// --- Task Interface ---
export interface TaskApplicationResponseData {
  id: string;
  title: string;
  taskType: string;
  location: string;
  max_salary: number;
  min_salary: number;
  require_skills: string[];
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
  data: any;
  success: boolean;
  message: string;
  task: {
    id: string;
    title: string;
    description: string;
    deadline: string;
    files: string[];
  };
  trader?: {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
    profilePhoto: string | null;
  };
}

// --- Request Payload ---
export interface CreateTaskRequestPayload {
  taskId: string;
  coverLetter?: string;
  proposedPrice?: number;
}

// --- RTK Query API ---
export const taskApplicationManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMyTaskRequestOffer: builder.query<TaskApplicationResponseData, void>({
      query: () => ({
        url: "/task-application/request",
        method: "GET",
      }),
      providesTags: ["TaskApplication"],
    }),

    getAllMyTaskRequest: builder.query<TaskApplicationResponseData, void>({
      query: () => ({
        url: "/task-application/offer",
        method: "GET",
      }),
      providesTags: ["TaskApplication"],
    }),

    acceptTaskOfferById: builder.mutation<TaskApplicationResponseData, string>({
      query: (id) => ({
        url: `/task-application/offer/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["TaskApplication"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllMyTaskRequestOfferQuery, useGetAllMyTaskRequestQuery , useAcceptTaskOfferByIdMutation} =
  taskApplicationManagementApi;

export default taskApplicationManagementApi;
