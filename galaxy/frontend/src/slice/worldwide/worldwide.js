import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const worldwideApi = createApi({
  reducerPath: 'worldwideApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/worldwide' }),
  tagTypes: ['Worldwide'],
  endpoints: (builder) => ({
    // Create new worldwide entry
    createWorldwide: builder.mutation({
      query: (data) => ({
        url: '/add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Worldwide'],
    }),

    // Get all worldwide entries
    getAllWorldwide: builder.query({
      query: () => '/get',
      providesTags: ['Worldwide'],
    }),

    // Get worldwide entry by ID
    getWorldwideById: builder.query({
      query: (id) => `/getById?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'Worldwide', id }],
    }),

    // Update worldwide entry
    updateWorldwide: builder.mutation({
      query: ({ id, data }) => ({
        url: `/updateById?id=${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Worldwide'],
    }),

    // Delete worldwide entry
    deleteWorldwide: builder.mutation({
      query: (id) => ({
        url: `/delete?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Worldwide'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useCreateWorldwideMutation,
  useGetAllWorldwideQuery,
  useGetWorldwideByIdQuery,
  useUpdateWorldwideMutation,
  useDeleteWorldwideMutation,
} = worldwideApi;
