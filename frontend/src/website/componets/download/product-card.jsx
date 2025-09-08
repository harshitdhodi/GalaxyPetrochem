"use client"

import { useState } from "react"
import { Link } from "react-router-dom"

export default function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const imageUrl = product.images?.[0]?.url ? `/api/image/download/${product.images[0].url}` : null

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const getProductUrl = () => {
    const productSlug = generateSlug(product.name)
    const categorySlug = generateSlug(product.categoryId?.category || "")

    // Check if subcategory exists
    const subcategory = product.categoryId?.subCategories?.find((sub) => sub.slug === product.subCategorySlug)

    if (subcategory) {
      const subcategorySlug = generateSlug(subcategory.category)
      return `/${subcategorySlug}/${productSlug}`
    } else {
      return `/${categorySlug}/${productSlug}`
    }
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  return (
    <Link 
      to={getProductUrl()}
      className="group bg-white hover:shadow-blue-100 shadow-blue-200 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transform transition-transform duration-300 hover:-translate-y-2 cursor-pointer block"
    >
      <div className="flex flex-col h-full">
        <div className="relative bg-white h-56 flex items-center justify-center">
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={product.images[0]?.altText || product.name}
              className="max-h-48 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-blue-900 mb-1">
            {product.name}
          </h3>
          {product.tagline && (
            <p className="text-sm text-blue-700 font-medium mb-2">
              {product.tagline}
            </p>
          )}
          
          <div className="mt-2 space-y-2">
            {product.brandId && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-800">Brand:</span>
                <span className="text-sm text-gray-800">{product.brandId.name}</span>
              </div>
            )}

            {product.categoryId?.subCategories?.find((sub) => sub.slug === product.subCategorySlug) && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-800">Type:</span>
                <span className="text-sm text-gray-800">
                  {product.categoryId.subCategories.find((sub) => sub.slug === product.subCategorySlug)?.category}
                </span>
              </div>
            )}
          </div>

          {product.pdf && (
            <div className="text-sm text-gray-700 space-y-1 mt-2">
              <span className="font-semibold text-blue-800">PDF Available</span>
            </div>
          )}
          {product.msds && (
            <div className="text-sm text-gray-700 space-y-1 mt-2">
              <span className="font-semibold text-blue-800">MSDS Available</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}