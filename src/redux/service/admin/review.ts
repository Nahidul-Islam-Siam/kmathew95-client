/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

// ====== Types ======

// Individual Review Type
export interface Review {
  id: string;
  taskId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  reviewReceiverId: string;
  reviewProviderId: string;

  // Nested objects
  task: Task;
  reviewReceiver: ReviewUser | null; // 👉 Can be null — backend may return null
  reviewProvider: ReviewUser | null; // 👉 Same here
}

interface Task {
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
  files: any[];
  isActive: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  traderId: string;
  categoryid: string;
  subCategoryid: string | null;
}

interface ReviewUser {
  id: string;
  userId: string;
  isActive: boolean;
  stripeAccountId: string | null;
  fastName: string;
  lastName: string;
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
}

// Pagination metadata
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

// Response structure
export interface ReviewsResponse {
  meta: PaginationMeta;
  data: Review[];
}

// Generic API response wrapper
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: null | unknown;
}

// ====== RTK Query Endpoints ======
export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all private reviews
    getPrivateReviews: builder.query<ApiResponse<ReviewsResponse>, void>({
      query: () => ({
        url: "/review/privet",
        method: "GET",
      }),
      providesTags: ["Review"],
    }),

    getPublicReviews: builder.query<ApiResponse<ReviewsResponse>, void>({
      query: () => ({
        url: "/review/public",
        method: "GET",
      }),
      providesTags: ["Review"],
    }),

    createReview: builder.mutation<ApiResponse<Review>, Partial<Review>>({
      query: (reviewData) => ({
        url: "/review",
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: ["Review"],
    }),

  }),
});

// ✅ Export hooks
export const {
  useGetPrivateReviewsQuery,
  useGetPublicReviewsQuery,
  useCreateReviewMutation

} = reviewApi;