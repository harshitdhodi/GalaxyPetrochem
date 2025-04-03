import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Breadcrumb from "../componets/SubCategoryPage/BreadCrumb";
import { Pagination } from "../componets/category_subcategory/Pegination";
import GradeSidebar from "../componets/productsByLetter/GradeSidebar";
import AlphabetbaseProductTable from "../componets/productsByLetter/ProductsTable";
import Info from "../componets/productsByLetter/Info";
import Footer from "../componets/home/Footer";
const formatText = (text) => {
  if (!text) return '';
  
  // Split by hyphens and spaces
  return text
    .split(/[-\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
export default function AlphabetBasedProduct() {
  const location = useLocation();
  const { selectedLetter, chemicals } = location.state || {};
  console.log({selectedLetter, chemicals});
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [chemical, setChemical] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChemicals = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/chemical/getChemicalByCategoryAndAlphabet?categoryslug=${chemicals}&alphabet=${selectedLetter}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch chemicals');
        }

        const data = await response.json();
        setChemical(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (chemicals && selectedLetter) {
      fetchChemicals();
    }
  }, [chemicals, selectedLetter]);

  // Filter chemicals based on selected grades
  const filteredChemicals = selectedGrades.length
    ? chemical.filter((item) => selectedGrades.includes(item.grade))
    : chemical;

  const totalItems = filteredChemicals.length;

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error loading chemicals: {error}</div>;

    return (
    <>
    <div className="max-w-7xl mx-auto mb-10 ">
      <Breadcrumb chemicals={chemicals} categorySlug={chemicals} selectedLetter={selectedLetter} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <GradeSidebar
          categorySlug={chemicals}
          chemicals={chemical}
          selectedGrades={selectedGrades}
          setSelectedGrades={setSelectedGrades}
        />
        <div className="md:col-span-2">
          <Info
            letter={selectedLetter}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
          <AlphabetbaseProductTable
            selectedLetter={selectedLetter}
            categorySlug={chemicals}
            chemicals={filteredChemicals}
          />
          {/* <Pagination /> */}
        </div>
      </div>
    </div>
   
    </>
  );
}
