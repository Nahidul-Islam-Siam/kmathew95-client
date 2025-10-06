/* eslint-disable @typescript-eslint/no-explicit-any */
// "@/redux/service/admin/subscriptionPlan.ts"
import baseApi from "@/redux/api/baseApi";

/**
 * ======================
 * MODELS & INTERFACES
 * ======================
 */

/**
 * Subscription Plan model
 */
export interface SubscriptionPlan {
  id: string;
  plan: string;
  name: string;
  description: string;
  featuresList: string[];
  trialPeriod: boolean;
  price: number;
  stripeProductId: string;
  stripePriceId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Subscription model (user's active subscription)
 */
export interface Subscription {
  id: string;
  subscriptionPlanId: string;
  ownerId: string;
  subscriptionStatus: "ACTIVE" | "INACTIVE" | "CANCELLED" | "EXPIRED";
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  expiresAt: string;
  createdAt: string;
  cancelRequest: boolean;
  session?: {
    sessionId: string;
    sessionUrl: string;
  };
  renewURL?: string; // Optional, returned after renewal init
}

/**
 * Request body for creating a subscription plan
 */
export interface CreateSubscriptionPlanRequest {
  plan: string;
  name: string;
  description: string;
  featuresList: string[];
  price: number;
  trialPeriod?: boolean;
}

/**
 * Request body for updating a subscription plan
 * (backend requires stripePriceId)
 */
export interface UpdateSubscriptionPlanRequest {
  plan: string;
  name: string;
  description: string;
  featuresList: string[];
  price: number;
  trialPeriod?: boolean;
  stripePriceId: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

/**
 * Response structure for subscription plans (GET /subscription-plan)
 */
export interface SubscriptionPlanListResponseData {
  meta: PaginationMeta;
  data: SubscriptionPlan[];
}

/**
 * Response structure for subscriptions (GET /subscription)
 */
export interface SubscriptionListResponseData {
  meta: PaginationMeta;
  data: Subscription[];
}

/**
 * Response for renewal: returns renewURL
 */
export interface RenewSubscriptionResponseData {
  renualURL: string;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  message: string;
  success: boolean;
  meta: PaginationMeta | null;
  data: T;
}

/**
 * Final response types
 */
export type GetSubscriptionPlansResponse = ApiResponse<SubscriptionPlanListResponseData>;
export type GetSubscriptionsResponse = ApiResponse<SubscriptionListResponseData>;
export type CreateSubscriptionPlanResponse = ApiResponse<SubscriptionPlan>;
export type UpdateSubscriptionPlanResponse = ApiResponse<SubscriptionPlan>;
export type DeleteSubscriptionPlanResponse = ApiResponse<null>;
export type CreateUserSubscriptionResponse = ApiResponse<Subscription>;
export type RenewSubscriptionResponse = ApiResponse<RenewSubscriptionResponseData>; // ← This is key!

/**
 * Filter params for subscription plans
 */
export interface SubscriptionPlanFilterParams {
  plan?: string;
  name?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// --- RTK Query API Definition ---
export const subscriptionPlanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET /subscription-plan - Fetch all subscription plans with pagination and filters
     */
    getSubscriptionPlan: builder.query<
      GetSubscriptionPlansResponse,
      SubscriptionPlanFilterParams
    >({
      query: (params) => ({
        url: "/subscription-plan",
        method: "GET",
        params,
      }),
      providesTags: ["SubscriptionPlan"],
    }),

    /**
     * GET /subscription - Fetch all user subscriptions
     */
    getSubscription: builder.query<GetSubscriptionsResponse, void>({
      query: () => ({
        url: "/subscription",
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),

    /**
     * DELETE /subscription/:id - Delete a user subscription
     */
    deleteSubscription: builder.mutation<
      DeleteSubscriptionPlanResponse,
      string
    >({
      query: (id) => ({
        url: `/subscription/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscription"],
    }),

    /**
     * POST /subscription-plan - Create a new subscription plan
     */
    createSubscriptionPlan: builder.mutation<
      CreateSubscriptionPlanResponse,
      CreateSubscriptionPlanRequest
    >({
      query: (body) => ({
        url: "/subscription-plan",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SubscriptionPlan"],
    }),

    /**
     * PATCH /subscription/:id - Renew or update a subscription
     * Expected response: { data: { renewURL: "https://..." } }
     */
    updateSubscription: builder.mutation<
      RenewSubscriptionResponse, // ← Correct response type
      string // Accepts only the subscription ID
    >({
      query: (id) => ({
        url: `/subscription/${id}`, // Or just `/subscription/${id}` if backend handles renew on PATCH
        method: "PATCH",
        // No body needed unless required
      }),
      invalidatesTags: ["Subscription"],
    }),

    /**
     * POST /subscription - Create a user subscription (e.g., start trial)
     */
    createUserSubscription: builder.mutation<
      CreateUserSubscriptionResponse,
      { subscriptionPlanId: string }
    >({
      query: (body) => ({
        url: "/subscription",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subscription"],
    }),

    /**
     * DELETE /subscription-plan/:id - Delete a subscription plan
     */
    deleteSubscriptionPlan: builder.mutation<
      DeleteSubscriptionPlanResponse,
      string
    >({
      query: (id) => ({
        url: `/subscription-plan/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubscriptionPlan"],
    }),

    /**
     * PATCH /subscription-plan/:id - Update a subscription plan
     */
    updateSubscriptionPlan: builder.mutation<
      UpdateSubscriptionPlanResponse,
      { id: string; body: UpdateSubscriptionPlanRequest }
    >({
      query: ({ id, body }) => ({
        url: `/subscription-plan/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["SubscriptionPlan"],
    }),
  }),
});

// --- Export Hooks ---
export const {
  useGetSubscriptionPlanQuery,
  useGetSubscriptionQuery,
  useCreateSubscriptionPlanMutation,
  useCreateUserSubscriptionMutation,
  useUpdateSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
  useDeleteSubscriptionMutation,
  useUpdateSubscriptionMutation, // ← This is now fixed
} = subscriptionPlanApi;

export default subscriptionPlanApi;