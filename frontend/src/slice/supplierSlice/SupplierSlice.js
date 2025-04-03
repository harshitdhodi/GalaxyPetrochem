import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const supplierApi = createApi({
  reducerPath: 'supplierApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Supplier'],
  endpoints: (builder) => ({
    getSuppliers: builder.query({
      query: () => 'supplier/get',
      providesTags: ['Supplier'],
    }),
    getSuppliersByAlphabet: builder.query({
      query: (alphabet) => `supplier/getAllSuppliersByAlphabet?alphabet=${alphabet}`,
      providesTags: ['Supplier'],
    }),
    getSuppliersByChemicalId: builder.query({
      query: (chemicalId) => `supplier/getSupplierByChemicalId?chemicalId=${chemicalId}`,
      providesTags: ['Supplier'],
    }),
    getSupplierCountByChemicalId: builder.query({
      query: (chemicalId) => `supplier/getSupplierCountByChemicalId?chemicalId=${chemicalId}`,
      providesTags: ['Supplier'],
    }),
    addSupplier: builder.mutation({
      query: (newSupplier) => ({
        url: 'supplier/add',
        method: 'POST',
        body: newSupplier,
      }),
      invalidatesTags: ['Supplier'],
    }),
    getSupplierById: builder.query({
      query: (id) => `supplier/getById?id=${id}`,
      providesTags: ['Supplier'],
    }),
    updateSupplier: builder.mutation({
      query: ({ updatedSupplier, id }) => ({
        url: `supplier/update?id=${id}`,
        method: 'PUT',
        body: updatedSupplier,
      }),
      invalidatesTags: ['Supplier'],
    }),
    
    deleteSupplier: builder.mutation({
      query: (id) => ({
        url: `supplier/delete?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Supplier'],
    }),
    deleteChemicalFromSupplier: builder.mutation({
      query: ({ supplierId, chemicalId }) => ({
        url: `supplier/deleteChemicalFromSupplier?supplierId=${supplierId}&chemicalId=${chemicalId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Supplier'],
    }),
    
  }),
});

export const {
  useGetSuppliersQuery,
  useGetSuppliersByAlphabetQuery,
  useGetSuppliersByChemicalIdQuery,
  useAddSupplierMutation,
  useGetSupplierCountByChemicalIdQuery,
  useGetSupplierByIdQuery,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useDeleteChemicalFromSupplierMutation
} = supplierApi;