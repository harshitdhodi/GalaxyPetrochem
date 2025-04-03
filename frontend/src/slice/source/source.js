import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base API
export const sourceApi = createApi({
  reducerPath: 'sourceApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/source' }),
  endpoints: (builder) => ({
    // Create a source
    createSource: builder.mutation({
      query: (newSource) => ({
        url: '/add',
        method: 'POST',
        body: newSource,
      }),
      // Invalidates the cache for getAllSources after creating a new source
      invalidatesTags: [{ type: 'Source', id: 'LIST' }],
    }),
    // Get all sources
    getAllSources: builder.query({
      query: () => '/get',
      // Provide a tag to cache the result and automatically invalidate when needed
      providesTags: (result) => {
        // Ensure result is an array before attempting to map
        if (Array.isArray(result)) {
          return [
            { type: 'Source', id: 'LIST' },
            ...result.map(({ _id }) => ({ type: 'Source', id: _id })),
          ];
        }
        // If result is not an array, just return the LIST tag
        return [{ type: 'Source', id: 'LIST' }];
      },
    }),
    // Get a source by ID
    getSourceById: builder.query({
      query: (id) => `/getById?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'Source', id }],
    }),
    // Update a source
    updateSource: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/update?id=${id}`,
        method: 'PUT',
        body: { id, ...updateData },
      }),
      // Invalidate the cache for the specific source and the list of sources
      invalidatesTags: (result, error, { id }) => [
        { type: 'Source', id },
        { type: 'Source', id: 'LIST' },
      ],
    }),
    // Delete a source
    deleteSource: builder.mutation({
      query: (id) => ({
        url: `/delete?id=${id}`,
        method: 'DELETE',
      }),
      // Invalidate the cache for the deleted source and the list of sources
      invalidatesTags: [{ type: 'Source', id: 'LIST' }, { type: 'Source', id: 'LIST' }],
    }),
  }),
});

// Export hooks for each endpoint
export const {
  useCreateSourceMutation,
  useGetAllSourcesQuery,
  useGetSourceByIdQuery,
  useUpdateSourceMutation,
  useDeleteSourceMutation,
} = sourceApi;
