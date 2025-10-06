// api/customerApi.ts
import baseApi from "../api/baseApi";

// ======= Trader Profile Types =======
export interface TraderProfile {
  id: string;
  userId: string;
  isActive: boolean;
  stripeAccountId: string | null;
  fastName: string; // Note: likely typo for "firstName"
  lastName: string;
  skills: string[];
  mininumHoulyRate: number | null; // Typo: should be "minimumHourlyRate"
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
    user: {
    username: string;
    avatar: string | null;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  description: string;
  contactNo: string;
  password: string; // ⚠️ Should not be sent to frontend! For typing only if API returns it
  lang: string;
  role: "TRADER" | "ADMIN" | "CUSTOMER";
  avatar: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  trader?: TraderProfile; // Nested trader data
}

// ======= API Response Type =======
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface GetAllTradersResponse {
  message: string;
  success: boolean;
  meta: PaginationMeta | null;
  data: TraderProfile[];
}

// ✅ Response for single trader
export interface GetSingleTraderResponse {
  message: string;
  success: boolean;
  meta: null;
  data: User; // ← Contains user + nested trader
}

// ======= API Endpoints =======
export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Fetches a paginated list of all traders/customers
     */
    getAllTraderList: builder.query<GetAllTradersResponse, void>({
      query: () => ({
        url: "/customers",
        method: "GET",
      }),
      providesTags: ["Customer"],
    }),

    /**
     * Fetches a single trader by ID
     * Returns: user info + trader profile
     */
    getSingleTrader: builder.query<GetSingleTraderResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/customers/${id}`,
        method: "GET",
      }),
      providesTags: ["Customer"],
    }),
  }),
  overrideExisting: false,
});

// Export Hooks
export const { useGetAllTraderListQuery, useGetSingleTraderQuery } = customerApi;

export default customerApi;