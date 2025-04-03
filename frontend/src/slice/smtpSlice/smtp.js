// services/smtpApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const smtpApi = createApi({
  reducerPath: 'smtpApi', // Unique key for this slice
  baseQuery: fetchBaseQuery({ baseUrl: '/api/smtp' }),
  tagTypes: ['SMTP'], // Tags for cache invalidation
  endpoints: (builder) => ({
    // Create Server
    createServer: builder.mutation({
      query: (newServer) => ({
        url: '/add',
        method: 'POST',
        body: newServer,
      }),
      invalidatesTags: ['SMTP'], // Invalidate cache after mutation
    }),
    // Get All Servers
    getAllServers: builder.query({
      query: () => '/get',
      providesTags: ['SMTP'], // Attach cache tag
    }),
    // Get Server by ID
    getServerById: builder.query({
      query: (id) => `/getById?id=${id}`,
      providesTags: ['SMTP'],
    }),
    // Update Server
    updateServer: builder.mutation({
      query: ({ id, updatedServer }) => ({
        url: `/update?id=${id}`, // Make sure 'id' is part of the URL or request body
        method: 'PUT',
        body: updatedServer,
      }),
      invalidatesTags: ['SMTP'], // Invalidate cache after mutation
    }),
    
    // Delete Server
    deleteServer: builder.mutation({
      query: (id) => ({
        url: `/delete?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SMTP'], // Invalidate cache after mutation
    }),
  }),
});

export const {
  useCreateServerMutation,
  useGetAllServersQuery,
  useGetServerByIdQuery,
  useUpdateServerMutation,
  useDeleteServerMutation,
} = smtpApi;


