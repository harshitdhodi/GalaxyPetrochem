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
      // Safely handle products that may not have a populated category
      const categoryData = product?.categoryId  // 👈 Changed variable name
      if (!categoryData || !categoryData._id) return

      const categoryId = categoryData._id
      const categoryName = categoryData.category
      const categorySlug = categoryData.slug
      const subCategories = categoryData.subCategories || []

      if (!categoriesMap.has(categoryId)) {
        categoriesMap.set(categoryId, {
          _id: categoryId,
          category: categoryName,
          slug: categorySlug,
          subCategories: new Map(),
          productCount: 0,
        })
      }

      const categoryEntry = categoriesMap.get(categoryId)  // 👈 Changed variable name
      categoryEntry.productCount++

      subCategories.forEach((subCategory) => {
        const subCategorySlug = subCategory.slug
        const subCategoryName = subCategory.category
        if (!categoryEntry.subCategories.has(subCategorySlug)) {
          categoryEntry.subCategories.set(subCategorySlug, {
            slug: subCategorySlug,
            category: subCategoryName,
            productCount: 0,
          })
        }
        if (product.subCategorySlug === subCategorySlug) {
          categoryEntry.subCategories.get(subCategorySlug).productCount++
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
      // Skip products without a properly populated brand
      const brand = product?.brandId
      if (!brand || !brand._id) return

      const brandId = brand._id
      const brandName = brand.name
      const brandPhoto = brand.photo
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
    let filtered = products.filter((product) => product && product.brandId && product.categoryId)
    if (selectedBrand) {
      filtered = filtered.filter((product) => product.brandId && product.brandId._id === selectedBrand)
    }
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.categoryId && product.categoryId._id === selectedCategory
      )
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
      const category = product.categoryId
      const subCategory =
        category && Array.isArray(category.subCategories)
          ? category.subCategories.find((sc) => sc.slug === subCategorySlug)
          : null
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