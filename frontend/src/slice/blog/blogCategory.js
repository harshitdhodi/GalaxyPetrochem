// src/redux/api/blogCategoryApi.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const blogCategoryApi = createApi({
  reducerPath: 'blogCategoryApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/blogCategory' }), // Define the base URL
  endpoints: (builder) => ({
    // Endpoint for adding a category
    addCategory: builder.mutation({
      query: (categoryData) => ({
        url: '/add',
        method: 'POST',
        body: categoryData,
      }),
    }),

    // Endpoint to get all categories
    getAllCategories: builder.query({
        query: () => '/get',
        providesTags: ['Category'],
      }),

    // Endpoint to get a category by ID
    getCategoryById: builder.query({
      query: (id) => `/getById?id=${id}`,
    }),

    // Endpoint to update a category
    updateCategory: builder.mutation({
        query: ({ id, categoryData }) => ({
            url: `/update?id=${id}`,
            method: 'PUT',
            body: categoryData, // Directly passing the categoryData object
        }),
    }),
    

    // Endpoint to delete a category
    deleteCategory: builder.mutation({
        query: (id) => ({
          url: `/delete?id=${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Category'], // Invalidate cache after deletion
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
