import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/blog' }),
  tagTypes: ['Blog', 'Category'],
  endpoints: (builder) => ({
    // Create a new blog
    createBlog: builder.mutation({
      query: (formData) => ({
        url: '/add',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Blog'],
    }),

    // Get all blogs
    getAllBlogs: builder.query({
      query: () => '/get',
      providesTags: ['Blog'],
    }),

    // Get a blog by ID
    getBlogById: builder.query({
      query: (id) => ({
        url: '/getById',
        params: { id },
      }),
      providesTags: ['Blog'],
    }),

    // Get a blog by slug
    getBlogBySlug: builder.query({
      query: (slug) => ({
        url: '/getBlogBySlug',
        params: { slug },
      }),
      providesTags: ['Blog'],
    }),

    // Update a blog by ID
    updateBlog: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/update?id=${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Blog'],
    }),

    // Delete a blog by ID
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: '/delete',
        method: 'DELETE',
        params: { id },
      }),
      invalidatesTags: ['Blog'],
    }),

    // Get blogs by category
    getBlogsByCategory: builder.query({
      query: (categoryId) => ({
        url: `/category?categoryId=${categoryId}`,
      }),
      providesTags: ['Category'],
    }),

    // Get the latest blog
    getLatestBlog: builder.query({
      query: () => '/getLatestBlog',
      providesTags: ['Blog'],
    }),

    // Get all blogs except the latest one
    getAllBlogsExceptLatest: builder.query({
      query: (slug) => ({
        url: '/getAllBlogsExceptLatest',
        params: { slug },
      }),
      providesTags: ['Blog'],
    }),

    // Increment blog visits
    incrementBlogVisits: builder.mutation({
      query: ({ id, clientIP }) => ({
        url: `/incrementBlogVisits`,
        method: 'PUT',
        params: { id, clientIP }, // sending as query parameters
      }),
    }),



  }),
});

export const {
  useCreateBlogMutation,
  useGetAllBlogsQuery,
  useGetBlogByIdQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetBlogsByCategoryQuery,
  useGetLatestBlogQuery,
  useGetAllBlogsExceptLatestQuery,
  useGetBlogBySlugQuery,
  useIncrementBlogVisitsMutation,
} = blogApi;