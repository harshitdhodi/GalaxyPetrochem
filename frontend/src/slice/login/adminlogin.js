import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { logout } from './authSlice'; // Import a logout action if you have one in the auth slice

// Create a custom base query with automatic token handling and error handling
const baseQueryWithReauth = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: '/api/admin',
    prepareHeaders: (headers) => {
      const token = Cookies.get('jwt'); // Get the JWT from cookies

      // If token exists, add it to the Authorization header
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  });

  const result = await baseQuery(args, api, extraOptions);

  // Check for 403 status code and handle forbidden errors
  if (result.error && result.error.status === 403) {
    console.error('Forbidden: Invalid or expired token');
    api.dispatch(logout()); // Dispatch logout action if applicable
  }

  return result;
};

// Define the API slice with tagTypes
export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['AdminProfile'], // Define a tag type for admin profile data
  endpoints: (builder) => ({
    // Register Admin
    registerAdmin: builder.mutation({
      query: (formData) => ({
        url: 'register',
        method: 'POST',
        body: formData,
      }),
    }),

    // Get Admin Profile (with tag)
    getAdminProfile: builder.query({
      query: () => 'adminprofile',
      providesTags: ['AdminProfile'], // This query provides the 'AdminProfile' tag
    }),

    // Update Admin Profile (with tag invalidation)
    updateAdminProfile: builder.mutation({
      query: (formData) => ({
        url: 'updateAdminprofile',
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['AdminProfile'], // Invalidates the 'AdminProfile' tag on success
    }),

    // Admin Login
    loginAdmin: builder.mutation({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

// Export hooks for each endpoint
export const {
  useRegisterAdminMutation,
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useLoginAdminMutation,
} = adminApi;