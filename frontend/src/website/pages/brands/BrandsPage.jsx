"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import BrandsBanner from "./BrandsBanner"
import BrandsHeader from "./BrandsHeader"
import BrandsSidebar from "./BrandsSidebar"
import CategoryNavigation from "./CategoryNavigation"
import SubcategoryNavigation from "./SubcategoryNavigation"
import ProductsGrid from "./ProductsGrid"
import { useBrandsData } from "./hooks/useBrandsData"
import { useBrandsFilters } from "./hooks/useBrandsFilters"

export default function BrandsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [viewType, setViewType] = useState("grid")
  const navigate = useNavigate()
  const location = useLocation()

  const { products, brands, banners, loading, error, fetchProducts } = useBrandsData()

  const {
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
  } = useBrandsFilters(products, brands)

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts(selectedBrand, selectedCategory, selectedSubCategory)
  }, [])

  const handleBrandSelect = (brandId) => {
    setSelectedBrand(brandId)
    const brand = brands.find((b) => b._id === brandId)
    if (brand) {
      const brandSlug = brand.slug || brand.name.replace(/\s+/g, "-").toLowerCase()
      navigate(`/brands/${brandSlug}`)
    } else {
      navigate("/brands")
    }
  }

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId)
    setSelectedSubCategory(null)
  }

  const handleSubCategorySelect = (categoryId, subCategorySlug) => {
    setSelectedCategory(categoryId)
    setSelectedSubCategory(subCategorySlug)
  }

  const handleProductClick = (slug) => {
    navigate(`/products/${slug}`)
  }

  const totalProducts = filteredProducts.length

  return (
    <div className="min-h-screen bg-gray-50">
      <BrandsBanner banners={banners} location={location} />

      <BrandsHeader
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        viewType={viewType}
        setViewType={setViewType}
      />

      <div className="flex">
        <BrandsSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          brands={mergedBrands}
          selectedBrand={selectedBrand}
          onBrandSelect={handleBrandSelect}
          loading={loading}
          error={error}
        />

        <div className="flex-1 z-0 lg:ml-0">
          <CategoryNavigation
            categories={categories}
            selectedCategory={selectedCategory}
            selectedBrand={selectedBrand}
            products={products}
            onCategorySelect={handleCategorySelect}
            loading={loading}
            error={error}
          />

          {selectedCategory && (
            <SubcategoryNavigation
              selectedCategory={selectedCategory}
              selectedSubCategory={selectedSubCategory}
              selectedBrand={selectedBrand}
              products={products}
              onSubCategorySelect={handleSubCategorySelect}
            />
          )}

          <ProductsGrid
            productsBySubCategory={productsBySubCategory}
            totalProducts={totalProducts}
            selectedBrand={selectedBrand}
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            brands={brands}
            categories={categories}
            viewType={viewType}
            loading={loading}
            error={error}
            onProductClick={handleProductClick}
          />
        </div>
      </div>
    </div>
  )
}
