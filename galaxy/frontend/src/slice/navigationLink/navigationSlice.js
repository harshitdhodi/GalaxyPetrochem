import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const navigationLinkApi = createApi({
  reducerPath: 'navigationLinkApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/navigationLink' }),
  tagTypes: ['NavigationLink'],
  endpoints: (builder) => ({
    getAllNavigationLinks: builder.query({
      query: () => '/',
      providesTags: ['NavigationLink'],
    }),
    getNavigationLinkById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'NavigationLink', id }],
    }),
    createNavigationLink: builder.mutation({
      query: (formData) => ({
        url: '/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['NavigationLink'],
    }),
    updateNavigationLink: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'NavigationLink', id }],
    }),
    deleteNavigationLink: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['NavigationLink'],
    }),
  }),
});

export const {
  useGetAllNavigationLinksQuery,
  useGetNavigationLinkByIdQuery,
  useCreateNavigationLinkMutation,
  useUpdateNavigationLinkMutation,
  useDeleteNavigationLinkMutation,
} = navigationLinkApi;