import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const aboutUsApi = createApi({
  reducerPath: 'aboutUsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/aboutus' }),
  tagTypes: ['AboutUs'],
  endpoints: (builder) => ({
    // Get about us (both all )
    getAboutUs: builder.query({
      query: (params) => ({
        url: '/get',
        params, // Will handle both empty params for all and {id} for single
      }),
      providesTags: ['AboutUs'],
    }),

  // Get about us by ID
    getAboutUsById: builder.query({
      query: (id) => ({
        url: `/getById?id=${id}`,
      }),
      providesTags: ['AboutUs'],
    }),

    // Get about us by slug
    getAboutUsBySlug: builder.query({
      query: (slug) => ({
        url: `/getBySlug?slug=${slug}`,
      }),
      providesTags: ['AboutUs'],
    }),

    // Create about us
    createAboutUs: builder.mutation({
      query: (formData) => ({
        url: '/add',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['AboutUs'],
    }),

    // Update about us with query parameter
    updateAboutUs: builder.mutation({
      query: ({ id, formData }) => ({
        url: '/update',
        method: 'PUT',
        params: { id },
        body: formData,
      }),
      invalidatesTags: ['AboutUs'],
    }),

    // Delete about us with query parameter
    deleteAboutUs: builder.mutation({
      query: (id) => ({
        url: '/delete',
        method: 'DELETE',
        params: { id },
      }),
      invalidatesTags: ['AboutUs'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetAboutUsQuery,
  useCreateAboutUsMutation,
  useUpdateAboutUsMutation,
  useDeleteAboutUsMutation,
  useGetAboutUsByIdQuery,   
  useGetAboutUsBySlugQuery,
} = aboutUsApi; 