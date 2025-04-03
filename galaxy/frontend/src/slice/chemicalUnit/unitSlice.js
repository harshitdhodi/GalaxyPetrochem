import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the API service using RTK Query
export const unitApi = createApi({
  reducerPath: 'unitApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/unit' }),
  endpoints: (builder) => ({
    // Create a new unit
    createUnit: builder.mutation({
      query: (unitData) => ({
        url: '/add',
        method: 'POST',
        body: unitData,
      }),
      // Invalidate the list of units to trigger a refetch after creation
      invalidatesTags: [{ type: 'Unit', id: 'LIST' }],
    }),
    
    // Get all units
    getAllUnits: builder.query({
      query: () => '/get',
      // This will provide a tag for the list of units
      providesTags: (result = [], error) =>
        result ? [{ type: 'Unit', id: 'LIST' }] : [],
    }),
    
    // Get a unit by ID
    getUnitById: builder.query({
      query: (id) => `/getById?id=${id}`,
      // Provides a tag for each individual unit based on its ID
      providesTags: (result, error, id) => [{ type: 'Unit', id }],
    }),
    
    // Update a unit by ID
    updateUnit: builder.mutation({
      query: ({ id, updatedUnit }) => ({
        url: `/update?id=${id}`,
        method: 'PUT',
        body: updatedUnit,
      }),
      // Invalidate the list of units and the updated unit cache after update
      invalidatesTags: (result, error, { id }) => [
        { type: 'Unit', id: 'LIST' },
        { type: 'Unit', id },
      ],
    }),

    // Delete a unit by ID
    deleteUnit: builder.mutation({
      query: (id) => ({
        url: `/delete?id=${id}`,
        method: 'DELETE',
      }),
      // Invalidate the list of units and the deleted unit cache after deletion
      invalidatesTags: (result, error, id) => [
        { type: 'Unit', id: 'LIST' },
        { type: 'Unit', id },
      ],
    }),
  }),
});

export const {
  useCreateUnitMutation,
  useGetAllUnitsQuery,
  useGetUnitByIdQuery,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = unitApi;
