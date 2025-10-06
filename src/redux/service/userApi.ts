/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

// ========================================================================
// 1. Admin Profile Interface
// ========================================================================
export interface AdminProfile {
  id: string;
  userId: string;
  isActive: boolean;
  fastName: string | null;
  lastName: string | null;
  createdAt: string;
  updatedAt: string; 
}

// ========================================================================
// 2. Trader Profile Interface
// ========================================================================
export interface TraderProfile {
  id: string;
  userId: string;
  isActive: boolean;
  stripeAccountId: string | null;
  fastName: string | null;
  lastName: string | null;
  skills: string[];
  mininumHoulyRate: number | null;
  nationality: string | null;
  tagline: string[];
  description: string | null;
  attachments: string[];
  resumeFile: string | null;
  socialMediaLink: string[];
  isVerified: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
}

// ========================================================================
// 3. User Interface
// ========================================================================
export interface User {
  id: string;
  username: string;
  email: string;
  description: string | null;
  contactNo: string;
  lang: string;
  role: "TRADER" | "ADMIN" | "CUSTOMER";
  avatar: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;

  trader?: TraderProfile | null;
  admin?: AdminProfile | null;
  name: string ;
}

// ========================================================================
// 4. Response Types (Based on Real API)
// ========================================================================
export interface ApiResponse<T> {
  message: string;
  success: boolean;
  meta: null | {
    page?: number;
    limit?: number;
    total?: number;
  };
  data: T;
}

// Use same for all responses
export type GetUserResponse = ApiResponse<User>;
export type UpdateTraderResponseData = ApiResponse<User>; // Same as GetUserResponse
export type UpdateAdminResponseData = ApiResponse<User>;

// ========================================================================
// 5. API Endpoints
// ========================================================================
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Fetches the authenticated user's profile
     */
    getUser: builder.query<GetUserResponse, void>({
      query: () => "/auth/get-me",
      providesTags: ["User"],
    }),

    /**
     * Updates a trader profile (with optional avatar & resume upload)
     */
    updateTraderById: builder.mutation<UpdateTraderResponseData, {
      id: string;
      data: FormData; // Accepts FormData directly
    }>({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"], // Refreshes cached user data
    }),

    /**
     * Updates an admin profile
     */
    updateAdminById: builder.mutation<UpdateAdminResponseData, {
      id: string;
      data: FormData;
    }>({
      query: ({ id, data }) => ({
        url: `/admins/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

// ========================================================================
// 6. Export Hooks
// ========================================================================
export const {
  useGetUserQuery,
  useUpdateTraderByIdMutation,
  useUpdateAdminByIdMutation,
} = userApi;

export default userApi;