import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [chemicals, setChemicals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setChemicals([]);
      setShowSuggestions(false);
      return;
    }

    const fetchChemicals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/product/filterProduct?search=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch chemicals.");
        }
        const data = await response.json();
        
        setChemicals(data || []);
        setShowSuggestions(data.length > 0);
      } catch (err) {
        setError(err.message || "An error occurred.");
        setChemicals([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchChemicals, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleChemicalSelect = (chemical) => {
    setShowSuggestions(false);
    setSearchTerm("");
    setShowSearchModal(false);
    navigate(`/search?tab=${chemical.slug}`);
  };

  const handleSearch = () => {
    const selectedChemical = chemicals.find(
      (chemical) => chemical.name.toLowerCase() === searchTerm.toLowerCase()
    );

    if (selectedChemical?.slug) {
      setSearchTerm("");
      setShowSearchModal(false);
      navigate(`/search?tab=${selectedChemical.slug}`);
    } else {
      alert("Please select a valid product to search.");
    }
  };

  return (
    <div className="relative w-full">
      {/* Search Icon for Mobile */}
      <button 
        className="md:hidden p-2 bg-primary  text-white rounded-full fixed top-5 right-20 z-50"
        onClick={() => setShowSearchModal(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {/* Desktop Search Bar */}
      <div className="hidden md:block w-full max-w-[35rem] mx-auto">
        <div className="flex rounded-full border-2 border-primary">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(e.target.value.length >= 2);
            }}
            className="w-full px-4 py-2 rounded-l-full focus:outline-none"
            placeholder="Search products..."
          />
          <button 
            onClick={handleSearch}
            className="px-4 bg-primary text-white rounded-r-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        {/* Desktop Suggestions */}
        {showSuggestions && chemicals.length > 0 && (
          <div className="absolute z-10 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
            {chemicals.map((chemical) => (
              <button
                key={chemical._id}
                onClick={() => handleChemicalSelect(chemical)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b"
              >
                {chemical.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 h-fit top-[10%] bg-white z-[100] overflow-y-auto">
          <div className="p-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Search Products</h2>
              <button 
                onClick={() => setShowSearchModal(false)}
                className="text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Mobile Search Input */}
            <div className="flex rounded-full border-2 border-primary">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(e.target.value.length >= 2);
                }}
                className="w-full px-4 py-2 rounded-l-full focus:outline-none"
                placeholder="Search products..."
              />
              <button 
                onClick={handleSearch}
                className="px-4 bg-primary text-white rounded-r-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="mt-4 text-center text-gray-500">
                Loading suggestions...
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 text-center text-red-500">
                {error}
              </div>
            )}

            {/* Mobile Suggestions */}
            {showSuggestions && chemicals.length > 0 && (
              <div className="mt-4 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                {chemicals.map((chemical) => (
                  <button
                    key={chemical._id}
                    onClick={() => handleChemicalSelect(chemical)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b"
                  >
                    {chemical.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}