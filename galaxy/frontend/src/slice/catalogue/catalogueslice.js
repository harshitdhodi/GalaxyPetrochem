import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const catalogueApi = createApi({
  reducerPath: 'catalogueApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/catalogue' }),
  tagTypes: ['Catalogue'],
  endpoints: (builder) => ({
    getAllCatalogues: builder.query({
      query: () => '/',
      providesTags: ['Catalogue'],
    }),
    getCatalogueById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Catalogue', id }],
    }),
    createCatalogue: builder.mutation({
      query: (formData) => ({
        url: '/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Catalogue'],
    }),
    updateCatalogue: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Catalogue', id }],
    }),
    deleteCatalogue: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Catalogue'],
    }),
  }),
});

export const {
  useGetAllCataloguesQuery,
  useGetCatalogueByIdQuery,
  useCreateCatalogueMutation,
  useUpdateCatalogueMutation,
    useDeleteCatalogueMutation,
} = catalogueApi;