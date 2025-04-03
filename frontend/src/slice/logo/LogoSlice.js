import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const logoApi = createApi({
    reducerPath: 'logoApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Logo'],
    endpoints: (builder) => ({
        // Get Logo
        getLogo: builder.query({
            query: () => ({
                url: '/companyLogo/get-logo',
                method: 'GET'
            }),
            providesTags: ['Logo'],
            transformResponse: (response) => response.data
        }),

        // Update Logo
        updateLogo: builder.mutation({
            query: (logoData) => ({
                url: '/companyLogo/update',
                method: 'PUT',
                body: logoData
            }),
            invalidatesTags: ['Logo'],
            transformResponse: (response) => response.data
        }),

        // Delete Logo
        deleteLogo: builder.mutation({
            query: () => ({
                url: '/companyLogo/delete',
                method: 'DELETE'
            }),
            invalidatesTags: ['Logo']
        })
    })
});

// Export hooks for usage in components
export const {
    useGetLogoQuery,
    useUpdateLogoMutation,
    useDeleteLogoMutation
} = logoApi;

// Export api for store configuration
export default logoApi;
