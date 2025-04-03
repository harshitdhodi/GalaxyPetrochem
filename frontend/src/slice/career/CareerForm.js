import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const careerApi = createApi({
  reducerPath: 'careerApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/career' }),
  tagTypes: ['Career'],
  endpoints: (builder) => ({
    submitApplication: builder.mutation({
      query: (formData) => ({
        url: '/add',
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary for FormData
      }),
      invalidatesTags: ['Career'],
    }),

    getAllApplications: builder.query({
      query: () => '/get',
      providesTags: ['Career'],
    }),

    getApplicationById: builder.query({
      query: (id) => `/getById?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'Career', id }],
    }),

    updateApplication: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/update?id=${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Career'],
    }),

    deleteApplication: builder.mutation({
      query: (id) => ({
        url: `/delete?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Career'],
    }),
  }),
});

export const {
  useSubmitApplicationMutation,
  useGetAllApplicationsQuery,
  useGetApplicationByIdQuery,
  useUpdateApplicationMutation,
  useDeleteApplicationMutation,
} = careerApi;
