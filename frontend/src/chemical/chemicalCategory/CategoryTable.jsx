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
import { useGetAllChemicalCategoriesQuery } from '@/slice/chemicalSlice/chemicalCategory'
import { Link, useNavigate } from 'react-router-dom'

const CategoryRow = ({ item, level, parentIds = {} }) => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = React.useState(false)
  const hasSubcategories = item.subCategories?.length > 0 || item.subSubCategory?.length > 0
  
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
          <div className="flex justify-start ">
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <Edit className="h-4 w-4 text-blue-600" />
            </Button>
            <Button variant="ghost" size="icon">
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
        />
      ))}
      {isOpen && item.subSubCategory && item.subSubCategory.map((subitem) => (
        <CategoryRow 
          key={subitem._id} 
          item={subitem} 
          level={level + 1} 
          parentIds={currentLevelIds}
        />
      ))}
    </>
  )
}

export default function HierarchicalCategoryTable() {
  const { data: categories, error, isLoading } = useGetAllChemicalCategoriesQuery();

  console.log("Raw API response:", categories);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message || 'An error occurred'}</div>;

  const categoriesArray = Array.isArray(categories) ? categories : [categories];

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
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}