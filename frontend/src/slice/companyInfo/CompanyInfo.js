// src/redux/services/companyInfoApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const companyInfoApi = createApi({
  reducerPath: 'companyInfoApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['CompanyInfo'],
  endpoints: (builder) => ({
    // GET all company info
    getCompanyInfo: builder.query({
      query: () => 'companyInfo',
      providesTags: ['CompanyInfo'],
    }),

    // ✅ GET company info by ID
    getCompanyInfoById: builder.query({
      query: (id) => `companyInfo/${id}`,
      providesTags: ['CompanyInfo'],
    }),

    // POST new company info (form-data)
    addCompanyInfo: builder.mutation({
      query: (formData) => ({
        url: 'companyInfo/create',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['CompanyInfo'],
    }),

    // PUT (update) company info
    updateCompanyInfo: builder.mutation({
      query: ({ id, formData }) => ({
        url: `companyInfo/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['CompanyInfo'],
    }),

    // DELETE company info
    deleteCompanyInfo: builder.mutation({
      query: (id) => ({
        url: `companyInfo/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CompanyInfo'],
    }),
  }),
});

export const {
  useGetCompanyInfoQuery,
  useGetCompanyInfoByIdQuery, // ✅ Exported here
  useAddCompanyInfoMutation,
  useUpdateCompanyInfoMutation,
  useDeleteCompanyInfoMutation,
} = companyInfoApi;
