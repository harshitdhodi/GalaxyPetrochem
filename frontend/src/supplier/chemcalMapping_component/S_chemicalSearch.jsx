import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useAddChemicalIdsToSupplierMutation } from '@/slice/supplierSlice/chemicalBySupplier';

export function S_ChemicalSearch({ selectedSupplier, onAddChemical }) {
  const [chemicalSearch, setChemicalSearch] = useState('');
  const [queryString, setQueryString] = useState('');
  const [selectedChemical, setSelectedChemical] = useState(null);
  const [chemicals, setChemicals] = useState([]);
  const [isLoadingChemicals, setIsLoadingChemicals] = useState(false);

  // Replace the RTK Query hook with a function to fetch chemicals
  const fetchChemicals = async (alphabet) => {
    if (!alphabet) return;
    
    setIsLoadingChemicals(true);
    try {
      const response = await axios.get(`/api/chemical/getChemicalByCategoryAndAlphabet?alphabet=${alphabet}`);
      setChemicals(response.data);
    } catch (error) {
      console.error('Error fetching chemicals:', error);
      setChemicals([]);
    } finally {
      setIsLoadingChemicals(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setChemicalSearch(value);
    if (value.trim()) {
      setQueryString(value);
      fetchChemicals(value.charAt(0));
    } else {
      setQueryString('');
      setChemicals([]);
    }
  };

  // Mutation hook for adding chemical IDs to a supplier
  const [addChemicalToSupplier, { isLoading: isAdding }] = useAddChemicalIdsToSupplierMutation();

  const handleSelectChemical = (chemical) => {
    setSelectedChemical(chemical);
    setChemicalSearch(chemical.name);
    setQueryString(''); // Clear the query string to hide the list
  };

  const handleAddChemical = async () => {
    if (!selectedChemical || !selectedSupplier) {
      console.error('No chemical or supplier selected');
      return;
    }

    try {
      const chemicalId = selectedChemical._id;
      const supplierId = selectedSupplier._id;

      await addChemicalToSupplier({
        supplierId,
        chemical_ids: [chemicalId],
      }).unwrap();

      // Clear selection
      setSelectedChemical(null);
      setChemicalSearch('');
      
      // Notify parent to refresh data
      if (onAddChemical) {
        onAddChemical();
      }
    } catch (error) {
      alert(`Failed to add chemical: ${error.message || 'Unknown error occurred'}`);
    }
  };

  return (
    <div className="mt-4">
      <div className="relative">
        <Input
          placeholder="Search Chemical"
          value={chemicalSearch}
          onChange={handleInputChange}
          className="w-full mb-4"
          disabled={!selectedSupplier}
        />
        {isLoadingChemicals && (
          <div className="absolute top-2 right-4 text-sm text-gray-500">Loading...</div>
        )}
      </div>

      {queryString && chemicals?.length > 0 && (
        <ul className="border bg-white rounded max-h-40 overflow-y-auto">
          {chemicals.map((chemical) => (
            <li
              key={chemical._id}
              onClick={() => handleSelectChemical(chemical)}
              className="p-2 hover:bg-gray-200 cursor-pointer border-b last:border-b-0"
            >
              {chemical.name}
            </li>
          ))}
        </ul>
      )}

      {chemicals?.length === 0 && !isLoadingChemicals && queryString && (
        <div className="p-2 text-gray-500">No chemicals found</div>
      )}

      <Button
        onClick={handleAddChemical}
        disabled={isAdding || !selectedChemical || !selectedSupplier}
        className={`mt-4 w-fit py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
          isAdding ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isAdding ? 'Adding...' : 'Add Chemical'}
      </Button>
    </div>
  );
}