import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const bannerApi = createApi({
  reducerPath: 'bannerApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/banner' }),
  tagTypes: ['Banner'],
  endpoints: (builder) => ({
    // Get all banners
    getAllBanners: builder.query({
      query: () => '/getAll',
      providesTags: ['Banner'],
    }),

    // Get banner by ID
    getBannerById: builder.query({
      query: (id) => ({
        url: '/get',
        params: { id },
      }),
      providesTags: (result, error, id) => [{ type: 'Banner', id }],
    }),

    // Get banner by pageSlug
    getBannerByPageSlug: builder.query({
      query: (pageSlug) => ({
        url: '/getByPageSlug',
        params: { pageSlug },
      }),
      providesTags: ['Banner'],
    }),

    // Create new banner
    createBanner: builder.mutation({
      query: (bannerData) => ({
        url: '/add',
        method: 'POST',
        body: bannerData,
      }),
      invalidatesTags: ['Banner'],
    }),

    // Update banner
    updateBanner: builder.mutation({
      query: ({ id, bannerData }) => ({
        url: `/update?id=${id}`,
        method: 'PUT',
        body: bannerData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Banner', id }],
    }),

    // Delete banner
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: '/delete',
        method: 'DELETE',
        params: { id },
      }),
      invalidatesTags: ['Banner'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetAllBannersQuery,
  useGetBannerByIdQuery,
  useGetBannerByPageSlugQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;