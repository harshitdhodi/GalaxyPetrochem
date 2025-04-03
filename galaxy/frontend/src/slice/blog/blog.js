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

    // Get a blog by slug (newly added)
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
        url: `/update?id=${id}`,  // Pass the id in the query string
        method: 'PUT',
        body: formData,  // Send the rest of the data in the request body
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
      query: () => '/getLatestBlog',  // Route for fetching the latest blog
      providesTags: ['Blog'],
    }),

    // Get all blogs except the latest one
    getAllBlogsExceptLatest: builder.query({
      query: () => '/getAllBlogsExceptLatest',  // Route for fetching all blogs except the latest one
      providesTags: ['Blog'],
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
  useGetLatestBlogQuery,  // Hook for getting the latest blog
  useGetAllBlogsExceptLatestQuery,  // Hook for getting all blogs except the latest
  useGetBlogBySlugQuery,  // Hook for getting a blog by slug
} = blogApi;
