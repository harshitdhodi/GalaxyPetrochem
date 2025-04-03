import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base API
export const statusApi = createApi({
  reducerPath: 'statusApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/status' }),
  tagTypes: ['Status'], // Define the tag type for cache invalidation
  endpoints: (builder) => ({
    // Create a status
    createStatus: builder.mutation({
      query: (newStatus) => ({
        url: '/add',
        method: 'POST',
        body: newStatus,
      }),
      // Invalidate all cached data related to 'Status' when a status is created
      invalidatesTags: [{ type: 'Status', id: 'LIST' }],
    }),
    // Get all statuses
    getAllStatuses: builder.query({
      query: () => '/get',
      // Cache this query with the 'LIST' id
      providesTags: ['Status', { type: 'Status', id: 'LIST' }],
    }),
    // Get a status by ID
    getStatusById: builder.query({
      query: (id) => `/getById?id=${id}`,
      // Cache this query with the specific status ID
      providesTags: (result, error, id) => [{ type: 'Status', id }],
    }),
    // Update a status
    updateStatus: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/update?id=${id}`,
        method: 'PUT',
        body: { id, ...updateData },
      }),
      // Invalidate the specific status by its ID and the status list
      invalidatesTags: (result, error, { id }) => [
        { type: 'Status', id },
        { type: 'Status', id: 'LIST' },
      ],
    }),
    // Delete a status
    deleteStatus: builder.mutation({
      query: (id) => ({
        url: `/delete?id=${id}`,
        method: 'DELETE',
      }),
      // Invalidate the specific status by ID and the status list
      invalidatesTags: (result, error, id) => [
        { type: 'Status', id },
        { type: 'Status', id: 'LIST' },
      ],
    }),
  }),
});

// Export hooks for each endpoint
export const {
  useCreateStatusMutation,
  useGetAllStatusesQuery,
  useGetStatusByIdQuery,
  useUpdateStatusMutation,
  useDeleteStatusMutation,
} = statusApi;
