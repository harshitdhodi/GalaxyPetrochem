'use client'

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  useAddCategoryMutation, 
  useGetCategoryByIdQuery, 
  useUpdateCategoryMutation 
} from '@/slice/blog/blogCategory';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')          // Replace multiple - with single -
    .replace(/^-+/, '')              // Trim - from start
    .replace(/-+$/, '');             // Trim - from end
};

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [addCategory, { isLoading: isAddLoading }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdateLoading }] = useUpdateCategoryMutation();
  const { data: existingCategory, isLoading: isFetchLoading } = useGetCategoryByIdQuery(id, {
    skip: !id
  });

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      slug: '',
    }
  });

  const categoryName = watch('category');

  // Auto-generate slug when category name changes (only in add mode or if slug is empty)
  useEffect(() => {
    if (!categoryName) return;

    const newSlug = slugify(categoryName);

    // In add mode → always update
    // In edit mode → only update if slug is empty or very short
    if (!isEditMode || !watch('slug') || watch('slug').length < 3) {
      setValue('slug', newSlug, { shouldValidate: true });
    }
  }, [categoryName, isEditMode, setValue, watch]);

  // Populate form when editing
  useEffect(() => {
    if (existingCategory) {
      Object.keys(existingCategory).forEach(key => {
        setValue(key, existingCategory[key]);
      });
    }
  }, [existingCategory, setValue]);

 const onSubmit = async (data) => {
  try {
    const formData = {
      ...data,
      priority: data.priority ? Number(data.priority) : undefined,
    };

    if (id) {
      await updateCategory({ id, categoryData: formData }).unwrap();
      toast.success("Category updated successfully!");
    } else {
      await addCategory(formData).unwrap();
      toast.success("Category added successfully!");
    }

    reset();

    // ✅ Give the toast time to render before navigating away
    setTimeout(() => {
      navigate("/blog-category-table", { replace: true });
    }, 1500);

  } catch (submitError) {
 toast.error(submitError?.data?.message || submitError?.message || 'An error occurred. Please try again.');
 console.error("Submission error:", submitError);
  }
};

  const isLoading = isAddLoading || isUpdateLoading || isFetchLoading;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg relative">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <h2 className="text-2xl font-bold mb-6 text-center">
        {isEditMode ? 'Update Category' : 'Add Category'}
      </h2>
      
      {isLoading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Category Field */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="category"
              {...register("category", { 
                required: "Category is required",
                minLength: { value: 2, message: "Category must be at least 2 characters" }
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Slug Field - now auto-generated */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="slug"
              {...register("slug", { 
                required: "Slug is required",
                pattern: {
                  value: /^[a-z0-9-]+$/,
                  message: "Slug must contain only lowercase letters, numbers, and hyphens"
                },
                minLength: { value: 3, message: "Slug should be at least 3 characters" }
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="auto-generated from category name"
            />
            {errors.slug && (
              <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
            )}
            {!isEditMode && categoryName && (
              <p className="text-gray-500 text-xs mt-1 italic">
                Auto-generated: {slugify(categoryName)}
              </p>
            )}
          </div>

          {/* Meta Title */}
          <div>
            <label htmlFor="metatitle" className="block text-sm font-medium text-gray-700">
              Meta Title
            </label>
            <input
              type="text"
              id="metatitle"
              {...register("metatitle")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Meta Description */}
          <div>
            <label htmlFor="metadescription" className="block text-sm font-medium text-gray-700">
              Meta Description
            </label>
            <textarea
              id="metadescription"
              {...register("metadescription")}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Meta Keywords */}
          <div>
            <label htmlFor="metakeywords" className="block text-sm font-medium text-gray-700">
              Meta Keywords
            </label>
            <input
              type="text"
              id="metakeywords"
              {...register("metakeywords")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* URL */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
              URL
            </label>
            <input
              type="url"
              id="url"
              {...register("url", {
                pattern: {
                  value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                  message: "Invalid URL format"
                }
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.url && (
              <p className="text-red-500 text-xs mt-1">{errors.url.message}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <input
              type="number"
              id="priority"
              {...register("priority", {
                min: { value: 0, message: "Priority must be a non-negative number" }
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.priority && (
              <p className="text-red-500 text-xs mt-1">{errors.priority.message}</p>
            )}
          </div>

          {/* Other Meta */}
          <div>
            <label htmlFor="otherMeta" className="block text-sm font-medium text-gray-700">
              Other Meta
            </label>
            <textarea
              id="otherMeta"
              {...register("otherMeta")}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading 
                ? 'Processing...' 
                : (isEditMode ? 'Update Category' : 'Add Category')
              }
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CategoryForm;