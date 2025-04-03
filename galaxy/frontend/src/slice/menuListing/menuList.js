// filepath: /c:/Users/Admin/Desktop/CDHCHEMICAL/git/frontend/src/services/menuListingApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const menuListingApi = createApi({
    reducerPath: 'menuListingApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/menulist' }),
    endpoints: (builder) => ({
        getAllMenuListings: builder.query({
            query: () => '/get-menu',
        }),
        getMenuListingById: builder.query({
            query: (id) => `/get-menu/${id}`,
        }),
        createMenuListing: builder.mutation({
            query: (newMenuListing) => ({
                url: '/add-menu',
                method: 'POST',
                body: newMenuListing,
            }),
        }),
        updateMenuListing: builder.mutation({
            query: ({ id, ...updatedMenuListing }) => ({
                url: `/update-menu/${id}`,
                method: 'PUT',
                body: updatedMenuListing,
            }),
        }),
        deleteMenuListing: builder.mutation({
            query: (id) => ({
                url: `/delete-menu/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetAllMenuListingsQuery,
    useGetMenuListingByIdQuery,
    useCreateMenuListingMutation,
    useUpdateMenuListingMutation,
    useDeleteMenuListingMutation,
} = menuListingApi; 