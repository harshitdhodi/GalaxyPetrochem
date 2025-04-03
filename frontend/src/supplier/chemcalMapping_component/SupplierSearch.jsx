import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { useGetSuppliersByAlphabetQuery, useGetSupplierByIdQuery } from '@/slice/supplierSlice/SupplierSlice'
import { S_ChemicalSearch } from './S_chemicalSearch'
import { S_ChemicalTable } from './S_chemicalTable'

export function SupplierSearch({ onSelectSupplier }) {
  const [supplierSearch, setSupplierSearch] = useState('')
  const [queryString, setQueryString] = useState('')
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  
  // Fetch suppliers based on the first letter of the query string
  const { 
    data: suppliers, 
    isLoading: isLoadingSuppliers 
  } = useGetSuppliersByAlphabetQuery(
    queryString.charAt(0),
    { skip: queryString.length === 0 }
  )
  
  // Fetch selected supplier data to get up-to-date chemical_ids
  const { 
    data: refreshedSupplier, 
    refetch: refetchSupplier,
    isFetching: isRefetchingSupplier
  } = useGetSupplierByIdQuery(
    selectedSupplier?._id, 
    { skip: !selectedSupplier }
  )
  
  // Update selected supplier when fresh data is available
  useEffect(() => {
    if (refreshedSupplier && !isRefetchingSupplier) {
      setSelectedSupplier(refreshedSupplier)
      // Only call onSelectSupplier if it exists
      if (typeof onSelectSupplier === 'function') {
        onSelectSupplier(refreshedSupplier)
      }
    }
  }, [refreshedSupplier, isRefetchingSupplier, onSelectSupplier])

  const handleSelectSupplier = (supplier) => {
    setSelectedSupplier(supplier)
    setSupplierSearch(supplier.name)
    setQueryString('')
    // Only call onSelectSupplier if it exists
    if (typeof onSelectSupplier === 'function') {
      onSelectSupplier(supplier)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setSupplierSearch(value)
    setQueryString(value)
  }

  const handleChemicalModified = () => {
    // Refetch the supplier to get updated chemical list
    refetchSupplier()
  }

  return (
    <div className="mt-4">
      <Input
        placeholder="Search Supplier"
        value={supplierSearch}
        onChange={handleInputChange}
        className="w-full mb-4"
      />

      {isLoadingSuppliers ? (
        <div>Loading...</div>
      ) : (
        queryString &&
        suppliers &&
        suppliers.length > 0 && (
          <ul className="border bg-white rounded max-h-40 overflow-y-auto">
            {suppliers.map((supplier) => (
              <li
                key={supplier.id}
                onClick={() => handleSelectSupplier(supplier)}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {supplier.name}
              </li>
            ))}
          </ul>
        )
      )}

      {suppliers?.length === 0 && !isLoadingSuppliers && queryString && (
        <div className="p-2 text-gray-500">No Supplier found</div>
      )}

      {isRefetchingSupplier && (
        <div className="p-2 text-gray-500">Refreshing supplier data...</div>
      )}

      <S_ChemicalSearch
        selectedSupplier={selectedSupplier}
        onAddChemical={handleChemicalModified}
      />

      <div className="mt-4">
        <S_ChemicalTable
          chemicals={selectedSupplier?.chemical_ids || []}
          refetch={refetchSupplier}
          onRemoveChemical={handleChemicalModified}
          supplierId={selectedSupplier?._id}
        />
      </div>
    </div>
  )
}