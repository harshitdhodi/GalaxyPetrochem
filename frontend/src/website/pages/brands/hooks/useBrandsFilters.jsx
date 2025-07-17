"use client"

import { useState, useMemo } from "react"

export const useBrandsFilters = (products, brands) => {
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)

  // Extract unique categories and subcategories from products
  const categories = useMemo(() => {
    const categoriesMap = new Map()
    products.forEach((product) => {
      const categoryId = product.categoryId._id
      const categoryName = product.categoryId.category
      const categorySlug = product.categoryId.slug
      const subCategories = product.categoryId.subCategories || []

      if (!categoriesMap.has(categoryId)) {
        categoriesMap.set(categoryId, {
          _id: categoryId,
          category: categoryName,
          slug: categorySlug,
          subCategories: new Map(),
          productCount: 0,
        })
      }

      const category = categoriesMap.get(categoryId)
      category.productCount++

      subCategories.forEach((subCategory) => {
        const subCategorySlug = subCategory.slug
        const subCategoryName = subCategory.category
        if (!category.subCategories.has(subCategorySlug)) {
          category.subCategories.set(subCategorySlug, {
            slug: subCategorySlug,
            category: subCategoryName,
            productCount: 0,
          })
        }
        if (product.subCategorySlug === subCategorySlug) {
          category.subCategories.get(subCategorySlug).productCount++
        }
      })
    })

    return Array.from(categoriesMap.values()).map((category) => ({
      ...category,
      subCategories: Array.from(category.subCategories.values()),
    }))
  }, [products])

  // Extract unique brands from products for product count
  const mergedBrands = useMemo(() => {
    const brandsMap = new Map()
    products.forEach((product) => {
      const brandId = product.brandId._id
      const brandName = product.brandId.name
      const brandPhoto = product.brandId.photo
      if (!brandsMap.has(brandId)) {
        brandsMap.set(brandId, {
          _id: brandId,
          name: brandName,
          photo: brandPhoto,
          productCount: 0,
        })
      }
      brandsMap.get(brandId).productCount++
    })

    return brands.map((brand) => ({
      ...brand,
      productCount: brandsMap.get(brand._id)?.productCount || 0,
    }))
  }, [products, brands])

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = products
    if (selectedBrand) {
      filtered = filtered.filter((product) => product.brandId._id === selectedBrand)
    }
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.categoryId._id === selectedCategory)
    }
    if (selectedSubCategory) {
      filtered = filtered.filter((product) => product.subCategorySlug === selectedSubCategory)
    }
    return filtered
  }, [products, selectedBrand, selectedCategory, selectedSubCategory])

  // Group products by subcategory
  const productsBySubCategory = useMemo(() => {
    const groupedProducts = new Map()

    filteredProducts.forEach((product) => {
      const subCategorySlug = product.subCategorySlug
      const subCategory = product.categoryId.subCategories.find((sc) => sc.slug === subCategorySlug)
      const subCategoryName = subCategory ? subCategory.category : subCategorySlug

      if (!groupedProducts.has(subCategorySlug)) {
        groupedProducts.set(subCategorySlug, {
          subCategoryName,
          subCategorySlug,
          products: [],
        })
      }
      groupedProducts.get(subCategorySlug).products.push(product)
    })

    return Array.from(groupedProducts.values())
  }, [filteredProducts])

  return {
    selectedBrand,
    selectedCategory,
    selectedSubCategory,
    setSelectedBrand,
    setSelectedCategory,
    setSelectedSubCategory,
    filteredProducts,
    categories,
    mergedBrands,
    productsBySubCategory,
  }
}
