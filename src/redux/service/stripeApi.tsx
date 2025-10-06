/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

// ======= Types =======
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: null | unknown;
}

export const stripeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStripeLinkById: builder.mutation<ApiResponse<string>, string>({
      query: (id) => ({
        url: `/stripe-dashboard-trader/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetStripeLinkByIdMutation } = stripeApi;

export default stripeApi;