import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Footer from "../home/Footer";

export default function ProductSearchBar() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("tab"); // Get the 'tab' query parameter for slug
  const [chemical, setChemical] = useState(null); // State to hold the fetched chemical data
  const [isLoading, setIsLoading] = useState(true); // State for loading status
  const [isError, setIsError] = useState(false); // State for error status

  useEffect(() => {
    if (!slug) return; // Skip fetching if no slug is provided

    const fetchChemicalData = async () => {
      try {
        const response = await fetch(`/api/petrochemProduct/getBySlug?slug=${slug}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data[0]);
          setChemical(data[0]); // Set the fetched chemical data
        } else {
          setIsError(true); // Set error state if the request failed
        }
      } catch (error) {
        console.error("Error fetching chemical data:", error);
        setIsError(true); // Set error state on failure
      } finally {
        setIsLoading(false); // Set loading state to false after the request completes
      }
    };

    fetchChemicalData();
  }, [slug]); // Fetch data when the slug changes

  if (isLoading) {
    return (
      <div className="flex justify-center w-full min-h-[200px] items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError || !chemical) {
    return (
      <div className="flex justify-center w-full">
        <div className="w-full max-w-7xl p-6">
          <h1 className="text-2xl font-semibold mb-4">No results found</h1>
        </div>
      </div>
    );
  }

  // Extract category information from categoryId object
  const categorySlug = chemical.categoryId?.slug || '';
  const categoryName = chemical.categoryId?.category || 'N/A';
  const subCategoryName = chemical.subCategorySlug
  ? chemical.subCategorySlug.replace(/-/g, ' ').charAt(0).toUpperCase() + chemical.subCategorySlug.replace(/-/g, ' ').slice(1).toLowerCase()
  : 'N/A';



  return (
    <>
    <div className="flex justify-center w-full">
      <div className="w-full max-w-7xl p-6">
        <h1 className="text-2xl font-semibold mb-4">
          Search Results for "{chemical.name || 'Unknown'}"
        </h1>
        
        <div className="text-sm text-gray-600 mb-4">
          Showing details for {chemical.name}
        </div>

        <Table>
          <TableHeader className="bg-main">
            <TableRow>
              <TableHead className="text-white">Product Name</TableHead>
              <TableHead className="text-white">Category</TableHead>
              <TableHead className="text-white">Sub Category</TableHead>
              <TableHead className="text-white">Brand</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-blue-50">
              <TableCell>
                {chemical.slug ? (
                  <Link 
                    to={`/${chemical.subCategorySlug}/${chemical.slug}`} 
                    className="text-main hover:underline cursor-pointer"
                  >
                    {chemical.name}
                  </Link>
                ) : (
                  chemical.name || 'Unknown'
                )}
              </TableCell>
              <TableCell>
                {categorySlug ? (
                  <Link 
                    to={`/${categorySlug}`} 
                    className="text-main hover:underline cursor-pointer"
                  >
                    {categoryName}
                  </Link>
                ) : (
                  categoryName
                )}
              </TableCell>
              <TableCell>{subCategoryName}</TableCell>
              <TableCell>{chemical.brandId?.name || 'N/A'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
    <Footer/>
    </>
  );
}