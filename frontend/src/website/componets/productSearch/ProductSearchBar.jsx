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
        const response = await fetch(`/api/product/getBySlug/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setChemical(data); // Set the fetched chemical data
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
              <TableHead className="text-white">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-blue-50">
         
              <TableCell>
                <Link 
                  to={`/${chemical.category.slug}/${chemical.slug}`} 
                  className="text-main hover:underline cursor-pointer"
                >
                  {chemical.name}
                </Link>
              </TableCell>
              <TableCell>
              <Link 
                  to={`/${chemical.category.slug}`} 
                  className="text-main hover:underline cursor-pointer"
                >
                {chemical.category.category || 'N/A'}
                </Link>
                </TableCell>
              <TableCell>{chemical.price || 'N/A'} /piece</TableCell>
              
              
            </TableRow>
          </TableBody>
        </Table>

      
      </div>
    </div>
    <Footer/>
    </>
  );
}
