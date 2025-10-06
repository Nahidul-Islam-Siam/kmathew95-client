/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

// --- Base Types ---
export interface Task {
  id: string;
  title: string;
  taskType: string;
  location: string;
  min_salary: number;
  max_salary: number;
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
}

export interface Trader {
  id: string;
  firstName?: string;
  profilePhoto?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  name?: string;
  title?: string;

}

// --- Favorite Item ---
export interface FavoriteItem {
  id: string;
  type: "TASK" | "TRADER";
  createdAt: string;
  updatedAt: string;
  traderOwnerId: string;
  favoriteByTraderId: string | null;
  taskId: string | null;
  task?: Task;
  trader?: Trader;
}

// --- Pagination ---
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface PaginatedFavoriteResponse {
  meta: PaginationMeta;
  data: FavoriteItem[]; // ← Changed from `FavoriteItem` to `data`
}
// --- API Response ---
export interface GetAllFavoritesResponse {
  success: boolean;
  message: string;
  meta: null | unknown;
  data: PaginatedFavoriteResponse; // ← This is key: data contains { meta, data[] }
}

export interface SingleFavoriteResponse {
  success: boolean;
  message: string;
  meta: null | unknown;
  data: FavoriteItem;
}

// --- Payload ---
export interface CreateFavoritePayload {
  type: "TASK" | "TRADER";
  taskId?: string;
  traderOwnerId?: string;
  favoriteByTraderId?: string | null;
}

// --- RTK Query API ---
export const favouriteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addFavorite: builder.mutation<SingleFavoriteResponse, CreateFavoritePayload>({
      query: (body) => ({
        url: "/favorite-save",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Favorite"],
    }),

    getAllFavorites: builder.query<GetAllFavoritesResponse, void>({
      query: () => "/favorite-save",
      providesTags: ["Favorite"],
    }),
    deleteFavorite: builder.mutation<SingleFavoriteResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/favorite-save/${id}`,
        method: "DELETE",
        params: {
          id,
        },
      }),
      invalidatesTags: ["Favorite"],
    }),

  }),
  overrideExisting: false,
});

// Export Hooks
export const {
  useAddFavoriteMutation,
  useGetAllFavoritesQuery,
  useDeleteFavoriteMutation,
} = favouriteApi;

export default favouriteApi;