import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Menu, X, Grid, List } from 'lucide-react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import banner from '../../assets/petrochemical.webp';

export default function BrandsPage() {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [banners, setBanners] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedBrands, setExpandedBrands] = useState({});
  const [viewType, setViewType] = useState('grid');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.replace(/^\//, '') || 'brands';

  // Helper to get brand name from URL
  const getBrandNameFromUrl = () => {
    const match = location.pathname.match(/\/brands\/([^/]+)/);
    if (match) {
      // Try to find brand by slug
      const brand = brands.find(b => b.slug === match[1]);
      return brand ? brand.name : decodeURIComponent(match[1]);
    }
    return null;
  };

  const formatSlugToTitle = slug => {
  if (!slug) return '';
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

  // Fetch brands from /api/brand/
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get('/api/brand/');
        setBrands(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch brands:', error);
        setError('Failed to load brands. Please try again.');
      }
    };
    fetchBrands();
  }, []);

  // Fetch banner data
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(`/api/banner/getByPageSlug?pageSlug=${path}`);
        setBanners(response.data || []);
      } catch (error) {
        console.error('Failed to fetch banner:', error);
      }
    };
    fetchBanner();
  }, [path]);

  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (selectedBrand) params.brandId = selectedBrand;
        if (selectedCategory) params.categoryId = selectedCategory;
        if (selectedSubCategory) params.subCategorySlug = selectedSubCategory;

        const response = await axios.get('/api/petrochemProduct', { params });
        console.log(response.data);
        setProducts(response.data || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setError('Failed to load products. Please try again.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Extract unique categories and subcategories from products
  const getCategoriesFromProducts = () => {
    const categoriesMap = new Map();

    products.forEach(product => {
      const categoryId = product.categoryId._id;
      const categoryName = product.categoryId.category;
      const categorySlug = product.categoryId.slug;
      const subCategories = product.categoryId.subCategories || [];

      if (!categoriesMap.has(categoryId)) {
        categoriesMap.set(categoryId, {
          _id: categoryId,
          category: categoryName,
          slug: categorySlug,
          subCategories: new Map(),
          productCount: 0,
        });
      }

      const category = categoriesMap.get(categoryId);
      category.productCount++;

      // Iterate through subCategories array from categoryId
      subCategories.forEach(subCategory => {
        const subCategorySlug = subCategory.slug;
        const subCategoryName = subCategory.category;

        if (!category.subCategories.has(subCategorySlug)) {
          category.subCategories.set(subCategorySlug, {
            slug: subCategorySlug,
            category: subCategoryName,
            productCount: 0,
          });
        }

        // Increment product count if the product's subCategorySlug matches
        if (product.subCategorySlug === subCategorySlug) {
          category.subCategories.get(subCategorySlug).productCount++;
        }
      });
    });

    return Array.from(categoriesMap.values()).map(category => ({
      ...category,
      subCategories: Array.from(category.subCategories.values()),
    }));
  };

  // Extract unique brands from products for product count
  const getBrandsFromProducts = () => {
    const brandsMap = new Map();

    products.forEach(product => {
      const brandId = product.brandId._id;
      const brandName = product.brandId.name;
      const brandPhoto = product.brandId.photo;

      if (!brandsMap.has(brandId)) {
        brandsMap.set(brandId, {
          _id: brandId,
          name: brandName,
          photo: brandPhoto,
          productCount: 0,
        });
      }

      brandsMap.get(brandId).productCount++;
    });

    // Merge with fetched brands to ensure all brands are included
    const mergedBrands = brands.map(brand => ({
      ...brand,
      productCount: brandsMap.get(brand._id)?.productCount || 0,
    }));

    return mergedBrands;
  };

  const categories = getCategoriesFromProducts();
  const mergedBrands = getBrandsFromProducts();

  // Filter products (client-side fallback)
  const getFilteredProducts = () => {
    let filtered = products;

    if (selectedBrand) {
      filtered = filtered.filter(product => product.brandId._id === selectedBrand);
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoryId._id === selectedCategory);
    }

    if (selectedSubCategory) {
      filtered = filtered.filter(product => product.subCategorySlug === selectedSubCategory);
    }

    return filtered;
  };

  // Group products by subcategory
  const getProductsBySubCategory = () => {
    const filteredProducts = getFilteredProducts();
    const groupedProducts = new Map();

   filteredProducts.forEach(product => {
  const subCategorySlug = product.subCategorySlug;
  // Find the subcategory name from categoryId.subCategories
  const subCategory = product.categoryId.subCategories.find(sc => sc.slug === subCategorySlug);
  const subCategoryName = subCategory ? subCategory.category : subCategorySlug; // <-- changed here

  if (!groupedProducts.has(subCategorySlug)) {
    groupedProducts.set(subCategorySlug, {
      subCategoryName,
      subCategorySlug,
      products: [],
    });
  }

  groupedProducts.get(subCategorySlug).products.push(product);
});

    return Array.from(groupedProducts.values());
  };

  const toggleBrand = brandId => {
    setExpandedBrands(prev => ({
      ...prev,
      [brandId]: !prev[brandId],
    }));
  };

  const handleCategorySelect = categoryId => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory(null);
  };

  const handleSubCategorySelect = (categoryId, subCategorySlug) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory(subCategorySlug);
  };

  const handleBrandSelect = brandId => {
    setSelectedBrand(brandId);
    const brand = brands.find(b => b._id === brandId);
    if (brand) {
      // Use slug if available, otherwise fallback to name
      const brandSlug = brand.slug || brand.name.replace(/\s+/g, '-').toLowerCase();
      navigate(`/brands/${brandSlug}`);
    } else {
      navigate('/brand');
    }
  };

  const handleProductClick = slug => {
    navigate(`/products/${slug}`);
  };

  const getSelectedBrandName = () => {
    if (!selectedBrand) return null;
    const brand = mergedBrands.find(b => b._id === selectedBrand);
    return brand ? brand.name : null;
  };

  const getSelectedCategoryName = () => {
    if (!selectedCategory) return null;
    const category = categories.find(c => c._id === selectedCategory);
    return category ? category.category : null;
  };

  const getSelectedSubCategoryName = () => {
    if (!selectedSubCategory) return null;
    const category = categories.find(c => c._id === selectedCategory);
    if (!category) return null;
    const subCategory = category.subCategories.find(sc => sc.slug === selectedSubCategory);
    return subCategory ? subCategory.category : null;
  };

  const productsBySubCategory = getProductsBySubCategory();
  const totalProducts = getFilteredProducts().length;

  return (
    <div className="min-h-screen bg-gray-50">
 
      <div className="relative">
        {banners && banners.length > 0 ? (
          <img
            src={`/api/image/download/${banners[0].image}`}
            alt={banners[0].title}
            className="w-full h-48 sm:h-64 object-cover"
          />
        ) : (
          <img src={banner} alt="Default Banner" className="w-full h-48 sm:h-64 object-cover" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 mt-5 z-10">
          {location.pathname === '/brands' ? (
            <h1 className="text-3xl font-bold text-white  mb-2">Our Brands</h1>
          ) : location.pathname.startsWith('/brands/') ? (
            <h1 className="text-3xl font-bold text-white mb-2">
              {formatSlugToTitle(location.pathname.split('/')[2])}
            </h1>
          ) : null}
          <nav className="px-4 py-2 rounded-md text-white text-sm sm:text-md font-semibold flex items-center">
            <Link to="/">
              <span className="text-[12px] sm:text-[15px]">Home</span>
            </Link>
            <span className="mx-2">/</span>
            {location.pathname.startsWith('/blogs') ? (
              <>
                <Link to="/blogs">
                  <span className="text-[12px] sm:text-[15px]">Blogs</span>
                </Link>
                {location.pathname.match(/^\/blogs\/([^/]+)/) && (
                  <>
                    <span className="mx-2">/</span>
                    <span className="text-[12px] sm:text-[15px]">{decodeURIComponent(location.pathname.split('/')[2])}</span>
                  </>
                )}
              </>
            ) : location.pathname.startsWith('/brands') ? (
              <>
                <Link to="/brands">
                  <span className="text-[12px] sm:text-[15px]">Brands</span>
                </Link>
                {getBrandNameFromUrl() && (
                  <>
                    <span className="mx-2">/</span>
                    <span className="text-[12px] sm:text-[15px]">{getBrandNameFromUrl()}</span>
                  </>
                )}
              </>
            ) : null}
          </nav>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white lg:hidden shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
            </div>
            {/* <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewType('grid')}
                  className={`p-2 rounded-md ${viewType === 'grid' ? 'bg-[#a75d9e] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewType('list')}
                  className={`p-2 rounded-md ${viewType === 'list' ? 'bg-[#a75d9e] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Now shows BRANDS */}
        <div
          className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:z-0`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center py-5 pb-6 border-b">
              <h2 className="text-xl font-bold  text-gray-900">Our Brands</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <p className="text-gray-500">Loading brands...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => handleBrandSelect(null)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${!selectedBrand ? 'bg-[#a75d9e] text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    All Brands ({mergedBrands.length})
                  </button>
                  {mergedBrands.map(brand => (
                    <button
                      key={brand._id}
                      onClick={() => handleBrandSelect(brand._id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between ${selectedBrand === brand._id ? 'bg-[#a75d9e] text-white' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      <div className="flex items-center space-x-2">
                        {/* <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold">{brand.name.charAt(0)}</span>
                        </div> */}
                        <span className="truncate">{brand.name}</span>
                      </div>
                      <span className="text-xs opacity-75 ml-2">({brand.productCount})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Category Navigation - Now shows CATEGORIES */}
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center space-x-6 py-4 overflow-x-auto">
                {loading ? (
                  <p className="text-gray-500">Loading categories...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setSelectedSubCategory(null);
                      }}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-md font-medium transition-colors ${!selectedCategory ? 'bg-[#a75d9e] text-white' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      All Categories 
                      {/* ({totalProducts}) */}
                    </button>
                    {categories.map(category => {
                      // Count products for this category and selected brand
                      const count = products.filter(
                        p =>
                          p.categoryId._id === category._id &&
                          (!selectedBrand || p.brandId._id === selectedBrand)
                      ).length;
                      return (
                        <button
                          key={category._id}
                          onClick={() => handleCategorySelect(category._id)}
                          className={`flex-shrink-0 px-4 py-2 rounded-full text-md font-medium transition-colors ${selectedCategory === category._id ? 'bg-[#a75d9e] text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                          <span>{category.category}</span>
                          <span className="ml-1 text-xs opacity-75">({count})</span>
                        </button>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Subcategory Navigation (if category is selected) */}
          {selectedCategory && (
            <div className="bg-gray-50 border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:flex-row md:flex-col flex items-center space-x-4 py-3 overflow-x-auto">
                  <button
                    onClick={() => setSelectedSubCategory(null)}
                    className={`lg:flex-shrink-0  px-3 py-1 rounded-full text-sm font-medium transition-colors ${!selectedSubCategory ? 'bg-[#a75d9e] text-white' : 'text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    All Subcategories
                  </button>
                  {(() => {
                    // Filter products by selected brand and category
                    const filteredProducts = products.filter(
                      p =>
                        (!selectedBrand || p.brandId._id === selectedBrand) &&
                        p.categoryId._id === selectedCategory
                    );
                    // Get unique subcategories from filtered products
                    const subCategoryMap = new Map();
                    filteredProducts.forEach(p => {
                      const subCategory = p.categoryId.subCategories.find(sc => sc.slug === p.subCategorySlug);
                      if (subCategory && !subCategoryMap.has(subCategory.slug)) {
                        subCategoryMap.set(subCategory.slug, {
                          ...subCategory,
                          productCount: filteredProducts.filter(fp => fp.subCategorySlug === subCategory.slug).length,
                        });
                      }
                    });
                    return Array.from(subCategoryMap.values()).map(subCategory => (
                      <button
                        key={subCategory.slug}
                        onClick={() => handleSubCategorySelect(selectedCategory, subCategory.slug)}
                        className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedSubCategory === subCategory.slug ? 'bg-[#a75d9e] text-white' : 'text-gray-600 hover:bg-gray-200'
                          }`}
                      >
                        <span>{subCategory.category}</span>
                        <span className="ml-1 opacity-75">({subCategory.productCount})</span>
                      </button>
                    ));
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="max-w-7xl mx-auto px-4 overflow-y-auto h-screen sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {getSelectedBrandName() && getSelectedSubCategoryName()
                  ? `${getSelectedBrandName()} - ${getSelectedSubCategoryName()}`
                  : getSelectedBrandName()
                    ? `${getSelectedBrandName()} Products`
                    : getSelectedSubCategoryName()
                      ? getSelectedSubCategoryName()
                      : getSelectedCategoryName()
                        ? getSelectedCategoryName()
                        : 'All Products'}
              </h2>
              <p className="text-gray-600 mt-1">{totalProducts} products found</p>
            </div>

            {/* Products by Subcategory */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
              </div>
            ) : productsBySubCategory.length > 0 ? (
              <div className="space-y-8">
                {productsBySubCategory.map(subCategoryGroup => (
                  <div key={subCategoryGroup.subCategorySlug} className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-1 h-6 bg-[#a75d9e] mr-3"></div>
                        <h3 className="text-xl font-semibold text-gray-900">{subCategoryGroup.subCategoryName}</h3>
                        <span className="ml-2 text-sm text-gray-500">({subCategoryGroup.products.length} products)</span>
                      </div>
                      {/* <Link
                        to={`/brands/${subCategoryGroup.subCategorySlug}`}
                        className="text-[#a75d9e] hover:text-[#8a4d86] text-sm font-medium"
                      >
                        View All
                      </Link> */}
                    </div>
                    <div className="overflow-x-auto">
                      <div className={`flex space-x-4 pb-4 ${viewType === 'grid' ? 'min-w-full' : ''}`}>
                        {subCategoryGroup.products.slice(0, 6).map(product => (
                          <div
                            key={product._id}
                            className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${viewType === 'grid' ? 'flex-shrink-0 w-64 p-4' : 'flex-shrink-0 w-80 flex items-center space-x-4 p-4'
                              }`}
                            onClick={() => handleProductClick(product.slug)}
                          >
                            {viewType === 'grid' ? (
                              <div className="flex flex-col items-center">
                                <div className="w-[10rem] h-[10rem] mb-4 relative">
                                  {product.images && product.images.length > 0 ? (
                                    <img
                                      src={`/api/image/download/${product.images[0].url}`}
                                      alt={product.name}
                                      className="w-full h-full object-cover rounded-md"
                                      onError={e => {
                                        e.target.src = banner; // Fallback to default banner
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
                                      <span className="text-gray-500 text-xs">No Image</span>
                                    </div>
                                  )}
                                </div>
                                <h4 className="text-sm font-medium text-gray-900 text-center mb-2">{product.name}</h4>
                                <p className="text-xs text-gray-500 text-center mb-2">{product.brandId.name}</p>
                                <p className="text-xs text-gray-600 text-center line-clamp-2">{product.description || product.metaDescription}</p>
                              </div>
                            ) : (
                              <>
                                <div className="w-16 h-16 flex-shrink-0">
                                  {product.images && product.images.length > 0 ? (
                                    <img
                                      src={`/api/image/download/${product.images[0].url}`}
                                      alt={product.name}
                                      className="w-full h-full object-cover rounded-md"
                                      onError={e => {
                                        e.target.src = banner; // Fallback to default banner
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
                                      <span className="text-gray-500 text-xs">No Image</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium text-gray-900 mb-1">{product.name}</h4>
                                  <p className="text-xs text-gray-500 mb-2">{product.brandId.name}</p>
                                  <p className="text-xs text-gray-600 line-clamp-2">{product.description || product.metaDescription}</p>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}