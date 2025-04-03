import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Breadcrumb } from '../componets/category_subcategory/BreadCrumb';
import { Sidebar } from '../componets/category_subcategory/Sidebar';
import ProductTable from '../componets/category_subcategory/ProductTable';
import { Pagination } from '../componets/category_subcategory/Pegination';
import SubCategoryInfo from '../componets/category_subcategory/SubcategoryInfo';
import axios from 'axios';
import Footer from '../componets/home/Footer';
import PromoSidebar from '../componets/SubCategoryPage/PromoSidebar';

export default function ChemicalSubcategoryPage() {
  const { chemicals, slug, subsubCategorySlug } = useParams();
  console.log({chemicals,slug,subsubCategorySlug})
  const [chemicalData, setChemicalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Check if the URL path starts with specific keywords for different categories
  const isProductsPath =
    location.pathname.startsWith('/chemicals') ||
    location.pathname.startsWith('/microbiology') ||
    location.pathname.startsWith('/plant-culture-tested-chemical') ||
    location.pathname.startsWith('/cell-culture-tested-chemical');
  
  // Initialize the categoryName based on the URL path
  let categoryName = '';
  if (isProductsPath) {
    if (location.pathname.startsWith('/chemicals')) {
      categoryName = 'Fine Chemicals';
    } else if (location.pathname.startsWith('/microbiology')) {
      categoryName = 'MicroBiology Products';
    } else if (location.pathname.startsWith('/plant-culture-tested-chemical')) {
      categoryName = 'Plant Culture Tested Chemical';
    } else if (location.pathname.startsWith('/cell-culture-tested-chemical')) {
      categoryName = 'Cell Culture Tested Chemical';
    }
  }

  const { chemicalName, subCategoryName } = location.state || {};

  // Fetch chemicals by subsubCategorySlug or categoryslug and subcategoryslug
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        setIsLoading(true);
        setError(null);
  
        const response = await axios.get(`/api/product/getByCategorySlug/${slug}`);
  
        setChemicalData(Array.isArray(response.data) ? response.data : []);
        setFilteredData(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.response?.data?.message || "An error occurred while fetching products");
      } finally {
        setIsLoading(false);
      }
    };
  
    if (slug) {
      fetchProductsByCategory();
    }
  }, [slug]);
  

  // Filter data whenever selections change
  useEffect(() => {
    const applyFilters = () => {
      let result = [...chemicalData];

      // Apply subcategory filter
      if (selectedSubCategories.length > 0) {
        result = result.filter((item) =>
          selectedSubCategories.includes(item.subSubCategorySlug)
        );
      }

      // Apply grade filter
      if (selectedGrades.length > 0) {
        result = result.filter((item) => selectedGrades.includes(item.grade));
      }

      setFilteredData(result);
    };

    applyFilters();
  }, [chemicalData, selectedSubCategories, selectedGrades]);

// Map necessary data for rendering in the table
const processedData = filteredData.map(item => ({
  id: item._id,
  name: item.name,
  slug: item.slug,
  price: item.price,
  molecularFormula: item.molecular_formula,
  molecularWeight: item.molecular_weight,
  category: item.categorySlug,
  subCategory: item.subCategorySlug,
  subSubCategory: item.subSubCategorySlug,
  unit: item.unit,
  cas: item.cas_number,
  msds: item.msds,
  specs: item.specs,
  image: item.images?.length > 0 ? item.images[0] : null, // Safely access the first image
}));

  return (
    <>
    <div className="max-w-7xl px-5 sm:px-0 mx-auto sm:py-4 mb-10">
      <Breadcrumb 
        chemicalName={chemicalName} 
        slug2={slug} 
        categoryName={categoryName} 
        subCategoryName={subCategoryName} 
        subsubCategorySlug={subsubCategorySlug}
        categorySlug={chemicals}
        subCategorySlug={slug}
      />
     <div className="flex  flex-col-reverse md:flex-row gap-10 lg:gap-16">
  {/* Sidebar - Moves to bottom on small screens, left on larger screens */}
  {/* <Sidebar
    className="order-last md:order-first w-full md:w-1/3"
    chemicals={chemicalData}
    categorySlug={slug}
    selectedSubCategories={selectedSubCategories}
    selectedGrades={selectedGrades}
    setSelectedSubCategories={setSelectedSubCategories}
    setSelectedGrades={setSelectedGrades}
    subsubCategorySlug={subsubCategorySlug}
    categoryName={chemicals}
  /> */}
  {/* Main Content - Takes full width on small screens, two-thirds width on larger screens */}
  <div className="w-full md:w-[60%] lg:w-2/3">
    <SubCategoryInfo categorySlug={slug} subsubCategorySlug={subsubCategorySlug} />
    <ProductTable
      chemicals={processedData}
      isLoading={isLoading}
      error={error}
      slug={slug}
      subsubCategorySlug={subsubCategorySlug}
    />
    {/* <Pagination /> */}
  </div>
  <div className="relative h-[30vh] sm:h-[40vh] lg:h-[60vh] hidden md:block md:w-[30%] lg:w-1/4">
             <PromoSidebar />
           </div>
</div>

    </div>
    {/* <Footer/> */}
    </>
  );
}
