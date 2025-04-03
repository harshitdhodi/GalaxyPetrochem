import { Plus, Minus } from 'lucide-react';
import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PromoSidebar from '../SubCategoryPage/PromoSidebar';

const ProductCategory = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [openCategories, setOpenCategories] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Categories
    axios.get('/api/chemicalCategory/getAll')
      .then(response => {
        setCategories(response.data);
        if (response.data.length > 0) {
          setOpenCategories({ [response.data[0].slug]: true });
        }
      })
      .catch(error => console.error("Error fetching categories:", error));

    // Fetch Products
    axios.get('/api/product')
      .then(response => setProducts(response.data))
      .catch(error => console.error("Error fetching products:", error));
  }, []);


  // Group products by category
  const groupedCategories = categories.map(category => ({
    ...category,
    products: products.filter(product => product.category.slug === category.slug),
  }));

  const toggleCategory = (slug) => {
    setOpenCategories(prev => ({
      ...prev,
      [slug]: !prev[slug]
    }));
  };

  if (!categories.length) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="w-full md:max-w-7xl mx-auto min-h-screen bg-white">
      <nav className="pt-5 sm:text-xs md:text-sm lg:text-base text-[11px] border-b pb-3 w-[98%] ml-8 mb-5 py-2">
        <ul className="flex gap-2 flex-wrap">
          <li>
            <Link to="/" className="text-secondary  hover:text-main_light">Home</Link>
          </li>
          <li className="text-gray-400">&gt;</li>
          <li>
            <Link to="/products" className="text-main hover:text-main_light">Products</Link>
          </li>
        </ul>
      </nav>

      <div className="mx-auto max-w-7xl px-4 lg:px-0">
        <div className="flex flex-col md:flex-row justify-center gap-10 p-6 w-full">
          <div className="w-full border px-5 py-3 md:w-[75%]">
            <div className="space-y-8">
              {groupedCategories.map(category => (
                <div key={category.slug} className="rounded-lg p-4 shadow-md">
                  <div className="flex justify-between items-center mb-6 gap-6">
                    <div className='flex gap-3 items-center'>
                      <img
                        src={category.photo ? `/api/logo/download/${category.photo}` : "https://img.freepik.com/free-vector/abstract-chemical-logo_23-2148610094.jpg?w=200"}
                        alt={category.name}
                        className="h-10 border-2 p-1"
                      />
                      <Link to={`/${category.slug}`} className="block">
                        <h2 className="text-main font-bold text-lg">{category.category}</h2>
                      </Link>

               
                  </div>
                  <div>
                    <button
                      onClick={() => toggleCategory(category.slug)}
                      className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                    >
                      {openCategories[category.slug] ? <Minus className="w-5 h-5 text-main" /> : <Plus className="w-5 h-5 text-main" />}
                    </button>
                  </div>
                </div>

                  {
                  openCategories[category.slug] && (
                    <ul className="flex flex-col gap-5  bg-white rounded-lg">
                      {category.products.map(product => (
                        <li
                          key={product.slug}
                          className="flex p-1 px-4 justify-start items-center w-full bg-blue-100 cursor-pointer"
                          onClick={() => navigate(`/${category.slug}/${product.slug}`)}
                        >
                          <img
                            src={product.images?.[0]?.url ? `/api/image/download/${product.images[0].url}` : "https://via.placeholder.com/150"}
                            alt={product.name}
                            className="w-20 h-10 mt-2 object-contain mb-2"
                          />
                          <h3 className="text-main font-medium text-lg">{product.name}</h3>
                        </li>
                      ))}
                    </ul>

                  )
                }
                </div>
              ))}
          </div>
        </div>
        <div className="relative h-[30vh] sm:h-[40vh] lg:h-[60vh] w-1/4">
          <PromoSidebar />
        </div>
      </div>
    </div>
    </div >
  );
};

export default ProductCategory;
