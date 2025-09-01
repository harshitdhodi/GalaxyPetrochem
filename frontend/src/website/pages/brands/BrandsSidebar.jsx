"use client"
import { X } from "lucide-react"

const BrandsSidebar = ({ sidebarOpen, setSidebarOpen, brands, selectedBrand, onBrandSelect, loading, error }) => {
  return (
    <>
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:z-0 lg:w-64 xl:w-72`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-center py-5 px-4 border-b bg-gray-50">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Our Brands</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-4">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            ) : (
              <div className="space-y-1">
                <button
                  onClick={() => onBrandSelect(null)}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    !selectedBrand
                      ? "bg-[#a75d9e] text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>All Brands</span>
                    <span className="text-xs opacity-75">({brands.length})</span>
                  </div>
                </button>

                {brands.map((brand) => (
                  <button
                    key={brand._id}
                    onClick={() => onBrandSelect(brand._id)}
                    className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                      selectedBrand === brand._id
                        ? "bg-[#a75d9e] text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 min-w-0">
                        {/* <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-gray-600">{brand.name.charAt(0)}</span>
                        </div> */}
                        <span className="truncate">{brand.name}</span>
                      </div>
                      <span className="text-xs opacity-75 ml-2 flex-shrink-0">({brand.productCount || 0})</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </>
  )
}

export default BrandsSidebar
