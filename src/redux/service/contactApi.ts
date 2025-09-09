import { baseApi } from "@/redux/api/baseApi";

// --- Payload ---
export interface CreateContactPayload {
  fullName: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  companyName?: string;
}

// --- Response ---
export interface ContactUsResponse {
  success: boolean;
  message: string;
  data: null;
}

// --- RTK Query API ---
export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addContactApi: builder.mutation<ContactUsResponse, CreateContactPayload>({
      query: (body) => ({
        url: "/contact-us",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contact"], // Keep only if you have a "Contact" tag in baseApi
    }),

    getAllContactData: builder.query({
      query: () => "/contact-us",
      providesTags: ["Contact"], // Keep only if you have a "Contact" tag in baseApi
    }),


    
  }),
  overrideExisting: false,
});

// Export Hook
export const { useAddContactApiMutation , useGetAllContactDataQuery} = contactApi;

export default contactApi;