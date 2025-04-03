import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const inquiryApi = createApi({
  reducerPath: 'inquiryApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/inquiry' }),
  endpoints: (builder) => ({
    // Fetch all inquiries with providesTags
    getInquiries: builder.query({
      query: () => '/get',
      providesTags: (result) => 
        result ? [{ type: 'Inquiries', id: 'LIST' }] : [],  // If there are inquiries, associate with 'Inquiries' tag
    }),

    // Fetch inquiry by ID
    getInquiryById: builder.query({
      query: (id) => `/getById?id=${id}`,
    }),

    // Create a new inquiry with invalidatesTags
    addInquiry: builder.mutation({
      query: (inquiry) => ({
        url: '/add',
        method: 'POST',
        body: inquiry,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: [{ type: 'Inquiries', id: 'LIST' }],  // Invalidate the 'Inquiries' tag after mutation
    }),

    // Update an inquiry with invalidatesTags
    updateInquiry: builder.mutation({
      query: ({ id, ...inquiry }) => ({
        url: `/update?id=${id}`,
        method: 'PUT',
        body: inquiry,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: [{ type: 'Inquiries', id: 'LIST' }],  // Invalidate the 'Inquiries' tag after mutation
    }),

    // Delete an inquiry with invalidatesTags
    deleteInquiry: builder.mutation({
      query: (id) => ({
        url: `/delete?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Inquiries', id: 'LIST' }],  // Invalidate the 'Inquiries' tag after mutation
    }),
  }),
});

export const {
  useGetInquiriesQuery,
  useGetInquiryByIdQuery,
  useAddInquiryMutation,
  useUpdateInquiryMutation,
  useDeleteInquiryMutation,
} = inquiryApi;
