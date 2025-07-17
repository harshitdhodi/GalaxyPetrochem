"use client"
import banner from "../../../assets/petrochemical.webp"

const ProductsGrid = ({
  productsBySubCategory,
  totalProducts,
  selectedBrand,
  selectedCategory,
  selectedSubCategory,
  brands,
  categories,
  viewType,
  loading,
  error,
  onProductClick,
}) => {
  const getSelectedBrandName = () => {
    if (!selectedBrand) return null
    const brand = brands.find((b) => b._id === selectedBrand)
    return brand ? brand.name : null
  }

  const getSelectedCategoryName = () => {
    if (!selectedCategory) return null
    const category = categories.find((c) => c._id === selectedCategory)
    return category ? category.category : null
  }

  const getSelectedSubCategoryName = () => {
    if (!selectedSubCategory) return null
    const category = categories.find((c) => c._id === selectedCategory)
    if (!category) return null
    const subCategory = category.subCategories.find((sc) => sc.slug === selectedSubCategory)
    return subCategory ? subCategory.category : null
  }

  const getHeaderTitle = () => {
    if (getSelectedBrandName() && getSelectedSubCategoryName()) {
      return `${getSelectedBrandName()} - ${getSelectedSubCategoryName()}`
    }
    if (getSelectedBrandName()) {
      return `${getSelectedBrandName()} Products`
    }
    if (getSelectedSubCategoryName()) {
      return getSelectedSubCategoryName()
    }
    if (getSelectedCategoryName()) {
      return getSelectedCategoryName()
    }
    return "All Products"
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{getHeaderTitle()}</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          {totalProducts} product{totalProducts !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#a75d9e]"></div>
          <p className="text-gray-500 mt-4">Loading products...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Products */}
      {!loading && !error && productsBySubCategory.length > 0 && (
        <div className="space-y-8 sm:space-y-12">
          {productsBySubCategory.map((subCategoryGroup) => (
            <div key={subCategoryGroup.subCategorySlug} className="mb-8 sm:mb-12">
              {/* Subcategory Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center">
                  <div className="w-1 h-6 sm:h-8 bg-[#a75d9e] mr-3"></div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                    {subCategoryGroup.subCategoryName}
                  </h3>
                  <span className="ml-2 text-sm text-gray-500">
                    ({subCategoryGroup.products.length} product{subCategoryGroup.products.length !== 1 ? "s" : ""})
                  </span>
                </div>
              </div>

              {/* Products Grid/List */}
              {viewType === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                  {subCategoryGroup.products.slice(0, 10).map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 p-2 sm:p-3 md:p-4"
                      onClick={() => onProductClick(product.slug)}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-full aspect-square mb-2 sm:mb-3 md:mb-4 relative overflow-hidden rounded-md">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={`/api/image/download/${product.images[0].url}`}
                              alt={product.name}
                              className="sm:w-full sm:h-full object-cover transition-transform duration-300 hover:scale-105"
                              onError={(e) => {
                                e.target.src = banner
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">No Image</span>
                            </div>
                          )}
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 text-center mb-2 line-clamp-2">
                          {product.name}
                        </h4>
                        <p className="text-xs text-gray-500 text-center mb-2">{product.brandId.name}</p>
                        <p className="text-xs text-gray-600 text-center line-clamp-2">
                          {product.description || product.metaDescription}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {subCategoryGroup.products.slice(0, 10).map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer p-2 sm:p-3 md:p-4 flex items-center space-x-4"
                      onClick={() => onProductClick(product.slug)}
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={`/api/image/download/${product.images[0].url}`}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-md"
                            onError={(e) => {
                              e.target.src = banner
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
                            <span className="text-gray-500 text-xs">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-1 truncate">{product.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-500 mb-2">{product.brandId.name}</p>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                          {product.description || product.metaDescription}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && productsBySubCategory.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
            <p className="text-gray-500 mb-4">No products found matching your criteria.</p>
            <p className="text-sm text-gray-400">Try adjusting your filters or browse all products.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsGrid
