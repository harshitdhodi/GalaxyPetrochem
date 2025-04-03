import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function Sidebar({
  chemicals,
  categorySlug,
  selectedSubCategories,
  selectedGrades,
  setSelectedSubCategories,
  setSelectedGrades,
  subsubCategorySlug,
  categoryName
}) {
  // Helper functions remain unchanged
  const gradeCounts = chemicals.reduce((acc, item) => {
    const grade = item.grade || "Other";
    acc[grade] = (acc[grade] || 0) + 1;
    return acc;
  }, {});
  const navigate = useNavigate(); // Initialize navigate

  const subCategoryCounts = chemicals.reduce((acc, item) => {
    const subCategory = item.subSubCategorySlug || "Uncategorized";
    acc[subCategory] = (acc[subCategory] || 0) + 1;
    return acc;
  }, {});

  const formatSubCategory = (slug) =>
    slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const handleSubCategoryChange = (checked, subCategory) => {
    if (checked) {
      setSelectedSubCategories(prev => [...prev, subCategory]);
    } else {
      setSelectedSubCategories(prev => prev.filter(item => item !== subCategory));
    }
  };


  const handleGradeChange = (checked, grade) => {
    if (checked) {
      setSelectedGrades(prev => [...prev, grade]);
    } else {
      setSelectedGrades(prev => prev.filter(item => item !== grade));
    }
  };

  const handleClearAllFilters = () => {
    navigate(`/${categoryName}`);
    setSelectedSubCategories([]);
    setSelectedGrades([]);
  };

  const removeSubCategory = (subCategory) => {
    setSelectedSubCategories(prev => prev.filter(item => item !== subCategory));
  };

  const removeGrade = (grade) => {
    alert("hii");
    setSelectedGrades((prev) =>
      prev.filter((item) => item !== grade)
    );
    setTimeout(() => {
      navigate(`/chemicals/${categorySlug}`); // Use navigate here for redirection
    }, 0);
  };

  const isCategorySelected = subsubCategorySlug
    ? selectedSubCategories.includes(subsubCategorySlug)
    : selectedSubCategories.includes(categorySlug);

  return (
    <Card className="md:col-span-1 lg:mx-5 md:ml-5 lg:ml-0 bg-[#dee8ff] rounded-none p-3">
      <CardContent className="p-4">
        <h2 className="text-2xl font-normal mb-4">Your Selections</h2>

        {/* Categories Section */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Categories:</h3>
          <div className="text-main_light py-3 flex flex-col gap-2 border-y-2 border-gray-300">
            <div className="flex justify-between items-center">
              <p>{subsubCategorySlug ? `${subsubCategorySlug} (${chemicals.length})` : `${formatSubCategory(categorySlug)} (${chemicals.length})`}</p>

              <button
                onClick={handleClearAllFilters}
                 className="ml-2 text-white bg-red-600 mr-2  w-4 pb-2 h-4"
              >
                   <X size={16} />
              </button>
            </div>

            {selectedSubCategories.map((subCategory) => (
              <div key={subCategory} className="flex justify-between items-center px-2 py-1 bg-blue-100 rounded">
                <span className="text-sm">{formatSubCategory(subCategory)}</span>
                <button
                  onClick={() => removeSubCategory(subCategory)}
                  className="ml-2 text-white bg-red-600   w-4 pb-2 h-4"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Grades Section */}
        {selectedGrades.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium mb-2">Grades:</h3>
            <div className="text-main_light py-3 flex flex-col gap-2 border-y-2 border-gray-300">
              {selectedGrades.map((grade) => (
                <div key={grade} className="flex justify-between items-center px-2 py-1 bg-blue-100 rounded">
                  <span className="text-sm">{grade}</span>
                  <button onClick={() => removeGrade(grade)} className="text-gray-600 hover:text-red-600">
                    <X size={16} />
                  </button>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Options */}
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 text-2xl font-normal">Categories</h3>
            <div className="space-y-2">
              {Object.entries(subCategoryCounts).map(([subCategory, count]) => (
                <div key={subCategory} className="flex items-center space-x-2">
                  <Checkbox
                    id={subCategory}
                    checked={subsubCategorySlug ? subCategory === subsubCategorySlug : selectedSubCategories.includes(subCategory)}
                    onCheckedChange={(checked) => handleSubCategoryChange(checked, subCategory)}
                  />
                  <label htmlFor={subCategory} className="text-sm">
                    {formatSubCategory(subCategory)} ({count})
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-2xl font-normal">Grades</h3>
            <div className="space-y-2">
              {Object.entries(gradeCounts).map(([grade, count]) => (
                <div key={grade} className="flex items-center space-x-2">
                  <Checkbox
                    id={grade}
                    checked={selectedGrades.includes(grade)}
                    onCheckedChange={(checked) => handleGradeChange(checked, grade)}
                  />
                  <label htmlFor={grade} className="text-sm">
                    {grade} ({count})
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Sidebar;
