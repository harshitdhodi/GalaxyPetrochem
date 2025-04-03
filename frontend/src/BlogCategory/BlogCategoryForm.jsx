import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  useAddCategoryMutation, 
  useGetCategoryByIdQuery, 
  useUpdateCategoryMutation 
} from '@/slice/blog/blogCategory';

const CategoryForm = () => {
  // Get the ID from URL
  const { id } = useParams();
  const navigate = useNavigate();

  // Mutation and Query Hooks
  const [addCategory, { isLoading: isAddLoading }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdateLoading }] = useUpdateCategoryMutation();
  const { data: existingCategory, isLoading: isFetchLoading } = useGetCategoryByIdQuery(id, {
    skip: !id // Only run the query if id exists
  });

  // Initialize react-hook-form
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset,
    setValue
  } = useForm();

  // Populate form with existing data if editing
  useEffect(() => {
    if (existingCategory) {
      // Populate all form fields with existing category data
      Object.keys(existingCategory).forEach(key => {
        setValue(key, existingCategory[key]);
      });
    }
  }, [existingCategory, setValue]);

  // Form submission handler
  const onSubmit = async (data) => {
    try {
      // Convert priority to number if it's not already
      const formData = {
        ...data,
        priority: data.priority ? Number(data.priority) : undefined
      };
  
      let response;
      if (id) {
        // Update existing category with id as query parameter
        response = await updateCategory({ id, categoryData: formData }).unwrap();
      } else {
        // Add new category
        response = await addCategory(formData).unwrap();
      }
  
      // Reset form after successful submission
      reset();
  
      // Manually trigger refetch or state change for table update
      // Navigate to category table and refetch data if necessary
      navigate("/blog-category-table", { replace: true });
  
      // Optionally, add a success toast or notification
      console.log(id ? 'Category updated successfully' : 'Category added successfully', response);
    } catch (submitError) {
      // Handle submission error (you might want to add error handling)
      console.error(id ? 'Failed to update category' : 'Failed to add category', submitError);
    }
  };
  
  // Determine loading and button text
  const isLoading = isAddLoading || isUpdateLoading || isFetchLoading;
  const isEditMode = !!id;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
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

          {/* Slug Field */}
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
                  message: "Slug must be lowercase, numbers, and hyphens only"
                }
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.slug && (
              <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
            )}
          </div>

          {/* Meta Title Field */}
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

          {/* Meta Description Field */}
          <div>
            <label htmlFor="metadescription" className="block text-sm font-medium text-gray-700">
              Meta Description
            </label>
            <textarea
              id="metadescription"
              {...register("metadescription")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Meta Keywords Field */}
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

          {/* URL Field */}
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

          {/* Priority Field */}
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

          {/* Other Meta Field */}
          <div>
            <label htmlFor="otherMeta" className="block text-sm font-medium text-gray-700">
              Other Meta
            </label>
            <textarea
              id="otherMeta"
              {...register("otherMeta")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
              disabled:opacity-50 disabled:cursor-not-allowed"
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
