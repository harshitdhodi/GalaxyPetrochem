"use client"

import { useState } from "react"
import { Search, ChevronDown } from "lucide-react"

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
    // Implement search functionality here
  }

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
  }

  return (
    <header className="w-full">
      {/* Top bar with logo, search and language selector */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/logo.png"
            alt="Galaxy Petrochemicals Logo"
            className="h-10"
            onError={(e) => {
              e.target.onerror = null
              e.target.src =
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PPpqQfdCao16wz87ksrMF1qP02ZgJL.png"
            }}
          />
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 bg-orange-500 text-white rounded-r-full hover:bg-orange-600 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* Language Selector */}
        <div className="relative">
          <button onClick={toggleLanguageDropdown} className="flex items-center space-x-2 text-gray-700">
            <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
              <span className="text-blue-500 font-bold text-sm">G</span>
            </div>
            <span>Select Language</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {isLanguageDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <ul className="py-1">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">English</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Spanish</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">French</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Arabic</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Chinese</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <ul className="flex">
            <li className="py-4 px-6 hover:bg-purple-700 cursor-pointer transition-colors">AboutUs</li>
            <li className="py-4 px-6 hover:bg-purple-700 cursor-pointer transition-colors">Products</li>
            <li className="py-4 px-6 hover:bg-purple-700 cursor-pointer transition-colors">Brands</li>
            <li className="py-4 px-6 hover:bg-purple-700 cursor-pointer transition-colors">Blogs</li>
            <li className="py-4 px-6 hover:bg-purple-700 cursor-pointer transition-colors">Contact Us</li>
            <li className="py-4 px-6 bg-orange-500 hover:bg-orange-600 cursor-pointer transition-colors">
              Advanced Search
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
