import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SearchCategorySection({ title }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/chemicalCategory/getAll");
        setCategories(response.data || []);
        setIsLoading(false);
      } catch (err) {
        setError("Error loading categories");
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = () => {
    if (selectedCategory) {
      navigate(`/${selectedCategory}`);
    }
  };

  return (
    <div className="bg-gray-100/80 p-6 space-y-4">
      <h2 className="text-xl font-medium">{title}</h2>
      <div className="space-y-4">
        <Select onValueChange={(value) => setSelectedCategory(value)}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem disabled>Loading...</SelectItem>
            ) : error ? (
              <SelectItem disabled>{error}</SelectItem>
            ) : (
              categories.map((subcat) => (
                <SelectItem key={subcat._id} value={subcat.slug}>
                  {subcat.category}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <Button
          className="w-full bg-secondary hover:bg-primary"
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

  const handleSearchSubmit = async () => {
    if (!searchType || !searchTerm) {
      alert("Please select a search type and enter a search term.");
      return;
    }
  
    const queryParam =
      searchType === "product_name"
        ? `/api/product/advanceSearch?name=${encodeURIComponent(searchTerm)}`
        : `/api/product/advanceSearch?price=${encodeURIComponent(searchTerm)}`;
  
    try {
      const response = await axios.get(queryParam);
      console.log("Search Results:", response.data);
  
      // Pass search results via state
      navigate(`/product-search`, { state: { results: response.data, searchTerm } });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  
  

  return (
    <div className="grid gap-6 md:grid-cols-3 py-6">
      {/* Chemicals Section */}
      <SearchCategorySection title="Search Chemicals" />

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
              <SelectItem value="price">Product Price</SelectItem>
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
            className="w-full bg-secondary hover:bg-primary"
            onClick={handleSearchSubmit}
          >
            SUBMIT
          </Button>
        </div>
      </div>
    </div>
  );
}
