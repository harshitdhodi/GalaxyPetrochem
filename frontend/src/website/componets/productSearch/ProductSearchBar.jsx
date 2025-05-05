import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Footer from "../home/Footer";

export default function ProductSearchBar() {
  const [searchParams] = useSearchParams();
  console.log(searchParams); // Log searchParams to debug
  const searchTerm = searchParams.get("name"); // Get the 'name' query parameter (e.g., 'enklo')
  const [chemicals, setChemicals] = useState([]); // State to hold the fetched chemical data (array)
  const [isLoading, setIsLoading] = useState(true); // State for loading status
  const [isError, setIsError] = useState(false); // State for error status
  console.log(searchTerm); // Log searchTerm to debug

  useEffect(() => {
    if (!searchTerm) return; // Skip fetching if no search term is provided

    const fetchChemicalData = async () => {
      try {
        const response = await fetch(`/api/petrochemProduct/filterProduct?search=${searchTerm}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data); // Log API response to debug
          setChemicals(data); // Set the fetched chemical data (array)
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
  }, [searchTerm]); // Fetch data when the search term changes

  if (isLoading) {
    return (
      <div className="flex justify-center w-full min-h-[200px] items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError || chemicals.length === 0) {
    return (
      <div className="flex justify-center w-full">
        <div className="w-full max-w-7xl p-6">
          <h1 className="text-2xl font-semibold mb-4">No results found</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center w-full">
        <div className="w-full max-w-7xl p-6">
          <h1 className="text-2xl font-semibold mb-4">
            Search Results for "{searchTerm || 'Unknown'}"
          </h1>

          <div className="text-sm text-gray-600 mb-4">
            Showing {chemicals.length} result{chemicals.length !== 1 ? 's' : ''} for "{searchTerm}"
          </div>

          <Table>
            <TableHeader className="bg-main">
              <TableRow className="text-white bg-blue-700 hover:bg-blue-700">
                <TableHead className="text-white">Product Name</TableHead>
                <TableHead className="text-white">Category</TableHead>
                <TableHead className="text-white">Sub Category</TableHead>
                <TableHead className="text-white">Brand</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chemicals.map((chemical, index) => {
                // Extract category information from categoryId object
                const categorySlug = chemical.categoryId?.slug || '';
                const categoryName = chemical.categoryId?.category || 'N/A';
                const subCategoryName = chemical.subCategorySlug
                  ? chemical.subCategorySlug.replace(/-/g, ' ').charAt(0).toUpperCase() +
                  chemical.subCategorySlug.replace(/-/g, ' ').slice(1).toLowerCase()
                  : 'N/A';

                return (
                  <TableRow key={index} className="bg-blue-50">
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
                    <TableCell>
                      <Link
                        to={`/${categorySlug}/${chemical.subCategorySlug}`}
                        className="text-main hover:underline cursor-pointer"
                      >
                        <p className="pl-2">{subCategoryName}</p>
                      </Link>
                    </TableCell>

                    <TableCell>{chemical.brandId?.name || 'N/A'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      
    </>
  );
}