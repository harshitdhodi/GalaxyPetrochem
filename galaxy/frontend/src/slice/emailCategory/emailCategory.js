import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const emailCategoryApi = createApi({
    reducerPath: 'emailCategoryApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/emailCategory' }),
    tagTypes: ['EmailCategory'],
    endpoints: (builder) => ({
        // Get all categories
        getEmailCategories: builder.query({
            query: () => '/getCategories',
            providesTags: ['EmailCategory'],
        }),

        // Get single category by ID
        getEmailCategoryById: builder.query({
            query: (id) => `/category/${id}`,
            providesTags: ['EmailCategory'],
        }),

        // Create new category
        createEmailCategory: builder.mutation({
            query: (data) => ({
                url: '/addCategory',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['EmailCategory'],
        }),

        // Update category
        updateEmailCategory: builder.mutation({
            query: ({ id, data }) => ({
                url: `/updateCategory?id=${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['EmailCategory'],
        }),

        // Delete category
        deleteEmailCategory: builder.mutation({
            query: (id) => ({
                url: `/deleteCategory?id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['EmailCategory'],
        }),
    }),
});

export const {
    useGetEmailCategoriesQuery,
    useGetEmailCategoryByIdQuery,
    useCreateEmailCategoryMutation,
    useUpdateEmailCategoryMutation,
    useDeleteEmailCategoryMutation,
} = emailCategoryApi;
