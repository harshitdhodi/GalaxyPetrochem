import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Create the API slice
export const chemicalCategoryApi = createApi({
  reducerPath: 'chemicalCategoryApi', // Unique key for the slice
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/chemicalCategory', // Base URL for all requests
  }),
  tagTypes: ['ChemicalCategories'], // Add tag types for cache invalidation
  endpoints: (builder) => ({
    // Fetch all categories
    getAllChemicalCategories: builder.query({
      query: () => 'getAll',
      providesTags: ['ChemicalCategories'],
    }),

    // Fetch subcategories by slug
    getSpecificSubcategoryBySlug: builder.query({
      query: (slug) => `getSpecificSubcategoryBySlug?slug=${slug}`, // Dynamically inject the slug
      providesTags: ['ChemicalCategories'],
    }),

    // Fetch categories by slug
    getSpecificCategoryBySlug: builder.query({
      query: (slug) => `getSpecificCategory?slug=${slug}`, // Dynamically inject the slug
      providesTags: ['ChemicalCategories'],
    }),

    // Fetch specific category
    getSpecificCategory: builder.query({
      query: () => 'getSpecificCategory',
      providesTags: ['ChemicalCategories'],
    }),

    // Fetch specific subcategory
    getSpecificSubcategory: builder.query({
      query: () => 'getSpecificSubcategory',
      providesTags: ['ChemicalCategories'],
    }),

    // Fetch specific sub-subcategory
    getSpecificSubSubcategory: builder.query({
      query: () => 'getSpecificSubSubcategory',
      providesTags: ['ChemicalCategories'],
    }),

      
    // Update category
    updateCategory: builder.mutation({
      query: ({ categoryId, formData }) => ({
        url: `updateCategory?categoryId=${categoryId}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['ChemicalCategories'],
    }),

    // Update subcategory
    updateSubCategory: builder.mutation({
      query: ({ categoryId, subCategoryId, formData }) => ({
        url: `updateSubCategory?categoryId=${categoryId}&subCategoryId=${subCategoryId}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['ChemicalCategories'],
    }),

    // Update sub-subcategory
    updateSubSubCategory: builder.mutation({
      query: ({ categoryId, subCategoryId, subSubCategoryId, formData }) => ({
        url: `updatesubsubcategory?categoryId=${categoryId}&subCategoryId=${subCategoryId}&subSubCategoryId=${subSubCategoryId}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['ChemicalCategories'],
    }),

    // Add category
    addCategory: builder.mutation({
      query: (formData) => ({
        url: 'insertCategory',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['ChemicalCategories'],
    }),

    // Add subcategory
    addSubCategory: builder.mutation({
      query: ({ categoryId, formData }) => ({
        url: `insertSubCategory?categoryId=${categoryId}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['ChemicalCategories'],
    }),

    // Add sub-subcategory
    addSubSubCategory: builder.mutation({
      query: ({ categoryId, subCategoryId, formData }) => ({
        url: `insertSubSubCategory?categoryId=${categoryId}&subCategoryId=${subCategoryId}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['ChemicalCategories'],
    }),

    // Add delete category mutation
    deleteChemicalCategory: builder.mutation({
      query: (id) => ({
        url: `deletecategory?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ChemicalCategories'],
    }),
    // Add delete subcategory mutation
    deleteSubCategory: builder.mutation({
      query: ({ categoryId, subCategoryId }) => ({
        url: `deletesubcategory?categoryId=${categoryId}&subCategoryId=${subCategoryId}`, 
        method: 'DELETE',
      }),
      invalidatesTags: ['ChemicalCategories'],
    }),
    // Add delete sub-subcategory mutation
    deleteSubSubCategory: builder.mutation({
      query: ({ categoryId, subCategoryId, subSubCategoryId }) => ({
        url: `deletesubsubcategory?categoryId=${categoryId}&subCategoryId=${subCategoryId}&subSubCategoryId=${subSubCategoryId}`, 
        method: 'DELETE',
      }),
      invalidatesTags: ['ChemicalCategories'],
    }),

  }),
});

// Export hooks for the endpoints
export const {
  useGetAllChemicalCategoriesQuery,
  useGetSpecificCategoryQuery,
  useGetSpecificSubcategoryQuery,
  useGetSpecificSubSubcategoryQuery,
  useUpdateCategoryMutation,
  useUpdateSubCategoryMutation,
  useUpdateSubSubCategoryMutation,
  useGetSpecificSubcategoryBySlugQuery,
  useGetSpecificCategoryBySlugQuery,
  useDeleteChemicalCategoryMutation,
  useDeleteSubCategoryMutation,
  useDeleteSubSubCategoryMutation,
  useAddCategoryMutation,
  useAddSubCategoryMutation,
  useAddSubSubCategoryMutation
} = chemicalCategoryApi;