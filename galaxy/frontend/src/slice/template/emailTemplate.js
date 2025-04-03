import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const templateApi = createApi({
  reducerPath: 'templateApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/template' }),
  tagTypes: ['Templates'],
  endpoints: (builder) => ({
    // Add Template
    addTemplate: builder.mutation({
      query: (data) => ({
        url: '/add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Templates'],
    }),

    // Get All Templates
    getAllTemplates: builder.query({
      query: () => '/get',
      providesTags: ['Templates'],
    }),

    // Get Template By ID
    getTemplateById: builder.query({
      query: (id) => ({
        url: `/getById?id=${id}`,
        method: 'GET',
      }),
      providesTags: ['Templates'],
    }),

    // Update Template
    updateTemplate: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/update?id=${id}`,
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: ['Templates'],
    }),

    // Delete Template
    deleteTemplate: builder.mutation({
      query: (id) => ({
        url: `/delete?id=${id}`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: ['Templates'],
    }),
  }),
});

export const {
  useAddTemplateMutation,
  useGetAllTemplatesQuery,
  useGetTemplateByIdQuery,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
} = templateApi;

export default templateApi;
