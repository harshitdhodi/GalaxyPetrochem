import { useEffect, useState } from "react";
import axios from "axios";
import NavbarComp from './componets/navbar/Navbar.jsx';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/chemicalCategory/getAll');
        setCategories(res.data); // Adjust if response is nested (e.g. res.data.data)
      } catch (err) {
        console.error("Failed to fetch chemical categories:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <header className="w-full">
      <NavbarComp categories={categories} />
    </header>
  );
};

export default Navbar;
