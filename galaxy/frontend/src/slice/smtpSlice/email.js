import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Create an API slice
export const emailApi = createApi({
  reducerPath: 'emailApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/email', // Base URL for the API
  }),
  endpoints: (builder) => ({
    sendEmail: builder.mutation({
      query: (formData) => ({
        url: '/sendEmail',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

// Export hooks for using the mutation in components
export const { useSendEmailMutation } = emailApi;
