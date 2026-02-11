"use client"

const CategoryNavigation = ({
  categories,
  selectedCategory,
  selectedBrand,
  products,
  onCategorySelect,
  loading,
  error,
}) => {
  return (
    <div className="bg-white border-b sticky top-0 lg:top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-x-auto overflow-y-hidden -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="sm:flex items-center gap-3 sm:gap-4 lg:gap-6 py-3 sm:py-4 ">
            {loading ? (
              <div className="flex gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 w-24 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
                ))}
              </div>
            ) : error ? (
              <p className="text-red-500 text-sm">{error}</p>
            ) : (
              <>
                <button
                  onClick={() => onCategorySelect(null)}
                  className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-200 whitespace-nowrap ${
                    !selectedCategory
                      ? "bg-[#a75d9e] text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  All Categories
                </button>

                {categories.map((category) => {
                  const count = products.filter(
                    (p) => p.categoryId._id === category._id && (!selectedBrand || p.brandId._id === selectedBrand),
                  ).length

                  return (
                    <button
                      key={category._id}
                      onClick={() => onCategorySelect(category._id)}
                      className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-200 whitespace-nowrap ${
                        selectedCategory === category._id
                          ? "bg-[#a75d9e] text-white shadow-sm"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <span>{category.category}</span>
                      <span className="ml-1 text-xs opacity-75">({count})</span>
                    </button>
                  )
                })}
              </>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        /* Custom scrollbar styling */
        .overflow-x-auto::-webkit-scrollbar {
          height: 6px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </div>
  )
}

export default CategoryNavigation