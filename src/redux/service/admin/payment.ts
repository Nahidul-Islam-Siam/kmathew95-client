/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

// ======= Types =======
type PaymentStatus =
  | "REQUIRES_PAYMENT_METHOD"
  | "REQUIRES_CONFIRMATION"
  | "REQUIRES_ACTION"
  | "PROCESSING"
  | "REQUIRES_CAPTURE"
  | "CANCELLED"
  | "SUCCEEDED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"
  | "FAILED";

export interface Payment {
  id: string;
  paymentType: "TASK_PAYMENT" | "SUBSCRIPTION" | "BOOSTING";
  amount: number;
  currency: string;
  paymentOwnerId: string | null;
  paymentStatus: PaymentStatus;
  subscriptionId: string | null;
  traderId: string | null;
  taskId: string | null;
  subscriptionPlanId: string | null;
  stripePaymentId: string | null;
  boostingId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface PaymentsResponse {
  meta: PaymentMeta;
  data: Payment[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: null | unknown;
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<ApiResponse<PaymentsResponse>, void>({
      query: () => ({
        url: "/payment/public",
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),

    getPaymentById: builder.query<ApiResponse<Payment>, string>({
      query: (id) => ({
        url: `/payment/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Payment", id }],
    }),

    deletePayment: builder.mutation<ApiResponse<null>, { id: string }>({
      query: ({ id }) => ({
        url: `/payment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useDeletePaymentMutation,
} = paymentApi;

export default paymentApi;