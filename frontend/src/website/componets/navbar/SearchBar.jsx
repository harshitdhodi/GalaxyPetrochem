import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChemical, setSelectedChemical] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [chemicals, setChemicals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Handle clicks outside the search bar to hide suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setShowSearchModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // API call function
  const fetchChemicals = async (term) => {
    if (!term || term.length < 2) {
      setChemicals([]);
      setShowSuggestions(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/petrochemProduct/filterProduct?search=${encodeURIComponent(term)}`);
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

  // Fetch suggestions when searchTerm changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => fetchChemicals(searchTerm), 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Handle scroll for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight * 0.2;
      setIsSticky(window.scrollY > scrollThreshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChemicalSelect = (chemical) => {
    setSelectedChemical(chemical);
    setSearchTerm(chemical.name);
    setShowSuggestions(false); // Explicitly hide suggestions
    setShowSearchModal(false); // Close mobile modal
    // Optionally navigate immediately
    // navigate(`/search?tab=${chemical.slug}`);
  };

  const handleSearch = async () => {
    const term = selectedChemical ? selectedChemical.name : searchTerm;
    if (!term) {
      alert("Please enter or select a product to search.");
      return;
    }

    await fetchChemicals(term);

    const selected = selectedChemical || chemicals.find(
      (chemical) => chemical.name.toLowerCase() === term.toLowerCase()
    );

    if (selected?.slug) {
      setSearchTerm("");
      setSelectedChemical(null);
      setShowSearchModal(false);
      setShowSuggestions(false); // Ensure suggestions are hidden
      navigate(`/search?tab=${selected.slug}`);
    } else {
      alert("Please select a valid product to search.");
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      {/* Search Icon for Mobile */}
      <button
        className={`p-2 bg-[#E95821] sm:hidden text-white rounded-full fixed z-50 ${
          isSticky ? "top-5 right-16" : "top-5 right-16"
        }`}
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
              setSelectedChemical(null);
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
                onClick={() => {
                  setShowSearchModal(false);
                  setShowSuggestions(false); // Hide suggestions when closing modal
                }}
                className="text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Mobile Search Input */}
            <div className="flex rounded-full border-2 border-primary">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedChemical(null);
                  setShowSuggestions(e.target.value.length >= 2);
                }}
                className="w-full px-4 py-2 rounded-l-full focus:outline-none"
                placeholder="Search products..."
              />
              <button
                onClick={handleSearch}
                className="px-4 bg-[#E95821] text-white rounded-r-full"
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
              <div className="absolute left-0 right-0 z-50 mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                {chemicals.map((chemical) => (
                  <button
                    key={chemical._id}
                    onClick={() => handleChemicalSelect(chemical)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b last:border-b-0"
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