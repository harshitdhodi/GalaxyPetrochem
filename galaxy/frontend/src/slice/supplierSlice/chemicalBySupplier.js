import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the API
export const chemicalApi = createApi({
  reducerPath: 'chemicalApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }), // Adjust the base URL as needed
  tagTypes: ['Chemicals', 'Supplier'], // Define tag types

  endpoints: (builder) => ({
    // Endpoint to get chemicals filtered by alphabet
    getChemicalsByAlphabet: builder.query({
      query: (alphabet) => `chemical/filterChemical?alphabet=${alphabet}`, // Adjust path if necessary
      providesTags: (result, error, alphabet) => [{ type: 'Chemicals', id: alphabet }],
    }),

    // Endpoint to count all chemicals for a supplier
    countAllChemicals: builder.query({
      query: (supplierId) => `supplier/getChemicalsForSupplier?supplierId=${supplierId}`, // Adjust path if necessary
      providesTags: (result, error, supplierId) => [{ type: 'Supplier', id: supplierId }],
    }),

    // Mutation to add chemical IDs to a supplier
    addChemicalIdsToSupplier: builder.mutation({
      query: ({ supplierId, chemical_ids }) => ({
        url: `/supplier/addChemicalIdsToSupplier?id=${supplierId}`,
        method: 'PUT',
        body: { chemical_ids },
      }),
      invalidatesTags: (result, error, { supplierId }) => [
        { type: 'Supplier', id: supplierId },
      ],
    }),

    // Mutation to add a supplier
    addSupplier: builder.mutation({
      query: (supplierData) => ({
        url: '/api/supplier/add',
        method: 'POST',
        body: supplierData,
      }),
      invalidatesTags: [{ type: 'Supplier' }],
    }),
  }),
});

// Export hooks for queries and mutations
export const {
  useGetChemicalsByAlphabetQuery,
  useCountAllChemicalsQuery,
  useAddChemicalIdsToSupplierMutation,
  useAddSupplierMutation,
} = chemicalApi;
