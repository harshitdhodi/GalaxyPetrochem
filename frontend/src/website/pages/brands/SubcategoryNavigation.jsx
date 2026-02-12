"use client"

const SubcategoryNavigation = ({
  selectedCategory,
  selectedSubCategory,
  selectedBrand,
  products,
  onSubCategorySelect,
}) => {
  // Filter products by selected brand and category with null checks
  const filteredProducts = products.filter((p) => {
    // 👈 Add null checks for brandId and categoryId
    const hasValidBrand = !selectedBrand || p?.brandId?._id === selectedBrand
    const hasValidCategory = p?.categoryId?._id === selectedCategory
    return hasValidBrand && hasValidCategory
  })

  // Get unique subcategories from filtered products
  const subCategoryMap = new Map()
  filteredProducts.forEach((p) => {
    // 👈 Add null checks for categoryId and subCategories
    if (!p?.categoryId?.subCategories || !Array.isArray(p.categoryId.subCategories)) {
      return
    }
    
    const subCategory = p.categoryId.subCategories.find((sc) => sc.slug === p.subCategorySlug)
    if (subCategory && !subCategoryMap.has(subCategory.slug)) {
      subCategoryMap.set(subCategory.slug, {
        ...subCategory,
        productCount: filteredProducts.filter((fp) => fp.subCategorySlug === subCategory.slug).length,
      })
    }
  })

  const subcategories = Array.from(subCategoryMap.values())

  return (
    <div className="bg-gray-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex md:flex-wrap lg:flex-nowrap items-center  space-x-3 sm:space-x-4 py-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => onSubCategorySelect(selectedCategory, null)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              !selectedSubCategory
                ? "bg-[#a75d9e] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
            }`}
          >
            All Subcategories
          </button>

          {subcategories.map((subCategory) => (
            <button
              key={subCategory.slug}
              onClick={() => onSubCategorySelect(selectedCategory, subCategory.slug)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                selectedSubCategory === subCategory.slug
                  ? "bg-[#a75d9e] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
              }`}
            >
              <span>{subCategory.category}</span>
              <span className="ml-1 opacity-75">({subCategory.productCount})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SubcategoryNavigation