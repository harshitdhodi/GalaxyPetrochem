"use client"

import { useState, useEffect } from "react"
import { Image } from "lucide-react"

export default function BrandsPage() {
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [animateProducts, setAnimateProducts] = useState(false)

  const brands = [
    { id: 1, name: "Hindustan Petroleum", products: ["Engine Oil", "Lubricants", "Greases"] },
    { id: 2, name: "Valvoline", products: ["Synthetic Oil", "Transmission Fluid", "Brake Fluid"] },
    { id: 3, name: "ASV Molysulf", products: ["Molybdenum Disulfide Grease", "Anti-Seize Compounds"] },
    { id: 4, name: "Velvex", products: ["Adhesives", "Sealants", "Specialty Lubricants"] },
    { id: 5, name: "Castrol", products: ["GTX Engine Oil", "EDGE Synthetic Oil", "Power1 Motorcycle Oil"] },
    { id: 6, name: "Mobil", products: ["Mobil 1", "Delvac", "Super Moto"] },
    { id: 7, name: "Dow Corning", products: ["Silicone Lubricants", "Thermal Compounds", "Sealants"] },
    { id: 8, name: "Wacker", products: ["Silicones", "Polymers", "Specialty Chemicals"] },
    { id: 9, name: "Kleenoil", products: ["Filtration Systems", "Oil Analysis Kits", "Bypass Filters"] },
    { id: 10, name: "Pidilite", products: ["Adhesives", "Sealants", "Construction Chemicals"] },
  ]

  useEffect(() => {
    if (selectedBrand !== null) {
      setAnimateProducts(false)
      setTimeout(() => {
        setAnimateProducts(true)
      }, 100)
    }
  }, [selectedBrand])

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand.id === selectedBrand ? null : brand.id)
  }

  // Function to determine which color to use for each brand card
  const getBrandColor = (index) => {
    const colors = ["#e84c20", "#2294d6", "#9c5f96"]
    return colors[index % 3]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#bbc5ca] to-[#9c5f96] text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Our Brands</h1>
          <p className="mt-2">Discover quality products from trusted manufacturers</p>
        </div>
      </header>

      {/* Brands Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
          <div className="w-1 h-8 bg-[#e84c20] mr-3"></div>
          <h2 className="text-2xl font-bold text-gray-800">Featured Brands</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {brands.map((brand, index) => (
            <div
              key={brand.id}
              className={`relative overflow-hidden bg-white rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
                selectedBrand === brand.id ? "ring-4 ring-[#e84c20]" : ""
              }`}
              onClick={() => handleBrandClick(brand)}
              style={{
                borderTop: `4px solid ${getBrandColor(index)}`,
              }}
            >
              <div className="p-5">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 relative mb-4">
                    <Image
                      src={`/placeholder.svg?height=96&width=96&text=${brand.name}`}
                      alt={brand.name}
                      width={96}
                      height={96}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-center font-medium">{brand.name}</h3>

                  <div className="mt-3 w-full">
                    <button
                      className="w-full text-sm py-1 px-3 rounded bg-gray-100 hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center"
                      style={{ color: getBrandColor(index) }}
                    >
                      <span>View Products</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {selectedBrand === brand.id && (
                <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center animate-pulse">
                  <div className="w-6 h-6 border-2 border-[#e84c20] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      {selectedBrand !== null && (
        <section
          className={`container mx-auto px-4 py-8 mb-12 transition-opacity duration-500 ${
            animateProducts ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#2294d6] to-[#9c5f96] py-4 px-6">
              <h2 className="text-2xl font-bold text-white">
                {brands.find((b) => b.id === selectedBrand)?.name} Products
              </h2>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brands
                  .find((b) => b.id === selectedBrand)
                  ?.products.map((product, index) => (
                    <div
                      key={index}
                      className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                      style={{
                        borderLeft: `4px solid ${getBrandColor(index)}`,
                      }}
                    >
                      <div className="p-5">
                        <div className="flex items-start gap-4">
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${getBrandColor(index)}20` }}
                          >
                            <div className="w-10 h-10 relative">
                              <Image
                                src={`/placeholder.svg?height=40&width=40&text=P`}
                                alt={product}
                                width={40}
                                height={40}
                                className="object-contain"
                              />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium" style={{ color: getBrandColor(index) }}>
                              {product}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              High-quality product from {brands.find((b) => b.id === selectedBrand)?.name}
                            </p>
                            <button
                              className="mt-3 text-sm font-medium flex items-center group"
                              style={{ color: getBrandColor(index) }}
                            >
                              <span>View Details</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 ml-1 transition-transform duration-300 transform group-hover:translate-x-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}


    </div>
  )
}

