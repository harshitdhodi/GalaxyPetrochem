import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const followupApi = createApi({
  reducerPath: 'followupApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/followup' }),
  tagTypes: ['Messages'], // Define tag types
  endpoints: (builder) => ({
    // Get all messages
    getMessages: builder.query({
      query: () => '/get',
      providesTags: ['Messages'], // Add a tag for this query
    }),
    // Get today's messages
    getTodayMessages: builder.query({
      query: () => '/getTodayMessages',
      providesTags: ['Messages'], // Share the same tag
    }),
    // Get a single message by ID
    getMessageById: builder.query({
      query: (id) => `/getById?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'Messages', id }], // Tag by ID
    }),
    // Get a single message by inquiry ID
    getMessageByInquiryId: builder.query({
      query: (id) => `/getByInquiryId?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'Messages', id }], // Tag by ID
    }),
    // Get a count by inquiry ID
    getMessagesCountByInquiryId: builder.query({
      query: (id) => `/getCountByInquiryId?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'Messages', id }], // Tag by ID
    }),
    // Create a new message
    createMessage: builder.mutation({
      query: (newMessage) => ({
        url: '/add',
        method: 'POST',
        body: newMessage,
      }),
      invalidatesTags: ['Messages'], // Invalidate all Messages queries
    }),
    // Update a message by ID
    updateMessage: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/update?id=${id}`,
        method: 'PUT',
        body: updateData,  // Send all update fields
      }),
      invalidatesTags: ['Messages'],
    }),
    // Delete a message by ID
    deleteMessage: builder.mutation({
      query: (id) => ({
        url: `/delete?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Messages'], // Invalidate all Messages queries to refresh lists
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetMessagesQuery,
  useGetTodayMessagesQuery,
  useGetMessageByIdQuery,
  useGetMessageByInquiryIdQuery,
  useGetMessagesCountByInquiryIdQuery,
  useCreateMessageMutation,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = followupApi;
