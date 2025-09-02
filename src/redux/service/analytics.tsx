import baseApi from "../api/baseApi";

// ======= Admin Analytics Types =======
export interface DailyStat {
  date: string; // "YYYY-MM-DD"
  count: number;
  totalAmount?: number;
}

export interface DailyStats {
  traderRegistrations: DailyStat[];
  sales: (DailyStat & { totalAmount: number })[];
}

export interface Totals {
  totalTraders: number;
  totalTask: number;
  totalRevenue: number;
  totalPendingPayment: number;
}

export interface AdminAnalyticsData {
  totals: Totals;
  dailyStats: DailyStats;
}

export interface GetAdminAnalyticsResponse {
  message: string;
  success: boolean;
  meta: null;
  data: AdminAnalyticsData;
}

// ======= Trader Analytics Types =======
export interface TraderAnalyticsData {
  bidsApplied: number;
  bidsWon: number;
  reviewsCount: number;
  reviewsAvgRating: number;
  revenueStatices: Array<{ 
    date: string; 
    amount: number 
  }>; // assuming this is daily/monthly revenue (even if empty)
}

export interface GetTraderAnalyticsResponse {
  message: string;
  success: boolean;
  meta: null;
  data: TraderAnalyticsData;
}

// ======= API Endpoints =======
export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Admin Analytics
    getAdminAnalytics: builder.query<GetAdminAnalyticsResponse, void>({
      query: () => ({
        url: "/analytics/admin",
        method: "GET",
      }),
      providesTags: ["Analytics"],
    }),

    // ✅ Trader Analytics (new endpoint with correct type)
    getTraderAnalytics: builder.query<GetTraderAnalyticsResponse, void>({
      query: () => ({
        url: "/analytics/trader",
        method: "GET",
      }),
      providesTags: ["Analytics"],
    }),
  }),
});

// ✅ Export both hooks
export const { 
  useGetAdminAnalyticsQuery, 
  useGetTraderAnalyticsQuery 
} = analyticsApi;