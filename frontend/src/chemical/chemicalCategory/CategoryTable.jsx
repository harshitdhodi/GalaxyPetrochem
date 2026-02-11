'use client'

import React from 'react'
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronDown, Edit, Trash2, Plus } from 'lucide-react'
import {
  useGetAllChemicalCategoriesQuery,
  useDeleteSubCategoryMutation,
  useDeleteSubSubCategoryMutation
} from '@/slice/chemicalSlice/chemicalCategory'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'

const BASE_URL = '/api/chemicalCategory'

const CategoryRow = ({ item, level, parentIds = {}, onDelete }) => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  // ✅ Only slice mutations for sub & sub-sub
  const [deleteSubCategory,    { isLoading: isDeletingSubCat    }] = useDeleteSubCategoryMutation()
  const [deleteSubSubCategory, { isLoading: isDeletingSubSubCat }] = useDeleteSubSubCategoryMutation()

  const hasSubcategories =
    item.subCategories?.length > 0 || item.subSubCategory?.length > 0

  const currentLevelIds = {
    ...parentIds,
    ...(level === 0
      ? { categoryId: item._id }
      : level === 1
      ? { subcategoryId: item._id }
      : { subSubCategoryId: item._id }),
  }

  const handleEdit = () => {
    const editPath =
      `/edit-chemical-category/${currentLevelIds.categoryId || ''}` +
      `${currentLevelIds.subcategoryId    ? `/${currentLevelIds.subcategoryId}`    : ''}` +
      `${currentLevelIds.subSubCategoryId ? `/${currentLevelIds.subSubCategoryId}` : ''}`
    navigate(editPath)
  }

  const handleDelete = async () => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    })

    if (!confirmResult.isConfirmed) return

    try {
      if (level === 0) {
        // ✅ Axios for main category
        setIsDeleting(true)
        await axios.delete(`${BASE_URL}/deletecategory?id=${item._id}`)

      } else if (level === 1) {
        // ✅ Slice mutation for subcategory
        await deleteSubCategory({
          categoryId: parentIds.categoryId,
          subCategoryId: item._id,
        }).unwrap()

      } else if (level === 2) {
        // ✅ Slice mutation for sub-subcategory
        await deleteSubSubCategory({
          categoryId:       parentIds.categoryId,
          subCategoryId:    parentIds.subcategoryId,
          subSubCategoryId: item._id,
        }).unwrap()
      }

      await Swal.fire({
        title: 'Deleted!',
        text: 'The category has been deleted.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      })

      if (onDelete) onDelete()

    } catch (error) {
      console.error('Delete error:', error)
      Swal.fire({
        title: 'Error!',
        // axios error shape vs RTK Query error shape
        text: error.response?.data?.message  // axios
          || error.data?.message             // RTK Query
          || 'Failed to delete the category.',
        icon: 'error',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // ✅ Combined loading state across all three methods
  const isLoadingAny = isDeleting || isDeletingSubCat || isDeletingSubSubCat

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          <div
            className="flex items-center"
            style={{ paddingLeft: `${level * 20}px` }}
          >
            {hasSubcategories && (
              <button onClick={() => setIsOpen(!isOpen)} className="mr-2">
                {isOpen
                  ? <ChevronDown className="h-4 w-4" />
                  : <ChevronRight className="h-4 w-4" />}
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
              disabled={isLoadingAny}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {isOpen && item.subCategories?.map((subitem) => (
        <CategoryRow
          key={subitem._id}
          item={subitem}
          level={level + 1}
          parentIds={currentLevelIds}
          onDelete={onDelete}
        />
      ))}

      {isOpen && item.subSubCategory?.map((subitem) => (
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
  const { data: categories, error, isLoading, refetch } = useGetAllChemicalCategoriesQuery()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message || 'An error occurred'}</div>

  const categoriesArray = Array.isArray(categories) ? categories : [categories]

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
                onDelete={refetch}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}