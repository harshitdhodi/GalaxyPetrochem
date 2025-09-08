"use client"

import { useState, useEffect } from "react"
import ProductCard from "./product-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [visibleCounts, setVisibleCounts] = useState({})
  const itemsPerPage = 8

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/petrochemProduct/getAllProductsForBrandPage")
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        const data = await response.json()
        setProducts(data)
        
        // Initialize visible counts for each category
        const counts = data.reduce((acc, product) => {
          const categoryName = product.categoryId?.category || "Uncategorized"
          if (!acc[categoryName]) {
            acc[categoryName] = itemsPerPage
          }
          return acc
        }, {})
        setVisibleCounts(counts)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const loadMore = (categoryName) => {
    setVisibleCounts(prev => ({
      ...prev,
      [categoryName]: (prev[categoryName] || itemsPerPage) + itemsPerPage
    }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e95821]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <p className="text-destructive text-center">Error: {error}</p>
        </CardContent>
      </Card>
    )
  }

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const categoryName = product.categoryId?.category || "Uncategorized"
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push(product)
    return acc
  }, {})

  return (
    <div className="space-y-12">
      {Object.entries(groupedProducts).map(([categoryName, categoryProducts]) => {
        const visibleProducts = categoryProducts.slice(0, visibleCounts[categoryName] || itemsPerPage)
        const hasMore = categoryProducts.length > (visibleCounts[categoryName] || itemsPerPage)
        
        return (
          <section key={categoryName} className="space-y-6 max-w-7xl mx-auto">
            <div>
              <CardHeader>
                <CardTitle className="text-2xl lg:text-3xl font-bold mb-1 text-blue-900">
                  {categoryName}
                  <span className="ml-2 text-lg font-medium text-[#e95821]">
                   ({categoryProducts.length} products)
                  </span>
                </CardTitle>
                <div className="w-24 h-1 bg-blue-800"></div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {visibleProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                
                {hasMore && (
                  <div className="mt-10 text-center">
                    <Button 
                      variant="outline"
                      onClick={() => loadMore(categoryName)}
                      className="px-6 py-2 text-[#e95821] hover:bg-[#e95821] hover:text-white shadow-md hover:shadow-lg transition-shadow duration-200"
                    >
                      Show More {categoryName} Products
                    </Button>
                  </div>
                )}
              </CardContent>
            </div>
          </section>
        )
      })}
    </div>
  )
}
