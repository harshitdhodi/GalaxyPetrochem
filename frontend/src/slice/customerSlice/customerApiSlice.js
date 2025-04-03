import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Chemicals', 'Customers'],
  endpoints: (builder) => ({
    // Mutation to add chemicals to a customer
    addChemicalToCustomer: builder.mutation({
      query: ({ customerId, chemicalId }) => ({
        url: `customer/addChemicalIdsToCustomer?id=${customerId}`,
        method: 'PUT',
        body: { chemicalId: [chemicalId] },
      }),
      invalidatesTags: (result, error, { customerId }) => [{ type: 'Customers', id: customerId }],
    }),
    
    // Customer-related endpoints
    getCustomerById: builder.query({
      query: (customerId) => `customer/getById?id=${customerId}`,
      providesTags: ['Customers'],
    }),

    getCustomers: builder.query({
      query: () => 'customer/get',
      providesTags: ['Customers'],
    }),

    addCustomer: builder.mutation({
      query: (formData) => ({
        url: 'customer/create',
        method: 'POST',
        body: formData,
        prepareHeaders: (headers) => {
          headers.delete('Content-Type');
          return headers;
        },
      }),
      invalidatesTags: ['Customers'],
    }),

    updateCustomer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/customer/update?id=${id}`,
        method: 'PUT',
        body: data,
        prepareHeaders: (headers) => {
          headers.delete('Content-Type');
          return headers;
        },
      }),
      invalidatesTags: ['Customers'],
    }),

    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `customer/delete?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customers'],
    }),

    getCustomersByChemicalId: builder.query({
      query: (chemicalId) => `customer/getCustomerByChemicalId?chemicalId=${chemicalId}`,
      providesTags: ['Customers'],
    }),

    getCustomersByAlphabet: builder.query({
      query: (alphabet) => `customer/getAllCustomersByAlphabet?alphabet=${alphabet}`,
      providesTags: ['Customers'],
    }),

    removeChemicalFromCustomer: builder.mutation({
      query: ({ customerId, chemicalId }) => ({
        url: `customer/deleteChemicalFromCustomer?customerId=${customerId}&chemicalId=${chemicalId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Chemicals', 'Customers'],
    }),

  }),
});

export const {
  // Chemicals hooks
  useAddChemicalToCustomerMutation,


  // Customers hooks
  useGetCustomerByIdQuery,
  useGetCustomersQuery,
  useAddCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useGetCustomersByAlphabetQuery,
  useGetCustomersByChemicalIdQuery,
  useRemoveChemicalFromCustomerMutation
} = api;
