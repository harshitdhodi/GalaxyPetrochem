import  { useGetAllChemicalCategoriesQuery } from '@/slice/chemicalSlice/chemicalCategory';
import React,{ useState, useEffect } from 'react';
import NavbarComp from './componets/navbar/Navbar';

const Navbar = () => {
  const { data: categories, isSuccess } = useGetAllChemicalCategoriesQuery();

  useEffect(() => {
    if (isSuccess && categories) {
      console.log('Categories fetched:', categories);
    }
  }, [categories, isSuccess]);

  return (
    <header className="w-full">
      <NavbarComp categories={categories} />
    </header>
  );
};

export default React.memo(Navbar);