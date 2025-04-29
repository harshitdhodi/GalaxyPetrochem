import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetSpecificCategoryBySlugQuery } from "@/slice/chemicalSlice/chemicalCategory";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SearchCategorySection({ title, slug }) {
  const { data, isLoading, error } = useGetSpecificCategoryBySlugQuery(slug);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  const subcategories = data?.category.subCategories
  || [];

  const handleSubmit = () => {
    if (selectedCategory) {
      navigate(`/${slug}/${selectedCategory}`);
    }
  };

  return (
    <div className="bg-gray-100/80 p-6 space-y-4">
      <h2 className="text-xl font-medium">{title}</h2>
      <div className="space-y-4">
        <Select onValueChange={(value) => setSelectedCategory(value)}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select sub category" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem disabled>Loading...</SelectItem>
            ) : error ? (
              <SelectItem disabled>Error loading categories</SelectItem>
            ) : (
              subcategories.map((subcat) => (
                <SelectItem key={subcat._id} value={subcat.slug}>
                  {subcat.category}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <Button
          className="w-full bg-[#e85920] hover:bg-[#e85920]"
          onClick={handleSubmit}
        >
          SUBMIT
        </Button>
      </div>
    </div>
  );
}

export default function SearchSections() {
  const [searchType, setSearchType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = () => {
    if (!searchType || !searchTerm) {
      alert("Please select a search type and enter a search term.");
      return;
    }
  
    // Convert to lowercase and replace whitespace with a hyphen
    const formattedSearchTerm = searchTerm.toLowerCase().replace(/\s+/g, "-");
  
    // Redirect to the search page with query parameters
    navigate(`/search?tab=${encodeURIComponent(formattedSearchTerm)}`);
  };
  
  

  return (
    <div className="grid gap-6 md:grid-cols-3 py-6">
      {/* Chemicals Section */}
      <SearchCategorySection title="Search Industrial Oils" slug="industrial-oils" />

      {/* Microbiology Section */}
      <SearchCategorySection title="Search Greases" slug="greases" />

      {/* Products Section */}
      <div className="bg-gray-100/80 p-6 rounded-lg space-y-4">
        <h2 className="text-xl font-medium">Search Products</h2>
        <div className="space-y-4">
          <Select onValueChange={(value) => setSearchType(value)}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select search type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="product_name">Product Name</SelectItem>
              {/* <SelectItem value="product_code">Product Code</SelectItem> */}
              {/* <SelectItem value="cas">CAS Number</SelectItem> */}
            </SelectContent>
          </Select>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Enter ${searchType?.replace("_", " ") || "search criteria"}`}
            className="w-full px-3 py-2 border rounded-md border-input bg-background bg-white"
          />
          <Button
            className="w-full bg-[#e85920] hover:bg-[#e85920]"
            onClick={handleSearchSubmit}
          >
            SUBMIT
          </Button>
        </div>
      </div>
    </div>
  );
}
