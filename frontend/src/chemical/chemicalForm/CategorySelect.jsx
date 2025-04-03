import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { useGetAllChemicalCategoriesQuery } from '@/slice/chemicalSlice/chemicalCategory';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useGetAllUnitsQuery } from '@/slice/chemicalUnit/unitSlice';

export const CategorySelectionForm = ({ control, chemicalData, watch, setValue }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const { data: unitsData, isLoading: unitsLoading } = useGetAllUnitsQuery()
  const units = unitsData || []
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isSuccess: categoriesSuccess,
    isError,
    error
  } = useGetAllChemicalCategoriesQuery();

  const categories = categoriesData || [];
  const watchCategory = watch('category');
  const watchSubCategory = watch('sub_category');
  const watchSubSubCategory = watch('subsub_category_id');
  console.log(watchCategory, watchSubCategory, watchSubSubCategory);
  // Handle category, sub-category, and sub-sub-category changes
  useEffect(() => {
    if (!categories.length) return;

    const selectedCategory = categories.find(cat => cat._id === watchCategory);
    if (selectedCategory) {
      setSubCategories(selectedCategory.subCategories || []);
      setValue("categorySlug", selectedCategory.slug);
    }

    const selectedSubCategory = watchSubCategory && selectedCategory?.subCategories?.find(subCat => subCat._id === watchSubCategory);
    if (selectedSubCategory) {
      setSubSubCategories(selectedSubCategory.subSubCategory || []);
      setValue("subCategorySlug", selectedSubCategory.slug);
    }
  }, [categories, watchCategory, watchSubCategory, setValue]);

  // Separate useEffect for subSubCategory
  useEffect(() => {
    if (!subSubCategories.length) return;

    const selectedSubSubCategory = watchSubSubCategory && subSubCategories.find(subSubCat => subSubCat._id === watchSubSubCategory);
    if (selectedSubSubCategory) {
      setValue("subSubCategorySlug", selectedSubSubCategory.slug);
    }
  }, [subSubCategories, watchSubSubCategory, setValue]);

  // Error handling for API failure
  useEffect(() => {
    if (isError) {
      console.error('Failed to load categories:', error);
    }
  }, [isError, error]);

  // Pre-load subCategories and subSubCategories for display purposes only (no setValue)
  useEffect(() => {
    if (chemicalData && chemicalData.category && categories.length > 0) {
      const selectedCategory = categories.find(cat => cat._id === chemicalData.category);
      if (selectedCategory) {
        setSubCategories(selectedCategory.subCategories || []);
        setValue("category", chemicalData.category);
        setValue("categorySlug", selectedCategory.slug);

        const selectedSubCategory = selectedCategory.subCategories?.find(subCat => subCat._id === chemicalData.sub_category);
        if (selectedSubCategory) {
          setSubSubCategories(selectedSubCategory.subSubCategory || []);
          setValue("sub_category", chemicalData.sub_category);
          setValue("subCategorySlug", selectedSubCategory.slug);
        }

        const selectedSubSubCategory = selectedSubCategory?.subSubCategory?.find(subSubCat => subSubCat._id === chemicalData.subsub_category_id);
        if (selectedSubSubCategory) {
          setValue("subsub_category_id", chemicalData.subsub_category_id);
          setValue("subSubCategorySlug", selectedSubSubCategory.slug);
        }
      }
    }
  }, [chemicalData, categories, setValue]);

  return (
    <Card className="w-full max-w-2xl border-none mx-auto shadow-none">
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Controller
              name="category"
              control={control}
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <Select
                  value={field.value || ''}
                  onValueChange={(value) => {
                    const selectedCategory = categories.find(cat => cat._id === value);
                    if (selectedCategory) {
                      field.onChange(selectedCategory._id);
                      setValue('categorySlug', selectedCategory.slug);
                    }
                  }}
                >
                  <SelectTrigger id="category">
                    <SelectValue>
                      {field.value && categoriesSuccess
                        ? categories.find(cat => cat._id === field.value)?.category
                        : (chemicalData && chemicalData.category?.name) || 'Select Category'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesLoading ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : categoriesSuccess && categories.length > 0 ? (
                      categories.map(cat => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.category}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>No categories available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Sub Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="sub_category">Sub Category</Label>
            <Controller
              name="sub_category"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ''}
                  onValueChange={(value) => {
                    const selectedSubCategory = subCategories.find(subCat => subCat._id === value);
                    if (selectedSubCategory) {
                      field.onChange(selectedSubCategory._id);
                      setValue('subCategorySlug', selectedSubCategory.slug);
                    }
                  }}
                  disabled={!watchCategory || subCategories.length === 0}
                >
                  <SelectTrigger id="sub_category">
                    <SelectValue>
                      {field.value && subCategories.length > 0
                        ? subCategories.find(subCat => subCat._id === field.value)?.category
                        : (chemicalData && chemicalData.sub_category?.name) || 'Select Sub Category'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories.length > 0 ? (
                      subCategories.map(subCat => (
                        <SelectItem key={subCat._id} value={subCat._id}>
                          {subCat.category}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>No sub-categories available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Sub Sub Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="subsub_category_id">Sub Sub Category</Label>
            <Controller
              name="subsub_category_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ''}
                  onValueChange={(value) => {
                    const selectedSubSubCategory = subSubCategories.find(subSubCat => subSubCat._id === value);
                    if (selectedSubSubCategory) {
                      field.onChange(selectedSubSubCategory._id);
                      setValue('subSubCategorySlug', selectedSubSubCategory.slug);
                    }
                  }}
                  disabled={!watchSubCategory || subSubCategories.length === 0}
                >
                  <SelectTrigger id="subsub_category_id">
                    <SelectValue>
                      {field.value && subSubCategories.length > 0
                        ? subSubCategories.find(subSubCat => subSubCat._id === field.value)?.category
                        : (chemicalData && chemicalData.subSubCategory?.category) || 'Select Sub Sub Category'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {subSubCategories.length > 0 ? (
                      subSubCategories.map(subSubCat => (
                        <SelectItem key={subSubCat._id} value={subSubCat._id}>
                          {subSubCat.category}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>No sub-sub-categories available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* //Unit field */}
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Controller
              name="unit"
              control={control}
              rules={{ required: 'Unit is required' }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || undefined}>
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitsLoading ? (
                      <SelectItem value="loading">Loading...</SelectItem>
                    ) : (
                      units.map((unit) => (
                        <SelectItem key={unit._id} value={unit.name}>
                          {unit.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* //assay field */}
          <div className="space-y-2">
            <Label htmlFor="assay">Assay (%)</Label>
            <Controller
              name="assay"
              control={control}
              render={({ field }) => (
                <div>
                  <input
                    type="string"
                    id="assay"
                    min="0"
                    max="100"
                    step="0.01" // Allows decimal values
                    value={field.value || 0}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-full border "
                  />

                </div>
              )}
            />
          </div>


        </div>
      </CardContent>
    </Card>
  );
};

CategorySelectionForm.propTypes = {
  control: PropTypes.object.isRequired,
  chemicalData: PropTypes.object, // Optional chemical data for display
  watch: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default CategorySelectionForm;