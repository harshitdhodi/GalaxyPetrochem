"use client"

import { useState, useEffect, useCallback } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"

export const useBrandsData = () => {
  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const location = useLocation()
  const path = location.pathname.replace(/^\//, "") || "brands"

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("/api/brand/")
        setBrands(response.data.data || [])
      } catch (error) {
        console.error("Failed to fetch brands:", error)
        setError("Failed to load brands. Please try again.")
      }
    }
    fetchBrands()
  }, [])

  // Fetch banner data
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(`/api/banner/getByPageSlug?pageSlug=${path}`)
        setBanners(response.data || [])
      } catch (error) {
        console.error("Failed to fetch banner:", error)
      }
    }
    fetchBanner()
  }, [path])

  // Fetch products with filters
  const fetchProducts = useCallback(async (selectedBrand, selectedCategory, selectedSubCategory) => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (selectedBrand) params.brandId = selectedBrand
      if (selectedCategory) params.categoryId = selectedCategory
      if (selectedSubCategory) params.subCategorySlug = selectedSubCategory

      const response = await axios.get("/api/petrochemProduct", { params })
      setProducts(response.data || [])
    } catch (error) {
      console.error("Failed to fetch products:", error)
      setError("Failed to load products. Please try again.")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    brands,
    banners,
    loading,
    error,
    fetchProducts,
  }
}
