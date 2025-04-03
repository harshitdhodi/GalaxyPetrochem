import { useGetAllChemicalCategoriesQuery } from '@/slice/chemicalSlice/chemicalCategory';
import { useState } from "react";

import NavbarComp from './componets/navbar/Navbar.jsx';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: categories } = useGetAllChemicalCategoriesQuery();
  console.log(categories)
  return (
    <header className="w-full">
    <NavbarComp  categories={ categories }/>
    </header>
  );
}; 


export default Navbar;
 