import { useParams } from "react-router-dom";
import AlphabetNav from "./AlphabetNav";
import Breadcrumb from "./BreadCrumb";
import Header from "./Header";
import PromoSidebar from "./PromoSidebar";
import Sidebar from "./Sidebar";
import { useGetSpecificCategoryBySlugQuery } from "@/slice/chemicalSlice/chemicalCategory";
import Footer from "../home/Footer";

const SubCategories = () => {
  const { chemicals, categorySlug, selectedLetter } = useParams(); // Get all URL parameters

  // Fetch the data from the Redux slice
  const { data, isLoading, error } = useGetSpecificCategoryBySlugQuery(chemicals);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading categories.</p>;

  return (
        <>
      <Header />
      <div className="w-full md:max-w-7xl mx-auto min-h-screen bg-white">
        <Breadcrumb 
          chemicals={chemicals}
          categorySlug={categorySlug || ''}
          selectedLetter={selectedLetter || ''}
        />
        
        <div className="flex flex-col justify-center items-center">
          <AlphabetNav chemicals={chemicals} />
          <div className="flex flex-col md:flex-row justify-center gap-10 p-6 w-full">
            {/* Set Sidebar to take a specific width */}
            <div className="w-full md:w-[75%]">
              <Sidebar slug={chemicals} data={data} />
            </div>

            {/* Set PromoSidebar to take a specific width */}
            <div className="w-full md:w-[28%]">
              <PromoSidebar />
            </div>
          </div>
        </div>
      </div>
  
    </>

  );
};

export default SubCategories;
