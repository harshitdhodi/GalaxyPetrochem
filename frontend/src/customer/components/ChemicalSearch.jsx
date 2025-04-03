import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useGetChemicalsByAlphabetQuery } from '@/slice/supplierSlice/chemicalBySupplier';
import { useAddChemicalToCustomerMutation } from '@/slice/customerSlice/customerApiSlice';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

export function ChemicalSearch({ selectedCustomer, refetchCustomer }) {
  const [chemicalSearch, setChemicalSearch] = useState('');
  const [queryString, setQueryString] = useState('');
  const [selectedChemical, setSelectedChemical] = useState(null);

  const { data: chemicals, isLoading: isLoadingChemicals } = useGetChemicalsByAlphabetQuery(
    queryString.charAt(0),
    { skip: queryString.length === 0 }
  );

  const [addChemicalToCustomer, { isLoading: isAdding }] = useAddChemicalToCustomerMutation();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setChemicalSearch(value);
    setQueryString(value);
  };

  const handleSelectChemical = (chemical) => {
    setSelectedChemical(chemical);
    setChemicalSearch(chemical.name);
    setQueryString('');
  };

  const handleAddChemical = async () => {
    if (!selectedChemical || !selectedCustomer) {
      toast.error('Please select both customer and chemical');
      return;
    }

    try {
      const chemicalId = selectedChemical.id || selectedChemical._id;
      const customerId = selectedCustomer._id;

      await addChemicalToCustomer({
        customerId,
        chemicalId,
      }).unwrap();

      // Reset form and refetch data
      setChemicalSearch('');
      setSelectedChemical(null);
      await refetchCustomer();
      
      toast.success('Chemical added successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to add chemical');
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
          disabled={!selectedCustomer}
        />
        {isLoadingChemicals && (
          <div className="absolute top-2 right-4 text-sm text-gray-500">
            Loading...
          </div>
        )}
      </div>

      {queryString && chemicals?.length > 0 && (
        <ul className="border bg-white rounded max-h-40 overflow-y-auto">
          {chemicals.map((chemical) => (
            <li
              key={chemical._id}
              onClick={() => handleSelectChemical(chemical)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {chemical.name}
            </li>
          ))}
        </ul>
      )}

      <Button
        onClick={handleAddChemical}
        disabled={isAdding || !selectedChemical || !selectedCustomer}
        className="mt-4 w-[10%] py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {isAdding ? 'Adding...' : 'Add '}
      </Button>
    </div>
  );
}
