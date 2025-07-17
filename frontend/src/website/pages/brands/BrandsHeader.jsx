"use client"
import { Menu, X, Grid, List } from "lucide-react"

const BrandsHeader = ({ sidebarOpen, setSidebarOpen, viewType, setViewType }) => {
  return (
    <header className="bg-white lg:hidden shadow-sm border-b sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="ml-3 text-lg font-semibold text-gray-900 hidden sm:block">Brands</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewType("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewType === "grid" ? "bg-[#a75d9e] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-label="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewType("list")}
              className={`p-2 rounded-md transition-colors ${
                viewType === "list" ? "bg-[#a75d9e] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default BrandsHeader
