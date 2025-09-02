/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "@/redux/api/baseApi";

// ====== Types for Stripe Verification Response ======

export interface AccountLink {
  object: string;
  created: number;
  expires_at: number;
  url: string;
}

export interface StripeVerificationResponse {
  status: "onboarding_required" | "verified" | "pending" | "failed";
  onboardingUrl: string;
  accountLink: AccountLink;
}  

export interface CreateStripeVerificationResponse {
  message: string;
  success: boolean;
  meta: null;
  data: StripeVerificationResponse;
}

// ====== API Definition ======

export const stripeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Fetch Stripe verification status
    getStripeVerification: builder.query<CreateStripeVerificationResponse, void>({
      query: () => ({
        url: "/verification",
        method: "GET",
      }),
      providesTags: ["StripeVerification"],
    }),

    // ✅ Create or initiate Stripe verification (onboarding)
    createStripeVerification: builder.mutation<
      CreateStripeVerificationResponse,
      Record<string, any> // You can refine this if you know the payload shape
    >({
      query: (data) => ({
        url: "/verification",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["StripeVerification"],
    }),
  }),
});

// ✅ Export hooks
export const {
  useGetStripeVerificationQuery,
  useCreateStripeVerificationMutation,
} = stripeApi;