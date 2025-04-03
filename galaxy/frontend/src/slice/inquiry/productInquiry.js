import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productInquiryApi = createApi({
  reducerPath: 'productInquiryApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/productInquiry' }),
  tagTypes: ['ProductInquiry'],
  endpoints: (builder) => ({
    getInquiries: builder.query({
      query: () => '/getInquiries',
      providesTags: ['ProductInquiry']
    }),

    createInquiry: builder.mutation({
      query: (inquiryData) => ({
        url: '/createInquiry',
        method: 'POST',
        body: inquiryData
      }),
      invalidatesTags: ['ProductInquiry']
    }),

    deleteInquiry: builder.mutation({
      query: (id) => ({
        url: `/deleteInquiries?id=${id}`,
        method: 'DELETE'
      
      }),
      invalidatesTags: ['ProductInquiry']
    })
  })
});

export const {
  useGetInquiriesQuery,
  useCreateInquiryMutation,
  useDeleteInquiryMutation
} = productInquiryApi;
