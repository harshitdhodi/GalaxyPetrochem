import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useGetCustomersByAlphabetQuery, useGetCustomerByIdQuery } from '@/slice/customerSlice/customerApiSlice'
import { useRemoveChemicalFromCustomerMutation } from '@/slice/customerSlice/customerApiSlice'
import { ChemicalTable } from './ChemicalTable'
import { ChemicalSearch } from './ChemicalSearch'
import { toast } from 'react-toastify'

export function CustomerSearch({ onSelectCustomer }) {
  const [customerSearch, setCustomerSearch] = useState('')
  const [queryString, setQueryString] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  // Fetch customers based on the first letter of the query string
  const { data: customers, isLoading: isLoadingCustomers, refetch: refetchCustomers } = useGetCustomersByAlphabetQuery(
    queryString.charAt(0),
    {
      skip: queryString.length === 0,
    }
  );

  // Fetch selected customer details to keep them updated
  const { data: customerDetails, refetch: refetchCustomer } = useGetCustomerByIdQuery(
    selectedCustomer?._id,
    {
      skip: !selectedCustomer?._id,
    }
  );

  const [removeChemicalFromCustomer] = useRemoveChemicalFromCustomerMutation()

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer)
    setCustomerSearch(customer.name)
    setQueryString('')
    onSelectCustomer(customer)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setCustomerSearch(value)
    setQueryString(value)
  }

  const handleRemoveChemical = async (removedChemical) => {
    try {
      await removeChemicalFromCustomer({
        customerId: selectedCustomer._id,
        chemicalId: removedChemical._id
      }).unwrap();

      // Refetch both customer details and customer list
      await Promise.all([
        refetchCustomer(),
        refetchCustomers()
      ]);
      
      toast.success('Chemical removed successfully');
    } catch (error) {
      console.error('Error removing chemical:', error);
      toast.error('Failed to remove chemical');
    }
  };

  // Use customerDetails data if available, otherwise use selectedCustomer
  const currentCustomerData = customerDetails?.data || selectedCustomer;

  return (
    <div className="mt-4">
      <Input
        placeholder="Search Customer"
        value={customerSearch}
        onChange={handleInputChange}
        className="w-full mb-4"
      />

      {/* Dropdown for Customer Suggestions */}
      {isLoadingCustomers ? (
        <div>Loading...</div>
      ) : (
        queryString &&
        customers &&
        customers.length > 0 && (
          <ul className="border bg-white rounded max-h-40 overflow-y-auto">
            {customers.map((customer) => (
              <li
                key={customer._id}
                onClick={() => handleSelectCustomer(customer)}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {customer.name}
              </li>
            ))}
          </ul>
        )
      )}

      {/* ChemicalSearch Component */}
      <ChemicalSearch 
        selectedCustomer={currentCustomerData} 
        refetchCustomer={async () => {
          await Promise.all([
            refetchCustomer(),
            refetchCustomers()
          ]);
        }}
      />

      {/* ChemicalTable Component */}
      {currentCustomerData && (
        <ChemicalTable 
          chemicals={currentCustomerData.chemicalId || []} 
          onRemoveChemical={handleRemoveChemical}
        />
      )}
    </div>
  )
}
