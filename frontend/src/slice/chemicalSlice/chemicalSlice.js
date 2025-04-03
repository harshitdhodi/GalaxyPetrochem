import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const chemicalApi = createApi({
  reducerPath: 'chemicalApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/chemical',
    prepareHeaders: (headers) => {
      headers.delete('Content-Type');
      return headers;
    },
  }),
  tagTypes: ['Chemicals'],
  endpoints: (builder) => ({
    getChemicalsByAlphabetForFilter: builder.query({
      query: ({ alphabet }) =>
        `/getChemicalByCategoryAndAlphabet?alphabet=${alphabet}`,
      transformResponse: (response) => response || [],
      providesTags: (result) =>
        result ? [{ type: 'Chemicals', id: 'LIST' }] : [],
    }),

    getChemicals: builder.query({
      query: () => `/get`,
      transformResponse: (response) => response?.data || response || [],
      providesTags: (result) =>
        result ? [{ type: 'Chemicals', id: 'LIST' }] : [],
    }),

    getChemicalById: builder.query({
      query: (id) => `/getChemicalById?id=${id}`,
      transformResponse: (response) => response?.data || response || {},
      providesTags: (result) =>
        result ? [{ type: 'Chemicals', id: 'LIST' }] : [],
    }),

    getChemicalsByCategoryAndSubCategory: builder.query({
      query: ({ categorySlug, subCategorySlug }) =>
        `/getChemical?categorySlug=${categorySlug}&subCategorySlug=${subCategorySlug}`,
      transformErrorResponse: (response, meta, arg) => response.status,
    }),

    getChemicalsBySubSubCategorySlug: builder.query({
      query: (slug) => `/getChemicalBysubsubCategorySlug?slug=${slug}`,
      transformResponse: (response) => response?.data || response || [],
      providesTags: (result) =>
        result ? [{ type: 'Chemicals', id: 'LIST' }] : [],
    }),

    getLatestChemicals: builder.query({
      query: () => `/latest`,
      transformResponse: (response) => response?.data || response || [],
      providesTags: (result) =>
        result ? [{ type: 'Chemicals', id: 'LIST' }] : [],
    }),

    getLatestChemicalsExcept: builder.query({
      query: (chemicals) => `/getLatestChemicalsExcept?slug=${chemicals}`,
      transformResponse: (response) => response || {},
      providesTags: ['Chemicals'],
    }),

    searchChemicals: builder.query({
      query: (searchTerm) => ({
        url: `/search`,
        params: { query: searchTerm },
      }),
      transformResponse: (response) => response?.data || [],
      providesTags: ['Chemicals'],
    }),

    addChemical: builder.mutation({
      query: (newChemical) => ({
        url: '/add',
        method: 'POST',
        body: newChemical,
      }),
      invalidatesTags: [{ type: 'Chemicals', id: 'LIST' }],
    }),

    deleteProductById: builder.mutation({
      query: (id) => ({
        url: `/delete?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Chemicals', id: 'LIST' }],
    }),

    updateChemicalById: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/updateChemicalById?id=${id}`,
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: [{ type: 'Chemicals', id: 'LIST' }],
    }),

    getChemicalBySlug: builder.query({
      query: (chemicals) => `/getBySlug?slug=${chemicals}`,
      providesTags: (result) => (result ? [{ type: 'Chemicals', id: 'LIST' }] : []),
    }),
  }),
});

// Export hooks
export const {
  useGetChemicalsByAlphabetForFilterQuery,
  useGetChemicalsQuery,
  useGetChemicalByIdQuery,
  useSearchChemicalsQuery,
  useAddChemicalMutation,
  useDeleteProductByIdMutation,
  useUpdateChemicalByIdMutation,
  useGetChemicalsByCategoryAndSubCategoryQuery,
  useGetChemicalBySlugQuery,
  useGetChemicalsBySubSubCategorySlugQuery,
  useGetLatestChemicalsQuery,
  useGetLatestChemicalsExceptQuery,  
} = chemicalApi;

// Export the API for the store configuration
export default chemicalApi;

