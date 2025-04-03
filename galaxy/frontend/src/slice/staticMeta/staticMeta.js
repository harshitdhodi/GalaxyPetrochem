// filepath: /c:/Users/Admin/Desktop/CDHCHEMICAL/git/frontend/src/services/metaApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const metaApi = createApi({
    reducerPath: 'metaApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: (builder) => ({
        getAllMetas: builder.query({
            query: () => '/meta',
        }),
        getMetaById: builder.query({
            query: (id) => `/meta/${id}`,
        }),
        createMeta: builder.mutation({
            query: (newMeta) => ({
                url: '/meta',
                method: 'POST',
                body: newMeta,
            }),
        }),
        updateMeta: builder.mutation({
            query: ({ id, ...updatedMeta }) => ({
                url: `/meta/${id}`,
                method: 'PUT',
                body: updatedMeta,
            }),
        }),
        deleteMeta: builder.mutation({
            query: (id) => ({
                url: `/meta/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetAllMetasQuery,
    useGetMetaByIdQuery,
    useCreateMetaMutation,
    useUpdateMetaMutation,
    useDeleteMetaMutation,
} = metaApi;