/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "@/redux/api/baseApi";

// ===== Interfaces =====

// User interface
export interface MessageUser {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  description: string | null;
}

// Single message interface
export interface ChatMessage {
  id: string;
  message: string;
  messageType: "TEXT" | "IMAGE" | "FILE";
  images: string[];
  fileId: string | null;
  replyToId: string | null;
  isRead: boolean;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  senderId: string;
  receiverId: string;
  roomId: string | null;
}

// Unified response format
export interface ApiResponse<T = unknown> {
  message: string;
  success: boolean;
  meta: unknown | null;
  data: T;
}

// User list response
export interface UserListResponse {
  users: MessageUser[];
  total?: number;
  map: any;
  messages: any;
  id: string;
}

// Messages response
export interface MessageListResponse {
  messages: ChatMessage[];
  total: number;
  page: number;
  limit: number;
}

// API endpoints
export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get list of users for messaging
    getUserList: builder.query<ApiResponse<UserListResponse>, void>({
      query: () => ({
        url: "/messages/user-list",
        method: "GET",
      }),
      providesTags: ["Messages"],
    }),

    // Get messages with a specific user
    getMessagesWithUser: builder.query<
      ApiResponse<MessageListResponse>,
      string
    >({
      query: (id) => ({
        url: `/messages/${id}`,
        method: "GET",
        params: { id },
      }),
      providesTags: ["Messages"],
    }),


    // geting single user here
    getSingleUser: builder.query<ApiResponse<MessageUser>, string>({
      query: (id) => ({
        url: `/messages/user/${id}`,
        method: "GET",
        params: { id },
      }),
      providesTags: ["Messages"],
    }),

  }),
});

// Export hooks
export const { useGetUserListQuery, useGetMessagesWithUserQuery , useGetSingleUserQuery} = messageApi;
