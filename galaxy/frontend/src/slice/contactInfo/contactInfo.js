import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const contactInfoApi = createApi({
  reducerPath: 'contactInfoApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/contactInfo' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Add a new user
    addUser: builder.mutation({
      query: (formData) => ({
        url: '/add',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),

    // Get all users
    getAllUsers: builder.query({
      query: () => '/get',
      providesTags: ['User'],
    }),

    // Get user by ID
    getUserById: builder.query({
      query: (id) => `/getById?id=${id}`,
      providesTags: ['User'],
    }),

    // Update a user
    updateUser: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/update?id=${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),

    // Delete a user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/delete?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useAddUserMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = contactInfoApi;
