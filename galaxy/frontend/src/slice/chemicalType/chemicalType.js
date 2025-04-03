import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Create the API slice
export const chemicalTypeApi = createApi({
  reducerPath: 'chemicalTypeApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/chemical' }),
  tagTypes: ['ChemicalType'],
  endpoints: (builder) => ({
    // Create
    createChemicalType: builder.mutation({
      query: (newChemicalType) => ({
        url: '/add',
        method: 'POST',
        body: newChemicalType,
      }),
      invalidatesTags: [{ type: 'ChemicalType', id: 'LIST' }],
    }),

    // Read All
    getChemicalTypes: builder.query({
      query: () => '/get',
      providesTags: (result) =>
        result
          ? [
              { type: 'ChemicalType', id: 'LIST' },
              ...result.map(({ _id }) => ({ type: 'ChemicalType', id: _id })),
            ]
          : [{ type: 'ChemicalType', id: 'LIST' }],
    }),

    // Read by ID
    getChemicalTypeById: builder.query({
      query: (id) => `/getById?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'ChemicalType', id }],
    }),

   

    // Update
    updateChemicalType: builder.mutation({
      query: ({ id, updatedChemicalType }) => ({
        url: `/update?id=${id}`,
        method: 'PUT',
        body: updatedChemicalType,
      }),
      invalidatesTags: [{ type: 'ChemicalType', id: 'LIST' }],
    }),

    // Delete
    deleteChemicalType: builder.mutation({
      query: (id) => ({
        url: `/delete?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'ChemicalType', id: 'LIST' }],
    }),
  }),
});

export const {
  useCreateChemicalTypeMutation,
  useGetChemicalTypesQuery,
  useGetChemicalTypeByIdQuery,
  useUpdateChemicalTypeMutation,
  useDeleteChemicalTypeMutation,
} = chemicalTypeApi;
