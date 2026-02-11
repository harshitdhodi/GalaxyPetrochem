'use client'

import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronDown, Edit, Trash2, Plus } from 'lucide-react'
import { 
  useGetAllChemicalCategoriesQuery, 
  useDeleteChemicalCategoryMutation,
  useDeleteSubCategoryMutation,
  useDeleteSubSubCategoryMutation
} from '@/slice/chemicalSlice/chemicalCategory'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const CategoryRow = ({ item, level, parentIds = {}, onDelete }) => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = React.useState(false)
  const hasSubcategories = item.subCategories?.length > 0 || item.subSubCategory?.length > 0
  
  // Use different mutations based on level
  const [deleteCategory, { isLoading: isLoadingCategory }] = useDeleteChemicalCategoryMutation()
  const [deleteSubCategory, { isLoading: isLoadingSubCategory }] = useDeleteSubCategoryMutation()
  const [deleteSubSubCategory, { isLoading: isLoadingSubSubCategory }] = useDeleteSubSubCategoryMutation()
  
  const currentLevelIds = {
    ...parentIds,
    ...(level === 0 ? { categoryId: item._id } : 
        level === 1 ? { subcategoryId: item._id } : 
        { subSubCategoryId: item._id }
    )
  }

  const handleEdit = () => {
    const editPath = `/edit-chemical-category/${currentLevelIds.categoryId || ''}` +
      `${currentLevelIds.subcategoryId ? `/${currentLevelIds.subcategoryId}` : ''}` +
      `${currentLevelIds.subSubCategoryId ? `/${currentLevelIds.subSubCategoryId}` : ''}`
    
    navigate(editPath)
  }

const handleDelete = async () => {
  try {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (confirmResult.isConfirmed) {
      // Use appropriate mutation based on level with correct parameters
      if (level === 0) {
        // Delete main category - only needs categoryId
        await deleteCategory({ categoryId: item._id }).unwrap()
      } else if (level === 1) {
        // Delete subcategory - needs categoryId and subCategoryId
        await deleteSubCategory({ 
          categoryId: parentIds.categoryId, 
          subCategoryId: item._id 
        }).unwrap()
      } else if (level === 2) {
        // Delete sub-subcategory - needs all three IDs
        await deleteSubSubCategory({ 
          categoryId: parentIds.categoryId,
          subCategoryId: parentIds.subcategoryId,
          subSubCategoryId: item._id 
        }).unwrap()
      }
      
      await Swal.fire({
        title: 'Deleted!',
        text: 'The category has been deleted.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });

      // Call the onDelete callback if provided (to trigger refetch in parent)
      if (onDelete) onDelete();
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    Swal.fire({
      title: 'Error!',
      text: error.data?.message || 'Failed to delete the category',
      icon: 'error',
    });
  }
}

  // Determine loading state based on level
  const isLoading = level === 0 ? isLoadingCategory : 
                    level === 1 ? isLoadingSubCategory : 
                    isLoadingSubSubCategory

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          <div className={`flex items-center pl-[${level * 20}px]`}>
            {hasSubcategories && (
              <button onClick={() => setIsOpen(!isOpen)} className="mr-2">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            {item.category}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex justify-start">
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <Edit className="h-4 w-4 text-blue-600" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleDelete}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {isOpen && item.subCategories && item.subCategories.map((subitem) => (
        <CategoryRow 
          key={subitem._id} 
          item={subitem} 
          level={level + 1} 
          parentIds={currentLevelIds}
          onDelete={onDelete}
        />
      ))}
      {isOpen && item.subSubCategory && item.subSubCategory.map((subitem) => (
        <CategoryRow 
          key={subitem._id} 
          item={subitem} 
          level={level + 1} 
          parentIds={currentLevelIds}
          onDelete={onDelete}
        />
      ))}
    </>
  )
}

export default function HierarchicalCategoryTable() {
  const { data: categories, error, isLoading, refetch } = useGetAllChemicalCategoriesQuery();
  
  console.log("Raw API response:", categories);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message || 'An error occurred'}</div>;

  const categoriesArray = Array.isArray(categories) ? categories : [categories];

  // Function to trigger refetch after delete
  const handleCategoryDelete = () => {
    refetch();
  };

  console.log("Processed categories:", categoriesArray);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link to="/chemical-category-form">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </Link>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categories</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoriesArray.map((category) => (
              <CategoryRow 
                key={category._id} 
                item={category} 
                level={0} 
                parentIds={{}} 
                onDelete={handleCategoryDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}