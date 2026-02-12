// src/redux/api/blogCategoryApi.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const blogCategoryApi = createApi({
  reducerPath: 'blogCategoryApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/blogCategory' }),
  tagTypes: ['Category'], // ✅ Define tag types for cache management
  endpoints: (builder) => ({
    // Endpoint for adding a category
    addCategory: builder.mutation({
      query: (categoryData) => ({
        url: '/add',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }], // ✅ Invalidate list cache
    }),

    // Endpoint to get all categories
    getAllCategories: builder.query({
      query: () => '/get',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Category', id: _id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }], // ✅ Provide tags for each category
    }),

    // Endpoint to get a category by ID
    getCategoryById: builder.query({
      query: (id) => `/getById?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }], // ✅ Provide tag for this specific category
    }),

    // Endpoint to update a category
    updateCategory: builder.mutation({
      query: ({ id, categoryData }) => ({
        url: `/update?id=${id}`,
        method: 'PUT',
        body: categoryData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Category', id }, // ✅ Invalidate this specific category cache
        { type: 'Category', id: 'LIST' }, // ✅ Invalidate the list cache
      ],
    }),

    // Endpoint to delete a category
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/delete?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Category', id }, // ✅ Invalidate this specific category cache
        { type: 'Category', id: 'LIST' }, // ✅ Invalidate the list cache
      ],
    }),
  }),
});

// Export the auto-generated hook for each endpoint
export const {
  useAddCategoryMutation,
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = blogCategoryApi;